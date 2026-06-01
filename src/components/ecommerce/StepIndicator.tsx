import { Check } from 'lucide-react';

import { cn } from '../../lib/utils';

const steps = ['Cart', 'Review', 'Confirm'] as const;

type StepIndicatorProps = {
  currentStep: number;
};

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between px-2">
      {steps.map((step, index) => {
        const isComplete = index < currentStep;
        const isActive = index === currentStep;
        return (
          <div key={step} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              {index > 0 && (
                <div
                  className={cn(
                    'h-0.5 flex-1',
                    isComplete || isActive ? 'bg-vt-blue' : 'bg-slate-200',
                  )}
                />
              )}
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  isComplete
                    ? 'bg-vt-gradient text-white'
                    : isActive
                      ? 'border-2 border-vt-blue bg-white text-vt-blue'
                      : 'bg-slate-100 text-slate-400',
                )}
              >
                {isComplete ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1',
                    isComplete ? 'bg-vt-blue' : 'bg-slate-200',
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                'mt-1 text-[10px] font-medium',
                isActive || isComplete ? 'text-vt-blue' : 'text-slate-400',
              )}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
