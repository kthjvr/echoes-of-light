import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { v4 as uuidv4 } from "uuid";
import RestartButton from "./RestartButton";
import Confetti from "react-confetti";
import useSound from 'use-sound';
import popSfx from '../assets/pop.mp3';
import goofySfx from '../assets/goofy.mp3';
import wowSfx from '../assets/wow.mp3';
import niceSfx from '../assets/nice.mp3';
import { useGameSession } from './GameSessionContext';

interface Card {
  img: string;
  id: string;
  alt: number;
  isFlipped: boolean;
}

interface BoardOneProps {
  onComplete: () => void; // Define the type of the onComplete prop
  // onFirstClick: () => void;
}

const BoardOne: React.FC<BoardOneProps> = ({ onComplete }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<number  | null>(null);
  const [isTiming, setIsTiming] = useState(false);
  const { setLevelStats } = useGameSession();

  const scoreSpan = useRef(null);
  const totalPairs = 3;

  // for sound effects
  const [playFlip] = useSound(popSfx, { volume: 1 }); 
  const [goofy] = useSound(goofySfx, { volume: 0.5 }); 
  const [wow] = useSound(wowSfx, { volume: 0.5 }); 
  const [nice] = useSound(niceSfx, { volume: 2 }); 

  const [animationsRunning, setAnimationsRunning] = useState(false);

  const cardData = useMemo(
    () => [
      {
        img: "https://ik.imagekit.io/e3wiv79bq/flip-a-doodle-doo/5.png?updatedAt=1740544753718",
        id: uuidv4(),
        alt: 1,
        isFlipped: false,
      },
      {
        img: "https://ik.imagekit.io/e3wiv79bq/flip-a-doodle-doo/3.png?updatedAt=1740544753689",
        id: uuidv4(),
        alt: 2,
        isFlipped: false,
      },
      {
        img: "https://ik.imagekit.io/e3wiv79bq/flip-a-doodle-doo/1.png?updatedAt=1740544754066",
        id: uuidv4(),
        alt: 4,
        isFlipped: false,
      },
      {
        img: "https://ik.imagekit.io/e3wiv79bq/flip-a-doodle-doo/5.png?updatedAt=1740544753718",
        id: uuidv4(),
        alt: 1,
        isFlipped: false,
      },
      {
        img: "https://ik.imagekit.io/e3wiv79bq/flip-a-doodle-doo/3.png?updatedAt=1740544753689",
        id: uuidv4(),
        alt: 2,
        isFlipped: false,
      },
      {
        img: "https://ik.imagekit.io/e3wiv79bq/flip-a-doodle-doo/1.png?updatedAt=1740544754066",
        id: uuidv4(),
        alt: 4,
        isFlipped: false,
      },

    ],
    []
  );

  const handleRestart = () => {
    setScore(0);
    setIsGameOver(false);
    setFlippedCards([]);
    setMoves(0);
    setSeconds(0);
    setIsTiming(false);
    clearInterval(timerRef.current!);

    const shuffledCards = shuffleArray([...cardData]);
    setCards(shuffledCards);

    setCards((prevCards) =>
      prevCards.map((card) => ({ ...card, isFlipped: false }))
    );
  };

  const shuffleArray = useCallback((array: Card[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }, []);

  useEffect(() => {
    const shuffledCards = shuffleArray([...cardData]);
    setCards(shuffledCards);
  }, [cardData, shuffleArray]);

  const handleCardClick = useCallback(
    (cardId: string) => {
      if (isGameOver || flippedCards.length === 2) {
        return;
      }

      if (!isTiming) {
        setIsTiming(true);
        timerRef.current = setInterval(() => {
          setSeconds((s) => s + 1);
        }, 1000);
      }

      // Check if the card is already flipped before flipping
      if (cards.find((card) => card.id === cardId)?.isFlipped) {
        return;
      }

      // Flip the card first
      setCards((prevCards) => {
        const updatedCards = [...prevCards];
        const cardIndex = updatedCards.findIndex((card) => card.id === cardId);

        if (cardIndex !== -1) {
          updatedCards[cardIndex].isFlipped = true;
        }

        return updatedCards;
      });

      if (flippedCards.length === 1) {
        setMoves((m) => m + 1);
      }

      // Then, add the cardId to flippedCards
      setFlippedCards((prevFlippedCards) => [...prevFlippedCards, cardId]);
    },
    [isGameOver, flippedCards, cards ]
  );

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [card1Id, card2Id] = flippedCards;
      const card1 = cards.find((card) => card.id === card1Id);
      const card2 = cards.find((card) => card.id === card2Id);

      if (card1 && card2 && card1.alt === card2.alt) {
        // Match!
        setScore((prevScore) => prevScore + 1);
        setFlippedCards([]);
        wow();
      } else {
        // No match, flip back after a delay
        setTimeout(() => {
          setFlippedCards([]);
          setCards((prevCards) =>
            prevCards.map((card) =>
              [card1Id, card2Id].includes(card.id)
                ? { ...card, isFlipped: false }
                : card
            )
          );
        }, 500);
      }
    }

    // Check if all pairs are matched
    if (score === totalPairs) {
      clearInterval(timerRef.current!);
      setIsTiming(false);

      setLevelStats('level1', {
        moves,
        seconds,
      });

      setIsGameOver(true);

      setTimeout(() => {
        onComplete(); // go to next board
      }, 5000);
    }

  }, [flippedCards, cards, score, isGameOver, wow, onComplete]);

  useEffect(() => {
    if (isGameOver) {
      setAnimationsRunning(true); // Animations start
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setAnimationsRunning(false); // Animations end
      }, 5000);
      setTimeout(() => {
        nice();
      }, 2000);
      goofy();
    }
  }, [isGameOver, goofy, nice]);

  const createCard = useCallback(
    (card: Card) => {
      return (
        <div
          key={card.id}
          data-id={card.id}
          data-alt={card.alt}
          className={`card group relative bg-white/20 hover:bg-white/30 cursor-pointer rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
            isGameOver ? "matched" : ""
          } ${card.isFlipped ? "ring-2 ring-blue-400/50" : ""}`}
          onClick={() => {
            handleCardClick(card.id);
            playFlip();
          }}
        >
          {card.isFlipped ? (
            <img
              src={card.img}
              alt="card"
              className="transition-all duration-500 ease-in-out transform rounded-lg sm:rounded-xl w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-32 object-cover shadow-lg"
            />
          ) : (
            <div className="card-back relative overflow-hidden rounded-lg sm:rounded-xl w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-32 bg-gradient-to-br from-purple-500/30 to-blue-500/30 backdrop-blur-sm border border-white/20">
              <img 
                className="rounded-lg sm:rounded-xl w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                src="https://ik.imagekit.io/e3wiv79bq/echoes-of-light/Level3/back.png?updatedAt=1752512324481" 
                alt="card back" 
              />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          )}
        </div>
      );
    },
    [isGameOver, handleCardClick, playFlip]
  );

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  return (
    <div className="px-3 sm:px-4 py-4 sm:py-6 text-white">
      {/* Confetti */}
      {isGameOver && showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        </div>
      )}

      {/* Game Title */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Echoes of Light
        </h2>
        <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
      </div>

      {/* Game Status */}
      {isGameOver && (
        <div className="text-center mb-6 sm:mb-8 animate-bounce px-4">
          <div className="bg-gradient-to-r from-emerald-400/20 to-green-400/20 border border-emerald-400/40 rounded-xl p-3 sm:p-4 backdrop-blur-sm inline-block max-w-sm">
            <div className="text-xl sm:text-2xl font-bold text-emerald-400 mb-1">🎉 You Won!</div>
            <div className="text-xs sm:text-sm text-gray-300">Loading next level...</div>
          </div>
        </div>
      )}

      {/* Scoreboard */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 mx-2 sm:mx-0">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div className="flex flex-col">
            <span className="text-xs text-gray-300 mb-1">SCORE</span>
            <span className="text-base sm:text-lg md:text-xl font-bold text-yellow-300" id="score">{score}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-300 mb-1">MOVES</span>
            <span className="text-base sm:text-lg md:text-xl font-bold text-blue-300">{moves}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-300 mb-1">TIME</span>
            <span className="text-base sm:text-lg md:text-xl font-bold text-green-300">{formatTime(seconds)}</span>
          </div>
        </div>
      </div>

      {/* Card Grid */}
      <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto mb-6 sm:mb-8">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 p-3 sm:p-4 md:grid-cols-3 md:gap-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          {cards.map(createCard)}
        </div>
      </div>

      {/* Restart */}
      <div className="flex justify-center">
        <RestartButton onRestart={handleRestart} disabled={animationsRunning} />
      </div>
    </div>
  );

}

export default BoardOne;
