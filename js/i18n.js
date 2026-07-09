// i18n.js - Internationalization support
// Supports: English (en), Traditional Chinese (zh-TW)

const I18N = {
    currentLang: 'en',

    // All translatable strings organized by key
    strings: {
        // === APP TITLE ===
        appTitle: { en: 'Fate Create', 'zh-TW': 'Fate Create' },
        appSubtitle: { en: 'FATE Core Character Creator', 'zh-TW': 'FATE Core 角色創建器' },

        // === HOME PAGE ===
        btnNew: { en: 'NEW', 'zh-TW': '創角' },
        btnLoad: { en: 'LOAD', 'zh-TW': '讀取' },

        // === MENU ===
        menuNew: { en: 'NEW', 'zh-TW': '創角' },
        menuLoad: { en: 'LOAD', 'zh-TW': '讀取' },
        menuInfo: { en: 'INFO', 'zh-TW': '資訊' },
        menuSetting: { en: 'SETTING', 'zh-TW': '設定' },

        // === QUICK SETUP ===
        quickSetupTitle: { en: 'Quick Setup?', 'zh-TW': '快速創角？' },
        quickSetupDesc: { en: 'Would you like to be guided through character creation step-by-step, or skip to the character sheet?', 'zh-TW': '你想要逐步引導建立角色，還是直接跳到角色卡？' },
        btnQuickSetup: { en: 'Quick Setup', 'zh-TW': '快速創角' },
        btnSkipSetup: { en: 'Skip for Now', 'zh-TW': '暫時跳過' },

        // === ASPECT PAGES ===
        step1Title: { en: 'Step 1: High Concept', 'zh-TW': '步驟一：高概念' },
        step1Desc: { en: 'Your High Concept sums up what your character is about—who they are and what they do.', 'zh-TW': '你的高概念概括了你的角色是什麼樣的人——他們是誰，做什麼。' },
        highConceptLabel: { en: 'High Concept Aspect', 'zh-TW': '高概念形象' },
        highConceptPlaceholder: { en: 'e.g., Wizard Private Eye', 'zh-TW': '例如：巫師私家偵探' },
        highConceptHelp: { en: "This is one of your character's aspects.", 'zh-TW': '這是你角色的形象之一。' },

        step2Title: { en: 'Step 2: Trouble', 'zh-TW': '步驟二：麻煩' },
        step2Desc: { en: 'Your Trouble represents the things that complicate your character\'s life.', 'zh-TW': '你的麻煩代表了使你角色生活複雜化的事物。' },
        troubleLabel: { en: 'Trouble Aspect', 'zh-TW': '麻煩形象' },
        troublePlaceholder: { en: 'e.g., Sucker for a Pretty Face', 'zh-TW': '例如：見到美女就心軟' },
        troubleHelp: { en: 'This aspect will create interesting complications.', 'zh-TW': '這個形象會製造有趣的麻煩。' },

        step3Title: { en: 'Step 3: Phase One', 'zh-TW': '步驟三：階段一' },
        step3Desc: { en: 'Describe an important adventure or event in your character\'s past.', 'zh-TW': '描述你角色過去的一段重要冒險或事件。' },
        phase1Label: { en: 'Phase One Aspect', 'zh-TW': '階段一形象' },
        phase1Placeholder: { en: 'e.g., I Owe the Mob a Favor', 'zh-TW': '例如：我欠黑幫一個人情' },
        phase1Help: { en: 'This aspect represents a formative experience.', 'zh-TW': '這個形象代表一段成長經歷。' },

        step4Title: { en: 'Step 4: Phase Two', 'zh-TW': '步驟四：階段二' },
        step4Desc: { en: 'Describe how you crossed paths with another character.', 'zh-TW': '描述你如何與另一個角色交會。' },
        phase2Label: { en: 'Phase Two Aspect', 'zh-TW': '階段二形象' },
        phase2Placeholder: { en: 'e.g., Saved by My Best Friend', 'zh-TW': '例如：被我最好的朋友救了' },
        phase2Help: { en: 'This aspect represents a connection to others.', 'zh-TW': '這個形象代表與他人的連結。' },

        step5Title: { en: 'Step 5: Phase Three', 'zh-TW': '步驟五：階段三' },
        step5Desc: { en: 'Describe another adventure involving other characters.', 'zh-TW': '描述另一段涉及其他角色的冒險。' },
        phase3Label: { en: 'Phase Three Aspect', 'zh-TW': '階段三形象' },
        phase3Placeholder: { en: 'e.g., Made an Enemy of the Guild', 'zh-TW': '例如：與公會結仇' },
        phase3Help: { en: 'This aspect represents another important connection.', 'zh-TW': '這個形象代表另一段重要的連結。' },

        examples: { en: 'Examples:', 'zh-TW': '範例：' },
        btnBack: { en: 'Back', 'zh-TW': '返回' },
        btnNext: { en: 'Next', 'zh-TW': '下一步' },

        // === SKILLS PAGE ===
        step6Title: { en: 'Step 6: Skills', 'zh-TW': '步驟六：技能' },
        skillPyramidInfo: { en: 'Skill Pyramid:', 'zh-TW': '技能金字塔：' },
        skillPyramidDesc: { en: 'Select skills.', 'zh-TW': '選擇技能。' },

        // === STUNTS PAGE ===
        step7Title: { en: 'Step 7: Stunts', 'zh-TW': '步驟七：特技' },
        refreshTitle: { en: 'Refresh', 'zh-TW': '恢復值' },
        refreshHelp: { en: 'You start with 3 free stunts. Additional stunts reduce refresh by 1.', 'zh-TW': '你有3個免費特技。額外的特技會使恢復值減少1。' },
        btnAddStunt: { en: 'Add Stunt', 'zh-TW': '新增特技' },
        btnFinish: { en: 'Finish', 'zh-TW': '完成' },
        stuntNamePlaceholder: { en: 'Stunt name...', 'zh-TW': '特技名稱...' },
        stuntDescPlaceholder: { en: 'Describe what this stunt does...', 'zh-TW': '描述這個特技的效果...' },
        btnRemoveStunt: { en: 'Remove', 'zh-TW': '移除' },

        // === CHARACTER SHEET ===
        characterNamePlaceholder: { en: 'Character Name', 'zh-TW': '角色名稱' },
        coreAspects: { en: 'CORE ASPECTS', 'zh-TW': '核心形象' },
        secondaryAspects: { en: 'SECONDARY ASPECTS', 'zh-TW': '次要形象' },
        skillsTitle: { en: 'Skills', 'zh-TW': '技能' },
        stuntsTitle: { en: 'Stunts', 'zh-TW': '特技' },
        stressTitle: { en: 'Stress & Consequences', 'zh-TW': '壓力與後果' },
        physicalStress: { en: 'Physical Stress', 'zh-TW': '體力壓力' },
        mentalStress: { en: 'Mental Stress', 'zh-TW': '精神壓力' },
        mildConsequence: { en: 'Mild Consequence (2 shifts)', 'zh-TW': '輕微後果（2格）' },
        moderateConsequence: { en: 'Moderate Consequence (4 shifts)', 'zh-TW': '中度後果（4格）' },
        severeConsequence: { en: 'Severe Consequence (6 shifts)', 'zh-TW': '嚴重後果（6格）' },
        consequencePlaceholder: { en: 'Consequence aspect...', 'zh-TW': '後果形象...' },
        notesTitle: { en: 'Notes', 'zh-TW': '備註' },
        notesPlaceholder: { en: 'Additional notes about your character...', 'zh-TW': '關於你角色的額外備註...' },
        btnSave: { en: 'Save Character', 'zh-TW': '儲存角色' },
        btnNewFromSheet: { en: 'New Character', 'zh-TW': '新建角色' },

        // === LOAD PAGE ===
        loadTitle: { en: 'Load Character', 'zh-TW': '讀取角色' },
        btnBackHome: { en: 'Back to Home', 'zh-TW': '返回首頁' },
        btnLoadChar: { en: 'Load', 'zh-TW': '讀取' },
        btnDeleteChar: { en: 'Delete', 'zh-TW': '刪除' },
        noCharacters: { en: 'No saved characters yet.', 'zh-TW': '尚無已儲存的角色。' },
        lastModified: { en: 'Last modified:', 'zh-TW': '最後修改：' },

        // === INFO PAGE ===
        infoTitle: { en: 'About Fate Create', 'zh-TW': '關於 Fate Create' },
        infoWhatTitle: { en: 'What is FATE Core?', 'zh-TW': '什麼是 FATE Core？' },
        infoWhatDesc: { en: 'FATE Core is a tabletop roleplaying game system that emphasizes collaborative storytelling and character-driven narratives. Characters are defined by their aspects, skills, and stunts.<br><br>Learn more at the <a href="https://fate-srd.com/fate-core" target="_blank" rel="noopener noreferrer">Fate Core System Reference Document</a>.', 'zh-TW': 'FATE Core 是一個桌上角色扮演遊戲系統，強調協作敘事和角色驅動的故事。角色由形象、技能和特技來定義。<br><br>在 <a href="https://sites.google.com/site/faterpg/core" target="_blank" rel="noopener noreferrer">Fate Core 系統參考文件</a> 了解更多。' },
        infoHowTitle: { en: 'How to Use This App', 'zh-TW': '如何使用此應用程式' },
        infoHowDesc: { en: `Click "NEW" to create a character. You can use Quick Setup for a guided experience, or skip to the character sheet to fill it out manually. Your characters are saved in your browser.`, 'zh-TW': '點擊「新建」來創建角色。你可以使用快速設定來獲得引導體驗，或直接跳到角色表手動填寫。你的角色會儲存在瀏覽器中。' },
        infoVersionTitle: { en: 'Version', 'zh-TW': '版本' },
        infoVersion: { en: 'Fate Create v1.0', 'zh-TW': 'Fate Create v1.0' },
        btnClose: { en: 'Close', 'zh-TW': '關閉' },

        // === SETTINGS PAGE ===
        settingsTitle: { en: 'Settings', 'zh-TW': '設定' },
        languageTitle: { en: 'Language', 'zh-TW': '語言' },

        // === EDIT MODE ===
        btnEdit: { en: 'Edit', 'zh-TW': '編輯' },
        btnDoneEdit: { en: 'Done', 'zh-TW': '完成' },
        editModeOn: { en: 'Edit mode enabled', 'zh-TW': '編輯模式已啟用' },
        editModeOff: { en: 'Edit mode disabled', 'zh-TW': '編輯模式已關閉' },
        dragSkillHint: { en: 'Drag skills between tiers to rearrange', 'zh-TW': '拖曳技能到不同等級來重新排列' },
        unassignedSkills: { en: 'Unassigned Skills', 'zh-TW': '未分配技能' },
        editStuntsBtn: { en: '+', 'zh-TW': '+' },
        editStuntsHint: { en: 'Tap + to add or edit stunts', 'zh-TW': '點擊 + 新增或編輯特技' },
        btnSaveStunts: { en: 'Save Stunts', 'zh-TW': '儲存特技' },
        customSkillTile: { en: '+ Custom', 'zh-TW': '+ 自訂' },
        customSkillPrompt: { en: 'Enter custom skill name:', 'zh-TW': '輸入自訂技能名稱：' },
        customSkillEmpty: { en: 'Skill name cannot be empty', 'zh-TW': '技能名稱不能為空' },
        customSkillDuplicate: { en: 'A skill with that name already exists', 'zh-TW': '已存在同名技能' },

        // === PORTRAIT ===
        portraitClose: { en: 'Close', 'zh-TW': '關閉' },
        portraitSelect: { en: 'Select Portrait', 'zh-TW': '選擇肖像' },

        // === DICE ROLLER ===
        diceTotal: { en: 'Total', 'zh-TW': '總計' },
        diceClose: { en: 'Close', 'zh-TW': '關閉' },

        // === TOAST MESSAGES ===
        toastSaved: { en: 'Character saved!', 'zh-TW': '角色已儲存！' },
        toastLoaded: { en: 'Character loaded!', 'zh-TW': '角色已讀取！' },
        toastDeleted: { en: 'Character deleted', 'zh-TW': '角色已刪除' },
        toastError: { en: 'Error', 'zh-TW': '錯誤' },
        toastErrorLoad: { en: 'Error loading character', 'zh-TW': '讀取角色時發生錯誤' },
        toastErrorDelete: { en: 'Error deleting character', 'zh-TW': '刪除角色時發生錯誤' },
        confirmDelete: { en: 'Delete this character? This cannot be undone.', 'zh-TW': '刪除此角色？此操作無法復原。' },

        // === SKILL TIER LABELS ===
        tierGreat: { en: 'Great', 'zh-TW': '卓越' },
        tierGood: { en: 'Good', 'zh-TW': '良好' },
        tierFair: { en: 'Fair', 'zh-TW': '尚可' },
        tierAverage: { en: 'Average', 'zh-TW': '普通' },
    },

    // FATE Core skill names translation
    skills: {
        'Athletics':    { en: 'Athletics',    'zh-TW': '運動' },
        'Burglary':     { en: 'Burglary',     'zh-TW': '竊術' },
        'Contacts':     { en: 'Contacts',     'zh-TW': '人脈' },
        'Crafts':       { en: 'Crafts',       'zh-TW': '工藝' },
        'Deceive':      { en: 'Deceive',      'zh-TW': '欺瞞' },
        'Drive':        { en: 'Drive',        'zh-TW': '駕駛' },
        'Empathy':      { en: 'Empathy',      'zh-TW': '移情' },
        'Fight':        { en: 'Fight',        'zh-TW': '打鬥' },
        'Investigate':  { en: 'Investigate',  'zh-TW': '調查' },
        'Lore':         { en: 'Lore',         'zh-TW': '學識' },
        'Notice':       { en: 'Notice',       'zh-TW': '察覺' },
        'Physique':     { en: 'Physique',     'zh-TW': '體魄' },
        'Provoke':      { en: 'Provoke',      'zh-TW': '挑撥' },
        'Rapport':      { en: 'Rapport',      'zh-TW': '親善' },
        'Resources':    { en: 'Resources',    'zh-TW': '資源' },
        'Shoot':        { en: 'Shoot',        'zh-TW': '射擊' },
        'Stealth':      { en: 'Stealth',      'zh-TW': '潛匿' },
        'Will':         { en: 'Will',         'zh-TW': '意志' }
    },

    // Aspect examples translated
    aspectExamples: {
        highConcept: {
            en: [
                'Wizard Private Eye',
                'Knight of the Round Table',
                'Reformed Thief Turned Hero',
                'Cyberpunk Hacker with a Heart of Gold',
                'Grizzled Space Marine Captain'
            ],
            'zh-TW': [
                '巫師私家偵探',
                '圓桌騎士',
                '改邪歸正的竊賊英雄',
                '心地善良的賽博龐克駭客',
                '身經百戰的太空陸戰隊隊長'
            ]
        },
        trouble: {
            en: [
                'Sucker for a Pretty Face',
                "The King's Stooges Are on My Trail",
                'My Big Mouth Gets Me in Trouble',
                "Can't Resist a Challenge",
                'Haunted by My Past'
            ],
            'zh-TW': [
                '見到美女就心軟',
                '國王的爪牙在追蹤我',
                '我的大嘴巴總是惹麻煩',
                '無法抗拒挑戰',
                '被過去所糾纏'
            ]
        },
        phase: {
            en: [
                'I Owe the Mob a Favor',
                'Saved by My Best Friend',
                'Discovered an Ancient Artifact',
                'Made an Enemy of the Guild',
                'Found Love in a Hopeless Place'
            ],
            'zh-TW': [
                '我欠黑幫一個人情',
                '被我最好的朋友救了',
                '發現了一件古老的神器',
                '與公會結仇',
                '在絕望中找到了愛'
            ]
        }
    },

    // Get a translated string
    t: function(key) {
        const entry = this.strings[key];
        if (!entry) return key;
        return entry[this.currentLang] || entry['en'] || key;
    },

    // Get a translated skill name
    skill: function(englishName) {
        const entry = this.skills[englishName];
        if (!entry) return englishName;
        return entry[this.currentLang] || englishName;
    },

    // Get translated aspect examples
    getAspectExamples: function(type) {
        const entry = this.aspectExamples[type];
        if (!entry) return [];
        return entry[this.currentLang] || entry['en'] || [];
    },

    // Set language and save preference
    setLanguage: function(lang) {
        this.currentLang = lang;
        localStorage.setItem('fateCreate_language', lang);
        this.applyTranslations();
    },

    // Load saved language preference
    loadLanguage: function() {
        const saved = localStorage.getItem('fateCreate_language');
        if (saved && (saved === 'en' || saved === 'zh-TW')) {
            this.currentLang = saved;
        }
    },

    // Apply translations to all elements with data-i18n attribute
    applyTranslations: function() {
        // Translate text content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translated = this.t(key);
            if (translated !== key) {
                el.innerHTML = translated;
            }
        });

        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translated = this.t(key);
            if (translated !== key) {
                el.placeholder = translated;
            }
        });

        // Translate aria-labels
        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            const translated = this.t(key);
            if (translated !== key) {
                el.setAttribute('aria-label', translated);
            }
        });

        // Update page title
        document.title = this.t('appTitle') + ' - ' + this.t('appSubtitle');

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang === 'zh-TW' ? 'zh-TW' : 'en';
    }
};

// Load language on script load
I18N.loadLanguage();
