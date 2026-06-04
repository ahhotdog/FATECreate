// character.js
// Character data model and state management

// Current character being created/edited
let currentCharacter = null;

// Create a new blank character
function createNewCharacter() {
    currentCharacter = {
        id: null,
        name: "",
        aspects: {
            highConcept: "",
            trouble: "",
            phaseOne: "",
            phaseTwo: "",
            phaseThree: ""
        },
        skills: {},
        stunts: [],
        refresh: DEFAULT_REFRESH,
        stress: {
            physical: DEFAULT_STRESS_BOXES,
            mental: DEFAULT_STRESS_BOXES
        },
        consequences: {
            mild: { used: false, aspect: "" },
            moderate: { used: false, aspect: "" },
            severe: { used: false, aspect: "" }
        },
        notes: "",
        createdAt: null,
        updatedAt: null
    };
    return currentCharacter;
}

// Get the current character
function getCharacter() {
    return currentCharacter;
}

// Update a character field (supports nested paths like "aspects.highConcept")
function updateCharacter(path, value) {
    if (!currentCharacter) {
        console.error("No character to update");
        return;
    }

    const keys = path.split('.');
    let obj = currentCharacter;
    
    // Navigate to the nested property
    for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
    }
    
    // Set the value
    obj[keys[keys.length - 1]] = value;
    
    // Update timestamp
    currentCharacter.updatedAt = new Date().toISOString();
    
    console.log(`Updated ${path}:`, value);
}

// Load an existing character
function loadCharacterData(characterData) {
    currentCharacter = characterData;
    return currentCharacter;
}

// Calculate physical stress boxes based on Physique skill
function calculatePhysicalStress() {
    if (!currentCharacter) return DEFAULT_STRESS_BOXES;
    
    const physique = currentCharacter.skills.Physique || 0;
    
    if (physique >= 3) return 4;
    if (physique >= 1) return 3;
    return DEFAULT_STRESS_BOXES;
}

// Calculate mental stress boxes based on Will skill
function calculateMentalStress() {
    if (!currentCharacter) return DEFAULT_STRESS_BOXES;
    
    const will = currentCharacter.skills.Will || 0;
    
    if (will >= 3) return 4;
    if (will >= 1) return 3;
    return DEFAULT_STRESS_BOXES;
}

// Update stress boxes based on skills
function updateStressBoxes() {
    if (!currentCharacter) return;
    
    currentCharacter.stress.physical = calculatePhysicalStress();
    currentCharacter.stress.mental = calculateMentalStress();
}

// Calculate current refresh based on stunts
function calculateRefresh() {
    if (!currentCharacter) return DEFAULT_REFRESH;
    
    const stuntCount = currentCharacter.stunts.length;
    const extraStunts = Math.max(0, stuntCount - FREE_STUNTS);
    const refresh = DEFAULT_REFRESH - extraStunts;
    
    return Math.max(MIN_REFRESH, refresh);
}

// Update refresh based on current stunts
function updateRefresh() {
    if (!currentCharacter) return;
    
    currentCharacter.refresh = calculateRefresh();
}

// Add a skill to the character
function addSkill(skillName, rating) {
    if (!currentCharacter) return;
    
    currentCharacter.skills[skillName] = rating;
    updateStressBoxes(); // Recalculate stress in case Physique or Will changed
}

// Remove a skill from the character
function removeSkill(skillName) {
    if (!currentCharacter) return;
    
    delete currentCharacter.skills[skillName];
    updateStressBoxes();
}

// Add a stunt to the character
function addStunt(stunt) {
    if (!currentCharacter) return;
    
    currentCharacter.stunts.push(stunt);
    updateRefresh();
}

// Remove a stunt from the character
function removeStunt(index) {
    if (!currentCharacter) return;
    
    currentCharacter.stunts.splice(index, 1);
    updateRefresh();
}

// Update a stunt
function updateStunt(index, stunt) {
    if (!currentCharacter) return;
    
    currentCharacter.stunts[index] = stunt;
}

// Validate that character has all required fields
function validateCharacter() {
    if (!currentCharacter) return false;
    
    const errors = [];
    
    // Check name
    if (!currentCharacter.name || currentCharacter.name.trim() === "") {
        errors.push("Character needs a name");
    }
    
    // Check aspects
    if (!currentCharacter.aspects.highConcept) {
        errors.push("High Concept aspect is required");
    }
    if (!currentCharacter.aspects.trouble) {
        errors.push("Trouble aspect is required");
    }
    
    // Check skills (should have 10 skills total in pyramid)
    const skillCount = Object.keys(currentCharacter.skills).length;
    if (skillCount < 10) {
        errors.push("Skill pyramid incomplete (need 10 skills)");
    }
    
    // Check stunts (should have at least 3)
    if (currentCharacter.stunts.length < 3) {
        errors.push("Need at least 3 stunts");
    }
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
}

// Get character completion percentage
function getCompletionPercentage() {
    if (!currentCharacter) return 0;
    
    let completed = 0;
    let total = 10;
    
    // Name
    if (currentCharacter.name) completed++;
    
    // Aspects (5 total)
    if (currentCharacter.aspects.highConcept) completed++;
    if (currentCharacter.aspects.trouble) completed++;
    if (currentCharacter.aspects.phaseOne) completed++;
    if (currentCharacter.aspects.phaseTwo) completed++;
    if (currentCharacter.aspects.phaseThree) completed++;
    
    // Skills
    const skillCount = Object.keys(currentCharacter.skills).length;
    if (skillCount >= 10) completed++;
    
    // Stunts
    if (currentCharacter.stunts.length >= 3) completed++;
    
    return Math.round((completed / total) * 100);
}
