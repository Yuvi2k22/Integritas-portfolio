import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';
import { ReactNode } from 'react';

interface CustomTooltipProps {
  children: ReactNode;
  content: string;
}

const CustomTooltip = ({ children, content }: CustomTooltipProps) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild className="dark:text-white">
          {children}
        </TooltipTrigger>
        <TooltipContent className="z-[9999] max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { CustomTooltip };
