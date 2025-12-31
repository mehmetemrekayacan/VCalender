# Takvim - Responsive Windows Uygulaması

## Yeni Özellikler

### 🎨 Responsive Tasarım
Uygulama artık farklı pencere boyutlarına otomatik olarak uyum sağlar:

- **Küçük (600x500)**: Kompakt görünüm, tüm önemli bilgiler korunur
- **Küçük-Orta (700x580)**: Varsayılan boyut, dengeli görünüm
- **Orta (900x720)**: Daha geniş ve rahat kullanım
- **Büyük (1100x880)**: Büyük ekranlar için optimize edilmiş
- **Çok Büyük (1400x1000)**: Maksimum detay ve görünürlük
- **Ekstra Büyük (1600x1200)**: Ultra geniş ekranlar için

### 📐 Otomatik Pencere Boyutu Seçimi
- **Menü Çubuğu**: `Pencere Boyutu` menüsünden istediğiniz boyutu seçebilirsiniz
- **UI Seçici**: Alt navigasyon barında pencere boyutu seçici butonu
- **Otomatik Kayıt**: Seçtiğiniz boyut otomatik olarak kaydedilir
- **F11**: Tam ekran modu

### 🎯 Responsive Özellikler

#### Küçük Ekranlarda (< 650px):
- Dikey layout (resim üstte, takvim altta)
- Kompakt butonlar ve yazı boyutları
- Alıntı bölümü gizlenir (alan tasarrufu)
- Tek harfli gün adları (P, S, Ç, vb.)

#### Orta Ekranlarda (650-900px):
- Yan yana layout (resim 40%, takvim 60%)
- Orta boy yazı ve butonlar
- Alıntı görünür

#### Büyük Ekranlarda (> 900px):
- Geniş layout (resim 33%, takvim 67%)
- Tam boyut tüm elementler
- Detaylı hover efektleri

## Kullanım

### Geliştirme Modu
```bash
npm run electron:dev
```

### Production Build
```bash
npm run electron:build
```

## Teknik Detaylar

### Eklenen/Güncellenen Dosyalar:

1. **electron/main.cjs**
   - Pencere boyutu presetleri
   - Menü sistemi (Türkçe)
   - IPC handlers
   - electron-store entegrasyonu
   - "Her Zaman Üstte" toggle
   - Tam ekran desteği

2. **electron/preload.cjs**
   - electronAPI exposure
   - IPC bridge fonksiyonları

3. **src/app/components/WindowSizeSelector.tsx** (YENİ)
   - UI-based pencere boyutu seçici
   - Dropdown menu
   - Aktif boyut göstergesi

4. **src/app/components/CalendarMonth.tsx**
   - Responsive layout sistemi
   - Window resize listener
   - Breakpoint-based styling
   - Dinamik grid gaps ve padding

5. **src/app/App.tsx**
   - WindowSizeSelector entegrasyonu
   - Responsive navigasyon bar
   - Window resize tracking

6. **src/vite-env.d.ts**
   - ElectronAPI TypeScript tanımları
   - Global window interface

### Bağımlılıklar
- `electron-store`: Kullanıcı tercihlerini kaydetmek için

## Özellik Listesi

✅ 6 farklı pencere boyutu preset
✅ Menü tabanlı boyut değiştirme
✅ UI tabanlı boyut seçici
✅ Otomatik boyut kaydı
✅ Responsive layout (3 breakpoint)
✅ Tam ekran desteği (F11)
✅ Her zaman üstte toggle
✅ Merkezi pencere konumlandırma
✅ Smooth transitions
✅ TypeScript type safety

## Kısayol Tuşları

- **F11**: Tam ekran toggle
- **←/→**: Ay gezinme
- **ESC**: Dialog kapat

## Not

Pencere boyutu değişikliği yalnızca preset boyutlar arasında çalışır. Manuel resize devre dışıdır (daha tutarlı UX için).
