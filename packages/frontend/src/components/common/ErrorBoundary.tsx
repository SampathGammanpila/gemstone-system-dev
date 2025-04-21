import React, { Component, ErrorInfo, ReactNode } from 'react'
import Button from './ui/Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
    this.setState({ errorInfo })
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-white rounded-lg shadow-sm border border-secondary-200">
          <div className="text-center max-w-lg">
            <svg
              className="w-16 h-16 text-danger-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">Something went wrong</h2>
            <p className="text-secondary-600 mb-6">
              We've encountered an error in this component. You can try reloading the page or
              resetting the component.
            </p>
            
            {/* Show error details in development environment */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-4">
                <details className="cursor-pointer">
                  <summary className="text-sm font-medium text-secondary-700 mb-2">
                    Error Details (Development Only)
                  </summary>
                  <div className="text-left p-4 bg-secondary-50 rounded-md text-sm overflow-auto max-h-60">
                    <p className="font-bold mb-2">{this.state.error.toString()}</p>
                    <pre className="text-xs text-secondary-700 whitespace-pre-wrap">
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </div>
                </details>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => window.location.reload()}>Reload Page</Button>
              <Button variant="outline" onClick={this.handleReset}>
                Reset Component
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary