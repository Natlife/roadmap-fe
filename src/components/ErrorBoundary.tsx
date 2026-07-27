import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

// App-level boundary that sits ABOVE the router. Catches render errors in the
// provider stack (theme, query client, auth) that route error elements can't.
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('App crashed:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#09090b',
            color: '#fafafa',
            fontFamily: 'Inter, system-ui, sans-serif',
            padding: 24
          }}
        >
          <div style={{ maxWidth: 640, width: '100%', border: '1px solid #27272a', borderRadius: 12, padding: 24 }}>
            <h2 style={{ margin: 0, color: '#f87171' }}>Application error</h2>
            <p style={{ color: '#a1a1aa' }}>The app failed to render. Details below:</p>
            <pre style={{ whiteSpace: 'pre-wrap', color: '#fca5a5', fontFamily: 'Roboto Mono, monospace', fontSize: 13 }}>
              {this.state.error.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{ marginTop: 8, padding: '8px 16px', borderRadius: 8, border: '1px solid #27272a', background: '#7c6cf0', color: '#fff', cursor: 'pointer' }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
