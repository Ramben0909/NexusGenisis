import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFoundPage() {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-6">
          <div className="relative inline-block">
            <h1 className="text-7xl md:text-8xl font-extrabold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              404
            </h1>
            <div className="absolute inset-0 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-20 blur-3xl -z-10"></div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-6 md:p-8 mb-6">
          <div className="mb-4">
            <Search className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 text-base mb-5 max-w-md mx-auto">
            Oops! The page you're looking for seems to have wandered off into the digital void.
          </p>

          <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-xl p-4 mb-6 border border-indigo-100">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-indigo-600">Possible reasons:</span>
            </p>
            <ul className="text-sm text-gray-600 mt-2 space-y-1 text-left">
              <li>• The page may have been moved or deleted</li>
              <li>• The URL might be typed incorrectly</li>
              <li>• You might not have permission to view this page</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-md border border-gray-300 font-semibold transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
            
            <button
              onClick={handleGoHome}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg font-semibold transform hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </div>

        {/* Popular Pages */}
        <div className="text-left mb-5 bg-white rounded-2xl shadow-lg border border-purple-100 p-5">
          <h3 className="text-base font-bold text-gray-800 mb-3">
            Popular Pages
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Home", path: "/" },
              { name: "Stats", path: "/stats" },
              { name: "Trends & Scope", path: "/trends" },
              { name: "Profile", path: "/profile" },
            ].map((link) => (
              <a
                key={link.name}
                href={link.path}
                className="px-3 py-2 text-sm font-semibold text-indigo-600 hover:text-purple-600 bg-linear-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-lg transition-all text-center"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
}