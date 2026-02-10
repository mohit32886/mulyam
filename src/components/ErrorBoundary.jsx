import { Component } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

/**
 * Error Boundary component that catches JavaScript errors anywhere in the child
 * component tree, logs those errors, and displays a fallback UI.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Store error info in state for display
    this.setState({ errorInfo })

    // In production, you could send the error to an error reporting service
    // Example: logErrorToService(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // Check if it's an admin page error
      const isAdminPage = window.location.pathname.startsWith('/admin')

      return (
        <div
          className={`min-h-screen flex items-center justify-center p-4 ${
            isAdminPage ? 'bg-[#0a0a0f]' : 'bg-gray-50'
          }`}
        >
          <div
            className={`max-w-md w-full text-center p-8 rounded-xl ${
              isAdminPage
                ? 'bg-[#12121a] border border-[#2a2a35]'
                : 'bg-white shadow-lg'
            }`}
          >
            <div
              className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${
                isAdminPage ? 'bg-red-500/10' : 'bg-red-100'
              }`}
            >
              <AlertTriangle
                className={`w-8 h-8 ${isAdminPage ? 'text-red-400' : 'text-red-600'}`}
              />
            </div>

            <h1
              className={`text-xl font-semibold mb-2 ${
                isAdminPage ? 'text-white' : 'text-gray-900'
              }`}
            >
              Something went wrong
            </h1>

            <p className={isAdminPage ? 'text-neutral-400' : 'text-gray-600'}>
              {this.props.fallbackMessage ||
                "We're sorry, but something unexpected happened. Please try again."}
            </p>

            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div
                className={`mt-4 p-3 rounded-lg text-left text-xs overflow-auto max-h-32 ${
                  isAdminPage
                    ? 'bg-red-500/10 text-red-300'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                <pre className="whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isAdminPage
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-coral hover:bg-coral-dark text-white'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>

              <button
                onClick={this.handleGoHome}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isAdminPage
                    ? 'bg-[#2a2a35] hover:bg-[#3a3a45] text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Higher-order component to wrap any component with an error boundary
 * @param {Component} WrappedComponent - The component to wrap
 * @param {string} fallbackMessage - Optional custom error message
 */
export function withErrorBoundary(WrappedComponent, fallbackMessage) {
  return function WithErrorBoundaryWrapper(props) {
    return (
      <ErrorBoundary fallbackMessage={fallbackMessage}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    )
  }
}

export default ErrorBoundary
