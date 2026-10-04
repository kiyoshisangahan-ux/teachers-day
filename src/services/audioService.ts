/**
 * Premium Web Audio & Procedural Ambient Sound Generator
 * Generates beautiful, peaceful piano chords and chimes without external network dependencies,
 * while seamlessly supporting custom audio tracks and sound effects.
 */

class GiftAudioManager {
  private ctx: AudioContext | null = null;
  private isPlayingSynth: boolean = false;
  private synthInterval: any = null;
  private customAudio: HTMLAudioElement | null = null;
  private volume: number = 0.6;
  private rainNode: AudioNode | null = null;
  private activeSoundscape: string = 'piano';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.customAudio) {
      this.customAudio.volume = this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  // Soft envelope tear / wax seal break sound
  public playWaxSealSound() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Gentle warm resonant chime
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.3); // G5

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15 * this.volume, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch {
      // Ignore if user hasn't interacted
    }
  }

  // Tactile button click chime
  public playSoftClick() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5

      gain.gain.setValueAtTime(0.08 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore
    }
  }

  // Play a soft piano note chord in pentatonic scale
  private playPianoNote(freq: number, duration: number = 2.4, delay: number = 0) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime + delay;

    // Dual oscillator for rich warmth (sine + warm triangle)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.002, now); // slight detune for warmth

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(350, now + duration);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12 * this.volume, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
  }

  // Start background procedural acoustic piano melody
  public startAmbientSoundscape(type: string = 'piano') {
    this.initContext();
    this.activeSoundscape = type;
    this.stopAmbientSoundscape();
    this.isPlayingSynth = true;

    // Harmonic pentatonic frequencies (G major / E minor peaceful progression)
    // G3, B3, D4, E4, G4, A4, B4, D5, E5
    const chords = [
      [196.0, 293.66, 392.0, 493.88], // G maj
      [220.0, 261.63, 329.63, 440.0], // A min
      [164.81, 246.94, 329.63, 392.0], // E min
      [174.61, 261.63, 349.23, 440.0]  // F maj / C
    ];

    let chordIndex = 0;

    const playChordCycle = () => {
      if (!this.isPlayingSynth || !this.ctx) return;

      const chord = chords[chordIndex % chords.length];
      chordIndex++;

      // Arpeggiate chord notes gracefully
      chord.forEach((freq, idx) => {
        this.playPianoNote(freq, 3.2, idx * 0.45);
      });

      // Occasional sweet melody note in higher octave
      if (Math.random() > 0.4) {
        const melodyPitches = [587.33, 659.25, 783.99, 880.0, 987.77];
        const pitch = melodyPitches[Math.floor(Math.random() * melodyPitches.length)];
        this.playPianoNote(pitch, 2.5, 1.8);
      }
    };

    // Play first immediately
    playChordCycle();
    // Then loop every 3.8 seconds
    this.synthInterval = setInterval(playChordCycle, 3800);
  }

  public stopAmbientSoundscape() {
    this.isPlayingSynth = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  public isPlaying(): boolean {
    return this.isPlayingSynth;
  }
}

export const audioManager = new GiftAudioManager();
