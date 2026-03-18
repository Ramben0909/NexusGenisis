import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Share2 } from "lucide-react";
import loadingGif from "../assets/ai_chatbot.gif";

function AnimatedDotsText() {
  const [dotCount, setDotCount] = useState(1);
  const [increasing, setIncreasing] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => {
        if (increasing) {
          if (prev < 3) return prev + 1;
          setIncreasing(false);
          return prev - 1;
        } else {
          if (prev > 1) return prev - 1;
          setIncreasing(true);
          return prev + 1;
        }
      });
    }, 400);
    return () => clearInterval(interval);
  }, [increasing]);

  // 💡 Render a fixed 3-character space for dots so text doesn’t shift
  return (
    <p className="text-indigo-600 font-mono font-extrabold text-xl tracking-wide text-center">
      Analyzing data
      <span className="inline-block w-[1.5em] text-left">
        {".".repeat(dotCount)}
      </span>
    </p>
  );
}


export default function StatsPage() {
  const [query, setQuery] = useState("");
  const [company, setCompany] = useState("");
  const [topN, setTopN] = useState("");
  const [bottomN, setBottomN] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const APP_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const API_URL = `${APP_BASE_URL}/query/domainInsight`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return toast.error("Please enter a domain name.");

    const body = { domain: query.trim() };
    if (company.trim()) body.company = company.trim();
    if (topN) body.topN = Number(topN);
    if (bottomN) body.bottomN = Number(bottomN);

    try {
      setLoading(true);
      setResponse("");

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch insights");
      }

      setResponse(data.result);
      toast.success("Insights generated successfully");
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to fetch insights. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      toast.success("Copied insights to clipboard 📋");
    } catch {
      toast.error("Failed to copy text.");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `NexusGenisis Stats — ${query}`,
          text: response,
        });
        toast.success("Shared successfully 🌐");
      } catch (err) {
        console.error("Share cancelled or failed:", err);
      }
    } else {
      await navigator.clipboard.writeText(response);
      toast.info("Sharing not supported. Copied instead 📋");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-50 to-white">
      {/* Header */}
      <div className="text-center pt-16 pb-10 px-4">
        <h1 className="text-5xl font-extrabold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          NexusGenisis Stats
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Enter a{" "}
          <span className="font-semibold text-indigo-600">domain, company</span>{" "}
          or specify{" "}
          <span className="font-semibold text-purple-600">top/bottom</span> N
          for AI-powered analysis
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Input Section */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 border border-indigo-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Domain (e.g., Artificial Intelligence)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="text"
                placeholder="Company (optional)"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="number"
                placeholder="Top N (optional)"
                value={topN}
                onChange={(e) => setTopN(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <input
                type="number"
                placeholder="Bottom N (optional)"
                value={bottomN}
                onChange={(e) => setBottomN(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 md:flex-initial md:px-8 py-3 rounded-xl text-white font-semibold transition-all transform hover:scale-105 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                }`}
              >
                {loading ? "Analyzing..." : "Generate Insights"}
              </button>
            </div>
          </form>
        </div>

        {/* Response Section */}
        <div className=" bg-[#FBFBFB] border border-indigo-100 rounded-2xl shadow-xl p-8">
          {!response && !loading && (
            <div className="text-center py-12">
              <div className="text-7xl mb-4">📊</div>
              <p className="text-gray-600 text-lg font-medium">
                Enter details above to receive a detailed AI-powered analysis
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Data sourced from Perplexity API
              </p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <img
                src={loadingGif}
                alt="Loading..."
                className="w-2/3 h-2/3 object-contain"
              />
              <AnimatedDotsText />
            </div>
          )}


          {response && (
            <div className="space-y-6">
              {/* Copy & Share Buttons */}
              <div className="flex justify-end gap-3 mb-6">
                <button
                  onClick={handleCopy}
                  className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-medium hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 shadow-sm hover:shadow"
                >
                  <Copy className="w-4.5 h-4.5 group-hover:scale-110 transition-transform duration-200" />
                  <span>Copy</span>
                </button>

                <button
                  onClick={handleShare}
                  className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Share2 className="w-4.5 h-4.5 group-hover:rotate-12 transition-transform duration-200" />
                  <span>Share</span>
                  <div className="absolute inset-0 rounded-xl bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 blur transition-opacity duration-200"></div>
                </button>
              </div>

              <div className="prose prose-indigo max-w-none text-gray-800 leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {response}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
