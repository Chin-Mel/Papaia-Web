import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { BarChart3 } from "lucide-react";

const API_BASE = "https://papaiaapi.onrender.com/api/owner";

const cleanText = (text) => {
  if (!text) return "";
  return text
    .replace(
      /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
      ""
    )
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .trim();
};

export default function FarmAnalyticsSummary({
  farmId,
  timeFilter,
  dateRange,
}) {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef(null);
  const cacheRef = useRef(new Map());
  const pollIntervalRef = useRef(null);
  const lastHashRef = useRef(null);

  const getApiEndpoint = useMemo(() => {
    const endpoints = {
      Daily: {
        "Last 7 days": "seven-days-summary",
        "Last 11 days": "eleven-days-summary",
        "Last 14 days": "fourteen-days-summary",
      },
      Weekly: {
        "Last 4 weeks": "four-week-summary",
        "Last 9 weeks": "nine-week-summary",
        "Last 12 weeks": "twelve-week-summary",
      },
      Monthly: {
        "Last 3 months": "three-month-summary",
        "Last 6 months": "six-month-summary",
        "Last 12 months": "twelve-month-summary",
      },
      Yearly: {
        "Last 3 years": "three-year-summary",
        "Last 5 years": "five-year-summary",
        "Last 7 years": "seven-year-summary",
      },
    };

    return endpoints[timeFilter]?.[dateRange] || "eleven-days-summary";
  }, [timeFilter, dateRange]);

  // Hash function to detect data changes
  const hashData = useCallback((data) => {
    if (!data) return null;
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash;
  }, []);

  // Fetch data function
  const fetchData = useCallback(
    async (silent = false) => {
      if (!farmId) return;

      // Check cache first
      const cacheKey = `${farmId}-${getApiEndpoint}`;
      const cached = cacheRef.current.get(cacheKey);
      const now = Date.now();

      if (cached && now - cached.timestamp < 3000) {
        // Use cached data if less than 3 seconds old
        if (!summaryData) {
          setSummaryData(cached.data);
          setLoading(false);
        }
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        if (!silent && !summaryData) {
          setLoading(true);
        }

        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(
          `${API_BASE}/${getApiEndpoint}/${farmId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const newHash = hashData(data);

          // Only update if data changed
          if (newHash !== lastHashRef.current) {
            lastHashRef.current = newHash;
            setSummaryData(data);

            // Update cache
            cacheRef.current.set(cacheKey, {
              data,
              timestamp: now,
            });
          }
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Summary fetch error:", error);
        }
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [farmId, getApiEndpoint, summaryData, hashData]
  );

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [farmId, getApiEndpoint]);

  // Poll for changes silently
  useEffect(() => {
    if (!farmId) return;

    const checkForUpdates = async () => {
      if (document.hidden) return;
      await fetchData(true);
    };

    pollIntervalRef.current = setInterval(checkForUpdates, 5000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [farmId, getApiEndpoint, fetchData]);

  const FIXED_HEIGHT = "340px";

  if (loading && !summaryData) {
    return (
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col"
        style={{ height: FIXED_HEIGHT }}
      >
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col"
      style={{ height: FIXED_HEIGHT }}
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-green-700" />
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          Summary ({dateRange})
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {summaryData?.summary ? (
          <div className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
            {cleanText(summaryData.summary)}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm sm:text-base">
              No summary data available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
