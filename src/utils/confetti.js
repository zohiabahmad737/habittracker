import confetti from 'canvas-confetti';

export function fireConfetti(options = {}) {
  try {
    const count = 70;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4'],
      ...options,
    };

    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.6),
      spread: 60,
      startVelocity: 45,
    });

    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.4),
      spread: 100,
      decay: 0.91,
      scalar: 1.1,
    });
  } catch (err) {
    // Graceful fallback if canvas is unavailable
  }
}

export function fireSuperCelebration() {
  try {
    const end = Date.now() + 1000;
    const colors = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#fbbf24'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch (err) {}
}
