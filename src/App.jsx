import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WishlistProvider } from './context/WishlistContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import CustomOrders from './pages/CustomOrders';
import About from './pages/About';
import Contact from './pages/Contact';
import WhatsAppButton from './components/WhatsAppButton';
import Admin from './pages/Admin';
import BabyCollection from './pages/BabyCollection';
import Wishlist from './pages/Wishlist';
import TermsAndConditions from './pages/TermsAndConditions';
import { ProductProvider } from './context/ProductContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { ImageModalProvider } from './context/ImageModalContext';
import { AuthProvider } from './context/AuthContext';
import { CustomOrdersProvider } from './context/CustomOrdersContext';
import { ConfigProvider } from './context/ConfigContext';
import AuthModal from './components/AuthModal';

function App() {
  return (
    <WishlistProvider>
      <AuthProvider>
        <ProductProvider>
          <ReviewsProvider>
            <ConfigProvider>
              <CustomOrdersProvider>
                <ImageModalProvider>
                  <Router>
                    <div className="app-wrapper">
                      <Header />
                      <main>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/shop" element={<Shop />} />
                          <Route path="/baby-collection" element={<BabyCollection />} />
                          <Route path="/wishlist" element={<Wishlist />} />
                          <Route path="/custom-orders" element={<CustomOrders />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                          <Route path="/admin" element={<Admin />} />
                        </Routes>
                      </main>
                      <Footer />
                      <WhatsAppButton />
                      <AuthModal />
                    </div>
                  </Router>
                </ImageModalProvider>
              </CustomOrdersProvider>
            </ConfigProvider>
          </ReviewsProvider>
        </ProductProvider>
      </AuthProvider>
    </WishlistProvider>
  );
}

export default App;
