import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="center"><div className="card state" role="alert">
        <h2>Unexpected error</h2><p className="muted">{this.state.error.message}</p>
        <button className="btn primary" onClick={() => { this.setState({ error: null }); window.location.assign('/'); }}>Go home</button>
      </div></div>
    );
  }
}
