const { app, BrowserWindow, screen, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let config = {};

// Config dosya yolu
const configPath = path.join(app.getPath('userData'), 'config.json');

// Config okuma/yazma fonksiyonları
function loadConfig() {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      config = JSON.parse(data);
    }
  } catch (error) {
    console.error('Config okuma hatası:', error);
    config = {};
  }
  return config;
}

function saveConfig() {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Config yazma hatası:', error);
  }
}

// Pencere boyutu presetleri
const windowSizes = {
  compact: { width: 600, height: 500, label: 'Küçük (600x500)' },
  small: { width: 700, height: 580, label: 'Küçük-Orta (700x580)' },
  medium: { width: 900, height: 720, label: 'Orta (900x720)' },
  large: { width: 1100, height: 880, label: 'Büyük (1100x880)' },
  xlarge: { width: 1400, height: 1000, label: 'Çok Büyük (1400x1000)' },
  xxlarge: { width: 1600, height: 1200, label: 'Ekstra Büyük (1600x1200)' }
};

let currentSize = 'small'; // Default size

function setWindowSize(sizeName) {
  if (!mainWindow || !windowSizes[sizeName]) return;
  
  const size = windowSizes[sizeName];
  currentSize = sizeName;
  
  // Pencereyi ortala
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
  
  const x = Math.floor((screenWidth - size.width) / 2);
  const y = Math.floor((screenHeight - size.height) / 2);
  
  mainWindow.setResizable(true);
  mainWindow.setSize(size.width, size.height, true);
  mainWindow.setPosition(x, y, true);
  mainWindow.setResizable(false);
  
  // Kaydet
  config.windowSize = sizeName;
  saveConfig();
  
  createMenu(); // Menüyü güncelle
}

function toggleFullScreen() {
  if (!mainWindow) return;
  
  const isCurrentlyFullScreen = mainWindow.isFullScreen();
  
  if (!isCurrentlyFullScreen) {
    // Tam ekrana geçerken
    mainWindow.setResizable(true);
    mainWindow.setFullScreen(true);
  } else {
    // Tam ekrandan çıkarken
    mainWindow.setFullScreen(false);
    // Kısa bir gecikme sonra resizable'ı kapat
    setTimeout(() => {
      if (mainWindow && !mainWindow.isFullScreen()) {
        mainWindow.setResizable(false);
        // Eski pozisyona geri dön
        const size = windowSizes[currentSize];
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
        const x = Math.floor((screenWidth - size.width) / 2);
        const y = Math.floor((screenHeight - size.height) / 2);
        mainWindow.setSize(size.width, size.height);
        mainWindow.setPosition(x, y);
      }
    }, 100);
  }
  
  createMenu();
}

function toggleAlwaysOnTop() {
  if (!mainWindow) return;
  const isOnTop = mainWindow.isAlwaysOnTop();
  mainWindow.setAlwaysOnTop(!isOnTop);
  config.alwaysOnTop = !isOnTop;
  saveConfig();
  createMenu(); // Menüyü güncelle
}

function createMenu() {
  const isMac = process.platform === 'darwin';
  const isFullScreen = mainWindow?.isFullScreen() || false;
  const isAlwaysOnTop = mainWindow?.isAlwaysOnTop() || false;
  
  const template = [
    {
      label: 'Dosya',
      submenu: [
        isMac ? { role: 'close', label: 'Kapat' } : { role: 'quit', label: 'Çıkış' }
      ]
    },
    {
      label: 'Görünüm',
      submenu: [
        {
          label: 'Her Zaman Üstte',
          type: 'checkbox',
          checked: isAlwaysOnTop,
          click: toggleAlwaysOnTop
        },
        { type: 'separator' },
        {
          label: isFullScreen ? 'Tam Ekrandan Çık' : 'Tam Ekran',
          accelerator: 'F11',
          click: toggleFullScreen
        },
        { type: 'separator' },
        { role: 'reload', label: 'Yeniden Yükle' },
        { role: 'toggleDevTools', label: 'Geliştirici Araçları' }
      ]
    },
    {
      label: 'Pencere Boyutu',
      submenu: Object.entries(windowSizes).map(([key, value]) => ({
        label: value.label,
        type: 'radio',
        checked: currentSize === key,
        click: () => setWindowSize(key)
      }))
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createWindow() {
  // Config'i yükle
  loadConfig();
  
  // Kayıtlı boyutu al
  const savedSize = config.windowSize || 'small';
  currentSize = savedSize;
  
  // Ekran boyutlarını al
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  // Pencere boyutları
  const size = windowSizes[currentSize];
  const windowWidth = size.width;
  const windowHeight = size.height;

  // Ortalamak için koordinatlar hesapla
  const x = Math.floor((screenWidth - windowWidth) / 2);
  const y = Math.floor((screenHeight - windowHeight) / 2);

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    minWidth: 500,
    minHeight: 400,
    x: x,
    y: y,
    alwaysOnTop: config.alwaysOnTop || false,
    title: '',
    icon: path.join(__dirname, '../build/icon.ico'),
    frame: true, // native frame stays so window is draggable
    resizable: false,
    autoHideMenuBar: true, // menü gizli, Alt ile açılır; Dosya > Çıkış kullanılabilir
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Development modunda Vite dev server'a bağlan
  // Production modunda build edilmiş dosyaları yükle
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    // DevTools'u aç (geliştirme sırasında)
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  // Menüyü oluştur
  createMenu();
  
  // IPC handlers
  ipcMain.on('set-window-size', (event, sizeName) => {
    setWindowSize(sizeName);
  });
  
  ipcMain.on('get-window-sizes', (event) => {
    event.returnValue = { sizes: windowSizes, current: currentSize };
  });

  ipcMain.handle('toggle-always-on-top', () => {
    toggleAlwaysOnTop();
    return mainWindow?.isAlwaysOnTop() || false;
  });

  ipcMain.handle('get-always-on-top', () => {
    return mainWindow?.isAlwaysOnTop() || false;
  });
}

// Uygulama hazır olduğunda pencereyi oluştur
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // macOS'ta dock'a tıklandığında pencereyi yeniden oluştur
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Tüm pencereler kapatıldığında uygulamayı kapat (Windows & Linux)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
