import { useRouteError, isRouteErrorResponse, Link, useNavigate } from 'react-router-dom'
import { Home, RefreshCw, ChevronLeft, AlertTriangle, ServerCrash } from 'lucide-react'

export default function ErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()

  // Determine error type and message
  let status = null
  let title = 'Something went wrong'
  let description = 'An unexpected error occurred. Our team has been notified.'

  if (isRouteErrorResponse(error)) {
    status = error.status
    if (error.status === 404) {
      title = 'Page not found'
      description = "We couldn't find the page you're looking for. It may have moved or been removed."
    } else if (error.status === 401) {
      title = 'Not authorized'
      description = "You don't have permission to view this page. Please sign in and try again."
    } else if (error.status === 503) {
      title = 'Service unavailable'
      description = 'The service is temporarily unavailable. Please try again in a moment.'
    } else {
      description = error.data?.message || error.statusText || description
    }
  } else if (error instanceof Error) {
    description = import.meta.env.DEV ? error.message : description
  }

  const is404 = status === 404

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Minimal header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-navy-900 text-xl w-fit">
          <div className="w-8 h-8 bg-navy-800 rounded-lg flex items-center justify-center">
            <Home size={18} className="text-white" />
          </div>
          <span>FSBO<span className="text-accent-500">Market</span></span>
        </Link>
      </header>

      {/* Error content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
              is404 ? 'bg-navy-100' : 'bg-red-100'
            }`}>
              {is404
                ? <AlertTriangle size={36} className="text-navy-600" />
                : <ServerCrash size={36} className="text-red-500" />
              }
            </div>
          </div>

          {/* Status code */}
          {status && (
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Error {status}
            </p>
          )}

          {/* Title */}
          <h1 className="text-3xl font-bold text-navy-900 mb-3">{title}</h1>

          {/* Description */}
          <p className="text-gray-500 mb-8 leading-relaxed">{description}</p>

          {/* Dev-only error stack */}
          {import.meta.env.DEV && error instanceof Error && error.stack && (
            <details className="text-left mb-8 bg-gray-900 rounded-xl overflow-hidden">
              <summary className="px-4 py-2 text-xs text-gray-400 cursor-pointer hover:text-gray-300 font-mono">
                Stack trace
              </summary>
              <pre className="px-4 pb-4 text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {error.stack}
              </pre>
            </details>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={16} />
              Go back
            </button>
            {!is404 && (
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <RefreshCw size={16} />
                Try again
              </button>
            )}
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-navy-800 text-white rounded-lg text-sm font-medium hover:bg-navy-900 transition-colors"
            >
              <Home size={16} />
              Go home
            </Link>
          </div>

          {/* Listings shortcut on 404 */}
          {is404 && (
            <p className="mt-6 text-sm text-gray-400">
              Looking for a home?{' '}
              <Link to="/listings" className="text-navy-700 hover:text-navy-900 font-medium">
                Browse all listings →
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
