// language-detection.js
// Detects user's preferred language and sets it in the I18N module.

document.addEventListener('DOMContentLoaded', function() {
    // Check if a language has already been set by the user
    const savedLang = localStorage.getItem('fateCreate_language');
    if (savedLang) {
        return; // A preference is already saved, so do nothing.
    }

    const userLang = navigator.language || navigator.userLanguage; // Get user's preferred language
    console.log('Detected browser language:', userLang);

    // Check if the detected language is supported
    const supportedLangs = ['en', 'zh-TW', 'de', 'ja'];
    const matchedLang = supportedLangs.find(lang => userLang === lang || userLang.startsWith(lang + '-'));

    if (matchedLang) {
        I18N.setLanguage(matchedLang);
        console.log('Setting language to:', langCode);
    } else {
        I18N.setLanguage('en'); // Default to English if language is not supported
        console.log('Language not supported, defaulting to English.');
    }
});
