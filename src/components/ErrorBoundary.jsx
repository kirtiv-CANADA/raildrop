import { Component } from 'react';

// If any screen crashes, show a friendly message instead of a blank white page.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('RailDrop error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
          <p className="text-lg font-bold text-gray-800">Something went wrong</p>
          <p className="text-sm text-gray-600 mt-1">Please restart the demo.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#FC8019] text-white px-5 py-2 rounded-lg font-semibold"
          >
            Restart demo
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
