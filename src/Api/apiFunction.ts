// api/useApi.ts
/* eslint-disable prettier/prettier */
import { useRef, useCallback } from "react";
import { axiosInstance } from "./axiosInstance";
import { decryptResponse } from "./decryptResponse";

interface ApiOptions {
  headers?: Record<string, string>;
  deduplicate?: boolean;
  cache?: boolean;            // enable cache
  revalidate?: boolean;       // revalidate in background
  ttl?: number;               // cache time-to-live in ms
  signal?: AbortSignal;
}

type Params = Record<string, any>;
type RequestMap = Map<string, Promise<any>>;

interface CacheEntry {
  data: any;
  expiry: number; // timestamp when cache expires
}

export function useApi() {
  const activeRequestsRef = useRef<RequestMap>(new Map());
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());

  const handleUserLogout = () => {
    // logout()
    // toast.info("Your session expired, please login");
  };

  const header1 = { "Content-Type": "application/json" };
  const header2 = { "Content-Type": "multipart/form-data" };

  const getRequestKey = (method: string, endpoint: string, params?: Params) =>
    `${method}:${endpoint}:${JSON.stringify(params || {})}`;

  const fetchRequest = useCallback(
    async (
      method: "GET" | "POST" | "PUT" | "DELETE",
      endpoint: string,
      dataOrParams?: any,
      options: ApiOptions = {},
    ) => {
      const {
        headers = header1,
        deduplicate = true,
        cache = false,
        revalidate = false,
        ttl = 1000 * 60, // default 1 min
        signal,
      } = options;

      const requestKey = getRequestKey(method, endpoint, dataOrParams);

      // 1. Serve from cache if valid
      if (cache && cacheRef.current.has(requestKey)) {
        const cached = cacheRef.current.get(requestKey)!;
        const now = Date.now();

        if (cached.expiry > now) {
          // fresh cache
          if (revalidate) {
            // kick off background refresh
            fetchRequest(method, endpoint, dataOrParams, {
              ...options,
              revalidate: false,
            }).catch(() => { });
          }
          return Promise.resolve(cached.data);
        } else {
          cacheRef.current.delete(requestKey);
        }
      }

      // 2. Deduplicate in-flight request
      if (deduplicate && activeRequestsRef.current.has(requestKey)) {
        return activeRequestsRef.current.get(requestKey);
      }

      const controller = signal ? undefined : new AbortController();
      const requestSignal = signal || controller?.signal;

      let axiosPromise: Promise<any>;
      if (method === "GET") {
        axiosPromise = axiosInstance.get(endpoint, {
          headers,
          params: dataOrParams,
          signal: requestSignal,
        });
      } else if (method === "POST") {
        axiosPromise = axiosInstance.post(endpoint, dataOrParams, {
          headers,
          signal: requestSignal,
        });
      } else if (method === "PUT") {
        axiosPromise = axiosInstance.put(endpoint, dataOrParams, {
          headers,
          signal: requestSignal,
        });
      } else {
        axiosPromise = axiosInstance.delete(endpoint, {
          headers,
          signal: requestSignal,
        });
      }

      const requestPromise = axiosPromise
        .then((response) => decryptResponse(response?.data))
        .then((data) => {
          if (cache) {
            cacheRef.current.set(requestKey, {
              data,
              expiry: Date.now() + ttl,
            });
          }
          return data;
        })
        .catch((error) => {
          // if (error?.response?.status === 430) handleUserLogout(); // Removed: 430 is rate limit, not session expiry
          throw error;
        })
        .finally(() => {
          activeRequestsRef.current.delete(requestKey);
        });

      if (deduplicate) {
        activeRequestsRef.current.set(requestKey, requestPromise);
      }

      return requestPromise;
    },
    [],
  );

  const get = useCallback(
    (endpoint: string, params?: Params, options?: ApiOptions) =>
      fetchRequest("GET", endpoint, params, options),
    [fetchRequest],
  );

  const post = useCallback(
    (endpoint: string, apiData: any, options?: ApiOptions) =>
      fetchRequest("POST", endpoint, apiData, options),
    [fetchRequest],
  );

  const put = useCallback(
    (endpoint: string, apiData: any, options?: ApiOptions) =>
      fetchRequest("PUT", endpoint, apiData, options),
    [fetchRequest],
  );

  const deleteData = useCallback(
    (endpoint: string, options?: ApiOptions) =>
      fetchRequest("DELETE", endpoint, undefined, options),
    [fetchRequest],
  );

  const cancelAllRequests = useCallback(() => {
    activeRequestsRef.current.clear();
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    get,
    post,
    put,
    deleteData,
    cancelAllRequests,
    clearCache,
    header1,
    header2,
  };
}
