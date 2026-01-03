import { JSXElement } from 'solid-js'; // Correctly importing JSXElement from Solid.js
import { MusicImage } from '~/components/music-image/music-image'; // Path resolved via `~`
import { BaseMusicItem } from '~/types/types'; // Path resolved via `~`
import * as styles from './info-card.css'; // Import styles from the associated Vanilla Extract CSS file

export interface InfoCardProps {
  actions?: JSXElement; // Optional prop for actions (Solid.js element)
  label?: string; // Optional label
  secondaryInfo: JSXElement; // Solid.js JSX for secondary info (could be any HTML or custom component)
  item: BaseMusicItem; // BaseMusicItem type for the music item being displayed
}

export const InfoCard = (props: InfoCardProps): JSXElement => (
  <section class={styles.content}> 
    {/* The section element uses the 'content' class from Vanilla Extract */}
    <MusicImage item={props.item} class={styles.musicImage} /> 
    {/* Rendering the MusicImage component with the 'musicImage' style */}
    <div class={styles.details}> 
      {/* A div that holds the details, styled with the 'details' class */}
      <div class={styles.secondary}>{props.label}</div> 
      {/* Displaying the label if provided, styled with the 'secondary' class */}
      <h1 class={styles.title}>{props.item.name}</h1> 
      {/* Displaying the name of the item (music name), styled with the 'title' class */}

      <div class={styles.secondary}>{props.secondaryInfo}</div> 
      {/* Displaying secondary info */}
      
      <div class={styles.actions}>{props.actions}</div> 
      {/* Displaying actions if provided, styled with the 'actions' class */}
    </div>
  </section>
);
