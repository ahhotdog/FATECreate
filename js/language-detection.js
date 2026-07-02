// language-detection.js
// Detects user's preferred language and sets it in the I18N module.

document.addEventListener('DOMContentLoaded', function() {
    const userLang = navigator.language || navigator.userLanguage; // Get user's preferred language
    console.log('Detected browser language:', userLang);

    // Check if the detected language is supported
    const supportedLangs = ['en', 'zh-TW']; // List of languages your app supports
    const langCode = userLang.split('-')[0]; // Get the primary language code (e.g., 'en' from 'en-US')

    if (supportedLangs.includes(langCode)) {
        I18N.setLanguage(langCode);
        console.log('Setting language to:', langCode);
    } else {
        I18N.setLanguage('en'); // Default to English if language is not supported
        console.log('Language not supported, defaulting to English.');
    }
});
