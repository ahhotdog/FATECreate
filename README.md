# Fate Create - FATE Core Character Creator

A web-based character creation tool for the FATE Core RPG system.

## Features

✅ **Complete Character Creation Wizard**
- Guided step-by-step process
- High Concept and Trouble aspects
- Phase Trio (3 additional aspects)
- Skill pyramid (18 FATE Core skills)
- Stunts with refresh management

✅ **Character Management**
- Save characters to browser localStorage
- Load and edit existing characters
- Delete characters
- Character sheet display

✅ **User-Friendly Interface**
- Clean, intuitive design
- Mobile-responsive layout
- Form validation
- Toast notifications
- Progress indicator

## How to Use

### Getting Started

1. Open `index.html` in your web browser
2. Click **NEW** to create a character
3. Choose **Quick Setup** for guided creation or **Skip for Now** to go directly to the character sheet

### Quick Setup Wizard

The wizard guides you through:

1. **High Concept** - Define who your character is
2. **Trouble** - What complicates their life
3. **Phase Trio** - Three formative experiences (Phases 1-3)
4. **Skills** - Select skills following the pyramid structure:
   - 1 skill at Great (+4)
   - 2 skills at Good (+3)
   - 3 skills at Fair (+2)
   - 4 skills at Average (+1)
5. **Stunts** - Create special abilities (3 free, more reduce refresh)

### Character Sheet

- View all character information
- Edit name, notes, and consequences
- Track stress (physical and mental)
- Save your character for later

### Loading Characters

1. Click **LOAD** from the home page
2. Select a character from the list
3. Click **Load** to open it
4. Edit and save as needed

## File Structure

```
D:/FATECreate/
├── index.html              # Main HTML file
├── assets/
│   └── images/
│       └── logo.png        # App logo
├── css/
│   ├── main.css           # Base styles and variables
│   ├── components.css     # Reusable UI components
│   └── views.css          # Page-specific styles
├── js/
│   ├── fate-data.js       # FATE Core game data
│   ├── character.js       # Character data model
│   ├── storage.js         # localStorage management
│   ├── navigation.js      # View switching
│   ├── validation.js      # Form validation
│   └── app.js             # Main application controller
└── plans/                 # Architecture documentation
```

## FATE Core Skills

The app includes all 18 default FATE Core skills:

- Athletics
- Burglary
- Contacts
- Crafts
- Deceive
- Drive
- Empathy
- Fight
- Investigate
- Lore
- Notice
- Physique
- Provoke
- Rapport
- Resources
- Shoot
- Stealth
- Will

## Technical Details

- **Pure Vanilla JavaScript** - No frameworks or dependencies
- **localStorage** - Characters saved in browser
- **Responsive Design** - Works on mobile and desktop
- **Single Page Application** - Fast, smooth navigation

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari

## Tips

- **Aspects** should be descriptive phrases that can help or hinder your character
- **Skills** at higher ratings represent your character's expertise
- **Stunts** let you break the rules or get bonuses in specific situations
- **Refresh** determines how many fate points you start each session with
- **Stress** helps you stay in conflicts without taking consequences
- **Consequences** are lasting injuries or conditions

## Future Enhancements

Potential features for future versions:
- Export characters as PDF
- Import/export JSON
- Custom skill lists
- Multiple FATE variants (FAE, Dresden Files, etc.)
- Character sharing
- Cloud sync
- Print-friendly character sheets

## Credits

Created for FATE Core RPG character creation.

FATE Core is a product of Evil Hat Productions.

## Version

**v1.0** - Initial Release

---

**Enjoy creating your FATE Core characters!** 🎲✨
