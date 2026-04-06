// Indicateur de progression pour les formulaires multi-étapes
import { View, Text } from 'react-native';
import { cn } from './utils/cn';

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
  labels?: string[];
  className?: string;
}

export function StepIndicator({ totalSteps, currentStep, labels, className }: StepIndicatorProps) {
  return (
    <View className={cn('gap-3', className)}>
      {/* Barre de progression */}
      <View className="flex-row gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            className={cn(
              'flex-1 h-1 rounded-full',
              i < currentStep ? 'bg-jim-primary' : 'bg-jim-border'
            )}
          />
        ))}
      </View>
      {/* Label étape courante */}
      <View className="flex-row items-center justify-between">
        <Text className="text-jim-muted text-xs">
          Étape {currentStep} sur {totalSteps}
        </Text>
        {labels?.[currentStep - 1] && (
          <Text className="text-jim-text text-xs font-medium">
            {labels[currentStep - 1]}
          </Text>
        )}
      </View>
    </View>
  );
}
