'use client';

import { createContext, PropsWithChildren, useContext } from 'react';

import { EpicDto } from '~/types/dtos/epic-dto';

const EpicContext = createContext<EpicDto | undefined>(undefined);

export type ActiveEpicProviderProps = {
  epic: EpicDto;
} & PropsWithChildren;

export function ActiveEpicProvider(props: ActiveEpicProviderProps) {
  const { epic, children } = props;

  return <EpicContext.Provider value={epic}>{children}</EpicContext.Provider>;
}

export function useActiveEpic() {
  const context = useContext(EpicContext);

  if (context === undefined) {
    throw new Error('useActiveEpic must be used within a ActiveEpicProvider');
  }

  return context;
}
