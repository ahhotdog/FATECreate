// Run with: node scripts/test-character-csv.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const stored = new Map();
const app = vm.createContext({
    console, I18N: { currentLang: 'zh-TW', t: key => key },
    DEFAULT_REFRESH: 3, DEFAULT_STRESS_BOXES: 2,
    localStorage: { getItem: key => stored.get(key) || null, setItem: (key, value) => stored.set(key, value) },
    currentView: 'view-character-sheet', showToast() {}
});
for (const file of ['character.js', 'storage.js', 'character-csv.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../js', file), 'utf8'), app);
}
const original = app.createNewCharacter();
Object.assign(original, { name: '雪, "Wizard"', notes: '=SUM(A1)\r\nSecond line\n日本語', fatePoints: 7 });
original.aspects.highConcept = '<img src=x onerror=alert(1)>';
original.aspects.trouble = "'Apostrophe";
original.skills = { 'Custom, skill': 4, Will: 3 };
original.stunts = [{ name: '+Bonus', description: 'Quotes "and", commas\nnewlines' }];
original.stress.marked.physical = [true, false];
original.stress.marked.mental = [null, true];
original.consequences.mild = { used: true, aspect: 'Bruised' };
const csv = app.characterToCsv(original);
assert.ok(csv.startsWith('\uFEFF'));
assert.ok(csv.includes("'=SUM"));
const imported = app.parseCharacterCsv(csv);
for (const key of ['name', 'language', 'notes', 'refresh', 'fatePoints', 'aspects', 'skills', 'stunts', 'stress', 'consequences']) {
    assert.deepEqual(JSON.parse(JSON.stringify(imported[key])), JSON.parse(JSON.stringify(original[key])), key);
}
assert.equal(app.getCharacter(), original, 'Parsing must not change the active sheet');
assert.equal(app.parseCharacterCsv(csv.replace(/^\uFEFF/, '')).name, original.name);
assert.throws(() => app.parseCharacterCsv('name,skill\nBob,2'));
assert.throws(() => app.parseCharacterCsv(csv + '"unterminated'));
assert.throws(() => app.parseCharacterCsv(csv.replace('"format","Fate Create","1"', '"format","Fate Create","2"')));
assert.throws(() => app.parseCharacterCsv(csv + 'skill,__proto__,4,\r\n'));
assert.throws(() => app.parseCharacterCsv(csv + 'character,name,Duplicate,\r\n'));
assert.throws(() => app.parseCharacterCsv(csv.replace('"character","fatePoints","7"', '"character","fatePoints","NaN"')));
assert.throws(() => app.parseCharacterCsv(csv + 'stress,other,2,[]\r\n'));
async function run() {
    let downloadedBlob, clicked = false, removed = false, revoked = false;
    const anchor = { click() { clicked = true; }, remove() { removed = true; } };
    app.Blob = Blob;
    app.URL = { createObjectURL(blob) { downloadedBlob = blob; return 'blob:test'; }, revokeObjectURL() { revoked = true; } };
    app.document = { createElement: () => anchor, body: { appendChild() {} } };
    app.setTimeout = callback => callback();
    app.downloadCharacterCsv();
    assert.ok(clicked && removed && revoked);
    assert.equal(anchor.download, '雪, _Wizard_.csv');
    assert.equal(downloadedBlob.type, 'text/csv;charset=utf-8');
    assert.equal(app.parseCharacterCsv(await downloadedBlob.text()).name, original.name);
    app.saveCharacter(original);
    const input = { files: [{ size: csv.length, text: async () => csv }], value: 'character.csv' };
    await app.importCharacterCsvFile({ target: input });
    const saves = app.getAllCharacters();
    assert.equal(saves.length, 2);
    assert.notEqual(saves[0].id, saves[1].id);
    assert.equal(input.value, '');
    assert.equal(app.getCharacter(), original);
    input.files = [{ size: 3, text: async () => 'bad' }];
    await app.importCharacterCsvFile({ target: input });
    assert.equal(app.getAllCharacters().length, 2);
    app.localStorage.setItem = () => { throw new Error('Storage full'); };
    input.files = [{ size: csv.length, text: async () => csv }];
    await app.importCharacterCsvFile({ target: input });
    assert.equal(app.getCharacter(), original);
    console.log('CSV round-trip, validation, duplicate import, and failure checks passed.');
}
run().catch(error => { console.error(error); process.exitCode = 1; });
