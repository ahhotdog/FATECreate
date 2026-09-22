// The same model is used for local characters and imported CSV files.
function buildCharacterPrintHtml(character) {
    const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
    const label = key => escape(I18N.t(key));
    const text = value => `<div class="text">${escape(value || '—')}</div>`;
    const section = (title, content) => `<section><h2>${title}</h2>${content}</section>`;
    const aspects = [
        ['highConcept', 'highConceptLabel'], ['trouble', 'troubleLabel'],
        ['phaseOne', 'phase1Label'], ['phaseTwo', 'phase2Label'], ['phaseThree', 'phase3Label']
    ].map(([key, title]) => `<div class="entry"><h3>${label(title)}</h3>${text(character.aspects[key])}</div>`).join('');
    const skills = Object.entries(character.skills).sort((a, b) => b[1] - a[1])
        .map(([name, rating]) => `<div class="skill"><span>${escape(I18N.skill(name))}</span><strong>${rating >= 0 ? '+' : ''}${escape(rating)}</strong></div>`).join('');
    const stunts = character.stunts.map(stunt => `<div class="entry"><h3>${escape(stunt.name || '—')}</h3>${text(stunt.description)}</div>`).join('');
    const stress = ['physical', 'mental'].map(track => {
        const boxes = Array.from({ length: character.stress[track] }, (_, index) => {
            const marked = character.stress.marked?.[track]?.[index] === true;
            return `<span class="stress-box${marked ? ' marked' : ''}">${marked ? '× ' : ''}${index + 1}</span>`;
        }).join('');
        return `<h3>${label(track + 'Stress')}</h3><div class="stress">${boxes || '—'}</div>`;
    }).join('');
    const consequences = ['mild', 'moderate', 'severe'].map(key => {
        const consequence = character.consequences[key];
        return `<div class="entry"><h3>${consequence.used ? '☒' : '☐'} ${label(key + 'Consequence')}</h3>${text(consequence.aspect)}</div>`;
    }).join('');
    const portrait = getCharacterPortraitSource(character.portrait);
    // Resolve built-in relative portrait paths before writing the standalone page.
    const portraitHtml = portrait ? `<img class="portrait" alt="" src="${escape(new URL(portrait, document.baseURI).href)}">` : '';
    return `<!doctype html>
<html lang="${escape(character.language || I18N.currentLang)}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(character.name || 'Fate Create')} — ${label('btnPrintCharacter')}</title>
<style>
* { box-sizing: border-box; }
body { margin: 0; background: #e9e9e9; color: #111; font-family: Arial, "Noto Sans", sans-serif; }
.toolbar { max-width: 190mm; margin: 20px auto; padding: 0 12px; font-size: 14px; }
button { padding: 12px 20px; border: 0; border-radius: 6px; background: #234b60; color: white; font: bold 15px Arial, sans-serif; cursor: pointer; }
button:disabled { opacity: .5; cursor: wait; }
.toolbar p { line-height: 1.5; }
#small-text { color: #784800; }
/* This rectangle fits inside both A4 and Letter with 10 mm margins.
   Use identical physical dimensions on screen and in print to fit only once. */
#paper { width: 190mm; height: 258mm; margin: 0 auto 20px; background: white; position: relative; }
#sheet { width: 190mm; padding: 5mm; font-size: 10pt; line-height: 1.3; transform-origin: top left; overflow-wrap: anywhere; }
header { display: flex; align-items: center; gap: 4mm; border-bottom: 2px solid #111; padding-bottom: 3mm; margin-bottom: 3mm; }
.identity { flex: 1; min-width: 0; }
.brand { font-size: .8em; letter-spacing: .18em; font-weight: bold; }
h1 { font-size: 1.9em; margin: 1mm 0; white-space: pre-wrap; }
.stats { display: flex; flex-wrap: wrap; gap: 2mm 6mm; margin-top: 2mm; }
.portrait { width: 18mm; height: 18mm; object-fit: cover; }
.columns { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 4mm; }
section { border: 1px solid #aaa; padding: .65em; margin-bottom: .8em; }
h2 { font-size: 1.05em; margin: 0 0 .5em; padding-bottom: .25em; border-bottom: 1px solid #aaa; }
h3 { font-size: 1em; margin: 0 0 .2em; white-space: pre-wrap; }
.entry + .entry { margin-top: .65em; }
.text { white-space: pre-wrap; }
.skill { display: flex; gap: 1em; justify-content: space-between; padding: .18em 0; }
.skill span { min-width: 0; white-space: pre-wrap; }
.stress { display: flex; flex-wrap: wrap; gap: .35em; margin: .3em 0 .65em; }
.stress-box { display: inline-block; border: 1px solid #111; min-width: 1.8em; padding: .15em; text-align: center; }
.marked { font-weight: bold; border: 2px solid #111; }
@page { size: portrait; margin: 10mm; }
@media print {
    html, body { width: 190mm; margin: 0; padding: 0; background: white; }
    .toolbar { display: none !important; }
    #paper { margin: 0; break-inside: avoid; overflow: hidden; }
    #sheet { position: absolute; top: 0; left: 0; }
}
</style></head><body>
<div class="toolbar"><button id="print" disabled>${label('printAction')}</button>
<p>${label('printHint')}</p><p id="small-text" hidden>${label('printSmall')}</p></div>
<main id="paper"><article id="sheet">
<header>${portraitHtml}<div class="identity"><div class="brand">FATE CREATE</div><h1>${escape(character.name || '—')}</h1>
<div class="stats"><span>${label('refreshTitle')}: <strong>${escape(character.refresh)}</strong></span><span>${label('fatePointsTitle')}: <strong>${escape(character.fatePoints ?? character.refresh)}</strong></span><span>${label('languageTitle')}: ${escape(character.language || I18N.currentLang)}</span></div></div></header>
<div class="columns"><div>${section(label('coreAspects') + ' / ' + label('secondaryAspects'), aspects)}${section(label('skillsTitle'), skills || '—')}${section(label('stressTitle'), stress + consequences)}</div>
<div>${section(label('stuntsTitle'), stunts || '—')}${section(label('notesTitle'), text(character.notes))}</div></div>
</article></main><script>(${initializeCharacterPrint.toString()})();</script></body></html>`;
}

// Self-contained so the generated HTML keeps working independently of the app.
function initializeCharacterPrint() {
    const sheet = document.getElementById('sheet');
    const paper = document.getElementById('paper');
    function fit() {
        sheet.style.transform = 'none';
        // Prefer reflowing smaller text before scaling the complete sheet.
        let size = 10;
        sheet.style.fontSize = size + 'pt';
        while (sheet.scrollHeight > paper.clientHeight - 2 && size > 7) {
            size -= .25;
            sheet.style.fontSize = size + 'pt';
        }
        const scale = Math.min(1, (paper.clientHeight - 2) / sheet.scrollHeight,
            (paper.clientWidth - 2) / sheet.scrollWidth);
        sheet.style.transform = `scale(${scale})`;
        document.getElementById('small-text').hidden = size * scale >= 8;
    }
    window.addEventListener('beforeprint', fit);
    window.addEventListener('load', fit);
    document.getElementById('print').addEventListener('click', () => { fit(); window.print(); });
    Promise.resolve(document.fonts?.ready).then(() => {
        fit();
        document.getElementById('print').disabled = false;
    });
}

function openCharacterPrintPreview(character) {
    const dialog = document.createElement('dialog');
    dialog.className = 'character-print-dialog';
    const close = document.createElement('button');
    close.className = 'ui-button ui-button-small';
    close.textContent = I18N.t('printClose');
    const frame = document.createElement('iframe');
    frame.title = I18N.t('btnPrintCharacter');
    frame.srcdoc = buildCharacterPrintHtml(character);
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => dialog.remove());
    dialog.append(close, frame);
    document.body.appendChild(dialog);
    dialog.showModal();
}
