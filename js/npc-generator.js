// Fill the current character's aspects from the selected theme.
let npcIdeas = null;
let npcGenerating = false;

async function loadNpcIdeas() {
    if (npcIdeas) return npcIdeas;
    // Local HTML cannot fetch local JSON. Hosted pages prefer the source JSON,
    // with the matching bundle available if the request fails.
    if (window.location.protocol !== 'file:') {
        try {
            const response = await fetch('data/npcRandomizer.json');
            if (!response.ok) throw new Error('NPC data request failed');
            npcIdeas = await response.json();
        } catch (error) {
            console.warn('Using bundled NPC ideas:', error);
        }
    }
    if (!npcIdeas && typeof NPC_BUNDLED_IDEAS !== 'undefined') {
        npcIdeas = NPC_BUNDLED_IDEAS;
    }
    if (!npcIdeas) throw new Error('NPC ideas are unavailable');
    return npcIdeas;
}

function buildNpcAspects(entries) {
    for (const key of ['high_concepts', 'troubles', 'general_aspects']) {
        if (!Array.isArray(entries?.[key]) || !entries[key].length ||
            entries[key].some(value => typeof value !== 'string' || !value.trim())) {
            throw new Error('Invalid NPC theme data');
        }
    }
    const pool = [...new Set(entries.general_aspects)];
    if (pool.length < 3) throw new Error('Three distinct general aspects required');
    const pick = items => items[Math.floor(Math.random() * items.length)];
    const secondary = [];
    for (let i = 0; i < 3; i++) {
        secondary.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    }
    return {
        highConcept: pick(entries.high_concepts), trouble: pick(entries.troubles),
        phaseOne: secondary[0], phaseTwo: secondary[1], phaseThree: secondary[2]
    };
}

function closeNpcDialog() {
    if (npcGenerating) return;
    hideModal('npc-theme-dialog');
    document.getElementById('btn-npc-generator').focus();
}

async function generateNpc() {
    const select = document.getElementById('npc-theme');
    const theme = select.value;
    const character = getCharacter();
    if (!theme || !character || npcGenerating) return;
    const button = document.getElementById('btn-generate-npc');
    const cancel = document.getElementById('btn-cancel-npc');
    const error = document.getElementById('npc-generator-error');
    npcGenerating = true;
    button.disabled = cancel.disabled = select.disabled = true;
    error.classList.add('hidden');
    let success = false;
    try {
        const ideas = await loadNpcIdeas();
        // NPC ideas are grouped by the language stored with the character. This
        // prevents a saved character from receiving aspects in a different UI language.
        const language = character.language || I18N.currentLang;
        const localizedThemes = ideas[language] || ideas.en;
        const aspects = buildNpcAspects(localizedThemes?.[theme]);
        if (getCharacter() !== character) throw new Error('Character changed');
        Object.assign(character.aspects, aspects);
        character.updatedAt = new Date().toISOString();
        // Update only aspects to preserve stress checkboxes and other sheet inputs.
        if (editModeActive) {
            document.querySelectorAll('#aspects-display .aspect-edit-input').forEach(input => {
                input.value = aspects[input.dataset.aspectKey];
            });
        } else {
            const keys = ['highConcept', 'trouble', 'phaseOne', 'phaseTwo', 'phaseThree'];
            document.querySelectorAll('#aspects-display .aspect-value').forEach((el, index) => {
                el.textContent = aspects[keys[index]];
            });
        }
        success = true;
    } catch (err) {
        console.error('Unable to generate NPC:', err);
        error.classList.remove('hidden');
    } finally {
        npcGenerating = false;
        button.disabled = cancel.disabled = select.disabled = false;
    }
    if (success) {
        closeNpcDialog();
        document.getElementById('aspects-display').scrollIntoView({ block: 'start' });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const dialog = document.getElementById('npc-theme-dialog');
    const select = document.getElementById('npc-theme');
    const generate = document.getElementById('btn-generate-npc');
    document.getElementById('btn-npc-generator').addEventListener('click', () => {
        select.value = '';
        generate.disabled = true;
        document.getElementById('npc-generator-error').classList.add('hidden');
        showModal('npc-theme-dialog');
        select.focus();
    });
    select.addEventListener('change', () => { generate.disabled = !select.value; });
    generate.addEventListener('click', generateNpc);
    document.getElementById('btn-cancel-npc').addEventListener('click', closeNpcDialog);
    dialog.addEventListener('click', event => {
        if (event.target === dialog) closeNpcDialog();
    });
    dialog.addEventListener('keydown', event => {
        if (event.key === 'Escape') { event.preventDefault(); closeNpcDialog(); }
        if (event.key === 'Tab') {
            const controls = [...dialog.querySelectorAll('select, button')].filter(el => !el.disabled);
            if (!controls.length) { event.preventDefault(); return; }
            const first = controls[0], last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault(); last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault(); first.focus();
            }
        }
    });
});
