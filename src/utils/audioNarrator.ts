import { PaperEdition } from '../types';

export class AudioNarrator {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;
  private static isPlaying: boolean = false;
  private static isPaused: boolean = false;
  private static rate: number = 1.0;
  private static onStateChangeListeners: Array<(state: { isPlaying: boolean; isPaused: boolean; progressText: string }) => void> = [];
  private static progressText: string = '';

  public static subscribe(listener: (state: { isPlaying: boolean; isPaused: boolean; progressText: string }) => void) {
    this.onStateChangeListeners.push(listener);
    listener({ isPlaying: this.isPlaying, isPaused: this.isPaused, progressText: this.progressText });
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter(l => l !== listener);
    };
  }

  private static notify() {
    this.onStateChangeListeners.forEach(listener =>
      listener({ isPlaying: this.isPlaying, isPaused: this.isPaused, progressText: this.progressText })
    );
  }

  public static composeNarrationScript(edition: PaperEdition, readerName: string): string {
    const parts: string[] = [];

    parts.push(`Good morning, ${readerName}. This is your personalized morning edition for ${edition.dateStr}.`);
    parts.push(`Weather in ${edition.weather.city}: ${edition.weather.temp}, ${edition.weather.condition}.`);
    parts.push(`From the Editor's Desk: ${edition.chiefEditorNote.narrative}`);
    parts.push(`Today's lead front page story: ${edition.leadArticle.title}, reported by ${edition.leadArticle.author} for ${edition.leadArticle.outlet}.`);
    parts.push(edition.leadArticle.leadParagraph);

    if (edition.frontPageSideArticles.length > 0) {
      parts.push(`Also in this morning's dispatches:`);
      edition.frontPageSideArticles.forEach(art => {
        parts.push(`${art.title}. In brief: ${art.subhead}`);
      });
    }

    parts.push(`Today's morning reflection: "${edition.morningQuote.quote}" by ${edition.morningQuote.author}.`);
    parts.push(`Enjoy your morning paper. Have a productive and focused day.`);

    return parts.join(' ... ');
  }

  public static play(edition: PaperEdition, readerName: string) {
    if (!this.synth) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    this.stop();

    const script = this.composeNarrationScript(edition, readerName);
    this.currentUtterance = new SpeechSynthesisUtterance(script);
    this.currentUtterance.rate = this.rate;
    this.currentUtterance.pitch = 1.0;

    // Pick an English voice if available
    const voices = this.synth.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium')));
    if (naturalVoice) {
      this.currentUtterance.voice = naturalVoice;
    }

    this.currentUtterance.onstart = () => {
      this.isPlaying = true;
      this.isPaused = false;
      this.progressText = 'Playing Morning Dispatch...';
      this.notify();
    };

    this.currentUtterance.onpause = () => {
      this.isPaused = true;
      this.progressText = 'Narration Paused';
      this.notify();
    };

    this.currentUtterance.onresume = () => {
      this.isPaused = false;
      this.progressText = 'Resuming Morning Dispatch...';
      this.notify();
    };

    this.currentUtterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.progressText = 'Narration Complete';
      this.notify();
    };

    this.currentUtterance.onerror = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.progressText = 'Narration Stopped';
      this.notify();
    };

    this.synth.speak(this.currentUtterance);
  }

  public static pause() {
    if (this.synth && this.isPlaying && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      this.notify();
    }
  }

  public static resume() {
    if (this.synth && this.isPlaying && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notify();
    }
  }

  public static stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isPlaying = false;
    this.isPaused = false;
    this.progressText = '';
    this.notify();
  }

  public static setRate(newRate: number) {
    this.rate = newRate;
    if (this.isPlaying && this.currentUtterance) {
      // Re-trigger with new rate
      this.currentUtterance.rate = newRate;
    }
  }
}
