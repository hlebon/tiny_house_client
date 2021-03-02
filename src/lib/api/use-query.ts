import { useEffect, useReducer, useCallback } from "react";
import { server } from "./server";

interface State<TData> {
  data: TData | null;
  isLoading: boolean;
  error: boolean;
}

interface QueryResult<TData> extends State<TData> {
  refetch: () => void;
}

type Action<TData> =
  | { type: "FETCH" }
  | { type: "FETCH_SUCCESS"; payload: TData }
  | { type: "FETCH_ERROR" };

const reducer = <TData>() => (
  state: State<TData>,
  action: Action<TData>
): State<TData> => {
  switch (action.type) {
    case "FETCH":
      return {
        ...state,
        isLoading: true,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        error: false,
        data: action.payload,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    default:
      throw new Error();
  }
};

export const useQuery = <TData = any>(query: string): QueryResult<TData> => {
  const fetchReducer = reducer<TData>();
  const [state, dispatch] = useReducer(fetchReducer, {
    isLoading: false,
    error: false,
    data: null,
  });

  const fetchAPI = useCallback(() => {
    const fetch = async () => {
      try {
        dispatch({ type: "FETCH" });
        const { data, error } = await server.fetch<TData>({ query });

        if (error && error.length) {
          throw new Error(error[0].message);
        }
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_ERROR" });
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
