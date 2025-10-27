import { Clock, User } from "lucide-react";

const DGDriveHomepage = () => {
  const articles = [
    {
      id: 1,
      title: "Mercedes EQS: Redefining Electric",
      author: "James Mitchell",
      readTime: "5 min read",
      category: "LUXURY",
      image:
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=400&fit=crop&crop=center",
      categoryColor: "bg-yellow-400",
    },
    {
      id: 2,
      title: "Classic Convertible: 1953 Chevrolet Corvette",
      author: "Alex Turner",
      readTime: "8 min read",
      category: "PERFORMANCE",
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop&crop=center",
      categoryColor: "bg-yellow-400",
    },
    {
      id: 3,
      title: "Volkswagen Revives the Iconic Beetle",
      author: "Alex Turner",
      readTime: "4 min read",
      category: "VINTAGE",
      image:
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop&crop=center",
      categoryColor: "bg-yellow-400",
    },
    {
      id: 4,
      title: "Unleashing the Power of Muscle Cars",
      author: "Emma Rodriguez",
      readTime: "7 min read",
      category: "MUSCLE",
      image:
        "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=400&h=300&fit=crop&crop=center",
      categoryColor: "bg-yellow-400",
    },
    {
      id: 5,
      title: "McLaren's Masterpiece: The 570",
      author: "Sarah Rodriguez",
      readTime: "7 min read",
      category: "PERFORMANCE",
      image:
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop&crop=center",
      categoryColor: "bg-yellow-400",
    },
    {
      id: 6,
      title: "The Future of Flying: Electric Supercars",
      author: "James Mitchell",
      readTime: "6 min read",
      category: "FUTURE",
      image:
        "https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=300&fit=crop&crop=center",
      categoryColor: "bg-yellow-400",
    },
    {
      id: 7,
      title: "Engineering the McLaren 22S",
      author: "Sarah Rodriguez",
      readTime: "9 min read",
      category: "PERFORMANCE",
      image:
        "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=400&h=300&fit=crop&crop=center",
      categoryColor: "bg-yellow-400",
    },
    {
      id: 8,
      title: "Making the City Electric: Mini Cooper SE",
      author: "Emma Rodriguez",
      readTime: "5 min read",
      category: "URBAN",
      image:
        "https://images.unsplash.com/photo-1556800120-f80367ea0d72?w=400&h=300&fit=crop&crop=center",
      categoryColor: "bg-yellow-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
              <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent tracking-tight">
                DG-DRIVE
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-10">
              <a
                href="#"
                className="text-gray-800 hover:text-yellow-500 font-medium transition-all duration-300 hover:scale-105"
              >
                FOODPRINTS
              </a>
              <a
                href="#"
                className="text-gray-800 hover:text-yellow-500 font-medium transition-all duration-300 hover:scale-105"
              >
                DG TECH
              </a>
              <a
                href="#"
                className="text-gray-800 hover:text-yellow-500 font-medium transition-all duration-300 hover:scale-105"
              >
                DG INVEST
              </a>
              <a
                href="#"
                className="text-gray-800 hover:text-yellow-500 font-medium transition-all duration-300 hover:scale-105"
              >
                DG DAILY
              </a>
              <a
                href="#"
                className="text-gray-800 hover:text-yellow-500 font-medium transition-all duration-300 hover:scale-105"
              >
                DG DESTINATIONS
              </a>
              <a
                href="#"
                className="text-gray-800 hover:text-yellow-500 font-medium transition-all duration-300 hover:scale-105"
              >
                DAILY GUARDIAN
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
            PREMIUM
            <span className="block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              AUTOMOTIVE
            </span>
            CONTENT
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Discover the world&apos;s most exceptional vehicles through expert
            reviews, in-depth analysis, and captivating stories.
          </p>
        </div>

        {/* Featured Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Large Featured Article */}
          <div className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="aspect-video overflow-hidden">
              <img
                src={articles[0].image}
                alt={articles[0].title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-6 left-6">
                <span
                  className={`${articles[0].categoryColor} text-black px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg`}
                >
                  {articles[0].category}
                </span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-yellow-500 transition-colors duration-300">
                {articles[0].title}
              </h3>
              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{articles[0].author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{articles[0].readTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Second Featured Article */}
          <div className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="aspect-video overflow-hidden">
              <img
                src={articles[1].image}
                alt={articles[1].title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-6 left-6">
                <span
                  className={`${articles[1].categoryColor} text-black px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg`}
                >
                  {articles[1].category}
                </span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-yellow-500 transition-colors duration-300">
                {articles[1].title}
              </h3>
              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{articles[1].author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{articles[1].readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(2).map((article) => (
            <div
              key={article.id}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`${article.categoryColor} text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg`}
                  >
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-500 transition-colors duration-300 leading-tight">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <User className="w-3 h-3" />
                    <span className="font-medium">{article.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              <span className="block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                DG-DRIVE
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Handpicked stories that define the future of automotive excellence
            </p>
          </div>

          {/* Featured Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Hero Article - Takes up 3 columns */}
            <div className="lg:col-span-3">
              <div className="group relative overflow-hidden rounded-3xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-500">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=500&fit=crop&crop=center"
                    alt="Mercedes EQS Future of Luxury"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                      LUXURY
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-4xl font-black text-gray-900 mb-4 leading-tight group-hover:text-yellow-500 transition-colors duration-300">
                    The Future of Luxury: Mercedes EQS Sets New Standards
                  </h3>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    Discover how Mercedes-Benz is redefining luxury in the
                    electric age with the EQS, featuring cutting-edge technology
                    and unparalleled comfort.
                  </p>
                  <div className="flex items-center space-x-6 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">James Mitchell</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>5 min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Articles - Takes up 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Article 1 */}
              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="flex">
                  <div className="w-32 flex-shrink-0">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&h=300&fit=crop&crop=center"
                        alt="McLaren Engineering"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="mb-2">
                      <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        PERFORMANCE
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-yellow-500 transition-colors duration-300 leading-tight">
                      Engineering the McLaren 720S
                    </h4>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span className="font-medium">Sarah Rodriguez</span>
                      <span>7 min read</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article 2 */}
              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="flex">
                  <div className="w-32 flex-shrink-0">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=300&h=300&fit=crop&crop=center"
                        alt="Volkswagen Beetle"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="mb-2">
                      <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        VINTAGE
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-yellow-500 transition-colors duration-300 leading-tight">
                      Volkswagen Revives the Iconic Beetle
                    </h4>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span className="font-medium">Alex Turner</span>
                      <span>4 min read</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article 3 */}
              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="flex">
                  <div className="w-32 flex-shrink-0">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=300&h=300&fit=crop&crop=center"
                        alt="Muscle Cars"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="mb-2">
                      <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        MUSCLE
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-yellow-500 transition-colors duration-300 leading-tight">
                      Unleashing the Power of Muscle Cars
                    </h4>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span className="font-medium">Emma Clark</span>
                      <span>6 min read</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="flex">
                  <div className="w-32 flex-shrink-0">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=300&h=300&fit=crop&crop=center"
                        alt="Muscle Cars"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="mb-2">
                      <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        MUSCLE
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-yellow-500 transition-colors duration-300 leading-tight">
                      Unleashing the Power of Muscle Cars
                    </h4>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span className="font-medium">Emma Clark</span>
                      <span>6 min read</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="flex">
                  <div className="w-32 flex-shrink-0">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=300&h=300&fit=crop&crop=center"
                        alt="Muscle Cars"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="mb-2">
                      <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        MUSCLE
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-yellow-500 transition-colors duration-300 leading-tight">
                      Unleashing the Power of Muscle Cars
                    </h4>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span className="font-medium">Emma Clark</span>
                      <span>6 min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-3xl p-12 shadow-2xl">
            <h3 className="text-4xl font-black text-black mb-4">
              NEVER MISS A STORY
            </h3>
            <p className="text-lg text-black/80 mb-8 max-w-2xl mx-auto">
              Subscribe to get the latest automotive news, reviews, and
              exclusive content delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-4 focus:ring-white/50 shadow-lg"
              />
              <button className="px-8 py-4 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors duration-300 shadow-lg hover:shadow-xl">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="text-center">
            <h4 className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-4">
              DG-DRIVE
            </h4>
            <p className="text-gray-400 max-w-md mx-auto">
              Premium automotive content for enthusiasts who demand excellence.
            </p>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-gray-500 text-sm">
                © 2024 DG-DRIVE. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DGDriveHomepage;
