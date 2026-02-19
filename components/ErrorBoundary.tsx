import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;
            return (
                <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 min-h-[400px]">
                    <p className="text-lg font-medium mb-2">Something went wrong loading the map.</p>
                    <p className="text-sm text-gray-400 mb-4">{this.state.error?.message}</p>
                    <button
                        type="button"
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="px-4 py-2 bg-[#E53935] text-white rounded hover:opacity-90"
                    >
                        Try again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
