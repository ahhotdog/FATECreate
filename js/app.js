// app.js
// Main application controller - ties everything together

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Fate Create initialized');
    
    // Initialize navigation
    initNavigation();
    
    // Set up all event listeners
    setupEventListeners();
    
    // Populate example lists
    populateExamples();
    
    // Set up scroll-based menu button hide/show
    setupScrollMenuButton();
    
    // Apply saved language translations
    I18N.applyTranslations();
    initSettingsPage();
});

// Hide menu button on scroll down, show on scroll up
function setupScrollMenuButton() {
    let lastScrollY = 0;
    const menuButton = document.getElementById('menu-button');
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
            // Scrolling down - hide the button
            menuButton.classList.add('menu-hidden');
        } else {
            // Scrolling up - show the button
            menuButton.classList.remove('menu-hidden');
        }
        
        lastScrollY = currentScrollY;
    });
}

// Set up all event listeners
function setupEventListeners() {
    // === HOME PAGE ===
    document.getElementById('btn-new').addEventListener('click', () => {
        startNewCharacter();
    });
    
    document.getElementById('btn-load').addEventListener('click', () => {
        displayLoadPage();
        navigateTo('view-load');
    });
    
    // === MENU ===
    document.getElementById('menu-button').addEventListener('click', toggleMenu);
    // Close menu when clicking the logo inside the menu
    document.getElementById('menu-logo-close').addEventListener('click', () => hideModal('menu-overlay'));
    // Close menu when clicking outside the menu content (on the overlay background)
    document.getElementById('menu-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            hideModal('menu-overlay');
        }
    });
    
    document.getElementById('menu-info').addEventListener('click', () => {
        hideModal('menu-overlay');
        navigateTo('view-info');
    });
    
    document.getElementById('menu-new').addEventListener('click', () => {
        hideModal('menu-overlay');
        startNewCharacter();
    });
    
    document.getElementById('menu-load').addEventListener('click', () => {
        hideModal('menu-overlay');
        displayLoadPage();
        navigateTo('view-load');
    });
    
    document.getElementById('menu-setting').addEventListener('click', () => {
        hideModal('menu-overlay');
        initSettingsPage();
        navigateTo('view-settings');
    });
    
    // === SETTINGS ===
    document.getElementById('btn-back-settings').addEventListener('click', () => goToHome(true));
    document.getElementById('lang-en').addEventListener('click', () => selectLanguage('en'));
    document.getElementById('lang-zh-TW').addEventListener('click', () => selectLanguage('zh-TW'));
    
    // === DICE ROLLER ===
    document.getElementById('dice-close').addEventListener('click', closeDiceModal);
    document.getElementById('dice-modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeDiceModal();
    });
    
    // === QUICK SETUP ===
    document.getElementById('btn-start-quick').addEventListener('click', startQuickSetup);
    document.getElementById('btn-skip-setup').addEventListener('click', skipQuickSetup);
    
    // === ASPECT PAGES ===
    // Use event delegation for aspect inputs (works even when elements are hidden)
    document.addEventListener('input', (e) => {
        if (e.target.id && e.target.id.startsWith('aspect-')) {
            console.log('Input event on:', e.target.id, 'Value:', e.target.value);
            
            const pageId = e.target.id.replace('aspect-', '');
            const btnNext = document.getElementById(`btn-next-${pageId}`);
            
            console.log('Button found:', btnNext ? 'yes' : 'no');
            
            if (btnNext) {
                const validation = validateAspect(e.target.value);
                console.log('Validation result:', validation);
                console.log('Setting button enabled:', validation.valid);
                
                setButtonEnabled(btnNext, validation.valid);
                if (validation.valid) {
                    clearError(e.target);
                }
            }
        }
    });
    
    // Set up click handlers for aspect page buttons
    setupAspectButtons();
    
    // === SKILLS PAGE ===
    setupSkillsPage();
    
    document.getElementById('btn-back-skills').addEventListener('click', () => goBack());
    document.getElementById('btn-next-skills').addEventListener('click', () => {
        saveSkillsToCharacter();
        setupStuntsPage();
        navigateTo('view-stunts');
    });
    
    // === STUNTS PAGE ===
    document.getElementById('btn-back-stunts').addEventListener('click', () => goBack());
    document.getElementById('btn-add-stunt').addEventListener('click', addStuntCard);
    document.getElementById('btn-finish-wizard').addEventListener('click', () => {
        saveStuntsToCharacter();
        displayCharacterSheet();
        navigateTo('view-character-sheet');
    });
    
    // === CHARACTER SHEET ===
    document.getElementById('character-name').addEventListener('input', (e) => {
        updateCharacter('name', e.target.value);
    });
    
    document.getElementById('character-notes').addEventListener('input', (e) => {
        updateCharacter('notes', e.target.value);
    });
    
    document.getElementById('btn-save-character').addEventListener('click', () => {
        const id = saveCharacter(getCharacter());
        if (id) {
            showToast(I18N.t('toastSaved'), 'success');
        } else {
            showToast(I18N.t('toastError'), 'error');
        }
    });
    
    document.getElementById('btn-new-from-sheet').addEventListener('click', () => {
        if (confirm('Start a new character? Any unsaved changes will be lost.')) {
            startNewCharacter();
        }
    });
    
    // === EDIT MODE ===
    document.getElementById('btn-edit-mode').addEventListener('click', toggleEditMode);
    
    // === INFO PAGE ===
    document.getElementById('btn-close-info').addEventListener('click', () => goBack());
    
    // === LOAD PAGE ===
    document.getElementById('btn-back-load').addEventListener('click', () => {
        navigateTo('view-home');
    });
}

// Setup aspect button click handlers using event delegation
function setupAspectButtons() {
    const aspectPages = [
        { id: 'concept', path: 'aspects.highConcept', next: 'view-trouble' },
        { id: 'trouble', path: 'aspects.trouble', next: 'view-phase-1' },
        { id: 'phase1', path: 'aspects.phaseOne', next: 'view-phase-2' },
        { id: 'phase2', path: 'aspects.phaseTwo', next: 'view-phase-3' },
        { id: 'phase3', path: 'aspects.phaseThree', next: 'view-skills' }
    ];
    
    // Use event delegation for button clicks
    document.addEventListener('click', (e) => {
        console.log('Click detected on:', e.target.id, e.target);
        
        // Handle Next buttons
        if (e.target.id && e.target.id.startsWith('btn-next-')) {
            console.log('Next button clicked:', e.target.id);
            
            // Check if button is disabled
            if (e.target.disabled || e.target.hasAttribute('disabled')) {
                console.log('Button is disabled, ignoring click');
                return;
            }
            
            const pageId = e.target.id.replace('btn-next-', '');
            const page = aspectPages.find(p => p.id === pageId);
            
            console.log('Page config:', page);
            
            if (page) {
                const input = document.getElementById(`aspect-${pageId}`);
                console.log('Input value:', input ? input.value : 'input not found');
                
                if (input && input.value) {
                    console.log('Updating character and navigating...');
                    updateCharacter(page.path, input.value);
                    navigateTo(page.next);
                } else {
                    console.log('Input is empty or not found');
                }
            }
        }
        
        // Handle Back buttons
        if (e.target.id && e.target.id.startsWith('btn-back-')) {
            console.log('Back button clicked:', e.target.id);
            const pageId = e.target.id.replace('btn-back-', '');
            const aspectPageIds = aspectPages.map(p => p.id);
            
            if (aspectPageIds.includes(pageId)) {
                console.log('Going back...');
                goBack();
            }
        }
    });
}

// Populate example lists
function populateExamples() {
    // High Concept examples
    const highConceptList = document.getElementById('highconcept-examples');
    highConceptList.innerHTML = '';
    I18N.getAspectExamples('highConcept').forEach(example => {
        const li = document.createElement('li');
        li.textContent = example;
        highConceptList.appendChild(li);
    });
    
    // Trouble examples
    const troubleList = document.getElementById('trouble-examples');
    troubleList.innerHTML = '';
    I18N.getAspectExamples('trouble').forEach(example => {
        const li = document.createElement('li');
        li.textContent = example;
        troubleList.appendChild(li);
    });
    
    // Phase examples
    const phaseList = document.getElementById('phase-examples');
    phaseList.innerHTML = '';
    I18N.getAspectExamples('phase').forEach(example => {
        const li = document.createElement('li');
        li.textContent = example;
        phaseList.appendChild(li);
    });
}

// === SKILLS PAGE FUNCTIONS ===

function setupSkillsPage() {
    const pyramid = document.getElementById('skill-pyramid');
    pyramid.innerHTML = '';
    
    // Map tier keys to i18n keys
    const tierI18nKeys = { great: 'tierGreat', good: 'tierGood', fair: 'tierFair', average: 'tierAverage' };
    
    // Build tier drop zones (highest first)
    const tiers = [
        { key: 'great',   rating: 4, slots: 1 },
        { key: 'good',    rating: 3, slots: 2 },
        { key: 'fair',    rating: 2, slots: 3 },
        { key: 'average', rating: 1, slots: 4 }
    ];
    
    tiers.forEach(tier => {
        const tierLabel = I18N.t(tierI18nKeys[tier.key]);
        
        const zone = document.createElement('div');
        zone.className = 'skill-tier-drop-zone wizard-tier-zone';
        zone.dataset.rating = tier.rating;
        zone.dataset.maxSlots = tier.slots;
        
        // Tier label with slot counter
        const label = document.createElement('div');
        label.className = 'skill-tier-label';
        label.innerHTML = `${tierLabel} (+${tier.rating}) <span class="slot-counter" id="slot-counter-${tier.rating}">0 / ${tier.slots}</span>`;
        zone.appendChild(label);
        
        // Drop zone events
        zone.addEventListener('dragover', handleWizardDragOver);
        zone.addEventListener('dragenter', handleWizardDragEnter);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleWizardDrop);
        
        // Touch support
        zone.addEventListener('touchmove', handleTouchMove);
        zone.addEventListener('touchend', handleWizardTouchEnd);
        
        pyramid.appendChild(zone);
    });
    
    // Unassigned skills pool — all 18 skills start here
    const pool = document.createElement('div');
    pool.className = 'skill-pool wizard-skill-pool';
    pool.dataset.rating = '0';
    
    const poolLabel = document.createElement('div');
    poolLabel.className = 'skill-pool-label';
    poolLabel.textContent = I18N.t('unassignedSkills');
    pool.appendChild(poolLabel);
    
    // Pre-populate: if character already has skills assigned, place them in tiers
    const char = getCharacter();
    const assignedSkills = char.skills ? { ...char.skills } : {};
    
    // Place assigned skills into their tier zones
    Object.entries(assignedSkills).forEach(([skillName, rating]) => {
        const zone = pyramid.querySelector(`.wizard-tier-zone[data-rating="${rating}"]`);
        if (zone) {
            zone.appendChild(createWizardSkillTile(skillName));
        }
    });
    
    // Place unassigned skills into the pool
    FATE_SKILLS.forEach(skillName => {
        if (!assignedSkills[skillName]) {
            const tile = createWizardSkillTile(skillName);
            tile.classList.add('unassigned');
            pool.appendChild(tile);
        }
    });
    
    pool.addEventListener('dragover', handleWizardDragOver);
    pool.addEventListener('dragenter', handleWizardDragEnter);
    pool.addEventListener('dragleave', handleDragLeave);
    pool.addEventListener('drop', handleWizardDrop);
    
    // Touch support
    pool.addEventListener('touchmove', handleTouchMove);
    pool.addEventListener('touchend', handleWizardTouchEnd);
    
    pyramid.appendChild(pool);
    
    // Update slot counters and validate
    updateWizardSlotCounters();
    validateSkillPyramidUI();
}

// Create a draggable skill tile for the wizard page
function createWizardSkillTile(skillName) {
    const tile = document.createElement('div');
    tile.className = 'skill-tile';
    tile.textContent = I18N.skill(skillName);
    tile.dataset.skill = skillName;
    tile.draggable = true;
    
    tile.addEventListener('dragstart', (e) => {
        draggedSkill = skillName;
        tile.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', skillName);
    });
    
    tile.addEventListener('dragend', () => {
        tile.classList.remove('dragging');
        draggedSkill = null;
        document.querySelectorAll('.drag-over, .invalid-drop').forEach(el => {
            el.classList.remove('drag-over', 'invalid-drop');
        });
    });
    
    // Touch support
    tile.addEventListener('touchstart', (e) => {
        draggedSkill = skillName;
        tile.classList.add('dragging');
        tile._originalParent = tile.parentElement;
    });
    
    return tile;
}

// Wizard-specific drag handlers that enforce slot limits
function handleWizardDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleWizardDragEnter(e) {
    e.preventDefault();
    const zone = e.currentTarget;
    const maxSlots = parseInt(zone.dataset.maxSlots || '999');
    const currentCount = zone.querySelectorAll('.skill-tile').length;
    
    if (zone.dataset.rating !== '0' && currentCount >= maxSlots) {
        zone.classList.add('invalid-drop');
    } else {
        zone.classList.add('drag-over');
    }
}

function handleWizardDrop(e) {
    e.preventDefault();
    const zone = e.currentTarget;
    zone.classList.remove('drag-over', 'invalid-drop');
    
    const skillName = e.dataTransfer.getData('text/plain') || draggedSkill;
    if (!skillName) return;
    
    const maxSlots = parseInt(zone.dataset.maxSlots || '999');
    const currentCount = zone.querySelectorAll('.skill-tile').length;
    
    // Enforce slot limit (pool has no limit)
    if (zone.dataset.rating !== '0' && currentCount >= maxSlots) {
        return; // Tier is full, reject the drop
    }
    
    moveWizardSkillToZone(skillName, zone);
}

function handleWizardTouchEnd(e) {
    if (!draggedSkill) return;
    
    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (!dropTarget) {
        cancelTouchDrag();
        return;
    }
    
    const zone = dropTarget.closest('.wizard-tier-zone, .wizard-skill-pool');
    if (zone) {
        const maxSlots = parseInt(zone.dataset.maxSlots || '999');
        const currentCount = zone.querySelectorAll('.skill-tile').length;
        
        if (zone.dataset.rating === '0' || currentCount < maxSlots) {
            moveWizardSkillToZone(draggedSkill, zone);
        }
    }
    
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    draggedSkill = null;
}

// Move a skill tile into a wizard zone
function moveWizardSkillToZone(skillName, zone) {
    // Remove existing tile
    const existingTile = document.querySelector(`#skill-pyramid .skill-tile[data-skill="${skillName}"]`);
    if (existingTile) {
        existingTile.remove();
    }
    
    // Create fresh tile
    const newTile = createWizardSkillTile(skillName);
    if (zone.dataset.rating === '0') {
        newTile.classList.add('unassigned');
    }
    zone.appendChild(newTile);
    
    // Update counters and validate
    updateWizardSlotCounters();
    validateSkillPyramidUI();
}

// Update the "X / Y" slot counters on each tier
function updateWizardSlotCounters() {
    const tiers = [4, 3, 2, 1];
    const maxSlots = { 4: 1, 3: 2, 2: 3, 1: 4 };
    
    tiers.forEach(rating => {
        const zone = document.querySelector(`.wizard-tier-zone[data-rating="${rating}"]`);
        if (!zone) return;
        
        const count = zone.querySelectorAll('.skill-tile').length;
        const max = maxSlots[rating];
        const counter = document.getElementById(`slot-counter-${rating}`);
        
        if (counter) {
            counter.textContent = `${count} / ${max}`;
            
            if (count === max) {
                counter.classList.add('slot-full');
                counter.classList.remove('slot-over');
            } else if (count > max) {
                counter.classList.add('slot-over');
                counter.classList.remove('slot-full');
            } else {
                counter.classList.remove('slot-full', 'slot-over');
            }
        }
    });
}

function validateSkillPyramidUI() {
    // Read skills from the tile layout
    const skills = {};
    const tierZones = document.querySelectorAll('.wizard-tier-zone');
    
    tierZones.forEach(zone => {
        const rating = parseInt(zone.dataset.rating);
        const tiles = zone.querySelectorAll('.skill-tile');
        tiles.forEach(tile => {
            skills[tile.dataset.skill] = rating;
        });
    });
    
    const validation = validateSkillPyramid(skills);
    const btnNext = document.getElementById('btn-next-skills');
    
    setButtonEnabled(btnNext, validation.valid);
}

function saveSkillsToCharacter() {
    const skills = {};
    
    // Read from tile-based layout
    const tierZones = document.querySelectorAll('.wizard-tier-zone');
    tierZones.forEach(zone => {
        const rating = parseInt(zone.dataset.rating);
        const tiles = zone.querySelectorAll('.skill-tile');
        tiles.forEach(tile => {
            skills[tile.dataset.skill] = rating;
        });
    });
    
    // Update character
    const char = getCharacter();
    char.skills = skills;
    
    // Update stress boxes based on skills
    updateStressBoxes();
}

// === STUNTS PAGE FUNCTIONS ===

function setupStuntsPage() {
    const container = document.getElementById('stunts-container');
    container.innerHTML = '';
    
    // Create 3 default stunt cards
    for (let i = 0; i < 3; i++) {
        createStuntCard(i);
    }
    
    updateRefreshDisplay();
}

function createStuntCard(index) {
    const container = document.getElementById('stunts-container');
    
    const card = document.createElement('div');
    card.className = 'stunt-card';
    card.dataset.index = index;
    
    card.innerHTML = `
        <div class="stunt-number">${index + 1}</div>
        ${index >= 3 ? '<button class="btn-remove-stunt" onclick="removeStuntCard(' + index + ')">&times;</button>' : ''}
        <input type="text" class="stunt-name" placeholder="Stunt Name" data-index="${index}">
        <textarea class="stunt-description" placeholder="Describe what this stunt does..." data-index="${index}"></textarea>
    `;
    
    container.appendChild(card);
}

function addStuntCard() {
    const char = getCharacter();
    if (char.refresh <= MIN_REFRESH) {
        showToast('Cannot reduce refresh below 1!', 'warning');
        return;
    }
    
    const container = document.getElementById('stunts-container');
    const currentCount = container.children.length;
    
    createStuntCard(currentCount);
    updateRefreshDisplay();
    
    showToast('Stunt added (Refresh -1)', 'info');
}

function removeStuntCard(index) {
    const card = document.querySelector(`.stunt-card[data-index="${index}"]`);
    if (card) {
        card.remove();
        updateRefreshDisplay();
        showToast('Stunt removed (Refresh +1)', 'info');
    }
}

function updateRefreshDisplay() {
    const container = document.getElementById('stunts-container');
    const stuntCount = container.children.length;
    const refresh = Math.max(MIN_REFRESH, DEFAULT_REFRESH - Math.max(0, stuntCount - FREE_STUNTS));
    
    document.getElementById('refresh-value').textContent = refresh;
}

function saveStuntsToCharacter() {
    const char = getCharacter();
    char.stunts = [];
    
    const stuntCards = document.querySelectorAll('.stunt-card');
    stuntCards.forEach(card => {
        const name = card.querySelector('.stunt-name').value;
        const description = card.querySelector('.stunt-description').value;
        
        if (name || description) {
            char.stunts.push({
                name: name || 'Unnamed Stunt',
                description: description || 'No description'
            });
        }
    });
    
    updateRefresh();
}

// === CHARACTER SHEET FUNCTIONS ===

function displayCharacterSheet() {
    const char = getCharacter();
    
    // Reset edit mode UI when re-rendering the sheet
    editModeActive = false;
    const editBtn = document.getElementById('btn-edit-mode');
    if (editBtn) {
        editBtn.classList.remove('active');
        editBtn.textContent = I18N.t('btnEdit');
    }
    document.getElementById('view-character-sheet').classList.remove('edit-mode-active');
    
    // Name
    document.getElementById('character-name').value = char.name || '';
    
    // Aspects - separated into Core and Secondary
    const aspectsDisplay = document.getElementById('aspects-display');
    aspectsDisplay.innerHTML = '';
    
    // Core Aspects (High Concept & Trouble)
    const coreHeader = document.createElement('h4');
    coreHeader.className = 'aspect-group-header';
    coreHeader.textContent = I18N.t('coreAspects');
    aspectsDisplay.appendChild(coreHeader);
    
    const coreAspects = ['highConcept', 'trouble'];
    coreAspects.forEach(key => {
        const value = char.aspects[key];
        const aspectDiv = document.createElement('div');
        aspectDiv.className = 'aspect-display';
        aspectDiv.innerHTML = `<div class="aspect-value">${value || '—'}</div>`;
        aspectsDisplay.appendChild(aspectDiv);
    });
    
    // Secondary Aspects (Phase Trio)
    const secondaryHeader = document.createElement('h4');
    secondaryHeader.className = 'aspect-group-header';
    secondaryHeader.textContent = I18N.t('secondaryAspects');
    aspectsDisplay.appendChild(secondaryHeader);
    
    const secondaryAspects = ['phaseOne', 'phaseTwo', 'phaseThree'];
    secondaryAspects.forEach(key => {
        const value = char.aspects[key];
        const aspectDiv = document.createElement('div');
        aspectDiv.className = 'aspect-display';
        aspectDiv.innerHTML = `<div class="aspect-value">${value || '—'}</div>`;
        aspectsDisplay.appendChild(aspectDiv);
    });
    
    // Skills — grouped by rating tier in a 2-column grid
    const skillsDisplay = document.getElementById('skills-display');
    skillsDisplay.innerHTML = '';
    
    const sortedSkills = Object.entries(char.skills).sort((a, b) => b[1] - a[1]);
    
    // Group skills by rating
    const skillTiers = {};
    sortedSkills.forEach(([skill, rating]) => {
        if (!skillTiers[rating]) skillTiers[rating] = [];
        skillTiers[rating].push(skill);
    });
    
    // Render each tier group (highest first)
    const tierKeys = Object.keys(skillTiers).sort((a, b) => b - a);
    tierKeys.forEach(rating => {
        const tierDiv = document.createElement('div');
        tierDiv.className = 'skill-tier-group';
        
        skillTiers[rating].forEach(skill => {
            const skillDiv = document.createElement('div');
            skillDiv.className = 'skill-item clickable';
            const translatedSkill = I18N.skill(skill);
            skillDiv.innerHTML = `
                <span class="skill-name">${translatedSkill}</span>
                <span class="skill-rating">+${rating}</span>
            `;
            skillDiv.addEventListener('click', () => rollFateDice(skill, parseInt(rating)));
            tierDiv.appendChild(skillDiv);
        });
        
        skillsDisplay.appendChild(tierDiv);
    });
    
    // Stunts
    const stuntsDisplay = document.getElementById('stunts-display');
    stuntsDisplay.innerHTML = '';
    
    char.stunts.forEach(stunt => {
        const stuntDiv = document.createElement('div');
        stuntDiv.className = 'stunt-display';
        stuntDiv.innerHTML = `
            <div class="stunt-display-name">${stunt.name}</div>
            <div class="stunt-display-description">${stunt.description}</div>
        `;
        stuntsDisplay.appendChild(stuntDiv);
    });
    
    // Stress boxes
    displayStressBoxes('physical-stress', char.stress.physical);
    displayStressBoxes('mental-stress', char.stress.mental);
    
    // Consequences
    document.getElementById('consequence-mild').value = char.consequences.mild.aspect || '';
    document.getElementById('consequence-moderate').value = char.consequences.moderate.aspect || '';
    document.getElementById('consequence-severe').value = char.consequences.severe.aspect || '';
    
    // Notes
    document.getElementById('character-notes').value = char.notes || '';
    
    // Refresh
    document.getElementById('sheet-refresh-value').textContent = char.refresh;
}

function displayStressBoxes(containerId, count) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    for (let i = 1; i <= count; i++) {
        const label = document.createElement('label');
        label.className = 'stress-box';
        label.innerHTML = `
            <input type="checkbox">
            <span>${i}</span>
        `;
        container.appendChild(label);
    }
}

// === LOAD PAGE FUNCTIONS ===

function displayLoadPage() {
    const container = document.getElementById('character-list');
    container.innerHTML = '';
    
    const characters = getAllCharacters();
    
    if (characters.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <p class="empty-state-text">${I18N.t('noCharacters')}</p>
            </div>
        `;
        return;
    }
    
    characters.forEach(char => {
        const card = document.createElement('div');
        card.className = 'character-card';
        
        const date = new Date(char.updatedAt || char.createdAt);
        const dateStr = date.toLocaleDateString();
        
        card.innerHTML = `
            <div class="character-preview">
                <h3 class="character-name">${char.name || 'Unnamed Character'}</h3>
                <p class="character-concept">${char.aspects.highConcept || ''}</p>
                <p class="character-date">${I18N.t('lastModified')} ${dateStr}</p>
            </div>
            <div class="character-actions">
                <button class="ui-button ui-button-small" onclick="loadCharacterById('${char.id}')">${I18N.t('btnLoadChar')}</button>
                <button class="ui-button ui-button-small ui-button-danger" onclick="deleteCharacterById('${char.id}')">${I18N.t('btnDeleteChar')}</button>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Load character by ID (called from HTML)
function loadCharacterById(id) {
    const char = loadCharacter(id);
    if (char) {
        loadCharacterData(char);
        displayCharacterSheet();
        navigateTo('view-character-sheet');
        showToast(I18N.t('toastLoaded'), 'success');
    } else {
        showToast(I18N.t('toastErrorLoad'), 'error');
    }
}

// ===== DICE ROLLER =====

// Roll a single Fate die: returns -1, 0, or +1
function rollSingleFateDie() {
    const roll = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    return roll;
}

// Get the display symbol for a die result
function getDieSymbol(value) {
    if (value === 1) return '+';
    if (value === -1) return '−';
    return ' ';
}

// Get the CSS class for a die result
function getDieClass(value) {
    if (value === 1) return 'die-plus';
    if (value === -1) return 'die-minus';
    return 'die-blank';
}

// Open dice modal and roll 4dF for a skill
function rollFateDice(skillName, skillBonus) {
    const modal = document.getElementById('dice-modal');
    const resultDiv = document.getElementById('dice-result');
    const resultValue = document.getElementById('dice-result-value');
    
    // Set skill header (translate the skill name)
    document.getElementById('dice-skill-name').textContent = I18N.skill(skillName);
    document.getElementById('dice-skill-bonus').textContent = '+' + skillBonus;
    
    // Reset dice
    for (let i = 1; i <= 4; i++) {
        const die = document.getElementById('die-' + i);
        die.textContent = '';
        die.className = 'fate-die';
    }
    
    // Hide result
    resultDiv.classList.remove('show');
    resultDiv.classList.add('hidden');
    
    // Show modal
    modal.classList.remove('hidden');
    
    // Roll 4 dice
    const diceResults = [];
    for (let i = 0; i < 4; i++) {
        diceResults.push(rollSingleFateDie());
    }
    
    const diceTotal = diceResults.reduce((sum, val) => sum + val, 0);
    const finalResult = diceTotal + skillBonus;
    
    // Animate dice appearing one by one
    diceResults.forEach((result, index) => {
        setTimeout(() => {
            const die = document.getElementById('die-' + (index + 1));
            die.textContent = getDieSymbol(result);
            die.classList.add('rolling', getDieClass(result));
        }, index * 250); // 250ms stagger between each die
    });
    
    // Show final result after all dice have appeared
    setTimeout(() => {
        resultDiv.classList.remove('hidden');
        // Small delay for the CSS transition to kick in
        requestAnimationFrame(() => {
            resultDiv.classList.add('show');
        });
        
        // Format result with sign
        const sign = finalResult >= 0 ? '+' : '';
        resultValue.textContent = sign + finalResult;
        
        // Color the result
        resultValue.className = 'dice-result-value';
        if (finalResult > 0) {
            resultValue.classList.add('result-positive');
        } else if (finalResult < 0) {
            resultValue.classList.add('result-negative');
        }
    }, 4 * 250 + 400); // After all dice + animation time
}

// Close the dice modal
function closeDiceModal() {
    document.getElementById('dice-modal').classList.add('hidden');
}

// Delete character by ID (called from HTML)
function deleteCharacterById(id) {
    if (confirm(I18N.t('confirmDelete'))) {
        if (deleteCharacter(id)) {
            displayLoadPage();
            showToast(I18N.t('toastDeleted'), 'info');
        } else {
            showToast(I18N.t('toastErrorDelete'), 'error');
        }
    }
}

// ===== SETTINGS & LANGUAGE =====

// Initialize settings page (highlight current language)
function initSettingsPage() {
    document.querySelectorAll('.language-option').forEach(btn => {
        btn.classList.remove('active');
    });
    const currentBtn = document.getElementById('lang-' + I18N.currentLang);
    if (currentBtn) {
        currentBtn.classList.add('active');
    }
}

// Select a language and apply translations
function selectLanguage(lang) {
    I18N.setLanguage(lang);
    
    // Update active state on buttons
    initSettingsPage();
    
    // Re-populate dynamic content with new language
    populateExamples();
    
    // If on character sheet, re-render it (respecting edit mode)
    const charSheet = document.getElementById('view-character-sheet');
    if (charSheet && !charSheet.classList.contains('hidden')) {
        const wasEditing = editModeActive;
        if (wasEditing) {
            // Save current edits before re-rendering
            saveEditModeChanges();
        }
        displayCharacterSheet(); // This resets editModeActive to false
        if (wasEditing) {
            // Restore edit mode state
            editModeActive = true;
            const editBtn = document.getElementById('btn-edit-mode');
            editBtn.classList.add('active');
            editBtn.textContent = I18N.t('btnDoneEdit');
            charSheet.classList.add('edit-mode-active');
            renderEditableAspects();
            renderDraggableSkills();
        }
    }
    
    // If on load page, re-render it
    const loadPage = document.getElementById('view-load');
    if (loadPage && !loadPage.classList.contains('hidden')) {
        displayLoadPage();
    }
}

// ===== EDIT MODE =====

let editModeActive = false;

// Toggle edit mode on/off
function toggleEditMode() {
    editModeActive = !editModeActive;
    
    const btn = document.getElementById('btn-edit-mode');
    const sheetView = document.getElementById('view-character-sheet');
    
    if (editModeActive) {
        // Activate edit mode
        btn.classList.add('active');
        btn.textContent = I18N.t('btnDoneEdit');
        sheetView.classList.add('edit-mode-active');
        
        renderEditableAspects();
        renderDraggableSkills();
        
        showToast(I18N.t('editModeOn'), 'info');
    } else {
        // Deactivate edit mode — save changes first
        saveEditModeChanges();
        
        btn.classList.remove('active');
        btn.textContent = I18N.t('btnEdit');
        sheetView.classList.remove('edit-mode-active');
        
        // Re-render the normal character sheet
        displayCharacterSheet();
        
        showToast(I18N.t('editModeOff'), 'success');
    }
}

// --- Editable Aspects ---

function renderEditableAspects() {
    const char = getCharacter();
    const aspectsDisplay = document.getElementById('aspects-display');
    aspectsDisplay.innerHTML = '';
    
    // Core Aspects header
    const coreHeader = document.createElement('h4');
    coreHeader.className = 'aspect-group-header';
    coreHeader.textContent = I18N.t('coreAspects');
    aspectsDisplay.appendChild(coreHeader);
    
    // Core aspect inputs
    const coreAspects = [
        { key: 'highConcept', label: I18N.t('highConceptLabel') },
        { key: 'trouble', label: I18N.t('troubleLabel') }
    ];
    
    coreAspects.forEach(({ key, label }) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'aspect-display';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'aspect-edit-input';
        input.value = char.aspects[key] || '';
        input.placeholder = label;
        input.dataset.aspectKey = key;
        
        wrapper.appendChild(input);
        aspectsDisplay.appendChild(wrapper);
    });
    
    // Secondary Aspects header
    const secondaryHeader = document.createElement('h4');
    secondaryHeader.className = 'aspect-group-header';
    secondaryHeader.textContent = I18N.t('secondaryAspects');
    aspectsDisplay.appendChild(secondaryHeader);
    
    // Secondary aspect inputs
    const secondaryAspects = [
        { key: 'phaseOne', label: I18N.t('phase1Label') },
        { key: 'phaseTwo', label: I18N.t('phase2Label') },
        { key: 'phaseThree', label: I18N.t('phase3Label') }
    ];
    
    secondaryAspects.forEach(({ key, label }) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'aspect-display';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'aspect-edit-input';
        input.value = char.aspects[key] || '';
        input.placeholder = label;
        input.dataset.aspectKey = key;
        
        wrapper.appendChild(input);
        aspectsDisplay.appendChild(wrapper);
    });
}

// --- Drag-and-Drop Skills ---

// Currently dragged skill name (shared state for drag events)
let draggedSkill = null;

function renderDraggableSkills() {
    const char = getCharacter();
    const skillsDisplay = document.getElementById('skills-display');
    skillsDisplay.innerHTML = '';
    
    // Add hint text
    const hint = document.createElement('div');
    hint.className = 'edit-hint';
    hint.textContent = I18N.t('dragSkillHint');
    skillsDisplay.appendChild(hint);
    
    // Build a map of skill → rating from the character
    const skillRatings = { ...char.skills }; // e.g. { Athletics: 4, Fight: 3, ... }
    
    // Collect all assigned skill names
    const assignedSkills = new Set(Object.keys(skillRatings));
    
    // Unassigned skills (from FATE_SKILLS not in character)
    const unassignedSkills = FATE_SKILLS.filter(s => !assignedSkills.has(s));
    
    // Render tier drop zones for +4, +3, +2, +1
    const tiers = [
        { rating: 4, label: 'Great (+4)', slots: 1 },
        { rating: 3, label: 'Good (+3)', slots: 2 },
        { rating: 2, label: 'Fair (+2)', slots: 3 },
        { rating: 1, label: 'Average (+1)', slots: 4 }
    ];
    
    tiers.forEach(tier => {
        const zone = document.createElement('div');
        zone.className = 'skill-tier-drop-zone';
        zone.dataset.rating = tier.rating;
        
        // Tier label
        const label = document.createElement('div');
        label.className = 'skill-tier-label';
        label.textContent = tier.label;
        zone.appendChild(label);
        
        // Add skill tiles for skills at this rating
        const skillsAtTier = Object.entries(skillRatings)
            .filter(([_, r]) => r === tier.rating)
            .map(([name]) => name);
        
        skillsAtTier.forEach(skillName => {
            zone.appendChild(createSkillTile(skillName));
        });
        
        // Drop zone events
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragenter', handleDragEnter);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
        
        // Touch support
        zone.addEventListener('touchmove', handleTouchMove);
        zone.addEventListener('touchend', handleTouchEnd);
        
        skillsDisplay.appendChild(zone);
    });
    
    // Unassigned skills pool
    if (unassignedSkills.length > 0 || true) {
        // Always show the pool so users can drag skills back
        const pool = document.createElement('div');
        pool.className = 'skill-pool';
        pool.dataset.rating = '0';
        
        const poolLabel = document.createElement('div');
        poolLabel.className = 'skill-pool-label';
        poolLabel.textContent = I18N.t('unassignedSkills');
        pool.appendChild(poolLabel);
        
        unassignedSkills.forEach(skillName => {
            const tile = createSkillTile(skillName);
            tile.classList.add('unassigned');
            pool.appendChild(tile);
        });
        
        pool.addEventListener('dragover', handleDragOver);
        pool.addEventListener('dragenter', handleDragEnter);
        pool.addEventListener('dragleave', handleDragLeave);
        pool.addEventListener('drop', handleDrop);
        
        // Touch support
        pool.addEventListener('touchmove', handleTouchMove);
        pool.addEventListener('touchend', handleTouchEnd);
        
        skillsDisplay.appendChild(pool);
    }
}

// Create a single draggable skill tile element
function createSkillTile(skillName) {
    const tile = document.createElement('div');
    tile.className = 'skill-tile';
    tile.textContent = I18N.skill(skillName);
    tile.dataset.skill = skillName;
    tile.draggable = true;
    
    // Drag events
    tile.addEventListener('dragstart', (e) => {
        draggedSkill = skillName;
        tile.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', skillName);
    });
    
    tile.addEventListener('dragend', () => {
        tile.classList.remove('dragging');
        draggedSkill = null;
        // Clean up all drag-over highlights
        document.querySelectorAll('.drag-over, .invalid-drop').forEach(el => {
            el.classList.remove('drag-over', 'invalid-drop');
        });
    });
    
    // Touch support for mobile drag-and-drop
    tile.addEventListener('touchstart', (e) => {
        draggedSkill = skillName;
        tile.classList.add('dragging');
        // Store the original parent for potential cancel
        tile._originalParent = tile.parentElement;
        tile._touchOffsetX = e.touches[0].clientX - tile.getBoundingClientRect().left;
        tile._touchOffsetY = e.touches[0].clientY - tile.getBoundingClientRect().top;
    });
    
    return tile;
}

// --- Drag Event Handlers ---

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    e.preventDefault();
    const zone = e.currentTarget;
    zone.classList.add('drag-over');
}

function handleDragLeave(e) {
    const zone = e.currentTarget;
    // Only remove if we're actually leaving the zone (not entering a child)
    if (!zone.contains(e.relatedTarget)) {
        zone.classList.remove('drag-over', 'invalid-drop');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const zone = e.currentTarget;
    zone.classList.remove('drag-over', 'invalid-drop');
    
    const skillName = e.dataTransfer.getData('text/plain') || draggedSkill;
    if (!skillName) return;
    
    const newRating = parseInt(zone.dataset.rating);
    
    // Move the skill tile to this zone
    moveSkillToZone(skillName, newRating, zone);
}

// --- Touch Event Handlers for Mobile ---

function handleTouchMove(e) {
    // Prevent scrolling while dragging
    if (draggedSkill) {
        e.preventDefault();
    }
}

function handleTouchEnd(e) {
    if (!draggedSkill) return;
    
    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (!dropTarget) {
        cancelTouchDrag();
        return;
    }
    
    // Find the closest drop zone
    const zone = dropTarget.closest('.skill-tier-drop-zone, .skill-pool');
    if (zone) {
        const newRating = parseInt(zone.dataset.rating);
        moveSkillToZone(draggedSkill, newRating, zone);
    }
    
    // Clean up
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    draggedSkill = null;
}

function cancelTouchDrag() {
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    draggedSkill = null;
}

// --- Core Skill Movement Logic ---

function moveSkillToZone(skillName, newRating, zone) {
    const char = getCharacter();
    
    // Remove the existing tile from wherever it is
    const existingTile = document.querySelector(`.skill-tile[data-skill="${skillName}"]`);
    if (existingTile) {
        existingTile.remove();
    }
    
    // Update the character model
    if (newRating === 0) {
        // Moving to unassigned pool — remove from skills
        delete char.skills[skillName];
    } else {
        // Assign the new rating
        char.skills[skillName] = newRating;
    }
    
    // Create a fresh tile and add it to the zone
    const newTile = createSkillTile(skillName);
    if (newRating === 0) {
        newTile.classList.add('unassigned');
    }
    zone.appendChild(newTile);
    
    // Update stress boxes in case Physique or Will changed
    updateStressBoxes();
    
    // Update timestamp
    char.updatedAt = new Date().toISOString();
}

// --- Save Edit Mode Changes ---

function saveEditModeChanges() {
    const char = getCharacter();
    
    // Save aspect edits
    const aspectInputs = document.querySelectorAll('.aspect-edit-input');
    aspectInputs.forEach(input => {
        const key = input.dataset.aspectKey;
        if (key) {
            char.aspects[key] = input.value.trim();
        }
    });
    
    // Skills are already saved in real-time during drag-and-drop (in moveSkillToZone)
    // Just update stress boxes one final time
    updateStressBoxes();
    
    // Update stress display
    displayStressBoxes('physical-stress', char.stress.physical);
    displayStressBoxes('mental-stress', char.stress.mental);
    
    // Update timestamp
    char.updatedAt = new Date().toISOString();
}
