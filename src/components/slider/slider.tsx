import { createEffect, JSX, JSXElement, mergeProps } from 'solid-js'
import { clx } from '../../utils'
import * as styles from './slider.css'

export type SliderProps = Omit<JSX.HTMLAttributes<HTMLInputElement>, 'ref'> & {
  disabled?: boolean
  min?: number
  max?: number
  value: number
}

export const Slider = (props: SliderProps): JSXElement => {
  // Merging default and user-provided props
  const mergedProps = mergeProps(
    {
      min: 0,
      max: 100,
    },
    props,
  )

  let inputEl!: HTMLInputElement

  // Create an effect to update the slider value dynamically
  createEffect(() => {
    const percentage = (mergedProps.value * 100) / mergedProps.max
    const percentageSafe = Number.isFinite(percentage) ? percentage : 0

    // Update the slider CSS variable with the computed percentage
    inputEl.style.setProperty(styles.sliderValueVarName, `${percentageSafe}%`)
  })

  return (
    <input
      {...mergedProps} // Spread the merged props (like value, min, max, etc.)
      ref={inputEl} // Reference to the input element for direct manipulation
      type="range" // Slider input type
      class={clx(styles.slider, props.class)} // Combine the class from props and Vanilla Extract styles
      disabled={props.disabled} // Disable the slider if the prop is set
    />
  )
}
