import { Skeleton } from '@workspace/ui/components/skeleton';

interface loadingScreenProps {
  toolName?: string;
}
export function LoadingScreen(props: loadingScreenProps) {
  const { toolName = '' } = props;
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-6">
      <div className="max-w-md space-y-6 text-center">
        <Skeleton className="w-64 h-12 mx-auto" />
        <div className="space-y-4">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-5/6 h-4 mx-auto" />
          <Skeleton className="w-4/6 h-4 mx-auto" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-48 mx-auto rounded-md h-14" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Generating{toolName ? ` ${toolName}` : ''}...
          </p>
        </div>
      </div>
    </div>
  );
}
