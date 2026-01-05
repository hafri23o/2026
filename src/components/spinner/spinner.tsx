import { VoidComponent } from 'solid-js'
import { clx } from '../../utils'  // Assuming this is a utility for className merging
import * as styles from './spinner.css'

// SpinnerProps interface remains the same for optional className
export interface SpinnerProps {
  class?: string
}

// Functional component for the Spinner
export const Spinner: VoidComponent<SpinnerProps> = (props) => {
  return (
    <svg
      class={clx(styles.spinner, props.class)} // Combine spinner styles with any passed className
      viewBox='0 0 66 66'
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle class={styles.path} cx="33" cy="33" r="30" />
    </svg>
  )
}
