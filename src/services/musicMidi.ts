import { Midi } from '@tonejs/midi';

export function downloadMidi(notes: number[], tempo: number, fileName = 'fagulha-loop.mid') {
  const midi = new Midi();
  const track = midi.addTrack();
  midi.header.setTempo(tempo);
  notes.forEach((midiNote, index) => {
    track.addNote({
      midi: midiNote,
      time: index * (60 / tempo),
      duration: 60 / tempo,
      velocity: 0.78,
    });
  });

  const bytes = midi.toArray();
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const blob = new Blob([buffer], { type: 'audio/midi' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}
