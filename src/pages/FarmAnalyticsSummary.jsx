import React, { useState, useEffect } from "react";
import { TrendingUp, AlertCircle, CheckCircle, Calendar } from "lucide-react";

export default function FarmAnalyticsSummary({ farmId, timeFilter }) {
  const [summaryData, setSummaryData] = useState(null);
  const [commonDiseaseData, setCommonDiseaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!farmId) return;

      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Map timeFilter to the correct endpoint
        const endpointMap = {
          Daily: "daily-summary",
          Weekly: "weekly-summary",
          Monthly: "monthly-summary",
          Yearly: "yearly-summary",
        };

        const endpoint = endpointMap[timeFilter] || "daily-summary";

        // Fetch summary and common diseases in parallel
        const [summaryResponse, diseaseResponse] = await Promise.all([
          fetch(
            `https://papaiaapi.onrender.com/api/owner/${endpoint}/${farmId}`,
            { headers }
          ),
          fetch(
            `https://papaiaapi.onrender.com/api/owner/common-diseases/${farmId}`,
            { headers }
          ),
        ]);

        const summaryResult = await summaryResponse.json();
        const diseaseResult = await diseaseResponse.json();

        setSummaryData(summaryResult);
        setCommonDiseaseData(diseaseResult);
      } catch (error) {
        console.error("Error fetching summary data:", error);
        setSummaryData(null);
        setCommonDiseaseData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [farmId, timeFilter]);

  if (loading) {
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

  const getPeriodLabel = () => {
    const labels = {
      Daily: "11-Day",
      Weekly: "9-Week",
      Monthly: "12-Month",
      Yearly: "7-Year",
    };
    return labels[timeFilter] || "Period";
  };

  const hasDisease = commonDiseaseData && commonDiseaseData.count > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-green-700" />
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          {getPeriodLabel()} Summary
        </h2>
      </div>

      {/* Summary Content */}
      <div className="space-y-4">
        {/* AI-Generated Summary */}
        {summaryData?.summary && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {summaryData.summary}
            </p>
          </div>
        )}

        {/* Most Common Disease Section */}
        {commonDiseaseData && (
          <div
            className={`rounded-lg p-4 border ${
              hasDisease
                ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100"
                : "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100"
            }`}
          >
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
                  {commonDiseaseData.message}
                </p>
                {hasDisease && (
                  <div className="mt-2 flex flex-wrap gap-2 text-xs sm:text-sm">
                    <span className="px-2 py-1 bg-white rounded-md font-medium text-amber-800">
                      {commonDiseaseData.count} cases
                    </span>
                    <span className="px-2 py-1 bg-white rounded-md font-medium text-amber-800">
                      {commonDiseaseData.percentage}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Healthy Trend Badge */}
        {summaryData?.healthyTrend && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            <Calendar className="w-4 h-4" />
            <span>{summaryData.healthyTrend}</span>
          </div>
        )}

        {/* Trends - Compact Display */}
        {summaryData?.trends && summaryData.trends.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Key Trends
            </h3>
            <div className="space-y-1.5">
              {summaryData.trends.slice(0, 3).map((trend, index) => (
                <div
                  key={index}
                  className="text-xs sm:text-sm text-gray-600 flex items-start gap-2"
                >
                  <span className="mt-0.5">•</span>
                  <span className="flex-1">{trend}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
