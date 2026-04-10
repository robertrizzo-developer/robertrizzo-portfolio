import { useState } from 'react';

function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function RandomBubbles({ count = 15 }) {
  const [bubbles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      size: seededRandom(i * 7) * 100 + 20,
      left: `${seededRandom(i * 13 + 1) * 100}%`,
      top: `${seededRandom(i * 17 + 2) * 100}%`,
      duration: `${seededRandom(i * 23 + 3) * 8 + 6}s`,
      delay: `${seededRandom(i * 31 + 4) * 5}s`,
      opacity: seededRandom(i * 37 + 5) * 0.12 + 0.04,
    }))
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full bg-white blur-xl"
          style={{
            width: b.size,
            height: b.size,
            left: b.left,
            top: b.top,
            opacity: b.opacity,
            animation: `float ${b.duration} ease-in-out ${b.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default RandomBubbles;
