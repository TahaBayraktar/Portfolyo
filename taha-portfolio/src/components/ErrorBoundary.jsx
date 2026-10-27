import { Component } from "react";

// Beklenmeyen bir hatada siyah ekran yerine yenileme seçeneği gösterir.
// Context'e erişemeyebileceği için metinler iki dilde sabit yazılmıştır.
export default class ErrorBoundary extends Component {
  state = { hata: null };

  static getDerivedStateFromError(hata) {
    return { hata };
  }

  componentDidCatch(hata, bilgi) {
    console.error("Uygulama hatası:", hata, bilgi.componentStack);
  }

  render() {
    if (!this.state.hata) return this.props.children;
    return (
      <div className="grid min-h-[100svh] place-items-center px-4 text-center">
        <div>
          <p className="font-mono text-sm text-accent">$ error</p>
          <p className="mt-3 text-lg font-semibold">Bir şeyler ters gitti · Something went wrong</p>
          <p className="mt-2 text-sm text-muted">
            Tarayıcı çevirisi açıksa kapatıp sayfayı yenileyin. · If browser translation is on, turn it off and reload.
          </p>
          <button onClick={() => window.location.reload()} className="buton-ana mt-6">
            Yenile · Reload
          </button>
        </div>
      </div>
    );
  }
}
