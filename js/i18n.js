// i18n.js - Internationalization support
// Supports: English (en), Traditional Chinese (zh-TW), German (de), Japanese (ja)

const I18N = {
    currentLang: 'en',

    // All translatable strings organized by key
    strings: {
        // === APP TITLE ===
        appTitle: { en: 'Fate Create', 'zh-TW': 'Fate Create', de: 'Fate Create', ja: 'Fate Create' },
        appSubtitle: { en: 'FATE Core Character Creator', 'zh-TW': 'FATE Core 角色創建器', de: 'FATE Core Charaktergenerator', ja: 'FATE Core キャラクター作成ツール' },

        // === HOME PAGE ===
        btnNew: { en: 'NEW', 'zh-TW': '創角', de: 'NEU', ja: '新規' },
        btnLoad: { en: 'LOAD', 'zh-TW': '讀取', de: 'LADEN', ja: '読込' },

        // === MENU ===
        menuNew: { en: 'NEW', 'zh-TW': '創角', de: 'NEU', ja: '新規' },
        menuLoad: { en: 'LOAD', 'zh-TW': '讀取', de: 'LADEN', ja: '読込' },
        menuInfo: { en: 'INFO', 'zh-TW': '資訊', de: 'INFO', ja: '情報' },
        menuSetting: { en: 'SETTING', 'zh-TW': '設定', de: 'EINSTELLUNG', ja: '設定' },

        // === QUICK SETUP ===
        quickSetupTitle: { en: 'Quick Setup?', 'zh-TW': '快速創角？', de: 'Schnelle Einrichtung?', ja: 'クイックセットアップ？' },
        quickSetupDesc: { en: 'Would you like to be guided through character creation step-by-step, or skip to the character sheet?', 'zh-TW': '你想要逐步引導建立角色，還是直接跳到角色卡？', de: 'Möchten Sie schrittweise durch die Charaktererstellung geführt werden oder direkt zum Charakterblatt springen?', ja: 'キャラクター作成をステップバイステップで進めるか、キャラクターシートにスキップしますか？' },
        btnQuickSetup: { en: 'Quick Setup', 'zh-TW': '快速創角', de: 'Schnelle Einrichtung', ja: 'クイックセットアップ' },
        btnSkipSetup: { en: 'Skip for Now', 'zh-TW': '暫時跳過', de: 'Jetzt überspringen', ja: 'スキップ' },

        // === ASPECT PAGES ===
        step1Title: { en: 'Step 1: High Concept', 'zh-TW': '步驟一：高概念', de: 'Schritt 1: Hochkonzept', ja: 'ステップ1：ハイコンセプト' },
        step1Desc: { en: 'Your High Concept sums up what your character is about—who they are and what they do.', 'zh-TW': '你的高概念概括了你的角色是什麼樣的人——他們是誰，做什麼。', de: 'Ihr Hochkonzept fasst zusammen, worum es bei Ihrem Charakter geht – wer er ist und was er tut.', ja: 'あなたのハイコンセプトは、キャラクターが何であるかを要約します。彼らは誰で、何をしているのか。' },
        highConceptLabel: { en: 'High Concept Aspect', 'zh-TW': '高概念形象', de: 'Hochkonzept-Aspekt', ja: 'ハイコンセプト・アスペクト' },
        highConceptPlaceholder: { en: 'e.g., Wizard Private Eye', 'zh-TW': '例如：巫師私家偵探', de: 'z.B. Zauberer Privatdetektiv', ja: '例：魔法使いの私立探偵' },
        highConceptHelp: { en: "This is one of your character's aspects.", 'zh-TW': '這是你角色的形象之一。', de: 'Dies ist einer der Aspekte Ihres Charakters.', ja: 'これはあなたのキャラクターのアスペクトの1つです。' },

        step2Title: { en: 'Step 2: Trouble', 'zh-TW': '步驟二：麻煩', de: 'Schritt 2: Schwierigkeit', ja: 'ステップ2：トラブル' },
        step2Desc: { en: 'Your Trouble represents the things that complicate your character\'s life.', 'zh-TW': '你的麻煩代表了使你角色生活複雜化的事物。', de: 'Ihre Schwierigkeit stellt die Dinge dar, die das Leben Ihres Charakters verkomplizieren.', ja: 'あなたのトラブルは、キャラクターの人生を複雑にするものを表します。' },
        troubleLabel: { en: 'Trouble Aspect', 'zh-TW': '麻煩形象', de: 'Schwierigkeits-Aspekt', ja: 'トラブル・アスペクト' },
        troublePlaceholder: { en: 'e.g., Sucker for a Pretty Face', 'zh-TW': '例如：見到美女就心軟', de: 'z.B. Schwach für ein hübsches Gesicht', ja: '例：美しい顔に弱い' },
        troubleHelp: { en: 'This aspect will create interesting complications.', 'zh-TW': '這個形象會製造有趣的麻煩。', de: 'Dieser Aspekt wird interessante Komplikationen schaffen.', ja: 'このアスペクトは興味深い複雑さを生み出します。' },

        step3Title: { en: 'Step 3: Phase One', 'zh-TW': '步驟三：階段一', de: 'Schritt 3: Phase Eins', ja: 'ステップ3：フェーズ1' },
        step3Desc: { en: 'Describe an important adventure or event in your character\'s past.', 'zh-TW': '描述你角色過去的一段重要冒險或事件。', de: 'Beschreiben Sie ein wichtiges Abenteuer oder Ereignis in der Vergangenheit Ihres Charakters.', ja: 'キャラクターの過去の重要な冒険またはイベントを説明してください。' },
        phase1Label: { en: 'Phase One Aspect', 'zh-TW': '階段一形象', de: 'Phase-Eins-Aspekt', ja: 'フェーズ1・アスペクト' },
        phase1Placeholder: { en: 'e.g., I Owe the Mob a Favor', 'zh-TW': '例如：我欠黑幫一個人情', de: 'z.B. Ich schulde der Mafia einen Gefallen', ja: '例：マフィアに恩がある' },
        phase1Help: { en: 'This aspect represents a formative experience.', 'zh-TW': '這個形象代表一段成長經歷。', de: 'Dieser Aspekt stellt eine prägende Erfahrung dar.', ja: 'このアスペクトは形成的な経験を表します。' },

        step4Title: { en: 'Step 4: Phase Two', 'zh-TW': '步驟四：階段二', de: 'Schritt 4: Phase Zwei', ja: 'ステップ4：フェーズ2' },
        step4Desc: { en: 'Describe how you crossed paths with another character.', 'zh-TW': '描述你如何與另一個角色交會。', de: 'Beschreiben Sie, wie Sie auf einen anderen Charakter trafen.', ja: '別のキャラクターとどのように出会ったかを説明してください。' },
        phase2Label: { en: 'Phase Two Aspect', 'zh-TW': '階段二形象', de: 'Phase-Zwei-Aspekt', ja: 'フェーズ2・アスペクト' },
        phase2Placeholder: { en: 'e.g., Saved by My Best Friend', 'zh-TW': '例如：被我最好的朋友救了', de: 'z.B. Von meinem besten Freund gerettet', ja: '例：親友に救われた' },
        phase2Help: { en: 'This aspect represents a connection to others.', 'zh-TW': '這個形象代表與他人的連結。', de: 'Dieser Aspekt stellt eine Verbindung zu anderen dar.', ja: 'このアスペクトは他者との繋がりを表します。' },

        step5Title: { en: 'Step 5: Phase Three', 'zh-TW': '步驟五：階段三', de: 'Schritt 5: Phase Drei', ja: 'ステップ5：フェーズ3' },
        step5Desc: { en: 'Describe another adventure involving other characters.', 'zh-TW': '描述另一段涉及其他角色的冒險。', de: 'Beschreiben Sie ein weiteres Abenteuer mit anderen Charakteren.', ja: '他のキャラクターが関わる別の冒険を説明してください。' },
        phase3Label: { en: 'Phase Three Aspect', 'zh-TW': '階段三形象', de: 'Phase-Drei-Aspekt', ja: 'フェーズ3・アスペクト' },
        phase3Placeholder: { en: 'e.g., Made an Enemy of the Guild', 'zh-TW': '例如：與公會結仇', de: 'z.B. Einen Feind der Gilde gemacht', ja: '例：ギルドの敵を作った' },
        phase3Help: { en: 'This aspect represents another important connection.', 'zh-TW': '這個形象代表另一段重要的連結。', de: 'Dieser Aspekt stellt eine weitere wichtige Verbindung dar.', ja: 'このアスペクトは別の重要な繋がりを表します。' },

        examples: { en: 'Examples:', 'zh-TW': '範例：', de: 'Beispiele:', ja: '例：' },
        btnBack: { en: 'Back', 'zh-TW': '返回', de: 'Zurück', ja: '戻る' },
        btnNext: { en: 'Next', 'zh-TW': '下一步', de: 'Weiter', ja: '次へ' },

        // === SKILLS PAGE ===
        step6Title: { en: 'Step 6: Skills', 'zh-TW': '步驟六：技能', de: 'Schritt 6: Fähigkeiten', ja: 'ステップ6：スキル' },
        skillPyramidInfo: { en: 'Skill Pyramid:', 'zh-TW': '技能金字塔：', de: 'Fähigkeitspyramide:', ja: 'スキルピラミッド：' },
        skillPyramidDesc: { en: 'Select skills.', 'zh-TW': '選擇技能。', de: 'Wählen Sie Fähigkeiten.', ja: 'スキルを選択してください。' },

        // === STUNTS PAGE ===
        step7Title: { en: 'Step 7: Stunts', 'zh-TW': '步驟七：特技', de: 'Schritt 7: Stunts', ja: 'ステップ7：スタント' },
        refreshTitle: { en: 'Refresh', 'zh-TW': '恢復值', de: 'Auffrischung', ja: 'リフレッシュ' },
        refreshHelp: { en: 'You start with 3 free stunts. Additional stunts reduce refresh by 1.', 'zh-TW': '你有3個免費特技。額外的特技會使恢復值減少1。', de: 'Sie beginnen mit 3 kostenlosen Stunts. Zusätzliche Stunts reduzieren die Auffrischung um 1.', ja: '3つの無料スタントから始めます。追加のスタントはリフレッシュを1減らします。' },
        btnAddStunt: { en: 'Add Stunt', 'zh-TW': '新增特技', de: 'Stunt hinzufügen', ja: 'スタント追加' },
        btnFinish: { en: 'Finish', 'zh-TW': '完成', de: 'Fertig', ja: '完了' },
        stuntNamePlaceholder: { en: 'Stunt name...', 'zh-TW': '特技名稱...', de: 'Stunt-Name...', ja: 'スタント名...' },
        stuntDescPlaceholder: { en: 'Describe what this stunt does...', 'zh-TW': '描述這個特技的效果...', de: 'Beschreiben Sie, was dieser Stunt bewirkt...', ja: 'このスタントの効果を説明してください...' },
        btnRemoveStunt: { en: 'Remove', 'zh-TW': '移除', de: 'Entfernen', ja: '削除' },

        // === CHARACTER SHEET ===
        characterNamePlaceholder: { en: 'Character Name', 'zh-TW': '角色名稱', de: 'Charaktername', ja: 'キャラクター名' },
        coreAspects: { en: 'CORE ASPECTS', 'zh-TW': '核心形象', de: 'KERNASPEKTE', ja: 'コアアスペクト' },
        secondaryAspects: { en: 'SECONDARY ASPECTS', 'zh-TW': '次要形象', de: 'SEKUNDÄRE ASPEKTE', ja: 'セカンダリアスペクト' },
        skillsTitle: { en: 'Skills', 'zh-TW': '技能', de: 'Fähigkeiten', ja: 'スキル' },
        stuntsTitle: { en: 'Stunts', 'zh-TW': '特技', de: 'Stunts', ja: 'スタント' },
        stressTitle: { en: 'Stress & Consequences', 'zh-TW': '壓力與後果', de: 'Stress & Konsequenzen', ja: 'ストレス＆結果' },
        physicalStress: { en: 'Physical Stress', 'zh-TW': '體力壓力', de: 'Physischer Stress', ja: '肉体ストレス' },
        mentalStress: { en: 'Mental Stress', 'zh-TW': '精神壓力', de: 'Mentaler Stress', ja: '精神ストレス' },
        mildConsequence: { en: 'Mild Consequence (2 shifts)', 'zh-TW': '輕微後果（2格）', de: 'Leichte Konsequenz (2 Verschiebungen)', ja: '軽度の結果（2シフト）' },
        moderateConsequence: { en: 'Moderate Consequence (4 shifts)', 'zh-TW': '中度後果（4格）', de: 'Mäßige Konsequenz (4 Verschiebungen)', ja: '中程度の結果（4シフト）' },
        severeConsequence: { en: 'Severe Consequence (6 shifts)', 'zh-TW': '嚴重後果（6格）', de: 'Schwere Konsequenz (6 Verschiebungen)', ja: '重度の結果（6シフト）' },
        consequencePlaceholder: { en: 'Consequence aspect...', 'zh-TW': '後果形象...', de: 'Konsequenz-Aspekt...', ja: '結果アスペクト...' },
        notesTitle: { en: 'Notes', 'zh-TW': '備註', de: 'Notizen', ja: 'メモ' },
        notesPlaceholder: { en: 'Additional notes about your character...', 'zh-TW': '關於你角色的額外備註...', de: 'Zusätzliche Notizen zu Ihrem Charakter...', ja: 'キャラクターに関する追加メモ...' },
        btnSave: { en: 'Save Character', 'zh-TW': '儲存角色', de: 'Charakter speichern', ja: 'キャラクター保存' },
        btnNewFromSheet: { en: 'New Character', 'zh-TW': '新建角色', de: 'Neuer Charakter', ja: '新規キャラクター' },

        // === LOAD PAGE ===
        loadTitle: { en: 'Load Character', 'zh-TW': '讀取角色', de: 'Charakter laden', ja: 'キャラクター読込' },
        btnBackHome: { en: 'Back to Home', 'zh-TW': '返回首頁', de: 'Zurück zur Startseite', ja: 'ホームに戻る' },
        btnLoadChar: { en: 'Load', 'zh-TW': '讀取', de: 'Laden', ja: '読込' },
        btnDeleteChar: { en: 'Delete', 'zh-TW': '刪除', de: 'Löschen', ja: '削除' },
        noCharacters: { en: 'No saved characters yet.', 'zh-TW': '尚無已儲存的角色。', de: 'Noch keine gespeicherten Charaktere.', ja: 'まだ保存されたキャラクターはありません。' },
        lastModified: { en: 'Last modified:', 'zh-TW': '最後修改：', de: 'Zuletzt geändert:', ja: '最後に変更：' },

        // === INFO PAGE ===
        infoTitle: { en: 'About Fate Create', 'zh-TW': '關於 Fate Create', de: 'Über Fate Create', ja: 'Fate Createについて' },
        infoWhatTitle: { en: 'What is FATE Core?', 'zh-TW': '什麼是 FATE Core？', de: 'Was ist FATE Core?', ja: 'FATE Coreとは？' },
        infoWhatDesc: { en: 'FATE Core is a tabletop roleplaying game system that emphasizes collaborative storytelling and character-driven narratives. Characters are defined by their aspects, skills, and stunts.<br><br>Learn more at the <a href="https://fate-srd.com/fate-core" target="_blank" rel="noopener noreferrer">Fate Core System Reference Document</a>.', 'zh-TW': 'FATE Core 是一個桌上角色扮演遊戲系統，強調協作敘事和角色驅動的故事。角色由形象、技能和特技來定義。<br><br>在 <a href="https://sites.google.com/site/faterpg/core" target="_blank" rel="noopener noreferrer">Fate Core 系統參考文件</a> 了解更多。', de: 'FATE Core ist ein Tabletop-Rollenspiel-System, das kooperatives Geschichtenerzählen und charaktergetriebene Erzählungen betont. Charaktere werden durch ihre Aspekte, Fähigkeiten und Stunts definiert.<br><br>Erfahren Sie mehr im <a href="https://fate-srd.com/fate-core" target="_blank" rel="noopener noreferrer">Fate Core System Reference Document</a>.', ja: 'FATE Coreは、協調的なストーリーテリングとキャラクター駆動のナラティブを強調するテーブルトップロールプレイングゲームシステムです。キャラクターはアスペクト、スキル、スタントで定義されます。<br><br><a href="https://fate-srd.com/fate-core" target="_blank" rel="noopener noreferrer">Fate Core System Reference Document</a>で詳しく学んでください。' },
        infoHowTitle: { en: 'How to Use This App', 'zh-TW': '如何使用此應用程式', de: 'So verwenden Sie diese App', ja: 'このアプリの使い方' },
        infoHowDesc: { en: `Click "NEW" to create a character. You can use Quick Setup for a guided experience, or skip to the character sheet to fill it out manually. Your characters are saved in your browser.`, 'zh-TW': '點擊「新建」來創建角色。你可以使用快速設定來獲得引導體驗，或直接跳到角色表手動填寫。你的角色會儲存在瀏覽器中。', de: 'Klicken Sie auf „NEU", um einen Charakter zu erstellen. Sie können die schnelle Einrichtung für eine geführte Erfahrung verwenden oder direkt zum Charakterblatt springen, um es manuell auszufüllen. Ihre Charaktere werden in Ihrem Browser gespeichert.', ja: '「新規」をクリックしてキャラクターを作成します。ガイド付きの体験にはクイックセットアップを使用するか、キャラクターシートにスキップして手動で入力できます。キャラクターはブラウザに保存されます。' },
        infoVersionTitle: { en: 'Version', 'zh-TW': '版本', de: 'Version', ja: 'バージョン' },
        infoVersion: { en: 'Fate Create v1.2 Added portraits feature.', 'zh-TW': 'Fate Create v1.2 新增了肖像功能。', de: 'Fate Create v1.2 Porträtfunktion hinzugefügt.', ja: 'Fate Create v1.2 ポートレート機能を追加しました。' },
        infoDiscordDesc: { en: 'Join my discord server and give me some feedbacks! Or just hang out and chat about TTRPGs and FATE Core.', 'zh-TW': '加入我的 Discord 伺服器，給我一些回饋！或者只是閒聊關於 TRPG 和 FATE Core。', de: 'Treten Sie meinem Discord-Server bei und geben Sie mir Feedback! Oder einfach nur abhängen und über TTRPGs und FATE Core plaudern.', ja: '私のDiscordサーバーに参加して、フィードバックをください！または、TTRPGやFATE Coreについてチャットするだけでも構いません。' },
        btnClose: { en: 'Close', 'zh-TW': '關閉', de: 'Schließen', ja: '閉じる' },

        // === SETTINGS PAGE ===
        settingsTitle: { en: 'Settings', 'zh-TW': '設定', de: 'Einstellungen', ja: '設定' },
        languageTitle: { en: 'Language', 'zh-TW': '語言', de: 'Sprache', ja: '言語' },

        // === EDIT MODE ===
        btnEdit: { en: 'Edit', 'zh-TW': '編輯', de: 'Bearbeiten', ja: '編集' },
        btnDoneEdit: { en: 'Done', 'zh-TW': '完成', de: 'Fertig', ja: '完了' },
        editModeOn: { en: 'Edit mode enabled', 'zh-TW': '編輯模式已啟用', de: 'Bearbeitungsmodus aktiviert', ja: '編集モード有効' },
        editModeOff: { en: 'Edit mode disabled', 'zh-TW': '編輯模式已關閉', de: 'Bearbeitungsmodus deaktiviert', ja: '編集モード無効' },
        dragSkillHint: { en: 'Drag skills between tiers to rearrange', 'zh-TW': '拖曳技能到不同等級來重新排列', de: 'Ziehen Sie Fähigkeiten zwischen Ebenen, um sie neu anzuordnen', ja: 'スキルをティア間でドラッグして並べ替えます' },
        unassignedSkills: { en: 'Unassigned Skills', 'zh-TW': '未分配技能', de: 'Nicht zugewiesene Fähigkeiten', ja: '未割り当てスキル' },
        editStuntsBtn: { en: '+', 'zh-TW': '+', de: '+', ja: '+' },
        editStuntsHint: { en: 'Tap + to add or edit stunts', 'zh-TW': '點擊 + 新增或編輯特技', de: 'Tippen Sie auf +, um Stunts hinzuzufügen oder zu bearbeiten', ja: '+をタップしてスタントを追加または編集します' },
        btnSaveStunts: { en: 'Save Stunts', 'zh-TW': '儲存特技', de: 'Stunts speichern', ja: 'スタント保存' },
        customSkillTile: { en: '+ Custom', 'zh-TW': '+ 自訂', de: '+ Benutzerdefiniert', ja: '+ カスタム' },
        customSkillPrompt: { en: 'Enter custom skill name:', 'zh-TW': '輸入自訂技能名稱：', de: 'Geben Sie einen benutzerdefinierten Fähigkeitsnamen ein:', ja: 'カスタムスキル名を入力：' },
        customSkillEmpty: { en: 'Skill name cannot be empty', 'zh-TW': '技能名稱不能為空', de: 'Fähigkeitsname darf nicht leer sein', ja: 'スキル名は空にできません' },
        customSkillDuplicate: { en: 'A skill with that name already exists', 'zh-TW': '已存在同名技能', de: 'Eine Fähigkeit mit diesem Namen existiert bereits', ja: 'その名前のスキルは既に存在します' },

        // === PORTRAIT ===
        portraitClose: { en: 'Close', 'zh-TW': '關閉', de: 'Schließen', ja: '閉じる' },
        portraitSelect: { en: 'Select Portrait', 'zh-TW': '選擇肖像', de: 'Porträt auswählen', ja: 'ポートレート選択' },

        // === DICE ROLLER ===
        diceTotal: { en: 'Total', 'zh-TW': '總計', de: 'Gesamt', ja: '合計' },
        diceClose: { en: 'Close', 'zh-TW': '關閉', de: 'Schließen', ja: '閉じる' },

        // === TOAST MESSAGES ===
        toastSaved: { en: 'Character saved!', 'zh-TW': '角色已儲存！', de: 'Charakter gespeichert!', ja: 'キャラクターが保存されました！' },
        toastLoaded: { en: 'Character loaded!', 'zh-TW': '角色已讀取！', de: 'Charakter geladen!', ja: 'キャラクターが読み込まれました！' },
        toastDeleted: { en: 'Character deleted', 'zh-TW': '角色已刪除', de: 'Charakter gelöscht', ja: 'キャラクターが削除されました' },
        toastError: { en: 'Error', 'zh-TW': '錯誤', de: 'Fehler', ja: 'エラー' },
        toastErrorLoad: { en: 'Error loading character', 'zh-TW': '讀取角色時發生錯誤', de: 'Fehler beim Laden des Charakters', ja: 'キャラクター読込エラー' },
        toastErrorDelete: { en: 'Error deleting character', 'zh-TW': '刪除角色時發生錯誤', de: 'Fehler beim Löschen des Charakters', ja: 'キャラクター削除エラー' },
        confirmDelete: { en: 'Delete this character? This cannot be undone.', 'zh-TW': '刪除此角色？此操作無法復原。', de: 'Diesen Charakter löschen? Dies kann nicht rückgängig gemacht werden.', ja: 'このキャラクターを削除しますか？この操作は元に戻せません。' },

        // === SKILL TIER LABELS ===
        tierGreat: { en: 'Great', 'zh-TW': '卓越', de: 'Großartig', ja: '優秀' },
        tierGood: { en: 'Good', 'zh-TW': '良好', de: 'Gut', ja: '良好' },
        tierFair: { en: 'Fair', 'zh-TW': '尚可', de: 'Angemessen', ja: '普通' },
        tierAverage: { en: 'Average', 'zh-TW': '普通', de: 'Durchschnittlich', ja: '平均' },
    },

    // FATE Core skill names translation
    skills: {
        'Athletics':    { en: 'Athletics',    'zh-TW': '運動', de: 'Athletik', ja: '運動' },
        'Burglary':     { en: 'Burglary',     'zh-TW': '竊術', de: 'Einbruch', ja: '盗難' },
        'Contacts':     { en: 'Contacts',     'zh-TW': '人脈', de: 'Kontakte', ja: '人脈' },
        'Crafts':       { en: 'Crafts',       'zh-TW': '工藝', de: 'Handwerk', ja: '工芸' },
        'Deceive':      { en: 'Deceive',      'zh-TW': '欺瞞', de: 'Täuschung', ja: '欺瞞' },
        'Drive':        { en: 'Drive',        'zh-TW': '駕駛', de: 'Fahren', ja: '運転' },
        'Empathy':      { en: 'Empathy',      'zh-TW': '移情', de: 'Empathie', ja: '共感' },
        'Fight':        { en: 'Fight',        'zh-TW': '打鬥', de: 'Kampf', ja: '格闘' },
        'Investigate':  { en: 'Investigate',  'zh-TW': '調查', de: 'Ermitteln', ja: '調査' },
        'Lore':         { en: 'Lore',         'zh-TW': '學識', de: 'Wissen', ja: '知識' },
        'Notice':       { en: 'Notice',       'zh-TW': '察覺', de: 'Bemerken', ja: '知覚' },
        'Physique':     { en: 'Physique',     'zh-TW': '體魄', de: 'Körperbau', ja: '体格' },
        'Provoke':      { en: 'Provoke',      'zh-TW': '挑撥', de: 'Provozieren', ja: '挑発' },
        'Rapport':      { en: 'Rapport',      'zh-TW': '親善', de: 'Rapport', ja: 'ラポール' },
        'Resources':    { en: 'Resources',    'zh-TW': '資源', de: 'Ressourcen', ja: 'リソース' },
        'Shoot':        { en: 'Shoot',        'zh-TW': '射擊', de: 'Schießen', ja: '射撃' },
        'Stealth':      { en: 'Stealth',      'zh-TW': '潛匿', de: 'Heimlichkeit', ja: '隠密' },
        'Will':         { en: 'Will',         'zh-TW': '意志', de: 'Wille', ja: '意志' }
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
            ],
            de: [
                'Zauberer Privatdetektiv',
                'Ritter der Tafelrunde',
                'Reformierter Dieb zum Helden',
                'Cyberpunk-Hacker mit goldenem Herzen',
                'Erfahrener Weltraum-Marinekapitän'
            ],
            ja: [
                '魔法使いの私立探偵',
                '円卓の騎士',
                '改心した盗賊から英雄へ',
                '黄金の心を持つサイバーパンクハッカー',
                'しぶとい宇宙海兵隊長'
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
                '國王の爪牙在追蹤我',
                '我的大嘴巴總是惹麻煩',
                '無法抗拒挑戰',
                '被過去所糾纏'
            ],
            de: [
                'Schwach für ein hübsches Gesicht',
                'Die Schergen des Königs sind mir auf den Fersen',
                'Mein großes Maul bringt mich in Schwierigkeiten',
                'Kann einer Herausforderung nicht widerstehen',
                'Von meiner Vergangenheit heimgesucht'
            ],
            ja: [
                '美しい顔に弱い',
                '王の手下が私を追っている',
                '大きな口が私を困らせる',
                'チャレンジに抵抗できない',
                '過去に悩まされている'
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
            ],
            de: [
                'Ich schulde der Mafia einen Gefallen',
                'Von meinem besten Freund gerettet',
                'Ein altes Artefakt entdeckt',
                'Einen Feind der Gilde gemacht',
                'Liebe an einem hoffnungslosen Ort gefunden'
            ],
            ja: [
                'マフィアに恩がある',
                '親友に救われた',
                '古い遺物を発見した',
                'ギルドの敵を作った',
                '絶望的な場所で愛を見つけた'
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
        if (saved && (saved === 'en' || saved === 'zh-TW' || saved === 'de' || saved === 'ja')) {
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
        document.documentElement.lang = this.currentLang === 'zh-TW' ? 'zh-TW' : (this.currentLang === 'de' ? 'de' : (this.currentLang === 'ja' ? 'ja' : 'en'));
    }
};

// Load language on script load
I18N.loadLanguage();
