import React, { useState, useEffect, useRef, useMemo } from "react";
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

  useEffect(() => {
    if (!farmId) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchData = async () => {
      // Show loading only on initial load
      if (!summaryData) setLoading(true);

      try {
        const response = await fetch(
          `https://papaiaapi.onrender.com/api/owner/${getApiEndpoint}/${farmId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            signal: controller.signal,
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSummaryData(data);
        } else {
          setSummaryData(null);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setSummaryData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [farmId, getApiEndpoint, summaryData]);

  const FIXED_HEIGHT = "580px";

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
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-green-700" />
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          Summary ({dateRange})
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {summaryData?.summary ? (
          <div className="text-sm sm:text-base text-gray-700 leading-relaxed">
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
