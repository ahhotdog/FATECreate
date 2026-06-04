// storage.js
// localStorage management for saving and loading characters

const STORAGE_KEY = 'fateCharacters';

// Generate a unique ID for a character
function generateId() {
    return 'char_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Save character to localStorage
function saveCharacter(character) {
    try {
        // Generate ID if this is a new character
        if (!character.id) {
            character.id = generateId();
            character.createdAt = new Date().toISOString();
        }
        
        // Update timestamp
        character.updatedAt = new Date().toISOString();
        
        // Get existing characters
        const characters = getAllCharacters();
        
        // Find if character already exists
        const index = characters.findIndex(c => c.id === character.id);
        
        if (index >= 0) {
            // Update existing character
            characters[index] = character;
        } else {
            // Add new character
            characters.push(character);
        }
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
        
        console.log('Character saved:', character.id);
        return character.id;
        
    } catch (error) {
        console.error('Error saving character:', error);
        return null;
    }
}

// Get all saved characters
function getAllCharacters() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading characters:', error);
        return [];
    }
}

// Load a specific character by ID
function loadCharacter(id) {
    try {
        const characters = getAllCharacters();
        const character = characters.find(c => c.id === id);
        
        if (character) {
            console.log('Character loaded:', id);
            return character;
        } else {
            console.error('Character not found:', id);
            return null;
        }
    } catch (error) {
        console.error('Error loading character:', error);
        return null;
    }
}

// Delete a character by ID
function deleteCharacter(id) {
    try {
        const characters = getAllCharacters();
        const filtered = characters.filter(c => c.id !== id);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        
        console.log('Character deleted:', id);
        return true;
    } catch (error) {
        console.error('Error deleting character:', error);
        return false;
    }
}

// Export character as JSON file
function exportCharacter(character) {
    try {
        const dataStr = JSON.stringify(character, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${character.name || 'character'}_${character.id}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        console.log('Character exported');
        return true;
    } catch (error) {
        console.error('Error exporting character:', error);
        return false;
    }
}

// Import character from JSON
function importCharacter(jsonString) {
    try {
        const character = JSON.parse(jsonString);
        
        // Generate new ID to avoid conflicts
        character.id = generateId();
        character.createdAt = new Date().toISOString();
        character.updatedAt = new Date().toISOString();
        
        // Save the imported character
        return saveCharacter(character);
    } catch (error) {
        console.error('Error importing character:', error);
        return null;
    }
}

// Clear all saved characters (use with caution!)
function clearAllCharacters() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('All characters cleared');
        return true;
    } catch (error) {
        console.error('Error clearing characters:', error);
        return false;
    }
}

// Get storage usage info
function getStorageInfo() {
    try {
        const characters = getAllCharacters();
        const dataStr = localStorage.getItem(STORAGE_KEY) || '';
        
        return {
            characterCount: characters.length,
            storageSize: new Blob([dataStr]).size,
            storageSizeKB: (new Blob([dataStr]).size / 1024).toFixed(2)
        };
    } catch (error) {
        console.error('Error getting storage info:', error);
        return null;
    }
}
