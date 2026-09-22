// Versioned, spreadsheet-readable rows. Portrait images are not included.
function characterToCsv(character) {
    const rows = [['section', 'key', 'value', 'detail'], ['format', 'Fate Create', '1', '']];
    const add = (section, key, value, detail = '') => rows.push([section, String(key), String(value ?? ''), String(detail)]);
    ['name', 'language', 'notes', 'refresh', 'fatePoints'].forEach(key => add('character', key, character[key]));
    Object.entries(character.aspects).forEach(([key, value]) => add('aspect', key, value));
    Object.entries(character.skills).forEach(([key, value]) => add('skill', key, value));
    character.stunts.forEach((stunt, index) => add('stunt', index, stunt.name, stunt.description));
    ['physical', 'mental'].forEach(track => add('stress', track, character.stress[track], JSON.stringify(character.stress.marked?.[track] || [])));
    Object.entries(character.consequences).forEach(([key, value]) => add('consequence', key, value.aspect, value.used));
    // Prefix formula-like text for spreadsheet safety; double existing apostrophes
    // so importing our own exports always restores the exact original text.
    const quote = value => '"' + (/^[=+\-@\t\r\n']/.test(value) ? "'" + value : value).replace(/"/g, '""') + '"';
    return '\uFEFF' + rows.map(row => row.map(quote).join(',')).join('\r\n') + '\r\n';
}

function parseCharacterCsv(text) {
    if (text.length > 2 * 1024 * 1024) throw new Error('csvInvalid');
    text = text.replace(/^\uFEFF/, '');
    const rows = [];
    let row = [], cell = '', quoted = false, closed = false;
    const endCell = () => {
        row.push(/^'[=+\-@\t\r\n']/.test(cell) ? cell.slice(1) : cell);
        cell = ''; closed = false;
    };
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (quoted) {
            if (char === '"') {
                if (text[i + 1] === '"') { cell += '"'; i++; }
                else { quoted = false; closed = true; }
            } else cell += char;
        } else if (char === ',') endCell();
        else if (char === '\r' || char === '\n') {
            endCell(); rows.push(row); row = [];
            if (char === '\r' && text[i + 1] === '\n') i++;
        } else if (char === '"' && !cell && !closed) quoted = true;
        else {
            if (closed || char === '"') throw new Error('csvInvalid');
            cell += char;
        }
    }
    if (quoted) throw new Error('csvInvalid');
    if (cell || closed || row.length) { endCell(); rows.push(row); }
    if (JSON.stringify(rows.shift()) !== JSON.stringify(['section', 'key', 'value', 'detail']) ||
        JSON.stringify(rows.shift()) !== JSON.stringify(['format', 'Fate Create', '1', ''])) throw new Error('csvInvalid');
    const character = {
        id: null, portrait: null, name: '', language: 'en', notes: '', refresh: 3, fatePoints: 3,
        aspects: { highConcept: '', trouble: '', phaseOne: '', phaseTwo: '', phaseThree: '' },
        skills: {}, stunts: [], stress: { physical: 2, mental: 2, marked: { physical: [], mental: [] } },
        consequences: { mild: { used: false, aspect: '' }, moderate: { used: false, aspect: '' }, severe: { used: false, aspect: '' } }
    };
    const seen = new Set();
    const integer = (value, min, max) => {
        if (!/^-?\d+$/.test(value) || !Number.isSafeInteger(+value) || +value < min || +value > max) throw new Error('csvInvalid');
        return +value;
    };
    for (const fields of rows) {
        if (fields.length === 1 && fields[0] === '') continue;
        if (fields.length !== 4) throw new Error('csvInvalid');
        const [section, key, value, detail] = fields;
        const identity = JSON.stringify([section, key]);
        if (seen.has(identity)) throw new Error('csvInvalid');
        seen.add(identity);
        if (section === 'character' && ['name', 'notes', 'language', 'refresh', 'fatePoints'].includes(key)) {
            character[key] = ['refresh', 'fatePoints'].includes(key) ? integer(value, 0, Number.MAX_SAFE_INTEGER) : value;
            if (key === 'language' && !['en', 'zh-TW', 'de', 'ja'].includes(value)) throw new Error('csvInvalid');
        } else if (section === 'aspect' && Object.hasOwn(character.aspects, key)) character.aspects[key] = value;
        else if (section === 'skill' && key.trim() && !['__proto__', 'constructor', 'prototype'].includes(key)) {
            character.skills[key] = integer(value, 0, 10);
        } else if (section === 'stunt') {
            if (integer(key, 0, 999) !== character.stunts.length) throw new Error('csvInvalid');
            character.stunts.push({ name: value, description: detail });
        } else if (section === 'stress' && ['physical', 'mental'].includes(key)) {
            character.stress[key] = integer(value, 0, 100);
            const marks = JSON.parse(detail);
            if (!Array.isArray(marks) || marks.length > 100 || marks.some(mark => mark !== null && typeof mark !== 'boolean')) throw new Error('csvInvalid');
            character.stress.marked[key] = marks;
        } else if (section === 'consequence' && Object.hasOwn(character.consequences, key) && ['true', 'false'].includes(detail)) {
            character.consequences[key] = { aspect: value, used: detail === 'true' };
        } else throw new Error('csvInvalid');
    }
    for (const key of ['name', 'language', 'notes', 'refresh', 'fatePoints']) {
        if (!seen.has(JSON.stringify(['character', key]))) throw new Error('csvInvalid');
    }
    return character;
}

function downloadCharacterCsv() {
    try {
        const character = getCharacter();
        const url = URL.createObjectURL(new Blob([characterToCsv(character)], { type: 'text/csv;charset=utf-8' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = (character.name || 'character').replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').slice(0, 100) + '.csv';
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) { showToast(I18N.t('toastError'), 'error'); }
}

async function importCharacterCsvFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    try {
        if (file.size > 2 * 1024 * 1024) throw new Error('csvInvalid');
        const character = parseCharacterCsv(await file.text());
        // Keep the current sheet intact. The imported copy can be opened from Load.
        if (!saveCharacter(character)) throw new Error('toastError');
        showToast(I18N.t('csvImported'), 'success');
        if (currentView === 'view-home' || currentView === 'view-load') {
            displayLoadPage();
            navigateTo('view-load');
        }
    } catch (error) {
        showToast(I18N.t(error.message === 'toastError' ? 'toastError' : 'csvInvalid'), 'error');
    } finally { event.target.value = ''; }
}
