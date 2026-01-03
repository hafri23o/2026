import { VoidComponent } from 'solid-js'
import { version, description } from '../../../package.json'  // Ensure path is correct
import { Scaffold } from '~/components/scaffold/scaffold'      // Ensure correct import path
import * as styles from './about.css'                            // Import styles from CSS-in-TS

// Define the AboutPage component
const AboutPage: VoidComponent = () => (
  <Scaffold title="About" scrollable>
    <section class={styles.section}>
      {/* Logo image */}
      <img src="/icons/icon_responsive.svg" class={styles.logo} alt="Osho Digital Library Logo" />

      {/* Version and Description */}
      <div>{version}</div>
      <h1 class={styles.title}>Osho Digital Library</h1>
      <div>{description}</div>

      {/* External Links */}
      <a href="https://github.com/minht11/local-music-pwa" target="_blank" rel="noopener noreferrer">
        Source code on Github
      </a>
      <a href="https://github.com/minht11/local-music-pwa#privacy" target="_blank" rel="noopener noreferrer">
        Privacy
      </a>
    </section>
  </Scaffold>
)

export default AboutPage
