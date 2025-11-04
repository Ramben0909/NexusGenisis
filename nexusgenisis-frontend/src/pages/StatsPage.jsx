import { useState } from "react";

export default function StatsPage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResponse("");

    // Mocked response — replace with your backend API call
    setTimeout(() => {
      const formattedResponse = (
        <>
          <p>
            📊 <strong>Statistical Summary for "{query}"</strong>:
          </p>
          <ul className="list-disc list-inside mb-2">
            <li>
              <strong>Market Growth:</strong> 12.5% YoY
            </li>
            <li>
              <strong>Top Regions:</strong> North America, APAC
            </li>
            <li>
              <strong>Emerging Players:</strong> DataNova, NexuMind
            </li>
            <li>
              <strong>Key Metrics:</strong> Revenue growth +18%, user retention
              +30%
            </li>
          </ul>
          <p>
            Overall, the <strong>{query}</strong> domain shows strong upward
            momentum with increasing AI adoption.
          </p>
        </>
      );

      setResponse(formattedResponse);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-50 to-white">
      {/* Header */}
      <div className="text-center pt-16 pb-10 px-4">
        <h1 className="text-5xl font-extrabold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          NexusGenisis Stats
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Ask about any{" "}
          <span className="font-semibold text-indigo-600">domain or topic</span>{" "}
          to get AI-powered statistical insights
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Input Section */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 border border-indigo-100">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
              placeholder="Enter a domain or topic (e.g., AI in Healthcare)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-800 placeholder-gray-400 transition-all"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-8 py-3 rounded-xl text-white font-semibold transition-all transform hover:scale-105 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
              }`}
            >
              {loading ? "Analyzing..." : "Generate Stats"}
            </button>
          </div>
        </div>

        {/* Response Section */}
        <div className="bg-white border border-indigo-100 rounded-2xl shadow-xl p-8 transform transition-all hover:shadow-2xl">
          {!response && !loading && (
            <div className="text-center py-12">
              <div className="text-7xl mb-4">📊</div>
              <p className="text-gray-600 text-lg font-medium">
                Enter a topic above to receive a detailed statistical summary
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Powered by AI-driven analytics
              </p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative mb-4">
                <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-transparent border-t-indigo-600 border-r-purple-600 rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="text-indigo-600 font-medium">Analyzing data...</p>
            </div>
          )}

          {response && (
            <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
              <div className="text-gray-800 whitespace-pre-line leading-relaxed text-base prose">
                {response}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
