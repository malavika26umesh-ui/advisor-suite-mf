import { Component, type ErrorInfo, type ReactNode } from "react";
import { Card, Button } from "./ui";
import { WarningCircle } from "@phosphor-icons/react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
          <Card className="max-w-md w-full py-12 px-8 flex flex-col items-center">
            <WarningCircle size={48} className="text-warning-500 mb-4" />
            <h2 className="text-xl font-semibold text-brand-navy mb-2">Something went wrong</h2>
            <p className="text-neutral-600 mb-6">
              We encountered an unexpected error while loading this page.
            </p>
            <Button variant="primary" onClick={this.handleReload}>
              Reload page
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
