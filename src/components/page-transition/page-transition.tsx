import { ParentComponent } from 'solid-js'
import { CSSTransition } from '~/components/css-transition/css-transition' // Use path alias for components
import * as styles from './page-transition.css' // Import styles from the same folder

export interface PageTransitionProps {
  forwards?: boolean
}

export const PageTransition: ParentComponent<PageTransitionProps> = (props) => (
  <CSSTransition
    enter={props.forwards ? styles.enterForwards : styles.enterBackwards}
    exit={props.forwards ? styles.exitForwards : styles.exitBackwards}
  >
    {props.children}
  </CSSTransition>
)
