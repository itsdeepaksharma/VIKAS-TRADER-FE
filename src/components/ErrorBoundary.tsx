import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Unhandled UI error', { error, errorInfo });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-vt-beige-light px-6">
          <div className="rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <h1 className="text-xl font-semibold text-slate-900">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-600">Please refresh the page and try again.</p>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
