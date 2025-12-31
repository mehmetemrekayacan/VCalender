import { useState, useEffect } from 'react';
import { Monitor, ChevronDown } from 'lucide-react';

interface WindowSize {
  width: number;
  height: number;
  label: string;
}

interface WindowSizes {
  [key: string]: WindowSize;
}

export function WindowSizeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [sizes, setSizes] = useState<WindowSizes>({});
  const [currentSize, setCurrentSize] = useState<string>('small');

  useEffect(() => {
    // Electron API'den pencere boyutlarını al
    if (window.electronAPI) {
      const data = window.electronAPI.getWindowSizes();
      setSizes(data.sizes);
      setCurrentSize(data.current);
    }
  }, []);

  const handleSizeChange = (sizeName: string) => {
    if (window.electronAPI) {
      window.electronAPI.setWindowSize(sizeName);
      setCurrentSize(sizeName);
      setIsOpen(false);
    }
  };

  if (!window.electronAPI || Object.keys(sizes).length === 0) {
    return null; // Electron ortamında değilse gösterme
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-all text-sm"
      >
        <Monitor className="w-4 h-4" />
        <span>{sizes[currentSize]?.label || 'Boyut'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl overflow-hidden min-w-[200px] z-50">
          {Object.entries(sizes).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleSizeChange(key)}
              className={`w-full text-left px-4 py-2 hover:bg-neutral-800 transition-colors text-sm ${
                currentSize === key ? 'bg-neutral-800 text-white' : 'text-neutral-300'
              }`}
            >
              {value.label}
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
