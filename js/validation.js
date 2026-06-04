// validation.js
// Form validation and user feedback utilities

// Validate aspect text
function validateAspect(text) {
    if (!text || text.trim().length < 3) {
        return {
            valid: false,
            message: "Aspect must be at least 3 characters long"
        };
    }
    
    if (text.trim().length > 100) {
        return {
            valid: false,
            message: "Aspect is too long (max 100 characters)"
        };
    }
    
    return {
        valid: true,
        message: ""
    };
}

// Validate character name
function validateName(name) {
    if (!name || name.trim().length < 1) {
        return {
            valid: false,
            message: "Name is required"
        };
    }
    
    if (name.trim().length > 50) {
        return {
            valid: false,
            message: "Name is too long (max 50 characters)"
        };
    }
    
    return {
        valid: true,
        message: ""
    };
}

// Validate skill pyramid
function validateSkillPyramid(skills) {
    const errors = [];
    
    // Count skills at each rating
    const skillsByRating = {
        4: [],
        3: [],
        2: [],
        1: []
    };
    
    Object.entries(skills).forEach(([skill, rating]) => {
        if (skillsByRating[rating]) {
            skillsByRating[rating].push(skill);
        }
    });
    
    // Check pyramid structure
    if (skillsByRating[4].length !== 1) {
        errors.push(`Need exactly 1 skill at +4 (currently ${skillsByRating[4].length})`);
    }
    
    if (skillsByRating[3].length !== 2) {
        errors.push(`Need exactly 2 skills at +3 (currently ${skillsByRating[3].length})`);
    }
    
    if (skillsByRating[2].length !== 3) {
        errors.push(`Need exactly 3 skills at +2 (currently ${skillsByRating[2].length})`);
    }
    
    if (skillsByRating[1].length !== 4) {
        errors.push(`Need exactly 4 skills at +1 (currently ${skillsByRating[1].length})`);
    }
    
    // Check for duplicates
    const allSkills = Object.keys(skills);
    const uniqueSkills = new Set(allSkills);
    if (allSkills.length !== uniqueSkills.size) {
        errors.push("Duplicate skills detected");
    }
    
    return {
        valid: errors.length === 0,
        errors: errors,
        skillsByRating: skillsByRating
    };
}

// Validate stunt
function validateStunt(stunt) {
    const errors = [];
    
    if (!stunt.name || stunt.name.trim().length < 2) {
        errors.push("Stunt name must be at least 2 characters");
    }
    
    if (!stunt.description || stunt.description.trim().length < 10) {
        errors.push("Stunt description must be at least 10 characters");
    }
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
}

// Show error message on an input field
function showError(element, message) {
    // Add error class to input
    element.classList.add('error');
    
    // Find or create error message element
    let errorElement = element.parentElement.querySelector('.input-error');
    
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'input-error';
        element.parentElement.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
}

// Clear error message from an input field
function clearError(element) {
    // Remove error class
    element.classList.remove('error');
    
    // Hide error message
    const errorElement = element.parentElement.querySelector('.input-error');
    if (errorElement) {
        errorElement.classList.add('hidden');
    }
}

// Show success message on an input field
function showSuccess(element) {
    element.classList.add('success');
    element.classList.remove('error');
    
    // Clear any error messages
    const errorElement = element.parentElement.querySelector('.input-error');
    if (errorElement) {
        errorElement.classList.add('hidden');
    }
}

// Clear all validation states from an input
function clearValidation(element) {
    element.classList.remove('error', 'success');
    clearError(element);
}

// Show a toast notification
function showToast(message, type = 'info', duration = 3000) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Add to body
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, duration);
}

// Enable/disable a button
function setButtonEnabled(button, enabled) {
    if (!button) {
        console.error('Button not found');
        return;
    }
    
    if (enabled) {
        button.disabled = false;
        button.classList.remove('disabled');
        button.removeAttribute('disabled');
    } else {
        button.disabled = true;
        button.classList.add('disabled');
        button.setAttribute('disabled', 'disabled');
    }
}

// Validate input on blur
function setupInputValidation(inputElement, validationFunction) {
    inputElement.addEventListener('blur', () => {
        const value = inputElement.value;
        const result = validationFunction(value);
        
        if (!result.valid) {
            showError(inputElement, result.message);
        } else {
            showSuccess(inputElement);
        }
    });
    
    inputElement.addEventListener('input', () => {
        // Clear error while typing
        if (inputElement.classList.contains('error')) {
            clearValidation(inputElement);
        }
    });
}

// Check if skill is already selected in pyramid
function isSkillSelected(skillName, currentSelectElement = null) {
    const allSelects = document.querySelectorAll('.skill-select');
    
    for (let select of allSelects) {
        // Skip the current select element
        if (select === currentSelectElement) continue;
        
        if (select.value === skillName) {
            return true;
        }
    }
    
    return false;
}

// Update available skills in dropdowns
function updateSkillDropdowns() {
    const allSelects = document.querySelectorAll('.skill-select');
    
    allSelects.forEach(select => {
        const currentValue = select.value;
        
        // Clear and repopulate options
        select.innerHTML = '<option value="">Choose skill...</option>';
        
        FATE_SKILLS.forEach(skill => {
            // Only add if not selected elsewhere or is current value
            if (!isSkillSelected(skill, select) || skill === currentValue) {
                const option = document.createElement('option');
                option.value = skill;
                option.textContent = skill;
                if (skill === currentValue) {
                    option.selected = true;
                }
                select.appendChild(option);
            }
        });
    });
}
