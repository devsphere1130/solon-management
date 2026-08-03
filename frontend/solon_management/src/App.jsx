import AppRoutes from './routes/AppRoutes.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { LandingImagesProvider } from './context/LandingImagesContext.jsx'

function App() {
  return (
    <ThemeProvider>
      <LandingImagesProvider>
        <AppRoutes />
      </LandingImagesProvider>
    </ThemeProvider>
  )
}

export default App
