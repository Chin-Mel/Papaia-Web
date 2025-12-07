import React, { useState, useEffect, useRef } from "react";
import { BarChart3, AlertCircle, CheckCircle } from "lucide-react";

// Simple in-memory cache
const cache = {
  data: {},

  getUserId() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));
      return payload.userId || payload.id || payload.sub;
    } catch {
      return null;
    }
  },

  set(key, value, ttl = 60000) {
    const userId = this.getUserId();
    if (!userId) return;
    const userKey = `${userId}:${key}`;
    this.data[userKey] = {
      value,
      expires: Date.now() + ttl,
    };
  },

  get(key) {
    const userId = this.getUserId();
    if (!userId) return null;
    const userKey = `${userId}:${key}`;
    const item = this.data[userKey];
    if (!item) return null;
    if (Date.now() > item.expires) {
      delete this.data[userKey];
      return null;
    }
    return item.value;
  },

  clear() {
    this.data = {};
  },
};

// Function to clean text - remove emojis and asterisks
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
  const [commonDiseaseData, setCommonDiseaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef(null);

  // Map timeFilter and dateRange to API endpoints
  const getApiEndpoints = (filter, range) => {
    const endpoints = {
      Daily: {
        "Last 7 days": {
          summary: "seven-days-summary",
          disease: "seven-days-common-diseases",
        },
        "Last 11 days": {
          summary: "eleven-days-summary",
          disease: "eleven-days-common-diseases",
        },
        "Last 14 days": {
          summary: "fourteen-days-summary",
          disease: "fourteen-days-common-diseases",
        },
      },
      Weekly: {
        "Last 4 weeks": {
          summary: "four-week-summary",
          disease: "three-weeks-common-diseases",
        },
        "Last 9 weeks": {
          summary: "nine-week-summary",
          disease: "nine-weeks-common-diseases",
        },
        "Last 12 weeks": {
          summary: "twelve-week-summary",
          disease: "twelve-weeks-common-diseases",
        },
      },
      Monthly: {
        "Last 3 months": {
          summary: "three-month-summary",
          disease: "three-month-common-diseases",
        },
        "Last 6 months": {
          summary: "six-month-summary",
          disease: "six-month-common-diseases",
        },
        "Last 12 months": {
          summary: "twelve-month-summary",
          disease: "twelve-month-common-diseases",
        },
      },
      Yearly: {
        "Last 3 years": {
          summary: "three-year-summary",
          disease: "three-year-common-diseases",
        },
        "Last 5 years": {
          summary: "five-year-summary",
          disease: "five-year-common-diseases",
        },
        "Last 7 years": {
          summary: "seven-year-summary",
          disease: "seven-year-common-diseases",
        },
      },
    };

    return endpoints[filter]?.[range] || endpoints.Daily["Last 11 days"];
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!farmId) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const endpoints = getApiEndpoints(timeFilter, dateRange);
      const summaryCacheKey = `summary-${farmId}-${endpoints.summary}`;
      const diseaseCacheKey = `disease-${farmId}-${endpoints.disease}`;

      const cachedSummary = cache.get(summaryCacheKey);
      const cachedDisease = cache.get(diseaseCacheKey);

      if (cachedSummary) {
        setSummaryData(cachedSummary);
      }
      if (cachedDisease) {
        setCommonDiseaseData(cachedDisease);
      }

      if (cachedSummary && cachedDisease) {
        setLoading(false);
      } else {
        setLoading(true);
      }

      try {
        // Fetch summary and disease data in parallel
        const [summaryResponse, diseaseResponse] = await Promise.all([
          fetch(
            `https://papaiaapi.onrender.com/api/owner/${endpoints.summary}/${farmId}`,
            { headers, signal: abortController.signal }
          ),
          fetch(
            `https://papaiaapi.onrender.com/api/owner/${endpoints.disease}/${farmId}`,
            { headers, signal: abortController.signal }
          ),
        ]);

        const [summaryResult, diseaseResult] = await Promise.all([
          summaryResponse.ok ? summaryResponse.json() : null,
          diseaseResponse.ok ? diseaseResponse.json() : null,
        ]);

        if (summaryResult) {
          setSummaryData(summaryResult);
          cache.set(summaryCacheKey, summaryResult, 30000);
        }

        if (diseaseResult) {
          diseaseResult._fetchedAt = Date.now();
          setCommonDiseaseData(diseaseResult);
          cache.set(diseaseCacheKey, diseaseResult, 120000);
        }
      } catch (error) {
        if (error.name === "AbortError") return;

        if (!cachedSummary) setSummaryData(null);
        if (!cachedDisease) setCommonDiseaseData(null);
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
  }, [farmId, timeFilter, dateRange]);

  if (loading && !summaryData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
        </div>
      </div>
    );
  }

  if (!summaryData && !commonDiseaseData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <p className="text-gray-500 text-center text-sm sm:text-base">
          No summary data available
        </p>
      </div>
    );
  }

  const hasDisease = commonDiseaseData && commonDiseaseData.count > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-green-700" />
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          Summary ({dateRange})
        </h2>
      </div>

      {/* Summary Content */}
      <div className="space-y-4">
        {/* AI-Generated Summary */}
        {summaryData?.summary && (
          <div className="border-b border-gray-100 pb-4">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {cleanText(summaryData.summary)}
            </p>
          </div>
        )}

        {/* Most Common Disease Section */}
        {commonDiseaseData && (
          <div className="pb-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {hasDisease ? (
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <div className="flex-1">
                <h3
                  className={`font-semibold mb-1 text-sm sm:text-base ${
                    hasDisease ? "text-amber-900" : "text-emerald-900"
                  }`}
                >
                  {hasDisease ? "Most Common Disease" : "Farm Health Status"}
                </h3>
                <p className="text-sm sm:text-base text-gray-700">
                  {cleanText(commonDiseaseData.message)}
                </p>
                {hasDisease && (
                  <div className="mt-2 flex flex-wrap gap-2 text-xs sm:text-sm">
                    <span className="px-2 py-1 bg-gray-50 rounded-md font-medium text-amber-800 border border-amber-100">
                      {commonDiseaseData.count} cases
                    </span>
                    <span className="px-2 py-1 bg-gray-50 rounded-md font-medium text-amber-800 border border-amber-100">
                      {commonDiseaseData.percentage}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
