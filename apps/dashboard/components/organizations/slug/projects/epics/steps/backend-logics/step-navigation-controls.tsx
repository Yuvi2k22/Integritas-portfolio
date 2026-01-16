// components/backend-logics/StepNavigationControls.tsx
'use client';

import { Loader } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';

interface Props {
  onPrevious: () => void;
  onNext: () => void;
  loading: boolean;
}

export function StepNavigationControls({ onPrevious, onNext, loading }: Props) {
  return (
    <div className="flex justify-between mt-8 sticky bottom-0 bg-white py-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        className="w-32"
        disabled={loading}
      >
        Previous Step
      </Button>
      <Button
        onClick={onNext}
        className="w-32"
        disabled={loading}
      >
        {loading ? (
          <Loader className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          'Next Step'
        )}
      </Button>
    </div>
  );
}
