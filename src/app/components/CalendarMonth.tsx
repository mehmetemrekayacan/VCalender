import { Heart, Star, Flame, Lock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SeasonalAnimation } from './SeasonalAnimation';
import { useState } from 'react';

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

interface CalendarMonthProps {
  data: MonthData;
  onEditDate: (month: number, day: number) => void;
}

const monthNames = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month, 0).getDate();
};

const getFirstDayOfMonth = (month: number, year: number): number => {
  // 0 = Sunday, 1 = Monday, etc.
  const day = new Date(year, month - 1, 1).getDay();
  // Convert to Monday = 0
  return day === 0 ? 6 : day - 1;
};

const getIconForType = (type: SpecialDate['type']) => {
  switch (type) {
    case 'anniversary':
      return <Heart className="w-4 h-4" fill="currentColor" />;
    case 'birthday':
      return <Star className="w-4 h-4" fill="currentColor" />;
    case 'firstMeeting':
      return <Lock className="w-4 h-4" fill="currentColor" />;
    case 'memory':
      return <Flame className="w-4 h-4" fill="currentColor" />;
    case 'valentine':
      return <Heart className="w-4 h-4" fill="currentColor" />;
  }
};

export function CalendarMonth({ data, onEditDate }: CalendarMonthProps) {
  const daysInMonth = getDaysInMonth(data.month, data.year);
  const firstDay = getFirstDayOfMonth(data.month, data.year);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [hoveredDayColumn, setHoveredDayColumn] = useState<number>(0);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Track window size for responsive layout
  useState(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  const getSpecialDate = (day: number): SpecialDate | undefined => {
    return data.specialDates.find(sd => sd.day === day);
  };

  const getColumnForDay = (day: number) => {
    // Calculate which column (0-6) the day is in
    return (firstDay + day - 1) % 7;
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
  
  // Responsive breakpoints
  const isCompact = windowSize.width < 650;
  const isSmall = windowSize.width >= 650 && windowSize.width < 900;
  const isMedium = windowSize.width >= 900 && windowSize.width < 1200;
  const isLarge = windowSize.width >= 1200;

  return (
    <div 
      className={`min-h-screen flex transition-all duration-500 ${
        isCompact ? 'flex-col p-2 overflow-y-auto' : 'p-4 h-screen overflow-hidden'
      }`}
      style={{
        background: `linear-gradient(135deg, ${data.color}80 0%, ${data.color}40 50%, ${data.accentColor}60 100%)`
      }}
    >
      {/* Seasonal Animation */}
      <SeasonalAnimation month={data.month} />
      
      {/* Left Side - Image and Quote */}
      <div className={`flex flex-col gap-3 ${
        isCompact ? 'w-full' : isSmall ? 'w-2/5 pr-2' : 'w-1/3 pr-2'
      }`}>
        {/* Image */}
        <div className={`relative overflow-hidden rounded-2xl group flex-shrink-0 ${
          isCompact ? 'h-32' : isSmall ? 'h-40' : 'h-1/2'
        }`}>
          <ImageWithFallback
            src={data.imageUrl}
            alt={`${monthNames[data.month - 1]} mood`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
            style={{ objectPosition: data.imagePosition || 'center center' }}
            unsplashQuery="romantic couple"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className={`absolute bottom-0 left-0 right-0 ${isCompact ? 'p-2' : 'p-4'}`}>
            <h1 
              className={`mb-1 tracking-tight ${
                isCompact ? 'text-2xl' : isSmall ? 'text-3xl' : 'text-4xl'
              }`}
              style={{ color: data.accentColor }}
            >
              {monthNames[data.month - 1]}
            </h1>
            <p className={`text-neutral-400 ${isCompact ? 'text-sm' : 'text-lg'}`}>{data.year}</p>
          </div>
        </div>

        {/* Quote Section */}
        {!isCompact && (
          <div 
            className="flex flex-col justify-center p-4 backdrop-blur-sm rounded-2xl border-2 flex-1 overflow-y-auto"
            style={{
              backgroundColor: `${data.color}50`,
              borderColor: data.accentColor
            }}
          >
            <div className="relative">
              <div 
                className={`absolute -left-2 -top-2 opacity-20 ${
                  isSmall ? 'text-3xl' : 'text-5xl'
                }`}
                style={{ color: data.accentColor, fontFamily: 'Playfair Display, serif' }}
              >
                "
              </div>
              <p className={`leading-relaxed relative z-10 ${
                isSmall ? 'text-sm' : 'text-base'
              }`} style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', color: '#e5e5e5' }}>
                {data.quote}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right Side - Calendar */}
      <div className={`flex flex-col ${
        isCompact ? 'w-full flex-1' : isSmall ? 'w-3/5 pl-2' : 'flex-1 pl-2'
      }`}>
        {/* Calendar Grid */}
        <div 
          className={`backdrop-blur-xl rounded-2xl border-2 relative flex-1 flex flex-col ${
            isCompact ? 'p-2' : 'p-4'
          }`}
          style={{
            backgroundColor: `${data.color}60`,
            borderColor: data.accentColor
          }}
        >
          {/* Weekday Headers */}
          <div className={`grid grid-cols-7 gap-1 mb-2 ${isCompact ? 'gap-0.5' : 'gap-2'}`}>
            {(isCompact 
              ? ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'] 
              : ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
            ).map((day, index) => (
              <div 
                key={`weekday-${index}`} 
                className={`text-center py-1 tracking-wider font-medium ${
                  isCompact ? 'text-xs' : 'text-sm py-2'
                }`}
                style={{ color: data.accentColor }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className={`grid grid-cols-7 ${isCompact ? 'gap-0.5' : isSmall ? 'gap-1' : 'gap-2'}`}>
            {/* Empty cells for days before month starts */}
            {emptyDays.map((i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Actual days */}
            {days.map((day) => {
              const specialDate = getSpecialDate(day);
              const isSpecial = !!specialDate;

              return (
                <div key={day} className="relative">
                  <button
                    onClick={() => onEditDate(data.month, day)}
                    onMouseEnter={() => {
                      setHoveredDay(day);
                      setHoveredDayColumn(getColumnForDay(day));
                    }}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`
                      w-full aspect-square rounded-xl transition-all duration-200
                      flex items-center justify-center font-medium
                      ${isCompact ? 'p-1 text-xs rounded-lg' : isSmall ? 'p-1.5 text-sm' : 'p-2 text-lg'}
                      ${isSpecial 
                        ? 'border-2 shadow-lg hover:shadow-xl' 
                        : 'border hover:border-2'
                      }
                      ${isSpecial ? 'text-white font-bold' : 'text-neutral-300 hover:text-white'}
                    `}
                    style={{
                      backgroundColor: isSpecial ? data.accentColor : `${data.color}90`,
                      borderColor: data.accentColor,
                    }}
                  >
                    {day}
                    {specialDate?.sticker && (
                      <span className="absolute bottom-1 left-1 text-base">
                        {specialDate.sticker}
                      </span>
                    )}
                    {isSpecial && !isCompact && (
                      <div 
                        className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                        style={{ backgroundColor: data.accentColor }}
                      />
                    )}
                  </button>

                  {/* Hover Popup - positioned relative to the day */}
                  {!isCompact && hoveredDay === day && specialDate && (
                    <div 
                      className={`
                        absolute w-64 
                        bg-neutral-900/95 backdrop-blur-xl border rounded-xl p-4 shadow-2xl
                        animate-in fade-in duration-200 z-50
                        ${
                          hoveredDayColumn <= 2 
                            ? 'left-full ml-2 top-0' 
                            : hoveredDayColumn >= 5 
                            ? 'right-full mr-2 top-0' 
                            : 'left-1/2 -translate-x-1/2 bottom-full mb-2'
                        }
                      `}
                      style={{ borderColor: data.accentColor + '60' }}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="p-2 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: data.accentColor + '20', color: data.accentColor }}
                        >
                          {getIconForType(specialDate.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-neutral-400 mb-1">
                            {day} {monthNames[data.month - 1]}
                          </div>
                          <div 
                            className="text-sm font-medium mb-2"
                            style={{ color: data.accentColor }}
                          >
                            {getTypeLabel(specialDate.type)}
                          </div>
                          {specialDate.sticker && (
                            <div className="text-lg mb-1" aria-hidden>
                              {specialDate.sticker}
                            </div>
                          )}
                          {specialDate.note && (
                            <p className="text-sm text-neutral-300 leading-relaxed">
                              {specialDate.note}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Hover Popup - removed from here, now it's inside each day cell */}
        </div>

        {/* Progress Indicator */}
        <div className={`flex items-center justify-center gap-2 ${isCompact ? 'mt-2' : 'mt-3'}`}>
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all ${
                i + 1 === data.month ? (isCompact ? 'w-4' : 'w-6') : (isCompact ? 'w-1' : 'w-1.5')
              }`}
              style={{
                backgroundColor: i + 1 === data.month ? data.accentColor : '#404040'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}