'use client';

import { useState } from 'react';

export function useSetState<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);

  const newState = (newState: Partial<T>, override?: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    override
      ? setState(newState as T)
      : setState((prevState) => ({ ...prevState, ...newState }));
  };

  return [state, newState] as const;
}
