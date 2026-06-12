import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ProductDetail from './components/ProductDetail';
import CartDrawer from './components/CartDrawer';
import HelpCenter from './components/HelpCenter';

// Fetch credentials from Vite environment variables (with robust fallbacks)
const SHOP_NAME = import.meta.env.VITE_SHOP_NAME || 'Koseli Cart Nepal';
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '+977 9817521186';
const INSTAGRAM_URL = import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/shop.koselicart';
const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || 'koselicart@gmail.com';
const CURRENCY = import.meta.env.VITE_CURRENCY || 'Rs.';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortOption, setSortOption] = useState('default');

  // Theme State
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('koselicart_theme');
      return saved || 'light';
    } catch {
      return 'light';
    }
  });

  // Cart States
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('koselicart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Active Product for Full Page details view
  const [selectedProduct, setSelectedProduct] = useState(null);

  // View routing states
  const [activeView, setActiveView] = useState('catalog'); // 'catalog' | 'product-detail' | 'help-center'
  const [helpCenterTab, setHelpCenterTab] = useState('help');
  const [visibleCount, setVisibleCount] = useState(6);

  // Order Placement Confirmation Screen state
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Sync Theme to HTML class list
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('koselicart_theme', theme);
  }, [theme]);

  // Sync Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('koselicart_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Load Products JSON on Startup
  useEffect(() => {
    fetch('/products.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load products database.');
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Handle URL deep-linking on database load
  useEffect(() => {
    if (!loading && products.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const productId = params.get('product');
      const view = params.get('view');
      const tab = params.get('tab');

      if (view === 'help-center') {
        setActiveView('help-center');
        if (tab) setHelpCenterTab(tab);
        setSelectedProduct(null);
      } else if (productId) {
        const found = products.find((p) => p.id === productId);
        if (found) {
          setSelectedProduct(found);
          setActiveView('product-detail');
        }
      }
    }
  }, [loading, products]);

  // Listen to browser back/forward buttons to sync selected product
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const productId = params.get('product');
      const view = params.get('view');
      const tab = params.get('tab');

      if (view === 'help-center') {
        setActiveView('help-center');
        if (tab) setHelpCenterTab(tab);
        setSelectedProduct(null);
        return;
      }

      if (productId && products.length > 0) {
        const found = products.find((p) => p.id === productId);
        if (found) {
          setSelectedProduct(found);
          setActiveView('product-detail');
          return;
        }
      }

      setSelectedProduct(null);
      setActiveView('catalog');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Set selected product and sync browser history
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    if (product) {
      setActiveView('product-detail');
      window.history.pushState(null, '', `?product=${product.id}`);
    } else {
      setActiveView('catalog');
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  const handleOpenHelpCenter = (tab) => {
    setActiveView('help-center');
    setHelpCenterTab(tab);
    window.history.pushState(null, '', `?view=help-center&tab=${tab}`);
  };

  const handleCloseHelpCenter = () => {
    setActiveView('catalog');
    window.history.pushState(null, '', window.location.pathname);
  };

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((product) => {
      // Category Filter
      const matchCategory = activeCategory === 'all' || product.category === activeCategory;
      
      // Search Query Filter
      const matchSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      // Sorting
      if (sortOption === 'price-low') {
        return a.price - b.price;
      }
      if (sortOption === 'price-high') {
        return b.price - a.price;
      }
      if (sortOption === 'rating') {
        return b.rating - a.rating;
      }
      // 'default' (featured or original array order)
      return 0;
    });

  // Cart Actions
  const handleAddToCart = (product, size, color) => {
    const uniqueKey = `${product.id}-${size}-${color}`;
    
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.uniqueKey === uniqueKey);
      if (existingItem) {
        return prevItems.map((item) =>
          item.uniqueKey === uniqueKey ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [
          ...prevItems,
          {
            uniqueKey,
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            size,
            color,
            qty: 1
          }
        ];
      }
    });

    // Close product view & slide open cart drawer for direct confirmation
    handleSelectProduct(null);
    setIsCartOpen(true);
  };

  const handleUpdateQty = (uniqueKey, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(uniqueKey);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.uniqueKey === uniqueKey ? { ...item, qty: newQty } : item
        )
      );
    }
  };

  const handleRemoveItem = (uniqueKey) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.uniqueKey !== uniqueKey));
  };

  // Trigger WhatsApp redirection, clear cart session, and open thank you screen
  const handleCheckout = (whatsappUrl) => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setCartItems([]); // Clear session
    setIsCartOpen(false);
    handleSelectProduct(null); // Back to home listing
    setShowConfirmation(true); // Open thank you overlay
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  // Helper to clear selected product when searching or changing categories in Navbar
  const handleNavbarCategorySelect = (category) => {
    handleSelectProduct(null);
    setActiveView('catalog');
    setActiveCategory(category);
    setVisibleCount(6); // reset page count
  };

  const handleNavbarSearch = (query) => {
    handleSelectProduct(null);
    setActiveView('catalog');
    setSearchQuery(query);
    setVisibleCount(6); // reset page count
  };

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={handleNavbarSearch}
        activeCategory={activeCategory}
        setActiveCategory={handleNavbarCategorySelect}
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        shopName={SHOP_NAME}
        instagramUrl={INSTAGRAM_URL}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading collection catalog...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '100px 24px', color: 'var(--secondary-color)' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: '12px' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3>Failed to load products</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontSize: '0.9rem' }}>{error}</p>
        </div>
      ) : activeView === 'product-detail' && selectedProduct ? (
        /* Render Full Product Detail Page */
        <ProductDetail
          product={selectedProduct}
          onClose={() => handleSelectProduct(null)}
          onAddToCart={handleAddToCart}
          whatsappNumber={WHATSAPP_NUMBER}
          onCheckout={handleCheckout}
          currency={CURRENCY}
        />
      ) : activeView === 'help-center' ? (
        /* Render Help Center Portal */
        <HelpCenter
          activeTab={helpCenterTab}
          setActiveTab={setHelpCenterTab}
          onClose={handleCloseHelpCenter}
          shopName={SHOP_NAME}
          whatsappNumber={WHATSAPP_NUMBER}
          supportEmail={SUPPORT_EMAIL}
        />
      ) : (
        /* Render Dashboard Catalog Grid */
        <Dashboard
          products={filteredProducts}
          activeCategory={activeCategory}
          setActiveCategory={handleNavbarCategorySelect}
          onProductClick={handleSelectProduct}
          sortOption={sortOption}
          setSortOption={setSortOption}
          currency={CURRENCY}
          instagramUrl={INSTAGRAM_URL}
          flashSaleProducts={searchQuery === '' && activeCategory === 'all' ? products.filter(p => p.isFlashSale).slice(0, 6) : []}
          visibleCount={visibleCount}
          onLoadMore={() => setVisibleCount((prev) => prev + 6)}
          hasMore={filteredProducts.length > visibleCount}
        />
      )}

      {/* Footer Directory */}
      <footer className="footer">
        <div className="container">
          <div className="footer-directory">
            {/* Col 1: About Koseli Cart Nepal */}
            <div className="footer-col">
              <div className="footer-logo" style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/nepal.png" alt="Nepal Flag" style={{ height: '20px', width: 'auto', objectFit: 'contain' }} /> {SHOP_NAME}
              </div>
              <p className="footer-desc">
                Your ultimate curated shopping cart in Nepal. Browse premium clothing, footwear, and cosmetics. Checkout directly via encrypted WhatsApp messaging.
              </p>
              <div className="footer-socials">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="footer-social-link" title="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="footer-social-link" title="WhatsApp Support">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2: Customer Care */}
            <div className="footer-col">
              <h3>Customer Care</h3>
              <ul>
                <li><a onClick={() => handleOpenHelpCenter('help')}>Help Center</a></li>
                <li><a onClick={() => handleOpenHelpCenter('how-to-buy')}>How to Buy</a></li>
                <li><a onClick={() => handleOpenHelpCenter('contact')}>Contact Us</a></li>
              </ul>
            </div>

            {/* Col 3: Policy */}
            <div className="footer-col">
              <h3>{SHOP_NAME} & Policy</h3>
              <ul>
                <li><a onClick={() => handleOpenHelpCenter('terms')}>Terms & Conditions</a></li>
                <li><a onClick={() => handleOpenHelpCenter('privacy')}>Privacy Policy</a></li>
                <li><a onClick={() => handleOpenHelpCenter('payments')}>Digital Payments</a></li>
                <li><a onClick={() => handleOpenHelpCenter('help')}>Code of Conduct</a></li>
              </ul>
            </div>

            {/* Col 4: Digital Payments Badges */}
            <div className="footer-col">
              <h3>Digital Payments</h3>
              <p className="footer-desc" style={{ marginBottom: '12px' }}>We accept prepayments via digital wallets or bank transfer:</p>
              <div className="payment-badges-grid">
                <div className="payment-badge esewa" title="eSewa Wallet">eSewa</div>
                <div className="payment-badge khalti" title="Khalti Wallet">Khalti</div>
                <div className="payment-badge ime" title="IME Pay">IME Pay</div>
                <div className="payment-badge card" title="Fonepay / Mobile Banking">Fonepay</div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>&copy; {new Date().getFullYear()} {SHOP_NAME}. All Rights Reserved.</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Secure Shopping Guaranteed</span>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        whatsappNumber={WHATSAPP_NUMBER}
        onCheckout={handleCheckout}
        currency={CURRENCY}
      />

      {/* Order Confirmation Overlay Modal */}
      {showConfirmation && (
        <div className="modal-overlay" onClick={() => setShowConfirmation(false)}>
          <div className="modal-container" style={{ maxWidth: '440px', padding: '32px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>Order Initiated!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '24px' }}>
              Thank you for contacting us! We have opened WhatsApp to process your order. Keep shopping & keep enjoying! 🛍️✨
            </p>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowConfirmation(false)}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Floating Email Us Button */}
      <a 
        href={`mailto:${SUPPORT_EMAIL}?subject=Inquiry%20from%20${SHOP_NAME}%20Customer`}
        className="floating-email-btn animate-fade-in"
        title="Email Us"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
        <span>Email Us</span>
      </a>
    </>
  );
}
