import { useState, useEffect, useCallback } from "react";
import { server } from "./server";

interface State<TData> {
  data: TData | null;
  isLoading: boolean;
  error: boolean;
}

const mergeState = <TData>(newState: Partial<State<TData>>) => (
  oldState: State<TData>
) => {
  return {
    ...oldState,
    ...newState,
  };
};

export const useQuery = <TData = any>(query: string) => {
  const [state, setState] = useState<State<TData>>({
    data: null,
    isLoading: false,
    error: false,
  });

  const fetchAPI = useCallback(() => {
    const fetch = async () => {
      try {
        setState(mergeState({ isLoading: true, error: false }));
        const { data, error } = await server.fetch<TData>({ query });

        if (error && error.length) {
          throw new Error(error[0].message);
        }

        setState(mergeState({ data, isLoading: false, error: false }));
      } catch (error) {
        setState(mergeState({ error: true, isLoading: false }));
        throw console.error(error);
      }
    };
    fetch();
  }, [query]);

  useEffect(() => {
    fetchAPI();
  }, [fetchAPI]);

  return { ...state, refetch: fetchAPI };
};
