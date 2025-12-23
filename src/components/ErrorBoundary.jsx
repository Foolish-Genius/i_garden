import React from 'react';
import { captureException } from '../monitoring';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    captureException(error);
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-6">We're tracking this error and will look into it.</p>
          <button onClick={this.handleReload} className="px-4 py-2 bg-accent-primary text-white rounded">Reload</button>
        </div>
      );
    }

    return this.props.children;
  }
}