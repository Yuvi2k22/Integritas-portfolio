import { Dispatch, SetStateAction, useRef, useState } from 'react';

/**
 * Returns a stateful value, a function to update it and as ref to latest stateful value for accessing inside hooks and other callbacks.
 * @param initialState initial
 *
 * @author Jaheen Afsar Syed
 * @version 1.0.0
 */
export function useReferencedState<T>(
  initialState: T
): [T, Dispatch<SetStateAction<T>>, React.RefObject<T>] {
  const stateRef = useRef<T>(initialState);
  const [state, setState] = useState<T>(initialState);

  const setReferencedState: Dispatch<SetStateAction<T>> = (
    stateOrUpdater: SetStateAction<T>
  ) => {
    if (typeof stateOrUpdater === 'function') {
      // If the updater is a function, call it with the current state
      const updater = stateOrUpdater as (prevState: T) => T;
      setState((prevState) => {
        const newState = updater(prevState);
        stateRef.current = newState;
        return newState;
      });
    } else {
      // If the updater is a value, set the state and ref directly
      stateRef.current = stateOrUpdater;
      setState(stateOrUpdater);
    }
  };

  return [state, setReferencedState, stateRef];
}
