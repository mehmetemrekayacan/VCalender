import { useState, useEffect, useMemo } from 'react';
import { CalendarMonth } from './components/CalendarMonth';
import { EditDateDialog } from './components/EditDateDialog';
import { MonthSelector } from './components/MonthSelector';
import { ChevronLeft, ChevronRight, Calendar, Download, Edit3, Grid3x3, BellRing, Pin, PinOff } from 'lucide-react';
import { useBackgroundMusic } from './hooks/useBackgroundMusic';

// Monthly images
import ocakImage from '../images/ocak.png';
import subatImage from '../images/şubat.png';
import martImage from '../images/mart.png';
import nisanImage from '../images/nisan.png';
import mayisImage from '../images/mayis.png';
import haziranImage from '../images/haziran.png';
import temmuzImage from '../images/temmuz.png';
import agustosImage from '../images/agustos.png';
import eylulImage from '../images/eylul.png';
import ekimImage from '../images/ekim.png';
import kasimImage from '../images/kasim.png';
import aralikImage from '../images/aralik.png';

interface SpecialDate {
  day: number;
  type: 'anniversary' | 'birthday' | 'firstMeeting' | 'memory' | 'valentine';
  note?: string;
  sticker?: string;
}

interface MonthData {
  month: number;
  year: number;
  imageUrl: string;
  imagePosition?: string;
  quote: string;
  specialDates: SpecialDate[];
  color: string;
  accentColor: string;
}

const getSeasonalColors = (month: number) => {
  // Group months by season and return consistent palette for each
  if (month === 12 || month === 1 || month === 2) {
    return { color: '#1e3a8a', accentColor: '#bfdbfe' }; // Winter: dark blue + light blue
  }
  if (month === 3 || month === 4 || month === 5) {
    return { color: '#ec4899', accentColor: '#86efac' }; // Spring: pink + light green
  }
  if (month === 6 || month === 7 || month === 8) {
    return { color: '#0891b2', accentColor: '#fde047' }; // Summer: turquoise + yellow
  }
  return { color: '#15803d', accentColor: '#be123c' }; // Autumn: dark green + burgundy
};

const getTypeLabel = (type: SpecialDate['type']) => {
  switch (type) {
    case 'anniversary': return 'Yıldönümü';
    case 'birthday': return 'Doğum Günü';
    case 'firstMeeting': return 'İlk Buluşma';
    case 'memory': return 'Anı';
    case 'valentine': return 'Sevgililer Günü';
  }
};

export default function App() {
  const [currentMonth, setCurrentMonth] = useState(0); // 0-11 for Jan-Dec
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [editingDate, setEditingDate] = useState<{ month: number; day: number } | null>(null);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);

  // Track window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch always-on-top status from main (if available)
  useEffect(() => {
    const api = (window as any).electronAPI;
    if (api?.getAlwaysOnTop) {
      api.getAlwaysOnTop().then((value: boolean) => setIsAlwaysOnTop(value)).catch(() => {});
    }
  }, []);

  // Background music - plays quietly in the background
  useBackgroundMusic(0.15);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingDate) return; // Don't navigate if dialog is open
      
      if (e.key === 'ArrowLeft' && currentMonth > 0) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentMonth(prev => Math.max(0, prev - 1));
          setTimeout(() => setIsTransitioning(false), 50);
        }, 150);
      } else if (e.key === 'ArrowRight' && currentMonth < 11) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentMonth(prev => Math.min(11, prev + 1));
          setTimeout(() => setIsTransitioning(false), 50);
        }, 150);
      } else if (e.key === 'Escape') {
        setEditingDate(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingDate, currentMonth]);

  // Initialize monthsData from localStorage or default values
  const getInitialMonthsData = (): MonthData[] => {
    // Version kontrolü - renk güncellemesi için
    const dataVersion = localStorage.getItem('calendarDataVersion');
    const currentVersion = '3.1'; // Mevsimsel renkler versiyonu - 4 mevsim
    
    const savedData = localStorage.getItem('calendarMonthsData');
    if (savedData) {
      try {
        const parsed: MonthData[] = JSON.parse(savedData);
        const normalized = parsed.map((m) => ({
          ...m,
          ...getSeasonalColors(m.month),
        }));
        // Persist normalized colors and bump version
        localStorage.setItem('calendarMonthsData', JSON.stringify(normalized));
        localStorage.setItem('calendarDataVersion', currentVersion);
        return normalized;
      } catch (e) {
        console.error('Failed to parse saved data:', e);
      }
    }
    
    // Yeni versiyon - localStorage'i güncelle
    localStorage.setItem('calendarDataVersion', currentVersion);
    
    // Mevsim renkleri:
    // KIŞ (Aralık, Ocak, Şubat): Mavi-Beyaz
    // İLKBAHAR (Mart, Nisan, Mayıs): Pembe-Açık Yeşil
    // YAZ (Haziran, Temmuz, Ağustos): Turkuaz-Sarı
    // SONBAHAR (Eylül, Ekim, Kasım): Koyu Yeşil-Bordo
    
    // Default data
    return [
    // OCAK - KIŞ
    {
      month: 1,
      year: 2026,
      imageUrl: ocakImage,
      imagePosition: 'center center',
      quote: 'Mesafe, birisi çok şey ifade ettiğinde çok az şey ifade eder.',
      specialDates: [],
      ...getSeasonalColors(1),
    },
    // ŞUBAT - KIŞ
    {
      month: 2,
      year: 2026,
      imageUrl: subatImage,
      imagePosition: 'center 30%',
      quote: 'İki yerde varoluyorum, burada ve senin olduğun yerde.',
      specialDates: [],
      ...getSeasonalColors(2),
    },
    // MART - İLKBAHAR
    {
      month: 3,
      year: 2026,
      imageUrl: martImage,
      imagePosition: 'center center',
      quote: 'Her aşk hikayesi güzeldir, ama bizimki benim favorim.',
      specialDates: [],
      ...getSeasonalColors(3),
    },
    // NİSAN - İLKBAHAR
    {
      month: 4,
      year: 2026,
      imageUrl: nisanImage,
      imagePosition: 'center 20%',
      quote: 'Ait olduğum yer senin kollarındır, aramızdaki kilometreler önemli değil.',
      specialDates: [],
      ...getSeasonalColors(4),
    },
    // MAYIS - İLKBAHAR
    {
      month: 5,
      year: 2026,
      imageUrl: mayisImage,
      imagePosition: 'center 20%',
      quote: 'Sen benim bugünüm ve tüm yarınlarımsın.',
      specialDates: [],
      ...getSeasonalColors(5),
    },
    // HAZİRAN - YAZ
    {
      month: 6,
      year: 2026,
      imageUrl: haziranImage,
      imagePosition: 'center 20%',
      quote: 'Birlikte olmak benim en sevdiğim yer.',
      specialDates: [],
      ...getSeasonalColors(6),
    },
    // TEMMUZ - YAZ
    {
      month: 7,
      year: 2026,
      imageUrl: temmuzImage,
      imagePosition: 'center center',
      quote: 'Vedaç sonsuz değildir. Bir son değildirler; sadece yeniden karşılaşana kadar seni özleyeceğim anlamına gelirler.',
      specialDates: [],
      ...getSeasonalColors(7),
    },
    // AĞUSTOS - YAZ
    {
      month: 8,
      year: 2026,
      imageUrl: agustosImage,
      imagePosition: 'center 20%',
      quote: 'Senin kalbini benimle taşıyorum. Onu kalbimde taşıyorum.',
      specialDates: [],
      ...getSeasonalColors(8),
    },
    // EYLÜL - SONBAHAR
    {
      month: 9,
      year: 2026,
      imageUrl: eylulImage,
      imagePosition: 'center center',
      quote: 'Hayatta tutunulacak en iyi şey birbirimizdir.',
      specialDates: [],
      ...getSeasonalColors(9),
    },
    // EKİM - SONBAHAR
    {
      month: 10,
      year: 2026,
      imageUrl: ekimImage,
      imagePosition: 'center center',
      quote: 'Seni sadece olduğun için değil, seninle birlikte olduğumda ne olduğum için seviyorum.',
      specialDates: [],
      ...getSeasonalColors(10),
    },
    // KASIM - SONBAHAR
    {
      month: 11,
      year: 2026,
      imageUrl: kasimImage,
      imagePosition: 'center 20%',
      quote: 'Gözlerine baktığımda geleceğimi görüyorum.',
      specialDates: [],
      ...getSeasonalColors(11),
    },
    // ARALIK - KIŞ
    {
      month: 12,
      year: 2026,
      imageUrl: aralikImage,
      imagePosition: 'center center',
      quote: 'Güzel hikayemizin bir yılına daha.',
      specialDates: [],
      ...getSeasonalColors(12),
    }
    ];
  };

  const [monthsData, setMonthsData] = useState<MonthData[]>(getInitialMonthsData);

  // Save to localStorage whenever monthsData changes
  useEffect(() => {
    localStorage.setItem('calendarMonthsData', JSON.stringify(monthsData));
  }, [monthsData]);

  const handleEditDate = (month: number, day: number) => {
    setEditingDate({ month, day });
  };

  const handleSaveDate = (
    type: 'anniversary' | 'birthday' | 'firstMeeting' | 'memory' | 'valentine' | null,
    note: string,
    sticker: string | null,
  ) => {
    if (!editingDate) return;

    setMonthsData(prev => prev.map(monthData => {
      if (monthData.month !== editingDate.month) return monthData;

      const newSpecialDates = monthData.specialDates.filter(sd => sd.day !== editingDate.day);
      
      if (type) {
        newSpecialDates.push({
          day: editingDate.day,
          type,
          note: note || undefined,
          sticker: sticker || undefined,
        });
      }

      return {
        ...monthData,
        specialDates: newSpecialDates.sort((a, b) => a.day - b.day)
      };
    }));
  };

  const currentMonthData = monthsData[currentMonth];
  const editingDateData = editingDate 
    ? monthsData.find(m => m.month === editingDate.month)?.specialDates.find(sd => sd.day === editingDate.day)
    : null;

  const handlePrint = () => {
    window.print();
  };

  const nextSpecial = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();

    let best: { day: number; month: number; type: SpecialDate['type']; inDays: number } | null = null;

    monthsData.forEach((m) => {
      m.specialDates.forEach((sd) => {
        const targetThisYear = new Date(currentYear, m.month - 1, sd.day);
        let target = targetThisYear;
        if (target < today) {
          target = new Date(currentYear + 1, m.month - 1, sd.day);
        }
        const diffMs = target.getTime() - today.getTime();
        const inDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        if (best === null || inDays < best.inDays) {
          best = { day: sd.day, month: m.month, type: sd.type, inDays };
        }
      });
    });

    return best;
  }, [monthsData]);

  const togglePin = async () => {
    const api = (window as any).electronAPI;
    if (api?.toggleAlwaysOnTop) {
      try {
        const value = await api.toggleAlwaysOnTop();
        setIsAlwaysOnTop(value);
      } catch (err) {
        setIsAlwaysOnTop(prev => !prev);
      }
    } else {
      setIsAlwaysOnTop(prev => !prev);
    }
  };

  // Show daily notification for today's special dates (once per day)
  useEffect(() => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const key = `notified-${today.toISOString().slice(0, 10)}`;
    if (localStorage.getItem(key)) return;

    const monthData = monthsData.find(m => m.month === month);
    if (!monthData) return;
    const todaySpecials = monthData.specialDates.filter(sd => sd.day === day);
    if (todaySpecials.length === 0) return;

    const showNotification = () => {
      const labels = todaySpecials.map(sd => getTypeLabel(sd.type)).join(', ');
      new Notification('Takvim', {
        body: `${day} ${monthNames[month - 1]}: ${labels}`,
      });
      localStorage.setItem(key, '1');
    };

    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      showNotification();
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') showNotification();
      });
    }
  }, [monthsData]);
  
  // Responsive breakpoints
  const isCompact = windowSize.width < 650;
  const isSmall = windowSize.width >= 650 && windowSize.width < 900;

  return (
    <div className="h-screen bg-black text-white overflow-hidden">
      {/* Calendar Content */}
      <div className="h-full overflow-y-auto scrollbar-hide">
        <div 
          className="transition-all duration-300 ease-out"
          style={{
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'scale(0.98) translateY(10px)' : 'scale(1) translateY(0)',
          }}
        >
          <CalendarMonth 
            data={currentMonthData} 
            onEditDate={handleEditDate}
          />
        </div>
      </div>

      {/* Edit Dialog */}
      {editingDate && (
        <EditDateDialog
          month={editingDate.month}
          day={editingDate.day}
          year={2026}
          currentNote={editingDateData?.note}
          currentSticker={editingDateData?.sticker}
          currentType={editingDateData?.type}
          onSave={handleSaveDate}
          onClose={() => setEditingDate(null)}
        />
      )}

      {/* Navigation Buttons - Fixed at bottom */}
      <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center bg-neutral-900/90 backdrop-blur-sm rounded-full shadow-2xl print:hidden ${
        isCompact ? 'gap-2 px-3 py-1.5' : 'gap-3 px-4 py-2'
      }`}>
        <button
          onClick={() => {
            setIsTransitioning(true);
            setTimeout(() => {
              setCurrentMonth(prev => Math.max(0, prev - 1));
              setTimeout(() => setIsTransitioning(false), 50);
            }, 150);
          }}
          disabled={currentMonth === 0}
          className={`rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all ${
            isCompact ? 'p-1.5' : 'p-2'
          }`}
        >
          <ChevronLeft className={isCompact ? 'w-3 h-3' : 'w-4 h-4'} />
        </button>
        
        <span className={`text-neutral-400 min-w-[60px] text-center ${
          isCompact ? 'text-xs' : 'text-sm'
        }`}>
          {currentMonth + 1} / 12
        </span>

        {nextSpecial && !isCompact && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800/80 text-sm text-neutral-200 border border-neutral-700/80">
            <BellRing className="w-4 h-4 text-amber-300" />
            <span className="whitespace-nowrap">{getTypeLabel(nextSpecial.type)}</span>
            <span className="text-neutral-400 text-xs">{nextSpecial.inDays} gün kaldı</span>
          </div>
        )}

        <button
          onClick={() => {
            setIsTransitioning(true);
            setTimeout(() => {
              setCurrentMonth(prev => Math.min(11, prev + 1));
              setTimeout(() => setIsTransitioning(false), 50);
            }, 150);
          }}
          disabled={currentMonth === 11}
          className={`rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all ${
            isCompact ? 'p-1.5' : 'p-2'
          }`}
        >
          <ChevronRight className={isCompact ? 'w-3 h-3' : 'w-4 h-4'} />
        </button>
        {!isCompact && (
          <div className="w-px h-6 bg-neutral-700" />
        )}
        <button
          onClick={togglePin}
          className={`rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-all ${
            isCompact ? 'p-1.5' : 'p-2'
          } ${isAlwaysOnTop ? 'ring-2 ring-indigo-400/60' : ''}`}
          title={isAlwaysOnTop ? 'Üstte tutmayı kapat' : 'Üstte tutmayı aç'}
        >
          {isAlwaysOnTop ? <PinOff className={isCompact ? 'w-3 h-3' : 'w-4 h-4'} /> : <Pin className={isCompact ? 'w-3 h-3' : 'w-4 h-4'} />}
        </button>
      </div>
    </div>
  );
}