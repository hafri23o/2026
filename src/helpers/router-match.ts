import { useLocation, useMatch } from 'solid-app-router'
import { createMemo, untrack } from 'solid-js'

type ValueMapper<T> = T extends () => infer R ? R : T

export const useMapRouteToValue = <T>(
  mapping: Record<string, () => ValueMapper<T>>,
  defaultValue?: T,
) => {
  const matcherEntries = Object.entries(mapping).map(
    ([path, valueFn]) => [useMatch(() => path), valueFn] as const,
  )

  const location = useLocation()

  const valueFnMemo = createMemo(() => {
    // Ensure that we are tracking the `pathname` change.
    location.pathname

    // Find the first match for the current path
    const match = untrack(() => matcherEntries.find(([matcher]) => matcher()))

    // If no match found, return the default value
    if (!match) {
      return () => defaultValue
    }

    // Return the value function associated with the matched route
    return match[1]
  })

  return createMemo(() => valueFnMemo()())
}
