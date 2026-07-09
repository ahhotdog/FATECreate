// portrait-data.js
// Portrait image registry organized by genre categories

const PORTRAIT_CATEGORIES = [
    {
        key: 'fantasy',
        label: { en: 'Fantasy', 'zh-TW': '奇幻' },
        images: [
            'alchemist.png', 'bard.png', 'cartographor.png', 'cleric.png',
            'druid.png', 'fighter.png', 'herbalist.png', 'pally.png',
            'ranger.png', 'rouge.png', 'scholar.png', 'wizard.png'
        ]
    },
    {
        key: 'scifi',
        label: { en: 'Sci-Fi', 'zh-TW': '科幻' },
        images: [
            'ai.png', 'alien.png', 'alienboss.png', 'Bountyhunter.png',
            'captian.png', 'Cyborg.png', 'doc.png', 'hulk.png',
            'navigator.png', 'scavanger.png', 'smugler.png', 'spacemarine.png'
        ]
    },
    {
        key: 'noir',
        label: { en: 'Noir', 'zh-TW': '老警探' },
        images: [
            'cop.png', 'dick.png', 'doc.png', 'femme.png',
            'henchmen.png', 'hobo.png', 'jazz.png', 'journalist.png',
            'MIB.png', 'news.png', 'rich.png', 'richman.png'
        ]
    },
    {
        key: 'mythos',
        label: { en: 'Mythos', 'zh-TW': '克蘇魯' },
        images: [
            'antiques.png', 'artist.png', 'cthulu.png', 'cultis.png',
            'dick.png', 'goul.png', 'innsmouth.png', 'libraian.png',
            'madmen.png', 'Mystic.png', 'prof.png', 'reporter.png'
        ]
    }
];

// Map category key to folder name (folder names differ from tab labels)
const PORTRAIT_FOLDERS = {
    fantasy: 'Fantasy',
    scifi: 'Scifi',
    noir: 'Noir',
    mythos: 'Cthlulu'
};

// Build full path for a portrait image
function getPortraitPath(categoryKey, filename) {
    const folder = PORTRAIT_FOLDERS[categoryKey];
    return `assets/protraits/${folder}/${filename}`;
}

// Get the plus icon path
function getPortraitPlusPath() {
    return 'assets/protraits/plus.png';
}
