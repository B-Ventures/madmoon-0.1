import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare props: ErrorBoundaryProps;
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error('Unhandled render error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xl">
            <h1 className="text-xl font-black text-slate-900 mb-2">
              حدث خطأ غير متوقع / Something went wrong
            </h1>
            <p className="text-sm text-slate-500 mb-6">
              يرجى إعادة تحميل الصفحة والمحاولة مرة أخرى.
              <br />
              Please reload the page and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-3 px-6 rounded-xl text-sm"
            >
              إعادة تحميل / Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
