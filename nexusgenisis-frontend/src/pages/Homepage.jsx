import { useState, useEffect } from "react";

const categories = ["All", "Technology", "Business", "Finance", "Health", "Science", "Sports"];

export default function Homepage() {
  const [activeTab, setActiveTab] = useState("All");
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const mockNews = [
      {
        id: 1,
        title: "AI revolutionizing the finance world",
        category: "Finance",
        date: "2025-11-01",
        description: "Generative AI models are transforming financial forecasting and analysis.",
        image: "https://i.pinimg.com/1200x/55/a0/f3/55a0f3013d0cbfb4e4057687f206c892.jpg",
      },
      {
        id: 2,
        title: "Tech startups booming in 2025",
        category: "Technology",
        date: "2025-11-02",
        description: "Innovation-driven startups are shaping the next wave of digital transformation.",
        image: "https://i.pinimg.com/736x/94/db/93/94db93a11e9c6655a58f5d365b3433ac.jpg",
      },
      {
        id: 3,
        title: "Healthcare adopting AI at scale",
        category: "Health",
        date: "2025-10-29",
        description: "Hospitals integrate predictive AI models to optimize diagnosis and patient care.",
        image: "https://i.pinimg.com/1200x/fd/5a/65/fd5a65d89e01b72b5f5d748e5e65f4d3.jpg",
      },
      {
        id: 4,
        title: "Quantum computing breakthrough announced",
        category: "Science",
        date: "2025-11-03",
        description: "Scientists achieve major milestone in quantum error correction.",
        image: "https://i.pinimg.com/1200x/44/64/b3/4464b3f57280b1372349db7bd1cd724f.jpg",
      },
      {
        id: 5,
        title: "Global markets surge on tech rally",
        category: "Business",
        date: "2025-11-04",
        description: "Technology sector leads unprecedented growth across international markets.",
        image: "https://i.pinimg.com/736x/b2/45/9f/b2459f1644f9ea9f0c2d459ee3a84f35.jpg",
      },
      {
        id: 6,
        title: "Championship finals draw record viewers",
        category: "Sports",
        date: "2025-11-02",
        description: "Historic matchup attracts millions of viewers worldwide.",
        image: "https://i.pinimg.com/736x/34/b5/a1/34b5a1002ed04b04a9560badbceb62b6.jpg",
      },
    ];
    setNews(mockNews);
    setFilteredNews(mockNews);
  }, []);

  useEffect(() => {
    let data = news;

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
  }, [activeTab, searchTerm, dateFilter, news]);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Hero Header */}
      <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
            NexusGenisis News
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl">
            Stay updated with the latest AI-driven insights and global trends
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-8">
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Categories</h2>
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
            {filteredNews.length} {filteredNews.length === 1 ? 'article' : 'articles'} found
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
          {filteredNews.length > 0 ? (
            filteredNews.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">
                      {new Date(item.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                    <button className="text-sm font-semibold text-indigo-600 hover:text-purple-600 flex items-center gap-1 transition-colors">
                      Read more
                      <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📰</div>
              <p className="text-xl text-gray-600 font-medium">No news found for this filter</p>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}