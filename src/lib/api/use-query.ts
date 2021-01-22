import { useState, useEffect, useCallback } from "react";
import { server } from "./server";

interface State<TData> {
  data: TData | null;
}

export const useQuery = <TData = any>(query: string) => {
  const [state, setState] = useState<State<TData>>({ data: null });

  const fetchAPI = useCallback(() => {
    const fetch = async () => {
      const { data } = await server.fetch<TData>({ query });
      setState({ data });
    };
    fetch();
  }, [query]);

  useEffect(() => {
    fetchAPI();
  }, [fetchAPI]);

  return { ...state, refetch: fetchAPI };
};
