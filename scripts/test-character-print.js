const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const app = vm.createContext({
    I18N: { currentLang: 'en', t: key => key, skill: name => name },
    getCharacterPortraitSource: () => null
});
for (const file of ['character-csv.js', 'character-print.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../js', file), 'utf8'), app);
}
const character = app.parseCharacterCsv(fs.readFileSync(path.join(__dirname, 'fixtures/character.csv'), 'utf8'));
character.name = '<script>alert("no")</script>';
character.notes = 'Long notes\n'.repeat(2000) + 'END OF NOTES';
const html = app.buildCharacterPrintHtml(character);
for (const text of ['Curious wizard', 'Always asking questions', 'Quick thinker', 'A useful trick.', 'Bruised', 'END OF NOTES', 'Will']) assert.ok(html.includes(text), text);
assert.ok(html.includes('&lt;script&gt;alert(&quot;no&quot;)&lt;/script&gt;'));
assert.equal((html.match(/<script>/g) || []).length, 1, 'Character text cannot create executable HTML');
assert.ok(html.includes('class="stress-box marked">× 1'));
assert.ok(html.includes('fatePointsTitle: <strong>5</strong>'));
// Exercise the actual fitting routine with layout dimensions for short and long sheets.
async function checkFit(height) {
    const sheet = { style: {}, scrollHeight: height, scrollWidth: 718 };
    const elements = { sheet, paper: { clientWidth: 718, clientHeight: 975 }, 'small-text': {}, print: { addEventListener() {} } };
    const handlers = {};
    const runtime = vm.createContext({ document: { getElementById: id => elements[id], fonts: { ready: Promise.resolve() } }, window: { addEventListener: (name, fn) => { handlers[name] = fn; } } });
    vm.runInContext(`(${app.initializeCharacterPrint.toString()})();`, runtime);
    await new Promise(resolve => setImmediate(resolve));
    const scale = Number(sheet.style.transform.match(/scale\((.+)\)/)[1]);
    assert.ok(height * scale <= 973.001, 'All content fits the single-page height');
    assert.ok(sheet.scrollWidth * scale <= 716.001, 'All content fits the page width');
    assert.equal(elements.print.disabled, false);
    handlers.beforeprint();
    assert.equal(Number(sheet.style.transform.match(/scale\((.+)\)/)[1]), scale, 'Refitting must not compound scaling');
}
Promise.all([checkFit(700), checkFit(2500), checkFit(30000)]).then(() => console.log('Print content, escaping, and one-page fitting checks passed.')).catch(error => { console.error(error); process.exitCode = 1; });
