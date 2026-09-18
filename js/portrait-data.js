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

// Only accept embedded raster images or known built-in portraits when rendering.
function getCharacterPortraitSource(portrait) {
    if (!portrait) return null;
    if (portrait.type === 'custom') {
        return typeof portrait.dataUrl === 'string' &&
            /^data:image\/(?:png|jpeg);base64,[A-Za-z0-9+/]+={0,2}$/.test(portrait.dataUrl)
            ? portrait.dataUrl : null;
    }
    const category = PORTRAIT_CATEGORIES.find(c => c.key === portrait.category);
    return category && category.images.includes(portrait.image)
        ? getPortraitPath(portrait.category, portrait.image) : null;
}

// Decode, center-crop, and resize entirely on the user's device.
async function prepareCustomPortrait(file) {
    const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
    const isPng = [137, 80, 78, 71, 13, 10, 26, 10].every((b, i) => bytes[i] === b);
    const isJpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    if (!isPng && !isJpeg) throw new Error('portraitFileType');

    const url = URL.createObjectURL(file);
    try {
        const img = new Image();
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error('portraitFileError'));
            img.src = url;
        });
        const size = Math.min(img.naturalWidth, img.naturalHeight);
        if (!size) throw new Error('portraitFileError');
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 320;
        const context = canvas.getContext('2d');
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        context.drawImage(img, (img.naturalWidth - size) / 2,
            (img.naturalHeight - size) / 2, size, size, 0, 0, 320, 320);
        return { type: 'custom', dataUrl: canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', 0.85) };
    } finally {
        URL.revokeObjectURL(url);
    }
}
