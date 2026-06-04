// navigation.js
// View switching and navigation management

// Track navigation history
let navigationHistory = [];
let currentView = null;

// Initialize navigation system
function initNavigation() {
    // Show home view by default
    showView('view-home');
}

// Show a specific view, hide all others
function showView(viewId) {
    // Get all views
    const views = document.querySelectorAll('.spa-view');
    
    // Hide all views
    views.forEach(view => {
        view.classList.add('hidden');
    });
    
    // Show the requested view
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.remove('hidden');
        currentView = viewId;
        console.log('Showing view:', viewId);
        
        // Initialize view-specific functionality
        initializeView(viewId);
    } else {
        console.error('View not found:', viewId);
    }
}

// Initialize view-specific functionality when view is shown
function initializeView(viewId) {
    // Check if aspect input already has value and enable button
    const aspectViews = {
        'view-concept': 'highconcept',
        'view-trouble': 'trouble',
        'view-phase-1': 'phase1',
        'view-phase-2': 'phase2',
        'view-phase-3': 'phase3'
    };
    
    const pageId = aspectViews[viewId];
    if (pageId) {
        // Check if input has value and enable button if valid
        setTimeout(() => {
            const input = document.getElementById(`aspect-${pageId}`);
            const btnNext = document.getElementById(`btn-next-${pageId}`);
            
            if (input && btnNext) {
                const validation = validateAspect(input.value);
                setButtonEnabled(btnNext, validation.valid);
            }
        }, 50); // Small delay to ensure elements are ready
    }
}

// Navigate to a view with history tracking
function navigateTo(viewId, addToHistory = true) {
    // Add current view to history before navigating
    if (addToHistory && currentView && currentView !== viewId) {
        navigationHistory.push(currentView);
    }
    
    // Show the new view
    showView(viewId);
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Update progress indicator if in wizard
    updateProgressIndicator(viewId);
}

// Go back to previous view
function goBack() {
    if (navigationHistory.length > 0) {
        const previousView = navigationHistory.pop();
        showView(previousView);
        updateProgressIndicator(previousView);
    } else {
        // If no history, go to home
        navigateTo('view-home', false);
    }
}

// Clear navigation history
function clearHistory() {
    navigationHistory = [];
}

// Update progress indicator based on current view
function updateProgressIndicator(viewId) {
    const progressSteps = document.querySelectorAll('.progress-step');
    if (progressSteps.length === 0) return;
    
    // Map views to progress steps
    const viewToStep = {
        'view-concept': 1,
        'view-trouble': 2,
        'view-phase-1': 2,
        'view-phase-2': 2,
        'view-phase-3': 2,
        'view-skills': 3,
        'view-stunts': 4,
        'view-character-sheet': 5
    };
    
    const currentStep = viewToStep[viewId];
    
    if (currentStep) {
        progressSteps.forEach((step, index) => {
            const stepNumber = index + 1;
            
            // Remove all state classes
            step.classList.remove('completed', 'active', 'pending');
            
            // Add appropriate class
            if (stepNumber < currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.add('pending');
            }
        });
    }
}

// Show a modal/overlay
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    }
}

// Hide a modal/overlay
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

// Toggle menu overlay
function toggleMenu() {
    const menu = document.getElementById('menu-overlay');
    if (menu) {
        if (menu.classList.contains('hidden')) {
            showModal('menu-overlay');
        } else {
            hideModal('menu-overlay');
        }
    }
}

// Confirm navigation if there are unsaved changes
function confirmNavigation(targetView, message = "You have unsaved changes. Continue?") {
    // Check if character has been modified
    const character = getCharacter();
    if (character && character.updatedAt && !character.id) {
        // Character exists but hasn't been saved
        if (confirm(message)) {
            navigateTo(targetView);
        }
    } else {
        navigateTo(targetView);
    }
}

// Navigate to home and reset
function goToHome(confirmFirst = true) {
    if (confirmFirst) {
        confirmNavigation('view-home', "Return to home? Any unsaved progress will be lost.");
    } else {
        clearHistory();
        navigateTo('view-home', false);
    }
}

// Start new character creation
function startNewCharacter() {
    createNewCharacter();
    clearHistory();
    navigateTo('view-quick-setup', false);
}

// Quick setup decision
function startQuickSetup() {
    navigateTo('view-concept');
}

function skipQuickSetup() {
    navigateTo('view-character-sheet');
}
