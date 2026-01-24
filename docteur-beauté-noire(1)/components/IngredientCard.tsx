import React from 'react';
import { Ingredient } from '../types';
import { Beaker, AlertTriangle, Clock, Droplets } from 'lucide-react';

interface IngredientCardProps {
  ingredient: Ingredient;
}

const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-terracotta hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-playfair font-bold text-cocoa">{ingredient.name}</h3>
        <Beaker className="text-terracotta w-5 h-5" />
      </div>
      
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{ingredient.description}</p>
      
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-2">
          <Droplets className="w-4 h-4 text-emerald mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-cocoa">Target Dosage: </span>
            <span className="text-gray-700">{ingredient.dosage}</span>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-emerald mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-cocoa">Frequency: </span>
            <span className="text-gray-700">{ingredient.frequency}</span>
          </div>
        </div>

        <div className="flex items-start gap-2 bg-red-50 p-2 rounded-lg mt-2">
          <AlertTriangle className="w-4 h-4 text-mutedRed mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-mutedRed">Caution: </span>
            <span className="text-gray-800">{ingredient.caution}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientCard;