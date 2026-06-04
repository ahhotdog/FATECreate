// fate-data.js
// FATE Core game data and constants

// The 18 default FATE Core skills
const FATE_SKILLS = [
    "Athletics",
    "Burglary",
    "Contacts",
    "Crafts",
    "Deceive",
    "Drive",
    "Empathy",
    "Fight",
    "Investigate",
    "Lore",
    "Notice",
    "Physique",
    "Provoke",
    "Rapport",
    "Resources",
    "Shoot",
    "Stealth",
    "Will"
];

// Skill pyramid structure
const SKILL_PYRAMID = {
    great: { rating: 4, slots: 1, label: "Great" },
    good: { rating: 3, slots: 2, label: "Good" },
    fair: { rating: 2, slots: 3, label: "Fair" },
    average: { rating: 1, slots: 4, label: "Average" }
};

// Aspect examples to help users
const ASPECT_EXAMPLES = {
    highConcept: [
        "Wizard Private Eye",
        "Knight of the Round Table",
        "Reformed Thief Turned Hero",
        "Cyberpunk Hacker with a Heart of Gold",
        "Grizzled Space Marine Captain"
    ],
    trouble: [
        "Sucker for a Pretty Face",
        "The King's Stooges Are on My Trail",
        "My Big Mouth Gets Me in Trouble",
        "Can't Resist a Challenge",
        "Haunted by My Past"
    ],
    phase: [
        "I Owe the Mob a Favor",
        "Saved by My Best Friend",
        "Discovered an Ancient Artifact",
        "Made an Enemy of the Guild",
        "Found Love in a Hopeless Place"
    ]
};

// Stunt examples
const STUNT_EXAMPLES = [
    {
        name: "Heavy Hitter",
        description: "When I use Fight to make an attack and invoke an aspect to add to the attack, I gain +3 instead of +2."
    },
    {
        name: "Danger Sense",
        description: "I have an almost preternatural capacity for detecting danger. My Notice skill works unimpeded by conditions like total concealment, darkness, or other sensory impairments in situations where someone or something intends to harm me."
    },
    {
        name: "Smooth Recovery",
        description: "Once per session, I can clear a mild consequence."
    },
    {
        name: "Lethal Weapon",
        description: "When I succeed with style on a Fight attack and choose to reduce the result by one to gain a boost, I gain a full situation aspect with a free invocation instead."
    }
];

// Help text for different sections
const HELP_TEXT = {
    highConcept: "Your High Concept is a phrase that sums up what your character is about—who they are and what they do. It's one of your character's aspects.",
    trouble: "Your Trouble is an aspect that represents the things that complicate your character's life. It could be a personal weakness, an enemy, or an obligation.",
    phases: "Phase aspects represent important moments or relationships in your character's backstory. Each phase should tell a short story about your character.",
    skills: "Skills represent your character's capabilities. The skill pyramid ensures a balanced character: 1 skill at +4, 2 at +3, 3 at +2, and 4 at +1.",
    stunts: "Stunts are special tricks your character knows that give you a bonus or let you bend the rules. You start with 3 free stunts. Additional stunts reduce your refresh.",
    refresh: "Refresh is the number of fate points you start each session with. It starts at 3, but decreases by 1 for each stunt beyond the first 3.",
    stress: "Stress represents your ability to stay in a fight. Physical stress is based on Physique, mental stress on Will.",
    consequences: "Consequences are new aspects you take to absorb big hits. They represent lasting harm and take time to recover."
};

// Default starting values
const DEFAULT_REFRESH = 3;
const DEFAULT_STRESS_BOXES = 2;
const FREE_STUNTS = 3;
const MIN_REFRESH = 1;
