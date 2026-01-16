"use client";

import { createContext, PropsWithChildren, useContext } from "react";
import { NotionIntegration } from "~/types/dtos/notion-integration-dto";

const NotionContext = createContext<NotionIntegration | undefined>(undefined);

export type ActiveNotionProviderProps = {
  notion?: NotionIntegration;
} & PropsWithChildren;

export function ActiveNotionProvider(props: ActiveNotionProviderProps) {
  const { notion, children } = props;

  return (
    <NotionContext.Provider value={notion}>{children}</NotionContext.Provider>
  );
}

export function useActiveNotion() {
  const context = useContext(NotionContext);

  if (context === undefined) {
    throw new Error(
      "useActiveNotion must be used within an ActiveNotionProvider",
    );
  }

  return context;
}
