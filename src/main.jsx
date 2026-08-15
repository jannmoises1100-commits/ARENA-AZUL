import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("ARENA AZUL — error no capturado:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh", display: "grid", placeItems: "center", padding: 24,
            background: "#F8FAFC", color: "#1E293B", fontFamily: "system-ui, sans-serif",
            textAlign: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              Algo falló en la app
            </div>
            <div style={{ fontSize: 14, color: "#64748B", marginBottom: 16 }}>
              Ocurrió un error inesperado. Recarga la página para continuar.
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: "#2563EB", color: "#fff", border: "none", borderRadius: 12,
                padding: "10px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer",
              }}
            >
              Recargar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
