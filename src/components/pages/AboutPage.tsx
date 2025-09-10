"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About Lightning Shop
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're revolutionizing e-commerce with cutting-edge technology and
            lightning-fast performance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 mb-6">
              To create the fastest, most intuitive shopping experience
              possible. We believe that technology should enhance, not hinder,
              the joy of discovering and purchasing great products.
            </p>
            <p className="text-gray-600">
              Our single-page application architecture ensures instant
              navigation, seamless interactions, and a shopping experience that
              feels like magic.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why Lightning Fast?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm">⚡</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Instant Navigation
                  </h3>
                  <p className="text-gray-600 text-sm">
                    No page reloads, no waiting, just smooth transitions.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm">🚀</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Optimized Performance
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Built with the latest web technologies for maximum speed.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 text-sm">💎</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Premium Experience
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Every interaction is crafted for excellence and delight.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Technology Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                <span className="text-2xl">⚛️</span>
              </div>
              <h3 className="font-semibold text-gray-900">React 19</h3>
              <p className="text-gray-600 text-sm">Latest React features</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                <span className="text-2xl">▲</span>
              </div>
              <h3 className="font-semibold text-gray-900">Next.js 15</h3>
              <p className="text-gray-600 text-sm">App Router & Turbopack</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="font-semibold text-gray-900">Tailwind CSS</h3>
              <p className="text-gray-600 text-sm">Utility-first styling</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                <span className="text-2xl">🗄️</span>
              </div>
              <h3 className="font-semibold text-gray-900">Prisma</h3>
              <p className="text-gray-600 text-sm">Type-safe database</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Experience the Future?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of satisfied customers who have discovered the joy of
            lightning-fast shopping.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Start Shopping
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
