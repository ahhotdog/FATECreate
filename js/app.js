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
    
    // Set up portrait system
    setupPortraitSystem();
    
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
    document.getElementById('lang-de').addEventListener('click', () => selectLanguage('de'));
    document.getElementById('lang-ja').addEventListener('click', () => selectLanguage('ja'));
    
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
    document.getElementById('btn-back-stunts').addEventListener('click', () => {
        // If editing from character sheet, go back to character sheet instead of wizard flow
        if (editingStuntsFromSheet) {
            editingStuntsFromSheet = false;
            navigateTo('view-character-sheet');
            // Re-enable edit mode
            editModeActive = true;
            const editBtn = document.getElementById('btn-edit-mode');
            editBtn.classList.add('active');
            editBtn.textContent = I18N.t('btnDoneEdit');
            document.getElementById('view-character-sheet').classList.add('edit-mode-active');
            renderEditableAspects();
            renderDraggableSkills();
            renderEditableStunts();
        } else {
            goBack();
        }
    });
    document.getElementById('btn-add-stunt').addEventListener('click', addStuntCard);
    document.getElementById('btn-finish-wizard').addEventListener('click', () => {
        saveStuntsToCharacter();
        
        if (editingStuntsFromSheet) {
            // Return to character sheet and re-enable edit mode
            editingStuntsFromSheet = false;
            displayCharacterSheet();
            navigateTo('view-character-sheet');
            
            // Re-enable edit mode on the sheet
            editModeActive = true;
            const editBtn = document.getElementById('btn-edit-mode');
            editBtn.classList.add('active');
            editBtn.textContent = I18N.t('btnDoneEdit');
            document.getElementById('view-character-sheet').classList.add('edit-mode-active');
            renderEditableAspects();
            renderDraggableSkills();
            renderEditableStunts();
            
            showToast(I18N.t('editModeOn'), 'success');
        } else {
            displayCharacterSheet();
            navigateTo('view-character-sheet');
        }
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
    const btnCloseInfo = document.getElementById('btn-close-info');
    if (btnCloseInfo) {
        btnCloseInfo.addEventListener('click', () => goBack());
    }
    
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
    
    // Build tier drop zones (highest first) — no slot limits in sandbox mode
    const tiers = [
        { key: 'great',   rating: 4 },
        { key: 'good',    rating: 3 },
        { key: 'fair',    rating: 2 },
        { key: 'average', rating: 1 }
    ];
    
    tiers.forEach(tier => {
        const tierLabel = I18N.t(tierI18nKeys[tier.key]);
        
        const zone = document.createElement('div');
        zone.className = 'skill-tier-drop-zone wizard-tier-zone';
        zone.dataset.rating = tier.rating;
        // Tier label with skill count (no slot limit in sandbox mode)
        const label = document.createElement('div');
        label.className = 'skill-tier-label';
        label.innerHTML = `${tierLabel} (+${tier.rating}) <span class="slot-counter" id="slot-counter-${tier.rating}">0</span>`;
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
    const assignedSkills = (char && char.skills) ? { ...char.skills } : {};
    
    // Place assigned skills into their tier zones
    Object.entries(assignedSkills).forEach(([skillName, rating]) => {
        const zone = pyramid.querySelector(`.wizard-tier-zone[data-rating="${rating}"]`);
        if (zone) {
            const tile = createWizardSkillTile(skillName);
            if (isCustomSkill(skillName)) tile.classList.add('custom-skill');
            zone.appendChild(tile);
        }
    });
    
    // Place unassigned standard skills into the pool
    FATE_SKILLS.forEach(skillName => {
        if (!assignedSkills[skillName]) {
            const tile = createWizardSkillTile(skillName);
            tile.classList.add('unassigned');
            pool.appendChild(tile);
        }
    });
    
    // Add the "Custom" generator tile (always present in pool)
    const customTile = createWizardSkillTile(CUSTOM_SKILL_MARKER);
    customTile.classList.add('custom-skill-generator', 'unassigned');
    customTile.textContent = I18N.t('customSkillTile');
    pool.appendChild(customTile);
    
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
    tile.dataset.skill = skillName;
    tile.draggable = true;
    
    // Handle custom skill generator tile display
    if (skillName === CUSTOM_SKILL_MARKER) {
        tile.textContent = I18N.t('customSkillTile');
        tile.classList.add('custom-skill-generator');
    } else {
        tile.textContent = I18N.skill(skillName);
        if (isCustomSkill(skillName)) tile.classList.add('custom-skill');
    }
    
    // Drag events (PC)
    tile.addEventListener('dragstart', (e) => {
        draggedSkill = skillName;
        tile.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', skillName);
        
        // Create a custom drag image (ghost)
        const isUnassigned = tile.classList.contains('unassigned');
        const isCustomGen = skillName === CUSTOM_SKILL_MARKER;
        const ghostText = isCustomGen ? I18N.t('customSkillTile') : I18N.skill(skillName);
        const ghost = createDragGhost(ghostText, isUnassigned);
        if (isCustomGen) ghost.classList.add('custom-ghost');
        ghost.style.left = '-9999px';
        ghost.style.top = '-9999px';
        e.dataTransfer.setDragImage(ghost, ghost.offsetWidth / 2, ghost.offsetHeight + 12);
    });
    
    tile.addEventListener('drag', (e) => {
        if (e.clientX > 0 && e.clientY > 0) {
            moveDragGhost(e.clientX, e.clientY);
        }
    });
    
    tile.addEventListener('dragend', () => {
        tile.classList.remove('dragging');
        draggedSkill = null;
        removeDragGhost();
        document.querySelectorAll('.drag-over, .invalid-drop').forEach(el => {
            el.classList.remove('drag-over', 'invalid-drop');
        });
    });
    
    // Touch support for mobile
    tile.addEventListener('touchstart', (e) => {
        draggedSkill = skillName;
        tile.classList.add('dragging');
        tile._originalParent = tile.parentElement;
        
        // Create floating ghost at touch position
        const isUnassigned = tile.classList.contains('unassigned');
        const isCustomGen = skillName === CUSTOM_SKILL_MARKER;
        const ghostText = isCustomGen ? I18N.t('customSkillTile') : I18N.skill(skillName);
        const ghost = createDragGhost(ghostText, isUnassigned);
        if (isCustomGen) ghost.classList.add('custom-ghost');
        moveDragGhost(e.touches[0].clientX, e.touches[0].clientY);
    });
    
    tile.addEventListener('touchmove', (e) => {
        if (draggedSkill) {
            e.preventDefault();
            const touch = e.touches[0];
            moveDragGhost(touch.clientX, touch.clientY);
            highlightTouchDropZone(touch.clientX, touch.clientY, '.wizard-tier-zone, .wizard-skill-pool');
        }
    }, { passive: false });
    
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
    
    // Temporarily hide ghost so elementFromPoint finds the real element
    if (dragGhostEl) dragGhostEl.style.display = 'none';
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    if (dragGhostEl) dragGhostEl.style.display = '';
    
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
    
    removeDragGhost();
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    document.querySelectorAll('.drag-over, .invalid-drop').forEach(el => el.classList.remove('drag-over', 'invalid-drop'));
    draggedSkill = null;
}

// Move a skill tile into a wizard zone
function moveWizardSkillToZone(skillName, zone) {
    // Handle custom skill creation
    if (skillName === CUSTOM_SKILL_MARKER) {
        // Don't allow dropping custom tile back to pool (rating 0)
        if (zone.dataset.rating === '0') return;
        
        // Collect existing skills from all tier zones for duplicate check
        const existingSkills = {};
        document.querySelectorAll('#skill-pyramid .wizard-tier-zone .skill-tile').forEach(tile => {
            const s = tile.dataset.skill;
            if (s && s !== CUSTOM_SKILL_MARKER) existingSkills[s] = true;
        });
        
        const customName = promptCustomSkillName(existingSkills);
        if (!customName) return;
        
        // Create the custom skill tile and add it to the zone
        const newTile = createWizardSkillTile(customName);
        newTile.classList.add('custom-skill');
        zone.appendChild(newTile);
        
        updateWizardSlotCounters();
        validateSkillPyramidUI();
        return;
    }
    
    // Remove existing tile
    const existingTile = document.querySelector(`#skill-pyramid .skill-tile[data-skill="${skillName}"]`);
    if (existingTile) {
        existingTile.remove();
    }
    
    // Create fresh tile
    const newTile = createWizardSkillTile(skillName);
    if (isCustomSkill(skillName)) newTile.classList.add('custom-skill');
    if (zone.dataset.rating === '0') {
        newTile.classList.add('unassigned');
    }
    zone.appendChild(newTile);
    
    // Update counters and validate
    updateWizardSlotCounters();
    validateSkillPyramidUI();
}

// Update the skill count on each tier (sandbox mode — no max limits)
function updateWizardSlotCounters() {
    const tiers = [4, 3, 2, 1];
    
    tiers.forEach(rating => {
        const zone = document.querySelector(`.wizard-tier-zone[data-rating="${rating}"]`);
        if (!zone) return;
        
        const count = zone.querySelectorAll('.skill-tile').length;
        const counter = document.getElementById(`slot-counter-${rating}`);
        
        if (counter) {
            counter.textContent = `${count}`;
            
            // Always show as normal — no over/full states in sandbox mode
            counter.classList.remove('slot-full', 'slot-over');
            if (count > 0) {
                counter.classList.add('slot-full');
            }
        }
    });
}

function validateSkillPyramidUI() {
    // Sandbox mode — always allow progression (no pyramid enforcement)
    const btnNext = document.getElementById('btn-next-skills');
    setButtonEnabled(btnNext, true);
}

function saveSkillsToCharacter() {
    const skills = {};
    
    // Read from tile-based layout
    const tierZones = document.querySelectorAll('.wizard-tier-zone');
    tierZones.forEach(zone => {
        const rating = parseInt(zone.dataset.rating);
        const tiles = zone.querySelectorAll('.skill-tile');
        tiles.forEach(tile => {
            const skill = tile.dataset.skill;
            // Skip the custom skill generator marker
            if (skill === CUSTOM_SKILL_MARKER) return;
            skills[skill] = rating;
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
        <input type="text" class="stunt-name" placeholder="${I18N.t('stuntNamePlaceholder')}" data-index="${index}">
        <textarea class="stunt-description" placeholder="${I18N.t('stuntDescPlaceholder')}" data-index="${index}"></textarea>
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
    
    // Portrait
    updatePortraitDisplay(char);
    
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
            skillDiv.innerHTML = `
                <span class="skill-name">${I18N.skill(skill)}</span>
                <span class="skill-rating">+${rating}</span>
            `;
            skillDiv.addEventListener('click', () => rollFateDice(skill, parseInt(rating))); // Pass original skill name
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
        
        // Build portrait thumbnail HTML
        let portraitHtml = '';
        if (char.portrait && char.portrait.category && char.portrait.image) {
            const portraitSrc = getPortraitPath(char.portrait.category, char.portrait.image);
            portraitHtml = `<div class="card-portrait"><img src="${portraitSrc}" alt="Portrait" /></div>`;
        } else {
            portraitHtml = `<div class="card-portrait"><img src="${getPortraitPlusPath()}" alt="No portrait" style="opacity:0.4;padding:25%;" /></div>`;
        }
        
        card.innerHTML = `
            <div class="character-preview">
                ${portraitHtml}
                <div class="card-info">
                    <h3 class="character-name">${char.name || 'Unnamed Character'}</h3>
                    <p class="character-concept">${char.aspects.highConcept || ''}</p>
                    <p class="character-date">${I18N.t('lastModified')} ${dateStr}</p>
                </div>
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
            renderEditableStunts();
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
let editingStuntsFromSheet = false;

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
        renderEditableStunts();
        
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

// Special marker for the "Custom" skill tile
const CUSTOM_SKILL_MARKER = '__CUSTOM__';

// Currently dragged skill name (shared state for drag events)
let draggedSkill = null;
let dragGhostEl = null; // Floating ghost element that follows cursor/finger

// Check if a skill name is a custom (non-standard) skill
function isCustomSkill(skillName) {
    return skillName && !FATE_SKILLS.includes(skillName) && skillName !== CUSTOM_SKILL_MARKER;
}

// Prompt user for a custom skill name, returns the name or null if cancelled
function promptCustomSkillName(existingSkills) {
    const name = prompt(I18N.t('customSkillPrompt'));
    if (!name || !name.trim()) {
        if (name !== null) showToast(I18N.t('customSkillEmpty'), 'warning');
        return null;
    }
    const trimmed = name.trim();
    // Check for duplicates (case-insensitive)
    const allSkills = [...FATE_SKILLS, ...Object.keys(existingSkills || {})];
    const isDuplicate = allSkills.some(s => s.toLowerCase() === trimmed.toLowerCase());
    if (isDuplicate) {
        showToast(I18N.t('customSkillDuplicate'), 'warning');
        return null;
    }
    return trimmed;
}

// --- Drag Ghost Utilities ---

function createDragGhost(text, isUnassigned) {
    removeDragGhost(); // Clean up any existing ghost
    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost' + (isUnassigned ? ' unassigned' : '');
    ghost.textContent = text;
    document.body.appendChild(ghost);
    dragGhostEl = ghost;
    return ghost;
}

function moveDragGhost(clientX, clientY) {
    if (!dragGhostEl) return;
    dragGhostEl.style.left = (clientX - dragGhostEl.offsetWidth / 2) + 'px';
    dragGhostEl.style.top = (clientY - dragGhostEl.offsetHeight - 12) + 'px';
}

function removeDragGhost() {
    if (dragGhostEl) {
        dragGhostEl.remove();
        dragGhostEl = null;
    }
}

// Highlight the drop zone under the touch point
function highlightTouchDropZone(clientX, clientY, zoneSelectors) {
    // Remove previous highlights
    document.querySelectorAll('.drag-over, .invalid-drop').forEach(el => {
        el.classList.remove('drag-over', 'invalid-drop');
    });
    
    const el = document.elementFromPoint(clientX, clientY);
    if (!el) return;
    
    const zone = el.closest(zoneSelectors);
    if (zone) {
        const maxSlots = parseInt(zone.dataset.maxSlots || '999');
        const currentCount = zone.querySelectorAll('.skill-tile').length;
        
        if (zone.dataset.rating !== '0' && maxSlots < 999 && currentCount >= maxSlots) {
            zone.classList.add('invalid-drop');
        } else {
            zone.classList.add('drag-over');
        }
    }
}

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
    
    // Render tier drop zones for +4, +3, +2, +1 (no slot limits in sandbox mode)
    const tiers = [
        { rating: 4, label: 'Great (+4)' },
        { rating: 3, label: 'Good (+3)' },
        { rating: 2, label: 'Fair (+2)' },
        { rating: 1, label: 'Average (+1)' }
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
            const tile = createSkillTile(skillName);
            if (isCustomSkill(skillName)) tile.classList.add('custom-skill');
            zone.appendChild(tile);
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
        
        // Add Custom skill generator tile (always available)
        const customTile = createSkillTile(CUSTOM_SKILL_MARKER);
        customTile.classList.add('custom-skill-generator');
        pool.appendChild(customTile);
        
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
    tile.dataset.skill = skillName;
    tile.draggable = true;
    
    // Handle custom skill generator tile display
    if (skillName === CUSTOM_SKILL_MARKER) {
        tile.textContent = I18N.t('customSkillTile');
        tile.classList.add('custom-skill-generator');
    } else {
        tile.textContent = I18N.skill(skillName);
        if (isCustomSkill(skillName)) tile.classList.add('custom-skill');
    }
    
    // Drag events (PC)
    tile.addEventListener('dragstart', (e) => {
        draggedSkill = skillName;
        tile.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', skillName);
        
        // Create a custom drag image (ghost)
        const isUnassigned = tile.classList.contains('unassigned');
        const isCustomGen = skillName === CUSTOM_SKILL_MARKER;
        const ghostText = isCustomGen ? I18N.t('customSkillTile') : I18N.skill(skillName);
        const ghost = createDragGhost(ghostText, isUnassigned);
        if (isCustomGen) ghost.classList.add('custom-ghost');
        // Position off-screen initially so the browser picks it up
        ghost.style.left = '-9999px';
        ghost.style.top = '-9999px';
        e.dataTransfer.setDragImage(ghost, ghost.offsetWidth / 2, ghost.offsetHeight + 12);
    });
    
    tile.addEventListener('drag', (e) => {
        // Move the ghost to follow the cursor during drag
        if (e.clientX > 0 && e.clientY > 0) {
            moveDragGhost(e.clientX, e.clientY);
        }
    });
    
    tile.addEventListener('dragend', () => {
        tile.classList.remove('dragging');
        draggedSkill = null;
        removeDragGhost();
        // Clean up all drag-over highlights
        document.querySelectorAll('.drag-over, .invalid-drop').forEach(el => {
            el.classList.remove('drag-over', 'invalid-drop');
        });
    });
    
    // Touch support for mobile drag-and-drop
    tile.addEventListener('touchstart', (e) => {
        draggedSkill = skillName;
        tile.classList.add('dragging');
        tile._originalParent = tile.parentElement;
        
        // Create floating ghost at touch position
        const isUnassigned = tile.classList.contains('unassigned');
        const isCustomGen = skillName === CUSTOM_SKILL_MARKER;
        const ghostText = isCustomGen ? I18N.t('customSkillTile') : I18N.skill(skillName);
        const ghost = createDragGhost(ghostText, isUnassigned);
        if (isCustomGen) ghost.classList.add('custom-ghost');
        moveDragGhost(e.touches[0].clientX, e.touches[0].clientY);
    });
    
    tile.addEventListener('touchmove', (e) => {
        if (draggedSkill) {
            e.preventDefault();
            const touch = e.touches[0];
            moveDragGhost(touch.clientX, touch.clientY);
            highlightTouchDropZone(touch.clientX, touch.clientY, '.skill-tier-drop-zone, .skill-pool');
        }
    }, { passive: false });
    
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
    
    // Temporarily hide ghost so elementFromPoint can find the real element underneath
    if (dragGhostEl) dragGhostEl.style.display = 'none';
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    if (dragGhostEl) dragGhostEl.style.display = '';
    
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
    removeDragGhost();
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    document.querySelectorAll('.drag-over, .invalid-drop').forEach(el => el.classList.remove('drag-over', 'invalid-drop'));
    draggedSkill = null;
}

function cancelTouchDrag() {
    removeDragGhost();
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    document.querySelectorAll('.drag-over, .invalid-drop').forEach(el => el.classList.remove('drag-over', 'invalid-drop'));
    draggedSkill = null;
}

// --- Core Skill Movement Logic ---

function moveSkillToZone(skillName, newRating, zone) {
    const char = getCharacter();
    
    // Handle custom skill creation
    if (skillName === CUSTOM_SKILL_MARKER) {
        // Don't allow dropping custom tile back to pool (rating 0)
        if (newRating === 0) return;
        
        // Prompt for custom skill name
        const customName = promptCustomSkillName(char.skills);
        if (!customName) return; // User cancelled or invalid name
        
        // Create the custom skill with the given rating
        char.skills[customName] = newRating;
        
        // Create a fresh custom tile and add it to the zone
        const newTile = createSkillTile(customName);
        newTile.classList.add('custom-skill');
        zone.appendChild(newTile);
        
        // Update stress boxes and timestamp
        updateStressBoxes();
        char.updatedAt = new Date().toISOString();
        return;
    }
    
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
    if (isCustomSkill(skillName)) newTile.classList.add('custom-skill');
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

// --- Editable Stunts ---

function renderEditableStunts() {
    const char = getCharacter();
    const stuntsDisplay = document.getElementById('stunts-display');
    
    // Keep existing stunt display but add the "+" button at the end
    // First, remove any existing edit button (in case of re-render)
    const existingBtn = stuntsDisplay.querySelector('.edit-add-stunt-btn');
    if (existingBtn) existingBtn.remove();
    const existingHint = stuntsDisplay.querySelector('.edit-hint');
    if (existingHint) existingHint.remove();
    
    // Add hint text
    const hint = document.createElement('p');
    hint.className = 'edit-hint';
    hint.textContent = I18N.t('editStuntsHint');
    stuntsDisplay.appendChild(hint);
    
    // Add "+" button
    const addBtn = document.createElement('button');
    addBtn.className = 'edit-add-stunt-btn';
    addBtn.textContent = I18N.t('editStuntsBtn');
    addBtn.addEventListener('click', () => {
        // Save current aspect/skill edits before leaving
        saveEditModeChanges();
        
        // Set flag so stunts page knows we came from edit mode
        editingStuntsFromSheet = true;
        
        // Set up the stunts wizard page with existing stunts
        setupStuntsPageForEdit();
        
        // Navigate to the stunts wizard page
        navigateTo('view-stunts');
    });
    stuntsDisplay.appendChild(addBtn);
}

function setupStuntsPageForEdit() {
    const char = getCharacter();
    const container = document.getElementById('stunts-container');
    container.innerHTML = '';
    
    // If character has existing stunts, pre-fill them
    if (char.stunts && char.stunts.length > 0) {
        char.stunts.forEach((stunt, index) => {
            createStuntCard(index);
            
            // Fill in the stunt data
            const card = container.querySelector(`.stunt-card[data-index="${index}"]`);
            if (card) {
                const nameInput = card.querySelector('.stunt-name');
                const descInput = card.querySelector('.stunt-description');
                if (nameInput) nameInput.value = stunt.name || '';
                if (descInput) descInput.value = stunt.description || '';
            }
        });
    } else {
        // No existing stunts — create 3 empty cards like the normal wizard
        for (let i = 0; i < 3; i++) {
            createStuntCard(i);
        }
    }
    
    updateRefreshDisplay();
}

// === PORTRAIT SYSTEM ===

// Update the portrait display on the character sheet
function updatePortraitDisplay(char) {
    const avatar = document.getElementById('portrait-avatar');
    const img = document.getElementById('portrait-img');
    if (!avatar || !img) return;
    
    if (char.portrait && char.portrait.category && char.portrait.image) {
        img.src = getPortraitPath(char.portrait.category, char.portrait.image);
        avatar.classList.remove('no-portrait');
    } else {
        img.src = getPortraitPlusPath();
        avatar.classList.add('no-portrait');
    }
}

// Set up the portrait system (click handler, scroll shrink, picker)
function setupPortraitSystem() {
    // Click portrait avatar to open picker
    const avatar = document.getElementById('portrait-avatar');
    if (avatar) {
        avatar.addEventListener('click', openPortraitPicker);
    }
    
    // Close button
    const closeBtn = document.getElementById('portrait-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closePortraitPicker);
    }
    
    // Click overlay background to close
    const overlay = document.getElementById('portrait-picker');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePortraitPicker();
        });
    }
    
    // Scroll listener for portrait shrink
    setupPortraitScrollShrink();
}

// Open the portrait picker modal
function openPortraitPicker() {
    const picker = document.getElementById('portrait-picker');
    if (!picker) return;
    
    picker.classList.remove('hidden');
    
    // Build tabs
    const tabsContainer = document.getElementById('portrait-tabs');
    tabsContainer.innerHTML = '';
    
    const lang = I18N.currentLang || 'en';
    
    PORTRAIT_CATEGORIES.forEach((cat, index) => {
        const tab = document.createElement('button');
        tab.className = 'portrait-tab' + (index === 0 ? ' active' : '');
        tab.textContent = cat.label[lang] || cat.label.en;
        tab.dataset.category = cat.key;
        tab.addEventListener('click', () => {
            // Switch active tab
            tabsContainer.querySelectorAll('.portrait-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderPortraitGrid(cat.key);
        });
        tabsContainer.appendChild(tab);
    });
    
    // Render first category by default
    renderPortraitGrid(PORTRAIT_CATEGORIES[0].key);
}

// Render the portrait grid for a given category
function renderPortraitGrid(categoryKey) {
    const grid = document.getElementById('portrait-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const category = PORTRAIT_CATEGORIES.find(c => c.key === categoryKey);
    if (!category) return;
    
    const char = getCharacter();
    
    category.images.forEach(filename => {
        const item = document.createElement('div');
        item.className = 'portrait-grid-item';
        
        // Check if this is the currently selected portrait
        if (char && char.portrait && char.portrait.category === categoryKey && char.portrait.image === filename) {
            item.classList.add('selected');
        }
        
        const img = document.createElement('img');
        img.src = getPortraitPath(categoryKey, filename);
        img.alt = filename.replace('.png', '');
        img.loading = 'lazy';
        item.appendChild(img);
        
        item.addEventListener('click', () => {
            selectPortrait(categoryKey, filename);
        });
        
        grid.appendChild(item);
    });
}

// Select a portrait
function selectPortrait(categoryKey, filename) {
    const char = getCharacter();
    if (!char) return;
    
    char.portrait = { category: categoryKey, image: filename };
    char.updatedAt = new Date().toISOString();
    
    // Update the character sheet display
    updatePortraitDisplay(char);
    
    // Update selected state in grid
    const grid = document.getElementById('portrait-grid');
    if (grid) {
        grid.querySelectorAll('.portrait-grid-item').forEach(item => item.classList.remove('selected'));
        // Find and highlight the selected one
        const items = grid.querySelectorAll('.portrait-grid-item');
        items.forEach(item => {
            const img = item.querySelector('img');
            if (img && img.src.includes(filename)) {
                item.classList.add('selected');
            }
        });
    }
    
    // Close the picker after selection
    closePortraitPicker();
}

// Close the portrait picker modal
function closePortraitPicker() {
    const picker = document.getElementById('portrait-picker');
    if (picker) {
        picker.classList.add('hidden');
    }
}

// Scroll listener: shrink portrait when user scrolls down
function setupPortraitScrollShrink() {
    const sheetView = document.getElementById('view-character-sheet');
    if (!sheetView) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const header = document.getElementById('portrait-header');
                if (!header) { ticking = false; return; }
                
                // Only apply shrink when character sheet is visible
                if (sheetView.classList.contains('hidden')) {
                    ticking = false;
                    return;
                }
                
                const scrollY = window.scrollY || window.pageYOffset;
                if (scrollY > 80) {
                    header.classList.add('shrunk');
                } else {
                    header.classList.remove('shrunk');
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
}
