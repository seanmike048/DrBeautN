import { Language } from './types';

export const APP_NAME = "Docteur Beauté Noire";

export const SKIN_CONCERNS_EN = [
  "Acne / Breakouts",
  "Hyper-pigmentation (Dark Spots)",
  "Uneven Skin Tone",
  "Razor Bumps",
  "Dullness",
  "Dryness",
  "Oily / Shine",
  "Texture / Pores",
  "Sensitivity / Redness",
  "Signs of Aging"
];

export const SKIN_CONCERNS_FR = [
  "Acné / Boutons",
  "Hyper-pigmentation (Taches sombres)",
  "Teint irrégulier",
  "Boutons de rasage",
  "Teint terne",
  "Sécheresse",
  "Peau grasse / Brillance",
  "Texture / Pores",
  "Sensibilité / Rougeurs",
  "Signes de l'âge"
];

export const AFRICAN_COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "Cameroon",
  "Senegal",
  "Ivory Coast",
  "Other (Africa)",
  "Outside Africa"
];

export const CLIMATES = [
  "Humid / Tropical",
  "Dry / Harmattan",
  "Temperate",
  "Seasonal Changes"
];

export const TRANSLATIONS = {
  en: {
    hero: "The most trustworthy beauty doctor for Black skin.",
    heroDisclaimer: "AI-powered. Not medical advice. If symptoms persist, consult a dermatologist.",
    start: "Start Skin Diagnostic",
    disclaimer: "This is not medical advice. For persistent symptoms, severe acne, or suspected infection, consult a licensed dermatologist.",
    onboarding: {
      step1: "Identity",
      step2: "Skin Type",
      step3: "Goals",
      step4: "History",
      name: "First Name",
      age: "Age",
      location: "Location",
      climate: "Climate",
      gender: "Gender / Condition",
      skinType: "Self-Reported Skin Type",
      sensitivity: "Sensitivity Level",
      concerns: "Top Concerns (Max 3)",
      routine: "Current Routine",
      shaving: "Do you shave your face?",
      shavingOpts: ["Never", "Occasionally", "Daily/Frequently"],
      history: "Medical History Flags",
      historyOpts: ["None", "Eczema/Psoriasis History", "Keloid Prone", "Chronic Irritation"],
      budget: "Budget Preference",
      next: "Next",
      back: "Back",
      generate: "Generate Plan",
      photoAsk: "Would you like an AI analysis?",
      photoDesc: "We need 1 clear photo to analyze texture and tone.",
      photoYes: "Start Camera (Recommended)",
      photoNo: "Skip, Questionnaire Only",
    },
    camera: {
      title: "Skin Analysis",
      instruction: "Remove glasses & makeup. Find natural light.",
      tooDark: "Too Dark - Face a window",
      tooBright: "Too Bright - Avoid glare",
      good: "Perfect. Hold still...",
      holdStill: "Analyzing...",
      capture: "Capture",
      retake: "Retake Photo",
      use: "Analyze Photo",
      skip: "Skip Photo",
      permission: "Camera access needed for analysis.",
    },
    dashboard: {
      title: "Your Skin Blueprint",
      reset: "Start Over",
      snapshot: "Snapshot",
      am: "AM Routine",
      pm: "PM Routine",
      weekly: "Weekly",
      ingredients: "Molecules",
      triggers: "Triggers",
      lifestyle: "Lifestyle",
      save: "Save Plan",
    }
  },
  fr: {
    hero: "Le guide beauté le plus fiable pour les peaux noires.",
    heroDisclaimer: "Assisté par IA. Ceci n’est pas un avis médical. En cas de symptômes persistants, consultez un dermatologue.",
    start: "Commencer le diagnostic",
    disclaimer: "Ceci n'est pas un avis médical. Pour des symptômes persistants, acné sévère ou infection suspectée, consultez un dermatologue.",
    onboarding: {
      step1: "Identité",
      step2: "Type de peau",
      step3: "Objectifs",
      step4: "Histoire",
      name: "Prénom",
      age: "Âge",
      location: "Lieu",
      climate: "Climat",
      gender: "Genre / Condition",
      skinType: "Type de peau ressenti",
      sensitivity: "Niveau de sensibilité",
      concerns: "Préoccupations (Max 3)",
      routine: "Routine actuelle",
      shaving: "Vous rasez-vous le visage ?",
      shavingOpts: ["Jamais", "Occasionnellement", "Quotidiennement"],
      history: "Antécédents médicaux",
      historyOpts: ["Aucun", "Historique Eczéma/Psoriasis", "Sujet aux Chéloïdes", "Irritation Chronique"],
      budget: "Budget",
      next: "Suivant",
      back: "Retour",
      generate: "Générer le plan",
      photoAsk: "Voulez-vous une analyse IA ?",
      photoDesc: "Nous avons besoin d'une photo claire pour analyser la texture.",
      photoYes: "Lancer la caméra (Recommandé)",
      photoNo: "Passer, questionnaire seulement",
    },
    camera: {
      title: "Analyse de Peau",
      instruction: "Sans lunettes ni maquillage. Cherchez la lumière naturelle.",
      tooDark: "Trop sombre - Face à la fenêtre",
      tooBright: "Trop lumineux - Évitez les reflets",
      good: "Parfait. Ne bougez plus...",
      holdStill: "Analyse...",
      capture: "Capturer",
      retake: "Reprendre",
      use: "Analyser la photo",
      skip: "Passer la photo",
      permission: "Accès caméra nécessaire.",
    },
    dashboard: {
      title: "Votre Blueprint Peau",
      reset: "Recommencer",
      snapshot: "Résumé",
      am: "Matin",
      pm: "Soir",
      weekly: "Hebdo",
      ingredients: "Molécules",
      triggers: "Déclencheurs",
      lifestyle: "Style de vie",
      save: "Sauvegarder",
    }
  }
};

export const getTranslation = (lang: Language) => TRANSLATIONS[lang];