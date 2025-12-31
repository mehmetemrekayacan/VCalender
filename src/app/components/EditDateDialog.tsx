import { useState } from 'react';
import { X } from 'lucide-react';

interface EditDateDialogProps {
  month: number;
  day: number;
  year: number;
  currentNote?: string;
  currentType?: 'anniversary' | 'birthday' | 'firstMeeting' | 'memory' | 'valentine' | null;
  currentSticker?: string;
  onSave: (
    type: 'anniversary' | 'birthday' | 'firstMeeting' | 'memory' | 'valentine' | null,
    note: string,
    sticker: string | null,
  ) => void;
  onClose: () => void;
}

const monthNames = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export function EditDateDialog({ month, day, year, currentNote = '', currentType = null, onSave, onClose, currentSticker }: EditDateDialogProps) {
  const [selectedType, setSelectedType] = useState<EditDateDialogProps['currentType']>(currentType);
  const [note, setNote] = useState(currentNote);
  const [sticker, setSticker] = useState<string | null>(currentSticker || null);

  const handleSave = () => {
    onSave(selectedType, note, sticker);
    onClose();
  };

  const types = [
    { value: 'anniversary' as const, label: 'Yıldönümümüz', color: '#ff4d6d' },
    { value: 'birthday' as const, label: 'Doğum Günü', color: '#ffd60a' },
    { value: 'firstMeeting' as const, label: 'İlk Buluşma', color: '#06ffa5' },
    { value: 'memory' as const, label: 'Özel Anı', color: '#ff006e' },
    { value: 'valentine' as const, label: 'Sevgililer Günü', color: '#ff0054' },
  ];

  const stickers = ['❤️', '🎁', '🌸', '✨', '💍', '🎂'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4 sm:p-5 w-full max-w-[420px] max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg mb-0.5">Tarihi Düzenle</h2>
            <p className="text-xs text-neutral-400">
              {monthNames[month - 1]} {day}, {year}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Type Selection */}
          <div>
            <label className="block text-xs text-neutral-400 mb-2">Özel Gün Olarak İşaretle</label>
            <div className="space-y-1.5">
              {types.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(selectedType === type.value ? null : type.value)}
                  className={`w-full p-2 rounded-lg border transition-all flex items-center gap-2 text-sm ${
                    selectedType === type.value
                      ? 'border-2 bg-neutral-800'
                      : 'border-neutral-700 bg-neutral-800/30 hover:bg-neutral-800/50'
                  }`}
                  style={{
                    borderColor: selectedType === type.value ? type.color : undefined,
                  }}
                >
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: type.color }}
                  />
                  <span>{type.label}</span>
                </button>
              ))}
              
              {selectedType && (
                <button
                  onClick={() => setSelectedType(null)}
                  className="w-full p-2 rounded-lg border border-neutral-700 bg-neutral-800/30 hover:bg-neutral-800/50 transition-all text-neutral-400 text-sm"
                >
                  Özel İşareti Kaldır
                </button>
              )}
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-xs text-neutral-400 mb-1.5">Not Ekle (isteğe bağlı)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Romantik bir not, anı veya hatırlatma ekleyin..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500 resize-none"
              rows={2}
            />
          </div>

          {/* Sticker Selection */}
          <div>
            <label className="block text-xs text-neutral-400 mb-2">Sticker / Emoji (isteğe bağlı)</label>
            <div className="flex flex-wrap gap-2">
              {stickers.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSticker(sticker === emoji ? null : emoji)}
                  className={`px-3 py-2 rounded-lg border transition-all text-lg ${
                    sticker === emoji
                      ? 'border-2 border-pink-400 bg-neutral-800'
                      : 'border-neutral-700 bg-neutral-800/30 hover:bg-neutral-800/50'
                  }`}
                >
                  {emoji}
                </button>
              ))}
              {sticker && (
                <button
                  onClick={() => setSticker(null)}
                  className="px-3 py-2 rounded-lg border border-neutral-700 bg-neutral-800/30 hover:bg-neutral-800/50 text-xs text-neutral-400"
                >
                  Stickerı Kaldır
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 text-sm rounded-lg border border-neutral-700 hover:bg-neutral-800/50 transition-all"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 text-sm rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 transition-all"
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
