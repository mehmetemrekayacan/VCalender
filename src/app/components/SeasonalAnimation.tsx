import { useEffect, useState, memo } from 'react';

interface SeasonalAnimationProps {
  month: number;
}

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

function SeasonalAnimationComponent({ month }: SeasonalAnimationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate 15-20 particles (reduced for better performance)
    const particleCount = 18;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 5,
      size: 0.5 + Math.random() * 1.5,
    }));
    setParticles(newParticles);
  }, [month]);

  // Kış ayları: Kar taneleri (Ocak, Şubat, Aralık)
  if (month === 1 || month === 2 || month === 12) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10 print:hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute animate-snowfall will-change-transform"
            style={{
              left: `${particle.left}%`,
              top: '-10px',
              // Negative delay starts animation mid-flight to avoid clustering at the top
              animationDelay: `${-Math.random() * particle.duration}s`,
              animationDuration: `${particle.duration}s`,
              fontSize: `${particle.size}rem`,
            }}
          >
            ❄️
          </div>
        ))}
        <style>{`
          @keyframes snowfall {
            0% {
              transform: translate3d(0, -10px, 0) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translate3d(0, 100vh, 0) rotate(360deg);
              opacity: 0;
            }
          }
          .animate-snowfall {
            animation: snowfall linear infinite;
            backface-visibility: hidden;
            will-change: transform, opacity;
          }
        `}</style>
      </div>
    );
  }

  // İlkbahar ayları: Çiçek yaprakları (Mart, Nisan, Mayıs)
  if (month === 3 || month === 4 || month === 5) {
    const petals = ['🌸', '🌺', '🌼', '🌻'];
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10 print:hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute animate-petals will-change-transform"
            style={{
              left: `${particle.left}%`,
              top: '-10px',
              animationDelay: `${-Math.random() * particle.duration}s`,
              animationDuration: `${particle.duration}s`,
              fontSize: `${particle.size}rem`,
            }}
          >
            {petals[particle.id % petals.length]}
          </div>
        ))}
        <style>{`
          @keyframes petals {
            0% {
              transform: translate3d(0, -10px, 0) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translate3d(50px, 100vh, 0) rotate(360deg);
              opacity: 0;
            }
          }
          .animate-petals {
            animation: petals ease-in-out infinite;
            backface-visibility: hidden;
            will-change: transform, opacity;
          }
        `}</style>
      </div>
    );
  }

  // Yaz ayları: Kelebekler ve yıldızlar (Haziran, Temmuz, Ağustos)
  if (month === 6 || month === 7 || month === 8) {
    const summerIcons = ['✨', '⭐', '💫', '🦋'];
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10 print:hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute animate-float will-change-transform"
            style={{
              left: `${particle.left}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${-Math.random() * particle.duration}s`,
              animationDuration: `${particle.duration}s`,
              fontSize: `${particle.size}rem`,
            }}
          >
            {summerIcons[particle.id % summerIcons.length]}
          </div>
        ))}
        <style>{`
          @keyframes float {
            0%, 100% {
              transform: translate3d(0, 0, 0) rotate(0deg);
              opacity: 0.3;
            }
            25% {
              transform: translate3d(10px, -20px, 0) rotate(90deg);
              opacity: 1;
            }
            50% {
              transform: translate3d(20px, 0, 0) rotate(180deg);
              opacity: 0.5;
            }
            75% {
              transform: translate3d(10px, 20px, 0) rotate(270deg);
              opacity: 1;
            }
          }
          .animate-float {
            animation: float ease-in-out infinite;
            backface-visibility: hidden;
            will-change: transform, opacity;
          }
        `}</style>
      </div>
    );
  }

  // Sonbahar ayları: Düşen yapraklar (Eylül, Ekim, Kasım)
  if (month === 9 || month === 10 || month === 11) {
    const leaves = ['🍂', '🍁', '🍃'];
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10 print:hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute animate-leaves will-change-transform"
            style={{
              left: `${particle.left}%`,
              top: '-10px',
              animationDelay: `${-Math.random() * particle.duration}s`,
              animationDuration: `${particle.duration}s`,
              fontSize: `${particle.size}rem`,
            }}
          >
            {leaves[particle.id % leaves.length]}
          </div>
        ))}
        <style>{`
          @keyframes leaves {
            0% {
              transform: translate3d(0, -10px, 0) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            50% {
              transform: translate3d(-30px, 50vh, 0) rotate(180deg);
              opacity: 0.8;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translate3d(30px, 100vh, 0) rotate(360deg);
              opacity: 0;
            }
          }
          .animate-leaves {
            animation: leaves ease-in-out infinite;
            backface-visibility: hidden;
            will-change: transform, opacity;
          }
        `}</style>
      </div>
    );
  }

  return null;
}

// Memoize the component to prevent unnecessary re-renders
export const SeasonalAnimation = memo(SeasonalAnimationComponent);
