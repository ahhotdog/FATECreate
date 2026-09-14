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

async function translateTheme(theme, target) {
    const translated = {};
    for (const [key, values] of Object.entries(theme)) {
        translated[key] = [];
        for (let index = 0; index < values.length;) {
            const batch = [];
            // Keep requests below the browser translation endpoint's URL limit.
            while (index < values.length &&
                (batch.length === 0 || (batch.join(separator).length + separator.length + values[index].length) <= 3500)) {
                batch.push(values[index++]);
            }
            const result = await translateBatch(batch, target);
            if (result.length !== batch.length) throw new Error(`Incomplete ${target} translation`);
            translated[key].push(...result);
        }
    }
    return translated;
}

async function main() {
    // Do not translate an already-localized file a second time.
    if (source.en) throw new Error('NPC data is already localized.');
    const localized = { en: source };
    for (const language of languages) {
        console.log(`Translating NPC ideas into ${language}...`);
        localized[language] = {};
        for (const [themeName, theme] of Object.entries(source)) {
            localized[language][themeName] = await translateTheme(theme, targetCodes[language]);
        }
    }
    fs.writeFileSync(sourcePath, JSON.stringify(localized, null, 2) + '\n');
}

main().catch(error => { console.error(error); process.exitCode = 1; });
