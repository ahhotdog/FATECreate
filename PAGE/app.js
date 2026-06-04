// app.js

// 1. Grab all our page containers from the HTML
const viewHome = document.getElementById('view-home');
const viewQuickSetup = document.getElementById('view-quick-setup');
const viewWizardConcept = document.getElementById('view-wizard-concept');
const viewCharacterSheet = document.getElementById('view-character-sheet');

// 2. Grab our navigation buttons
const btnNew = document.getElementById('goto-setup');
const btnStartQuick = document.getElementById('goto-concept');
const btnSkipSetup = document.getElementById('goto-character-blank');

// 3. Set up the click events to swap screens

// When clicking "NEW" on the home page:
btnNew.addEventListener('click', () => {
    viewHome.classList.add('hidden');          // Hide Home
    viewQuickSetup.classList.remove('hidden'); // Show Quick Setup decision branch
});

// When clicking "Quick Setup" to start the wizard:
btnStartQuick.addEventListener('click', () => {
    viewQuickSetup.classList.add('hidden');       // Hide Quick Setup branch
    viewWizardConcept.classList.remove('hidden'); // Show Step 1: Concept Page
});

// When clicking "Skip for Now" to jump straight to the sheet:
btnSkipSetup.addEventListener('click', () => {
    viewQuickSetup.classList.add('hidden');         // Hide Quick Setup branch
    viewCharacterSheet.classList.remove('hidden'); // Jump straight to empty Character Sheet
});