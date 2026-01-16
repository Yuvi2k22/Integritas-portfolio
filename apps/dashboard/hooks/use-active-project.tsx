'use client';

import { createContext, PropsWithChildren, useContext } from 'react';

import { ProjectDto } from '~/types/dtos/project-dto';

const ProjectContext = createContext<ProjectDto | undefined>(undefined);

export type ActiveProjectProviderProps = {
  project: ProjectDto;
} & PropsWithChildren;

export function ActiveProjectProvider(props: ActiveProjectProviderProps) {
  const { project, children } = props;

  return (
    <ProjectContext.Provider value={project}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useActiveProject() {
  const context = useContext(ProjectContext);

  if (context === undefined) {
    throw new Error(
      'useActiveProject must be used within a ActiveProjectProvider'
    );
  }

  return context;
}
