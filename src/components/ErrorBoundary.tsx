import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('Application error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
          <p className="text-gray-600">Please refresh the page to try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-brand-600 px-6 py-2 font-medium text-white transition hover:bg-brand-700"
          >
            Refresh
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
