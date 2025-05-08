import { AuthProvider } from "@/context/authContext"
import { ThemeProvider } from "./theme-provider"

function Providers({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      >
          {children}
      </ThemeProvider>
    </AuthProvider>
    
  )
}
export default Providers