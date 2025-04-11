export const playSound = (type: 'success' | 'fail' | 'reset') => {
  const audio = new Audio(`/sounds/${type}.mp3`);
  audio.volume = 0.2;
  audio.play();
};
