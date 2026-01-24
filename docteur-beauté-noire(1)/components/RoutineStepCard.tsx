import React from 'react';
import { RoutineStep } from '../types';
import { Info, MapPin } from 'lucide-react';

interface RoutineStepCardProps {
  step: RoutineStep;
  index: number;
}

const RoutineStepCard: React.FC<RoutineStepCardProps> = ({ step, index }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-sand mb-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="bg-cocoa text-sand w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
          {index + 1}
        </span>
        <div>
          <h4 className="font-bold text-lg text-cocoa">{step.stepName}</h4>
          <span className="text-xs font-bold text-terracotta uppercase tracking-wider">{step.productType}</span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 italic pl-11 border-l-2 border-sand">{step.instructions}</p>

      <div className="pl-11">
        <h5 className="text-sm font-bold text-cocoa mb-2 flex items-center gap-1">
          Recommended:
        </h5>
        <div className="space-y-3">
          {step.recommendedProducts.map((prod, idx) => (
            <div key={idx} className="bg-sand/30 p-3 rounded-lg border border-sand/50">
              <div className="font-medium text-cocoa">{prod.name}</div>
              <div className="text-xs text-gray-500 mt-1 flex gap-2 flex-wrap">
                {prod.keyIngredients.map((ing, i) => (
                  <span key={i} className="bg-white px-2 py-0.5 rounded text-cocoa border border-gray-100">{ing}</span>
                ))}
              </div>
              
              <div className="mt-2 text-xs text-emerald flex items-start gap-1">
                <Info size={12} className="mt-0.5" /> {prod.reason}
              </div>

              {prod.localAlternative && (
                <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-terracotta flex items-start gap-1">
                   <MapPin size={12} className="mt-0.5" /> 
                   <span className="font-semibold">Local/Accessible Alternative:</span> {prod.localAlternative}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoutineStepCard;