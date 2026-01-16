'use client';

import { Sparkles } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';

import { LoadingScreen } from './LoadingScreen';
import { useSessionRecording } from '~/app/posthog-provider';
import { useActiveOrganization } from '~/hooks/use-active-organization';

interface AdvancedToolGeneratorProps {
  toolName: string;
  description: string;
  onGenerate: () => void;
  loading?: boolean;
  generateButtonName?: string;
}
export function AdvancedToolGenerator(props: AdvancedToolGeneratorProps) {
  const {
    toolName,
    description,
    onGenerate,
    loading = false,
    generateButtonName = '',
  } = props;
  const { startRecording } = useSessionRecording();
  const { name } = useActiveOrganization();

  const handleGenerate = () => {
    startRecording({
      eventName: `${toolName ?`Tool : ${toolName}` : 'Tool : User-Story'}`,
      organizationName: name,
    });
    onGenerate();
  };
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="max-w-md space-y-6 text-center">
        {loading ? (
          <LoadingScreen
            toolName={generateButtonName ? generateButtonName : toolName}
          />
        ) : (
          <>
            <h1 className="text-2xl font-bold">{toolName}</h1>
            <p className="text-muted-foreground">{description}</p>
            <Button size="lg" className="w-full gap-2" onClick={handleGenerate}>
              <Sparkles className="w-5 h-5" />
              Generate {generateButtonName ? generateButtonName : toolName}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
