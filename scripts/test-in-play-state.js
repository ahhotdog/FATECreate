// Run with: node scripts/test-in-play-state.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Minimal DOM surface for exercising the real sheet listeners and rendering.
class Element {
    constructor() {
        this.children = [];
        this.listeners = {};
        this.value = '';
        this.classList = { add() {}, remove() {} };
    }
    set innerHTML(html) {
        this.children = [];
        this.input = html.includes('<input') ? new Element() : null;
    }
    appendChild(child) { this.children.push(child); }
    querySelector() { return this.input; }
    addEventListener(type, listener) { this.listeners[type] = listener; }
    dispatch(type) { this.listeners[type]({ target: this }); }
}

const stored = new Map();
function boot() {
    const elements = new Map();
    const element = id => {
        if (!elements.has(id)) elements.set(id, new Element());
        return elements.get(id);
    };
    const context = vm.createContext({
        console: { log() {}, error: console.error },
        document: {
            addEventListener() {},
            getElementById: element,
            createElement: () => new Element()
        },
        localStorage: {
            getItem: key => stored.get(key) || null,
            setItem: (key, value) => stored.set(key, value)
        },
        I18N: { currentLang: 'en', t: key => key, skill: name => name },
        DEFAULT_STRESS_BOXES: 2, DEFAULT_REFRESH: 3, FREE_STUNTS: 3,
        SKILL_PYRAMID: {},
        toggleMenu() {}, startQuickSetup() {}, skipQuickSetup() {},
        closeDiceModal() {}, showToast() {}
    });
    for (const file of ['character.js', 'storage.js', 'app.js']) {
        vm.runInContext(fs.readFileSync(path.join(__dirname, '../js', file), 'utf8'), context);
    }
    context.setupSkillsPage = () => {};
    context.updatePortraitDisplay = () => {};
    context.setupEventListeners();
    return { app: context, element };
}

let { app, element } = boot();
app.createNewCharacter();
app.displayCharacterSheet();
assert.equal(app.getCharacter().fatePoints, 3);
element('fate-points-increase').dispatch('click');
element('fate-points-increase').dispatch('click');
assert.equal(app.getCharacter().fatePoints, 5);
assert.equal(element('sheet-fate-points').textContent, 5);
function mark(track, index, checked) {
    const input = element(`${track}-stress`).children[index].input;
    input.checked = checked;
    input.dispatch('change');
}
function consequence(severity, value) {
    const input = element(`consequence-${severity}`);
    input.value = value;
    input.dispatch('input');
}
function checkSheet(physical, mental, values) {
    for (const [track, expected] of [['physical', physical], ['mental', mental]]) {
        assert.deepEqual(element(`${track}-stress`).children.map(label => label.input.checked), expected);
    }
    for (const severity of ['mild', 'moderate', 'severe']) {
        assert.equal(element(`consequence-${severity}`).value, values[severity]);
        assert.equal(app.getCharacter().consequences[severity].used, !!values[severity].trim());
    }
}
const values = { mild: 'Bruised', moderate: 'Broken arm', severe: '失去信心' };
mark('physical', 1, true);
mark('mental', 0, true);
for (const [severity, value] of Object.entries(values)) consequence(severity, value);
assert.ok(app.getCharacter().updatedAt);
app.displayCharacterSheet();
checkSheet([false, true], [true, false], values);
element('btn-save-character').dispatch('click');
const id = app.getCharacter().id;

// A new runtime simulates a reload, retaining only serialized local storage.
({ app, element } = boot());
app.loadCharacterData(app.loadCharacter(id));
app.displayCharacterSheet();
assert.equal(app.getCharacter().fatePoints, 5);
assert.equal(element('sheet-fate-points').textContent, 5);
for (let i = 0; i < 6; i++) element('fate-points-decrease').dispatch('click');
assert.equal(app.getCharacter().fatePoints, 0);
assert.equal(element('fate-points-decrease').disabled, true);
checkSheet([false, true], [true, false], values);
app.addSkill('Physique', 3);
app.displayCharacterSheet();
checkSheet([false, true, false, false], [true, false], values);
mark('physical', 1, false);
mark('mental', 0, false);
for (const severity of Object.keys(values)) consequence(severity, '');
element('btn-save-character').dispatch('click');
app.loadCharacterData(app.loadCharacter(id));
app.displayCharacterSheet();
checkSheet([false, false, false, false], [false, false], { mild: '', moderate: '', severe: '' });

// Legacy saves retain their capacities and existing consequence text.
const legacy = app.loadCharacter(id);
assert.equal(legacy.fatePoints, 0);
delete legacy.fatePoints;
legacy.refresh = 2;
delete legacy.stress.marked;
legacy.consequences.mild = { used: true, aspect: 'Old injury' };
app.loadCharacterData(legacy);
app.displayCharacterSheet();
assert.equal(app.getCharacter().fatePoints, 2);
checkSheet([false, false, false, false], [false, false], { mild: 'Old injury', moderate: '', severe: '' });
mark('physical', 0, true);
app.createNewCharacter();
app.displayCharacterSheet();
checkSheet([false, false], [false, false], { mild: '', moderate: '', severe: '' });
console.log('In-play persistence checks passed.');
