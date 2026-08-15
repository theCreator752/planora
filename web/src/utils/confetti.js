import confetti from 'canvas-confetti';

export function fireCompletionConfetti() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  confetti({
    particleCount: 80,
    spread: 70,
    startVelocity: 35,
    origin: { y: 0.7 },
    colors: ['#3B4B7A', '#F5A623', '#2A7A4E'],
  });
}
