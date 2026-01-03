import { ParentComponent, ErrorBoundary } from 'solid-js'

// Fallback component for handling errors
const Fallback = (error: Error) => (
  <div style="user-select: text;">
    <div>Unknown error has occurred, please</div>
    <a href="/">Reload</a>
    <details>
      <summary>Internal Error logs</summary>
      {/* Log error information for debugging */}
      {console.log(error)}
      <p>{error.stack?.toString()}</p>
    </details>
  </div>
)

// The ErrorPage component, wrapping children with the ErrorBoundary
export const ErrorPage: ParentComponent = (props) => (
  <ErrorBoundary fallback={Fallback}>{props.children}</ErrorBoundary>
)
