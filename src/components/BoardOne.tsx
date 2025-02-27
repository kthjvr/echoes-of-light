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

      // Then, add the cardId to flippedCards
      setFlippedCards((prevFlippedCards) => [...prevFlippedCards, cardId]);

      // if (flippedCards.length === 1) {
      //   onFirstClick();
      // }
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

    setIsGameOver(true);
      setTimeout(() => {
        onComplete();
      }, 5000);
      console.log("isGameOver:", isGameOver); // Check if isGameOver is true
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
          className={`card bg-gray-200 hover:bg-gray-300 cursor-pointer rounded ${
            isGameOver ? "matched" : ""
          }`}
          onClick={() => {
            handleCardClick(card.id);
            playFlip();
          }}
        >
          {card.isFlipped ? (
            <img
              src={card.img}
              alt="card"
              className="transition-transform duration-500 ease-in-out transform rounded w-24 h-24 md:w-28 md:h-32 "
            />
          ) : (
            <div className="card-back card bg-gray-200 hover:bg-gray-300 cursor-pointer rounded w-24 h-24 md:w-28 md:h-32">
              <img className="rounded w-24 h-24 md:w-28 md:h-32" src="https://ik.imagekit.io/e3wiv79bq/flip-a-doodle-doo/Level3/back.png?updatedAt=1740646785921" alt="" />
            </div>
          )}
        </div>
      );
    },
    [isGameOver, handleCardClick, playFlip]
  );

  return (
    <div className="mx-auto">
      <h2 className="text-lg font-bold mb-4 text-center text-white">Flip-A-Doodle-Doo</h2>
      <div className="flex flex-col items-center">
      {isGameOver && (
        <>
          <div className="gameover">You won!</div>
          <div>Loading next level...</div>
        </>
      )}
      </div>

      <div className="flex flex-col justify-items-start">
      <h2 className="items-start">
          Score:{" "}
          <span ref={scoreSpan} id="score">
            {score}
          </span>
        </h2>
      </div>

      <div
        className="grid grid-cols-2 gap-2 p-2 md:grid-cols-3 md:gap-4"
        id="grid"
      >
        {cards.map(createCard)}
      </div>
      <div className="overflow-hidden">
        {isGameOver && showConfetti && <Confetti />}
      </div>

      <RestartButton onRestart={handleRestart} disabled={animationsRunning} />
    </div>
  );
}

export default BoardOne;
