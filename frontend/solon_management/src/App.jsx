import AppRoutes from './routes/AppRoutes.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { LandingImagesProvider } from './context/LandingImagesContext.jsx'
import { ServiceImagesProvider } from './context/ServiceImagesContext.jsx'
import { ProductCatalogProvider } from './context/ProductCatalogContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'

function App() {
  return (
    <ThemeProvider>
      <LandingImagesProvider>
        <ServiceImagesProvider>
          <ProductCatalogProvider>
            <WishlistProvider>
              <CartProvider>
                <AppRoutes />
              </CartProvider>
            </WishlistProvider>
          </ProductCatalogProvider>
        </ServiceImagesProvider>
      </LandingImagesProvider>
    </ThemeProvider>
  )
}

export default App
