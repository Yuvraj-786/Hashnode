import { Component } from 'react';
import ErrorPage from '../pages/ErrorPage';

/** Catches render errors in any page and shows the reusable 500 UI. */
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('UI error:', error, info);
  }

  render() {
    const { error } = this.state;
    if (error) return <ErrorPage error={error} onRetry={() => this.setState({ error: null })} />;
    return this.props.children;
  }
}
