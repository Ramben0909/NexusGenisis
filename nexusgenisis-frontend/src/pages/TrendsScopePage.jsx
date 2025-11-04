import { useState } from "react";

export default function TrendsScopePage() {
  const [idea, setIdea] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!idea.trim()) return;
    setLoading(true);
    setAnalysis("");

    // Mocked response for now (replace with /api/trends later)
    setTimeout(() => {
      const formattedAnalysis = (
        <>
          <p>
            🔍 <strong>Market Analysis for "{idea}"</strong>:
          </p>
          <br />

          <p>
            📈 <strong>Current Trend:</strong>
          </p>
          <ul className="list-disc list-inside mb-2">
            <li>
              The {idea} sector is rapidly evolving with increasing innovation
              and digital transformation.
            </li>
            <li>
              Global demand and investments have risen by ~25% in the last year.
            </li>
          </ul>

          <p>
            💡 <strong>Opportunities:</strong>
          </p>
          <ul className="list-disc list-inside mb-2">
            <li>High growth potential in developing markets.</li>
            <li>Integration with AI and automation tools.</li>
            <li>Increased investor attention and early-stage funding.</li>
          </ul>

          <p>
            ⚠️ <strong>Challenges:</strong>
          </p>
          <ul className="list-disc list-inside mb-2">
            <li>Competitive landscape with rising startups.</li>
            <li>Regulatory and compliance frameworks evolving.</li>
            <li>Need for strong technical differentiation.</li>
          </ul>

          <p>
            🚀 <strong>Future Outlook:</strong>
          </p>
          <ul className="list-disc list-inside">
            <li>
              The {idea} domain is projected to grow at a CAGR of 15–20% over
              the next 5 years.
            </li>
            <li>
              Strong potential for sustainable scale and innovation-driven
              disruption.
            </li>
          </ul>
        </>
      );

      setAnalysis(formattedAnalysis);
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-indigo-50 to-pink-50">
      {/* Header */}
      <div className="text-center pt-16 pb-10 px-4">
        <h1 className="text-5xl font-extrabold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          NexusGenisis Trends & Scope
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Enter a{" "}
          <span className="font-semibold text-indigo-600">
            business idea or topic
          </span>{" "}
          to get an AI-powered pre-market research and scope analysis
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Input Form */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 border border-purple-100">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleGenerate(e)}
              placeholder="e.g. Sustainable fashion startups, AI chatbots for education"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800 placeholder-gray-400 transition-all"
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`px-8 py-3 rounded-xl text-white font-semibold transition-all transform hover:scale-105 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
              }`}
            >
              {loading ? "Analyzing..." : "Generate Analysis"}
            </button>
          </div>
        </div>

        {/* Response Section */}
        <div className="bg-white border border-purple-100 rounded-2xl shadow-xl p-8 transform transition-all hover:shadow-2xl">
          {!analysis && !loading && (
            <div className="text-center py-12">
              <div className="text-7xl mb-4">💡</div>
              <p className="text-gray-600 text-lg font-medium">
                Enter a business idea to get detailed trend and scope insights
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Discover opportunities and challenges in your market
              </p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative mb-4">
                <div className="w-16 h-16 border-4 border-purple-200 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-transparent border-t-purple-600 border-r-pink-600 rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="text-purple-600 font-medium">
                Analyzing market trends...
              </p>
            </div>
          )}

          {analysis && (
            <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <div className="text-gray-800 whitespace-pre-line leading-relaxed text-base prose">
                {analysis}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
