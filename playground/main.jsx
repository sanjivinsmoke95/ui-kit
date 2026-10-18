import { Component, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, ToastProvider } from '../src';
import Gallery from './Gallery';
import './styles.css';

class Boundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() { return this.state.error ? <pre id="render-error" className="whitespace-pre-wrap p-6 text-danger">{String(this.state.error.stack || this.state.error)}</pre> : this.props.children; }
}

createRoot(document.getElementById('root')).render(
  <StrictMode><Boundary>
    <ThemeProvider defaultTheme="blue" storageKey="ui-kit.playground.theme">
      <ToastProvider>
        <Gallery />
      </ToastProvider>
    </ThemeProvider>
  </Boundary></StrictMode>,
);
