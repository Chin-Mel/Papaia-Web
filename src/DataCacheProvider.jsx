import { createContext, useContext, useState, useCallback } from "react";

const DataCacheContext = createContext();

export const DataCacheProvider = ({ children }) => {
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState({});

  const fetchData = useCallback(
    async (key, fetchFn, forceRefresh = false) => {
      // Return cached data if available and not forcing refresh
      if (cache[key] && !forceRefresh) {
        return cache[key];
      }

      // Prevent duplicate requests
      if (loading[key]) {
        // Wait for ongoing request
        return new Promise((resolve) => {
          const checkCache = setInterval(() => {
            if (cache[key]) {
              clearInterval(checkCache);
              resolve(cache[key]);
            }
          }, 100);
        });
      }

      try {
        setLoading((prev) => ({ ...prev, [key]: true }));
        const data = await fetchFn();

        setCache((prev) => ({ ...prev, [key]: data }));
        return data;
      } catch (error) {
        console.error(`Error fetching ${key}:`, error);
        throw error;
      } finally {
        setLoading((prev) => ({ ...prev, [key]: false }));
      }
    },
    [cache, loading]
  );

  const clearCache = useCallback((key) => {
    if (key) {
      setCache((prev) => {
        const newCache = { ...prev };
        delete newCache[key];
        return newCache;
      });
    } else {
      setCache({});
    }
  }, []);

  const getCachedData = useCallback((key) => cache[key], [cache]);

  const value = {
    fetchData,
    clearCache,
    getCachedData,
    isLoading: (key) => loading[key] || false,
  };

  return (
    <DataCacheContext.Provider value={value}>
      {children}
    </DataCacheContext.Provider>
  );
};

export const useDataCache = () => {
  const context = useContext(DataCacheContext);
  if (!context) {
    throw new Error("useDataCache must be used within DataCacheProvider");
  }
  return context;
};
