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

export default function FarmAnalyticsSummary({
  farmId,
  timeFilter,
  dateRange,
}) {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  const abortControllerRef = useRef(null);
  const initialLoadRef = useRef(true);

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

  const fetchData = useCallback(async () => {
    if (!farmId) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const endpoint = getApiEndpoints(timeFilter, dateRange);

    try {
      setLoading(true);

      const summaryResponse = await fetch(
        `https://papaiaapi.onrender.com/api/owner/${endpoint}/${farmId}`,
        { headers, signal: abortController.signal }
      );

      if (!summaryResponse.ok) {
        setSummaryData(null);
        return;
      }

      const summaryResult = await summaryResponse.json();
      setSummaryData(summaryResult);
    } catch (error) {
      if (error.name === "AbortError") return;
      setSummaryData(null);
    } finally {
      setLoading(false);
    }
  }, [farmId, timeFilter, dateRange, getApiEndpoints]);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const FIXED_HEIGHT = "420px";

  if (loading) {
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

  if (!summaryData) {
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
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-gray-500 text-center text-sm sm:text-base">
            No scans available
          </p>
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

      <div className="space-y-4 flex-1 overflow-y-auto">
        {summaryData?.summary && (
          <div className="pb-4">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {cleanText(summaryData.summary)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
