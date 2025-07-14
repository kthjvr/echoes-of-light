// FinalScore.tsx
import { useGameSession } from './GameSessionContext';
import { formatTime } from './formatTime';
import domtoimage from 'dom-to-image-more';
import { useRef } from 'react';


export const FinalScore = () => {
  const scoreRef = useRef<HTMLDivElement>(null);

  // For testing purposes only
  // const mockStats = {
  //   level1: { moves: 6, seconds: 90 },
  //   level2: { moves: 3, seconds: 150 },
  //   level3: { moves: 16, seconds: 330 },
  // };

  // Use mock instead:
  // const scores = mockStats;
  // const resetSession = () => {}; // no-op to avoid errors

  const { scores } = useGameSession();

  const handleDownloadImage = async () => {
    const node = document.getElementById('screenshot-container');
    if (!node) return;

    try {
      const dataUrl = await domtoimage.toPng(node as HTMLElement);
      const link = document.createElement('a');
      link.download = 'flip-a-doodle-summary.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Image export failed:', error);
    }
  };


  // Filter out nulls just in case
  const validScores = Object.values(scores).filter(
    (stat): stat is { moves: number; seconds: number } => stat !== null
  );

  const totalMoves = validScores.reduce((acc, stat) => acc + stat.moves, 0);
  const totalSeconds = validScores.reduce((acc, stat) => acc + stat.seconds, 0);

  const totalScore = Math.max(0, 1000 - totalMoves * 5 - totalSeconds);

  return (
    <div className="max-w-md mx-auto p-6 bg-white/10 rounded-2xl shadow-lg text-white mb-4" ref={scoreRef}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-blue-400">🎉 Game Summary</h2>
        <div className="w-16 h-1 bg-blue-400 mx-auto rounded-full"></div>
      </div>

      {/* Level Stats */}
      <div className="space-y-3 text-sm md:text-base mb-6">
        {Object.entries(scores).map(([level, stat], index) =>
          stat ? (
            <div
              key={level}
              className="bg-white border border-white/20 rounded-xl p-4 flex justify-between items-center hover:bg-white/15 transition-colors"
            >
              <div>
                <p className="font-semibold text-black mb-1">Level {index + 1}</p>
                <div className="flex gap-4 text-sm text-black">
                  <span>🎯 <span className="font-medium">{stat.moves}</span> moves</span>
                  <span>⏱️ <span className="font-medium">{formatTime(stat.seconds)}</span></span>
                </div>
              </div>
              <div className="text-green-400 text-xl">✔️</div>
            </div>
          ) : null
        )}
      </div>

      {/* Total Score */}
      <div className="text-center mb-8 bg-white rounded-xl p-6">
        <h3 className="text-xl font-semibold text-yellow-300 mb-2">🏅 Total Score</h3>
        <p className="text-5xl font-bold text-yellow-300 drop-shadow-lg">{totalScore}</p>
      </div>

      {/* Share Button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
          onClick={handleDownloadImage}
        >
          📤 <span>Share</span>
        </button>
      </div>

      <div
        id="screenshot-container"
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          padding: '32px',
          width: '360px',
          border: 'none',
          boxShadow: 'none',
          borderRadius: '0',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
          lineHeight: '1.4',
        }}
      >
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '28px',
          border: 'none'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            margin: '0 0 8px 0',
            border: 'none',
            color: '#2563eb'
          }}>
            🎉 Game Summary
          </h2>
          <div style={{
            width: '60px',
            height: '3px',
            backgroundColor: '#2563eb',
            margin: '0 auto',
            border: 'none'
          }} />
        </div>

        {/* Level Stats */}
        <div style={{ marginBottom: '24px', border: 'none' }}>
          {Object.entries(scores).map(([level, stat], index) =>
            stat ? (
              <div key={level} style={{
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                backgroundColor: '#f9fafb',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ border: 'none' }}>
                  <p style={{ 
                    fontWeight: '600', 
                    margin: '0 0 4px 0',
                    fontSize: '16px',
                    color: '#374151',
                    border: 'none' 
                  }}>
                    Level {index + 1}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    gap: '16px',
                    fontSize: '14px',
                    color: '#6b7280',
                    border: 'none'
                  }}>
                    <span style={{ border: 'none' }}>
                      🎯 {stat.moves} moves
                    </span>
                    <span style={{ border: 'none' }}>
                      ⏱️ {formatTime(stat.seconds)}
                    </span>
                  </div>
                </div>
                <div style={{ 
                  fontSize: '20px',
                  color: '#10b981',
                  border: 'none'
                }}>
                  ✔️
                </div>
              </div>
            ) : null
          )}
        </div>

        {/* Total Score */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '24px',
          padding: '20px',
          backgroundColor: '#fef3c7',
          borderRadius: '12px',
          border: '2px solid #f59e0b'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            margin: '0 0 8px 0',
            color: '#92400e',
            border: 'none' 
          }}>
            🏅 Total Score
          </h3>
          <p style={{ 
            fontSize: '36px', 
            fontWeight: '800', 
            color: '#d97706',
            margin: '0',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            border: 'none' 
          }}>
            {totalScore}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: '#6b7280',
            paddingTop: '16px',
            border: 'none',
          }}
        >
          <div
            style={{
              marginBottom: '8px',
            }}
          />

          <img
            src="https://ik.imagekit.io/e3wiv79bq/echoes-of-light/frame.png"
            alt="Echoes of Light QR Code"
            style={{
              width: '160px',
              height: '160px',
              margin: '0 auto 8px',
              display: 'block',
              border: 'none',
            }}
          />

          <p
            style={{
              margin: '0 0 4px 0',
              fontWeight: '500',
              border: 'none',
            }}
          >
            Made with ❤️ in{' '}
            <strong
              style={{
                color: '#2563eb',
                border: 'none',
              }}
            >
              Echoes of Light
            </strong>
          </p>

          <p
            style={{
              margin: '0',
              fontSize: '11px',
              opacity: '0.8',
              border: 'none',
            }}
          >
            https://echoes-of-light.netlify.app/
          </p>
        </div>

      </div>


    </div>
  );
};
