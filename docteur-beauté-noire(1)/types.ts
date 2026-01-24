export enum SkinType {
  OILY = 'Oily',
  DRY = 'Dry',
  COMBINATION = 'Combination',
  NORMAL = 'Normal'
}

export enum BudgetTier {
  LOW = 'Budget-Friendly',
  MID = 'Standard',
  HIGH = 'Premium'
}

export type Language = 'en' | 'fr';

export interface UserProfile {
  name: string;
  age: number;
  location: string;
  skinType: SkinType;
  concerns: string[];
  sensitivity: string;
  budget: BudgetTier;
  isPregnantOrBreastfeeding: boolean;
  climate: string;
  currentRoutine: string;
  shavingFrequency?: string;
  historyFlags?: string[]; // eczema, keloids, etc.
  photos: {
    front?: string; // base64
  };
  language: Language;
}

export interface Ingredient {
  name: string;
  description: string;
  dosage: string;
  frequency: string;
  caution: string;
}

export interface ProductRecommendation {
  type: string;
  name: string;
  reason: string;
  keyIngredients: string[];
  localAlternative?: string;
}

export interface RoutineStep {
  stepName: string;
  productType: string;
  instructions: string;
  recommendedProducts: ProductRecommendation[];
}

export interface Routine {
  am: RoutineStep[];
  pm: RoutineStep[];
  weekly: RoutineStep[];
}

export interface SkinSnapshot {
  summary: string;
  skinTypeConfidence: number; // 0-1
  barrierStatus: 'Healthy' | 'Compromised' | 'Needs Support';
  triggers: string[];
}

export interface AnalysisResult {
  snapshot: SkinSnapshot;
  routine: Routine;
  keyIngredients: Ingredient[];
  lifestyleTips: string[];
  disclaimer: string;
}