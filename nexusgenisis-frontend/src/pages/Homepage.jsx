import { useState, useEffect } from "react";
import image from "../assets/image.png";

export default function Homepage() {
  const [activeTab, setActiveTab] = useState("All");
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [categories, setCategories] = useState([
    "All",
    "Technology",
    "Business",
    "Finance",
    "Health",
    "Science",
    "Sports",
  ]);
  const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  const RATE_LIMIT_DURATION = 60 * 1000; // 1 minute between API calls
  const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  const NEWS_CACHE_KEY = "news-cache";
  const NEWS_TS_KEY = "news-timestamp";
  const NEWS_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours
  const NEWS_RATE_LIMIT_DURATION = 5 * 60 * 1000; // 5 minutes
  const HN_CACHE_KEY = "hn-cache";
  const HN_TS_KEY = "hn-ts";
  const HN_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Pagination calculations
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = filteredNews.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setIsLoading(true);

    async function fetchHackerNews() {
      try {
        const now = Date.now();
        let cached = localStorage.getItem(HN_CACHE_KEY);
        let ts = localStorage.getItem(HN_TS_KEY);

        // ✅ Serve from cache if fresh
        if (cached && ts && now - ts < HN_CACHE_DURATION) {
          const parsed = JSON.parse(cached);
          setNews((prev) =>
            prev.length === 0 ? parsed : [...prev, ...parsed]
          );
          setFilteredNews((prev) =>
            prev.length === 0 ? parsed : [...prev, ...parsed]
          );

          return;
        }

        console.log("Fetching Hacker News...");

        // ✅ Get top stories list
        const topIdsRes = await fetch(
          "https://hacker-news.firebaseio.com/v0/topstories.json"
        );
        const ids = await topIdsRes.json();

        const top20 = ids.slice(0, 20); // top 20 headlines

        // ✅ Fetch each story
        const storyRequests = top20.map((id) =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
            (r) => r.json()
          )
        );

        const stories = await Promise.all(storyRequests);

        // ✅ Format like your other news items
        const formatted = stories
          .filter((story) => story && story.title) // avoid nulls
          .map((story) => ({
            id: `hn-${story.id}`,
            title: story.title,
            category: "Technology",
            date: new Date(story.time * 1000).toISOString().split("T")[0],
            description:
              story.text?.replace(/<[^>]+>/g, "") ??
              "Hacker News trending tech story",

            // ✅ USE story.url when opening article, but image fallback for UI
            image: image,

            // ✅ preserve link for your Read More
            url:
              story.url || `https://news.ycombinator.com/item?id=${story.id}`,
            fit: "contain",
          }));

        // ✅ Cache it
        localStorage.setItem(HN_CACHE_KEY, JSON.stringify(formatted));
        localStorage.setItem(HN_TS_KEY, now.toString());

        // ✅ Add to UI state
        setNews((prev) => {
          const map = new Map();
          [...prev, ...formatted].forEach((item) => map.set(item.id, item));
          return Array.from(map.values());
        });

        setFilteredNews((prev) => {
          const map = new Map();
          [...prev, ...formatted].forEach((item) => map.set(item.id, item));
          return Array.from(map.values());
        });
      } catch (error) {
        console.log("HN error:", error);
        try {
          const cached = localStorage.getItem(HN_CACHE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            setNews((prev) =>
              prev.length === 0 ? parsed : [...prev, ...parsed]
            );
            setFilteredNews((prev) =>
              prev.length === 0 ? parsed : [...prev, ...parsed]
            );
          }
        } catch {
          console.log("HN cache retrieval failed");
        }
      }
    }

    async function fetchMarketData() {
      try {
        // Check if we have cached data
        let cachedData = null;
        let cachedTimestamp = null;

        try {
          cachedData = localStorage.getItem("crypto-market-data");
          cachedTimestamp = localStorage.getItem("crypto-fetch-timestamp");
        } catch (error) {
          console.log("Cache not available or empty");
        }

        const now = Date.now();

        // If cache exists and is still valid, use it
        if (cachedData && cachedTimestamp) {
          const timestamp = parseInt(cachedTimestamp);
          const timeSinceLastFetch = now - timestamp;

          if (timeSinceLastFetch < CACHE_DURATION) {
            console.log(
              "Using cached data. Time since last fetch:",
              Math.round(timeSinceLastFetch / 1000),
              "seconds"
            );
            const parsed = JSON.parse(cachedData);
            setNews(parsed);
            setFilteredNews(parsed);
            setLastFetchTime(timestamp);
            return;
          }
        }

        // Rate limiting check
        if (cachedTimestamp) {
          const timestamp = parseInt(cachedTimestamp);
          const timeSinceLastFetch = now - timestamp;

          if (timeSinceLastFetch < RATE_LIMIT_DURATION) {
            console.log(
              "Rate limit active. Please wait:",
              Math.round((RATE_LIMIT_DURATION - timeSinceLastFetch) / 1000),
              "seconds"
            );
            if (cachedData) {
              const parsed = JSON.parse(cachedData);
              setNews(parsed);
              setFilteredNews(parsed);
              setLastFetchTime(timestamp);
            }
            return;
          }
        }

        // Fetch fresh data from API
        console.log("Fetching fresh data from API...");
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&x_cg_demo_api_key=${COINGECKO_API_KEY}`
        );

        const data = await res.json();
        console.log("Fetched crypto market data:", data);

        const mapped = data.map((coin) => ({
          id: coin.id,
          title: coin.name,
          symbol: coin.symbol.toUpperCase(),
          category: "Finance",
          date: new Date(coin.last_updated).toISOString().split("T")[0],
          description: `${coin.symbol.toUpperCase()} is currently trading at $${coin.current_price.toLocaleString(
            "en-US",
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          )} with a market cap of $${(coin.market_cap / 1e9).toFixed(2)}B.`,
          currentPrice: coin.current_price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          priceChange24h: coin.price_change_percentage_24h?.toFixed(2),
          marketCap: coin.market_cap.toLocaleString("en-US", {
            maximumFractionDigits: 0,
          }),
          high24h: coin.high_24h?.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          low24h: coin.low_24h?.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          marketCapRank: coin.market_cap_rank,
          image: coin.image,
          fit: "contain",
        }));

        // Save to cache
        try {
          localStorage.setItem("crypto-market-data", JSON.stringify(mapped));
          localStorage.setItem("crypto-fetch-timestamp", now.toString());
        } catch (error) {
          console.log("Unable to save to cache:", error);
        }

        setNews((prev) => {
          const map = new Map();
          [...prev, ...mapped].forEach((item) => map.set(item.id, item));
          return Array.from(map.values());
        });

        setFilteredNews((prev) => {
          const map = new Map();
          [...prev, ...mapped].forEach((item) => map.set(item.id, item));
          return Array.from(map.values());
        });

        setLastFetchTime(now);
      } catch (error) {
        console.error("Failed to fetch:", error);

        try {
          const cachedData = localStorage.getItem("crypto-market-data");
          if (cachedData) {
            console.log("Using cached data due to fetch error");
            const parsed = JSON.parse(cachedData);
            setNews((prev) => [...prev, ...parsed]);
            setFilteredNews((prev) => [...prev, ...parsed]);
          }
        } catch (cacheError) {
          console.error("Cache retrieval failed:", cacheError);
        }
      }
    }

    async function fetchNewsData() {
      try {
        let cachedNews = null;
        let cachedNewsTs = null;

        try {
          cachedNews = localStorage.getItem(NEWS_CACHE_KEY);
          cachedNewsTs = localStorage.getItem(NEWS_TS_KEY);
        } catch {}

        const now = Date.now();

        if (cachedNews && cachedNewsTs) {
          const ts = parseInt(cachedNewsTs);
          if (now - ts < NEWS_CACHE_DURATION) {
            const parsed = JSON.parse(cachedNews);
            setNews((prev) =>
              prev.length === 0 ? parsed : [...prev, ...parsed]
            );
            setFilteredNews((prev) =>
              prev.length === 0 ? parsed : [...prev, ...parsed]
            );

            return;
          }
        }

        if (cachedNewsTs) {
          const ts = parseInt(cachedNewsTs);
          if (now - ts < NEWS_RATE_LIMIT_DURATION) {
            if (cachedNews) {
              const parsed = JSON.parse(cachedNews);
              setNews((prev) => [...prev, ...parsed]);
              setFilteredNews((prev) => [...prev, ...parsed]);
            }
            return;
          }
        }

        console.log("Fetching fresh NEWS...");
        const url =
          `https://newsdata.io/api/1/latest?apikey=${NEWS_API_KEY}` +
          `&category=technology,science,business&language=en`;

        const res = await fetch(url);
        console.log("News API status:", res.status);
        const json = await res.json();
        console.log("News API response:", json);

        const items = Array.isArray(json.results) ? json.results : [];

        const formatted = items.map((n, i) => {
          const base =
            n.article_id || n.link || `news-${Date.now()}-${Math.random()}`;

          return {
            id: n.article_id || base.replace(/[^a-zA-Z0-9]/g, ""),
            title: n.title,
            category: n.category?.[0]
              ? n.category[0].charAt(0).toUpperCase() +
                n.category[0].slice(1).toLowerCase()
              : "General",
            date: (() => {
              if (n.pubDate) {
                const normalized = n.pubDate.replace(" ", "T");
                return new Date(normalized).toISOString().split("T")[0];
              }
              return new Date().toISOString().split("T")[0];
            })(),
            description: n.description || "No summary",
            image:
              n.image_url || "https://via.placeholder.com/400x200?text=News",
            fit: "cover",
          };
        });

        try {
          localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify(formatted));
          localStorage.setItem(NEWS_TS_KEY, now.toString());
        } catch (e) {
          console.log("Couldn't cache news:", e);
        }

        setNews((prev) => {
          const map = new Map();
          [...prev, ...formatted].forEach((item) => map.set(item.id, item));
          return Array.from(map.values());
        });

        setFilteredNews((prev) => {
          const map = new Map();
          [...prev, ...formatted].forEach((item) => map.set(item.id, item));
          return Array.from(map.values());
        });
      } catch (err) {
        console.error("News fetch failed, using cache", err);
        try {
          const cached = localStorage.getItem(NEWS_CACHE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            setNews((prev) =>
              prev.length === 0 ? parsed : [...prev, ...parsed]
            );
            setFilteredNews((prev) =>
              prev.length === 0 ? parsed : [...prev, ...parsed]
            );
          }
        } catch {}
      }
    }

    Promise.all([fetchMarketData(), fetchNewsData(), fetchHackerNews()])
      .then(() => {
        // ✅ Sort final combined data by date DESC (latest first)
        setNews((prev) =>
          [...prev].sort((a, b) => new Date(b.date) - new Date(a.date))
        );

        setFilteredNews((prev) =>
          [...prev].sort((a, b) => new Date(b.date) - new Date(a.date))
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let data = news;
    setCategories((prevCats) => {
      const allCats = new Set([
        ...prevCats,
        ...news.map((item) => item.category),
      ]);

      return ["All", ...Array.from(allCats).filter((c) => c !== "All")];
    });

    if (activeTab !== "All") {
      data = data.filter((item) => item.category === activeTab);
    }

    if (searchTerm) {
      data = data.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter) {
      data = data.filter((item) => item.date === dateFilter);
    }

    setFilteredNews(data);
    setCurrentPage(1); // Reset to first page when filters change
  }, [activeTab, searchTerm, dateFilter, news]);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Hero Header */}
      <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            NexusGenisis News
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl">
            Stay updated with the latest AI-driven insights and global trends
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-8">
        {/* Cache Status Banner */}
        {/* {lastFetchTime && !isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-medium">⏱️ Last updated:</span>
              <span className="text-blue-800">{new Date(lastFetchTime).toLocaleTimeString()}</span>
            </div>
            <span className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              Cache active (5 min)
            </span>
          </div>
        )} */}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Loading market data...</p>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Search & Filter Bar */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search News
                  </label>
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Date Filter */}
                <div className="md:w-64">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Date
                  </label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Categories
              </h2>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`px-6 py-3 rounded-full text-sm font-semibold transition-all transform hover:scale-105 ${
                      activeTab === cat
                        ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-linear-to-r hover:from-indigo-50 hover:to-purple-50 shadow-md"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600 font-medium">
                {filteredNews.length}{" "}
                {filteredNews.length === 1 ? "article" : "articles"} found
                {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
              </p>
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
              {currentNews.length > 0 ? (
                currentNews.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                  >
                    <div className="relative overflow-hidden bg-linear-to-br from-indigo-100 to-purple-100">
                      <img
                        src={
                          item.image ||
                          "https://i.pinimg.com/1200x/26/6f/60/266f60cae0cf8de803d642bef5ac5fea.jpg"
                        }
                        alt={item.title}
                        loading="eager"
                        className={`w-full h-48  ${
                          item.fit === "cover"
                            ? "object-cover p-0"
                            : "object-contain p-8"
                        } transform hover:scale-110 transition-transform duration-500`}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-2 hover:text-indigo-600 transition-colors line-clamp-2">
                        {item.title}
                      </h2>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <button className="text-sm font-semibold text-indigo-600 hover:text-purple-600 flex items-center gap-1 transition-colors">
                          Read more
                          <span className="transform group-hover:translate-x-1 transition-transform">
                            →
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="text-gray-400 text-6xl mb-4">📰</div>
                  <p className="text-xl text-gray-600 font-medium">
                    No news found for this filter
                  </p>
                  <p className="text-gray-500 mt-2">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 py-12">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-3 rounded-xl font-semibold transition-all ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-indigo-600 hover:bg-indigo-50 shadow-md hover:shadow-lg transform hover:-translate-x-1"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Page Numbers */}
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-12 h-12 rounded-xl font-semibold transition-all transform hover:scale-110 ${
                            currentPage === page
                              ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                              : "bg-white text-gray-700 hover:bg-indigo-50 shadow-md"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span
                          key={page}
                          className="w-12 h-12 flex items-center justify-center text-gray-400"
                        >
                          •••
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-3 rounded-xl font-semibold transition-all ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-indigo-600 hover:bg-indigo-50 shadow-md hover:shadow-lg transform hover:translate-x-1"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
