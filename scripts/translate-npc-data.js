// Generates localized NPC aspect pools from the English source data.
// Usage: node scripts/translate-npc-data.js
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'data/npcRandomizer.json');
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const languages = ['zh-TW', 'de', 'ja'];
const targetCodes = { 'zh-TW': 'zh-TW', de: 'de', ja: 'ja' };
const separator = '\n[[[FATE_NPC_ITEM]]]\n';

function saveLocalizedData(localized) {
    fs.writeFileSync(sourcePath, JSON.stringify(localized, null, 2) + '\n');
}

async function translateBatch(values, target) {
    const url = new URL('https://clients5.google.com/translate_a/t');
    url.searchParams.set('q', values.join(separator));
    url.searchParams.set('client', 'dict-chrome-ex');
    url.searchParams.set('sl', 'en');
    url.searchParams.set('tl', target);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Translation request failed (${response.status})`);
    const payload = await response.json();
    return payload[0].split(separator);
}

async function translateMissingEntries(sourceTheme, localizedTheme, target) {
    for (const [key, sourceValues] of Object.entries(sourceTheme)) {
        const translatedValues = localizedTheme[key] || [];
        if (translatedValues.length > sourceValues.length) {
            throw new Error(`Too many existing ${target} entries for ${key}`);
        }
        if (translatedValues.length === sourceValues.length) continue;

        console.log(`  ${key}: translating ${sourceValues.length - translatedValues.length} new entries`);
        const missingValues = sourceValues.slice(translatedValues.length);
        for (let index = 0; index < missingValues.length;) {
            const batch = [];
            // Keep requests below the browser translation endpoint's URL limit.
            while (index < missingValues.length &&
                (batch.length === 0 || (batch.join(separator).length + separator.length + missingValues[index].length) <= 3500)) {
                batch.push(missingValues[index++]);
            }
            const result = await translateBatch(batch, target);
            if (result.length !== batch.length) throw new Error(`Incomplete ${target} translation`);
            translatedValues.push(...result);
        }
        localizedTheme[key] = translatedValues;
    }
}

async function main() {
    // Preserve existing translations and only append entries that have been added
    // to the English source since the last localization pass.
    const localized = source.en ? source : { en: source };
    for (const language of languages) {
        console.log(`Checking NPC ideas for ${language}...`);
        localized[language] ||= {};
        for (const [themeName, englishTheme] of Object.entries(localized.en)) {
            localized[language][themeName] ||= {};
            await translateMissingEntries(englishTheme, localized[language][themeName], targetCodes[language]);
            // Persist completed themes so an interrupted bulk pass can resume
            // without replacing already translated entries.
            saveLocalizedData(localized);
        }
    }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
