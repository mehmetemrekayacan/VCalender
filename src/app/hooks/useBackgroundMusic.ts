import { useEffect, useRef, useState } from 'react';

// Import all 6 songs
import song1 from '../../songs/Digital Dawn Grid.mp3';
import song2 from '../../songs/Digital Dawn Grid(1).mp3';
import song3 from '../../songs/Distant Hands, Same Sky.mp3';
import song4 from '../../songs/Distant Hands, Same Sky(1).mp3';
import song5 from '../../songs/Quiet Days Together.mp3';
import song6 from '../../songs/Quiet Days Together(1).mp3';

const playlist = [song1, song2, song3, song4, song5, song6];

const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export function useBackgroundMusic(volume: number = 0.15) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [order] = useState<string[]>(() => shuffle(playlist));
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Create audio element
    const audio = new Audio();
    audio.volume = volume;
    audio.loop = false;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Load first track
    audio.src = order[0];
    
    // Handle track ending - move to next track
    const handleEnded = () => {
      setCurrentTrackIndex((prev) => {
        const nextIndex = (prev + 1) % order.length;
        console.log(`Playing track ${nextIndex + 1} of ${order.length}`);
        return nextIndex;
      });
    };

    audio.addEventListener('ended', handleEnded);

    // Function to start playback
    const startPlayback = async () => {
      if (!isInitialized && audioRef.current) {
        try {
          await audioRef.current.play();
          setIsInitialized(true);
          console.log('Background music started');
        } catch (error) {
          console.log('Waiting for user interaction to start music...');
        }
      }
    };

    // Try to auto-play
    startPlayback();

    // Add event listeners for user interaction
    const interactionHandler = () => {
      startPlayback();
    };

    document.addEventListener('click', interactionHandler, { once: true });
    document.addEventListener('keydown', interactionHandler, { once: true });
    document.addEventListener('touchstart', interactionHandler, { once: true });

    // Cleanup
    return () => {
      audio.removeEventListener('ended', handleEnded);
      document.removeEventListener('click', interactionHandler);
      document.removeEventListener('keydown', interactionHandler);
      document.removeEventListener('touchstart', interactionHandler);
      audio.pause();
      audio.src = '';
    };
  }, [volume, order]);

  // Update track when index changes
  useEffect(() => {
    if (audioRef.current && isInitialized) {
      audioRef.current.src = order[currentTrackIndex];
      audioRef.current.play().catch((error) => {
        console.error('Error playing track:', error);
      });
    }
  }, [currentTrackIndex, isInitialized, order]);

  return { isPlaying: isInitialized };
}
