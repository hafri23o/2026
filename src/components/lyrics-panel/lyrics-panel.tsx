import { Show, VoidComponent } from 'solid-js';
import { usePlayerStore } from '~/stores/stores'; // The '~' alias works with your tsconfig and vite config
import * as styles from './lyrics-panel.css'; // Assuming vanilla-extract CSS or a valid CSS module

export const LyricsPanel: VoidComponent = () => {
  const [playerState] = usePlayerStore();
  const aTrack = () => playerState.activeTrack;
  const lyrics = () => aTrack()?.description?.trim();

  return (
    <div class={styles.container}>
      <div class={styles.title}>Lyrics</div>
      <Show when={lyrics()} fallback={<div class={styles.text}>No lyrics found for this track.</div>}>
        <div class={styles.text}>{lyrics()}</div>
      </Show>
    </div>
  );
};

export default LyricsPanel;
