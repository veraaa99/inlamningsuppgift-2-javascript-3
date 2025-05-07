import { ThemeProvider } from "./theme-provider"

function Providers({ children }) {
  return (
    <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
    >
        {children}
    </ThemeProvider>
  )
}
export default Providers