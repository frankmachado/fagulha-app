let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let activeSources: OscillatorNode[] = [];

function getAudioContext() {
  audioContext ??= new AudioContext();
  masterGain ??= audioContext.createGain();
  masterGain.gain.value = 0.18;
  masterGain.connect(audioContext.destination);
  return audioContext;
}

function frequencyFromMidi(midi: number) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function playTone(frequency: number, start: number, duration: number, type: OscillatorType = 'triangle') {
  const context = getAudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.28, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(masterGain!);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
  activeSources.push(oscillator);
  oscillator.addEventListener('ended', () => {
    activeSources = activeSources.filter((source) => source !== oscillator);
  });
}

export async function playNotes(notes: number[], tempo = 113) {
  const context = getAudioContext();
  if (context.state === 'suspended') await context.resume();
  stopAudio();
  const start = context.currentTime + 0.04;
  const beat = 60 / tempo;
  notes.forEach((midi, index) => playTone(frequencyFromMidi(midi), start + index * beat, beat * 0.82));
}

export async function playChord(notes: number[]) {
  const context = getAudioContext();
  if (context.state === 'suspended') await context.resume();
  stopAudio();
  const start = context.currentTime + 0.04;
  notes.forEach((midi) => playTone(frequencyFromMidi(midi), start, 1.3, 'sine'));
}

export function stopAudio() {
  activeSources.forEach((source) => {
    try { source.stop(); } catch { /* already ended */ }
  });
  activeSources = [];
}

export function setMasterVolume(value: number) {
  if (!masterGain) getAudioContext();
  masterGain!.gain.value = Math.max(0, Math.min(1, value));
}
