interface MonthData {
  month: number;
  color: string;
  accentColor: string;
}

interface MonthSelectorProps {
  months: MonthData[];
  currentMonth: number;
  onSelectMonth: (index: number) => void;
  onClose: () => void;
}

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function MonthSelector({ months, currentMonth, onSelectMonth, onClose }: MonthSelectorProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={onClose}>
      <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 text-center">
          <h2 className="text-3xl mb-2">Select Month</h2>
          <p className="text-neutral-400">Jump to any month of your journey</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {months.map((monthData, index) => (
            <button
              key={index}
              onClick={() => {
                onSelectMonth(index);
                onClose();
              }}
              className={`
                p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group
                ${currentMonth === index 
                  ? 'border-2 scale-105 shadow-2xl' 
                  : 'border-neutral-700 hover:border-neutral-500 hover:scale-105'
                }
              `}
              style={{
                borderColor: currentMonth === index ? monthData.accentColor : undefined,
                background: currentMonth === index 
                  ? `linear-gradient(135deg, ${monthData.color}20, ${monthData.accentColor}10)`
                  : 'rgba(23, 23, 23, 0.5)'
              }}
            >
              <div className="relative z-10">
                <div className="text-3xl mb-2">{monthNames[index]}</div>
                <div className="text-sm text-neutral-400">2026</div>
              </div>

              {/* Decorative gradient */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
                style={{
                  background: `radial-gradient(circle at center, ${monthData.accentColor}, transparent)`
                }}
              />
            </button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            Press ESC or click outside to close
          </button>
        </div>
      </div>
    </div>
  );
}
