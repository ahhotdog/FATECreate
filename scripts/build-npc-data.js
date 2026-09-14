// Keep the local-file bundle in sync after editing the source JSON.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const ideas = JSON.parse(fs.readFileSync(path.join(root, 'data/npcRandomizer.json'), 'utf8'));
const header = '// Generated from data/npcRandomizer.json. Refresh with: node scripts/build-npc-data.js\n' +
    '// A classic script can load from file://, where fetching JSON is blocked.\n';
fs.writeFileSync(path.join(root, 'js/npc-data.js'),
    header + 'const NPC_BUNDLED_IDEAS = ' + JSON.stringify(ideas, null, 2) + ';\n');
