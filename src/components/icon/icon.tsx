import { VoidComponent } from 'solid-js';
import { clx } from '~/utils'; // Ensure `clx` is defined in ~/utils.ts or ~/utils/index.ts
import { ICON_PATHS } from './icon-paths'; // Make sure ICON_PATHS is correctly imported
import * as styles from './icon.css'; // CSS module import for styles

export type IconType = keyof typeof ICON_PATHS;

export interface IconProps {
  icon: IconType;
  class?: string;
}

export const Icon: VoidComponent<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" class={clx(styles.icon, props.class)}>
    <path d={ICON_PATHS[props.icon]} />
  </svg>
);
