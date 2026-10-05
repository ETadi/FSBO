import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import { SellerProvider } from './context/SellerContext.jsx'
import RootLayout from './layouts/RootLayout.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import Home from './pages/Home.jsx'
import BrowseListings from './pages/BrowseListings.jsx'
import ListingDetail from './pages/ListingDetail.jsx'
import ServicesMarketplace from './pages/ServicesMarketplace.jsx'
import ServiceProviderProfile from './pages/ServiceProviderProfile.jsx'
import HowItWorks from './pages/HowItWorks.jsx'
import Pricing from './pages/Pricing.jsx'
import Cart from './pages/Cart.jsx'
import SellerDashboard from './pages/SellerDashboard.jsx'
import CreateListing from './pages/CreateListing.jsx'
import NotFound from './pages/NotFound.jsx'
import ErrorPage from './pages/ErrorPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'listings', element: <BrowseListings /> },
      { path: 'listings/:id', element: <ListingDetail /> },
      { path: 'services', element: <ServicesMarketplace /> },
      { path: 'providers/:id', element: <ServiceProviderProfile /> },
      { path: 'how-it-works', element: <HowItWorks /> },
      { path: 'pricing', element: <Pricing /> },
      { path: 'cart', element: <Cart /> },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <SellerDashboard /> },
          { path: 'listings/new', element: <CreateListing /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function App() {
  return (
    <CartProvider>
      <SellerProvider>
        <RouterProvider router={router} />
      </SellerProvider>
    </CartProvider>
  )
}
