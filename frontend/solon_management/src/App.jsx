import AppRoutes from './routes/AppRoutes.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { LandingImagesProvider } from './context/LandingImagesContext.jsx'
import { ServiceImagesProvider } from './context/ServiceImagesContext.jsx'

function App() {
  return (
    <ThemeProvider>
      <LandingImagesProvider>
        <ServiceImagesProvider>
          <AppRoutes />
        </ServiceImagesProvider>
      </LandingImagesProvider>
    </ThemeProvider>
  )
}

export default App
