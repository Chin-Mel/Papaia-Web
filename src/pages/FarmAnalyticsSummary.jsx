import React, { useState, useEffect, useRef, useCallback } from "react";
import { BarChart3 } from "lucide-react";

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

const summaryCache = new Map();
const CACHE_TTL = 30000;

export default function FarmAnalyticsSummary({
  farmId,
  timeFilter,
  dateRange,
}) {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  const abortControllerRef = useRef(null);
  const hasInitialLoad = useRef(false);
  const pollIntervalRef = useRef(null);

  const getApiEndpoints = useCallback((filter, range) => {
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

    return endpoints[filter]?.[range] || endpoints.Daily["Last 11 days"];
  }, []);

  const fetchData = useCallback(
    async (silent = false) => {
      if (!farmId) return;

      const cacheKey = `summary_${farmId}_${timeFilter}_${dateRange}`;

      if (!silent) {
        const cached = summaryCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          setSummaryData(cached.data);
          setLoading(false);
          hasInitialLoad.current = true;
          return;
        }
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const endpoint = getApiEndpoints(timeFilter, dateRange);

      try {
        if (!silent && !hasInitialLoad.current) {
          setLoading(true);
        }

        const timeoutId = setTimeout(() => abortController.abort(), 5000);

        const summaryResponse = await fetch(
          `https://papaiaapi.onrender.com/api/owner/${endpoint}/${farmId}`,
          { headers, signal: abortController.signal }
        );

        clearTimeout(timeoutId);

        if (!summaryResponse.ok) {
          if (!silent) {
            setSummaryData(null);
          }
          return;
        }

        const summaryResult = await summaryResponse.json();

        summaryCache.set(cacheKey, {
          data: summaryResult,
          timestamp: Date.now(),
        });

        setSummaryData((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(summaryResult)) {
            return summaryResult;
          }
          return prev;
        });
      } catch (error) {
        if (error.name !== "AbortError" && !silent) {
          setSummaryData(null);
        }
      } finally {
        if (!silent && !hasInitialLoad.current) {
          setLoading(false);
          hasInitialLoad.current = true;
        }
      }
    },
    [farmId, timeFilter, dateRange, getApiEndpoints]
  );

  useEffect(() => {
    const isSilent = hasInitialLoad.current;
    fetchData(isSilent);

    pollIntervalRef.current = setInterval(() => {
      if (!document.hidden) {
        fetchData(true);
      }
    }, 10000);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [fetchData]);

  const FIXED_HEIGHT = "420px";

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  );

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
      {loading && !hasInitialLoad.current ? (
        <div className="flex items-center justify-center flex-1">
          <LoadingSpinner />
        </div>
      ) : !summaryData ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-gray-500 text-center text-sm sm:text-base">
            No scans available
          </p>
        </div>
      ) : (
        <div className="space-y-4 flex-1 overflow-y-auto">
          {summaryData?.summary && (
            <div className="pb-4">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {cleanText(summaryData.summary)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
