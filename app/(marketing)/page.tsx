import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">
            Picasso Creative
          </h1>
          <p className="text-xl text-purple-200 mb-8">
            AI-Powered Content Creation Platform
          </p>
          <p className="text-lg text-purple-300 max-w-2xl mx-auto mb-8">
            Create consistent characters, generate images and videos, and automate
            your content workflow with AI-powered tools.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-white/10 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/30"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">
              Character Creation
            </h3>
            <p className="text-purple-200">
              Generate consistent character reference images with LoRA support
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">
              Content Generation
            </h3>
            <p className="text-purple-200">
              Create images and videos with AI-powered tools
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">
              Automation
            </h3>
            <p className="text-purple-200">
              Schedule and publish content across multiple platforms
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

