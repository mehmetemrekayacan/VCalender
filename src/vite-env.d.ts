declare module '*.mp3' {
  const src: string;
  export default src;
}

interface WindowSize {
  width: number;
  height: number;
  label: string;
}

interface WindowSizes {
  [key: string]: WindowSize;
}

interface ElectronAPI {
  platform: string;
  versions: {
    node: string;
    chrome: string;
    electron: string;
  };
  setWindowSize: (sizeName: string) => void;
  getWindowSizes: () => { sizes: WindowSizes; current: string };
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
