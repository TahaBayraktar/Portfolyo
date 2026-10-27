# Taha Bayraktar — Portföy

Kişisel portföy sitesi: [tahabayraktar.com](https://tahabayraktar.com)

- **Teknolojiler:** React 19, Vite, Tailwind CSS, Motion (Framer Motion)
- **İçerik:** Tüm metin, proje ve görseller [PortfoyJson](https://github.com/TahaBayraktar/PortfoyJson) reposundan (`KendiniTanit_xx.json`, `Proje_xx.json`, `Iletisim_xx.json`) çekilir. İçeriği güncellemek için kod değişikliği gerekmez.
- **Arayüz metinleri:** `src/i18n.js` (TR / EN)
- **Tema:** Açık / koyu / sistem + vurgu rengi seçici; renkler `src/index.css` içindeki CSS değişkenlerinde.

```bash
npm install
npm run dev     # geliştirme
npm run build   # üretim derlemesi
```

Vercel'e `main` dalına push edildiğinde otomatik yayınlanır.
