import React, { useState, useEffect } from 'react';

const getMockFlashSaleStock = (productId, availableStock) => {
  const seed = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const sold = (seed % 15) + 12; // stable mock sold amount: 12-26
  const total = sold + availableStock;
  const percent = Math.round((sold / total) * 100);
  return { sold, left: availableStock, percent };
};


const CATEGORY_ICONS = {
  all: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  clothes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46L16 5.5V2h-8v3.5L3.62 3.46a1 1 0 0 0-1.34.45L.43 7.5a1 1 0 0 0 .3 1.25L4 11v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V11l3.27-2.25a1 1 0 0 0 .3-1.25l-1.85-3.59a1 1 0 0 0-1.34-.45z" />
    </svg>
  ),
  footwear: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18c0-3 2-6 8-6h10v3c0 2-3 3-6 3H3z" />
      <path d="M12 12V8c0-2-1-3-3-3H4" strokeLinecap="round" />
      <path d="M3 18v2h18v-2" />
    </svg>
  ),
  cosmetics: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="12" width="12" height="10" rx="2" />
      <path d="M9 12V7a3 3 0 0 1 6 0v5" />
      <path d="M9 6h6" />
    </svg>
  ),
  babywear: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 0 0-4 4v7.5L5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3l-3-1.5V6a4 4 0 0 0-4-4z" />
      <circle cx="12" cy="11" r="1.5" fill="currentColor" />
      <circle cx="12" cy="15" r="1.5" fill="currentColor" />
    </svg>
  )
};

const CATEGORY_LABELS = {
  all: 'All Shop',
  clothes: 'Clothes',
  footwear: 'Footwear',
  cosmetics: 'Cosmetics',
  babywear: 'Babywear'
};

export default function Dashboard({
  products,
  activeCategory,
  setActiveCategory,
  onProductClick,
  sortOption,
  setSortOption,
  currency = 'Rs.',
  instagramUrl = '#',
  flashSaleProducts = [],
  visibleCount = 6,
  onLoadMore,
  hasMore = false
}) {
  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // Countdown resets at next midnight
      const diff = midnight - now;

      if (diff <= 0) {
        return { hours: '00', minutes: '00', seconds: '00' };
      }

      const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
      const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
      const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container" style={{ flexGrow: 1 }}>
      {/* Instagram Story-style Category Quick Navigation */}
      <section className="category-strip">
        <div className="category-flex">
          {Object.keys(CATEGORY_ICONS).map((catKey) => (
            <div
              key={catKey}
              className={`category-bubble-item ${activeCategory === catKey ? 'active' : ''}`}
              onClick={() => setActiveCategory(catKey)}
            >
              <div className="category-ring">
                <div className="category-bubble">
                  {CATEGORY_ICONS[catKey]}
                </div>
              </div>
              <span className="category-title">{CATEGORY_LABELS[catKey]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Hero Banner Section */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-tag">New Season Arrivals</span>
          <h1>Upgrade Your Wardrobe & Style</h1>
          <p>
            Explore our curated catalog of designer apparel, premium footwear, luxury cosmetics, and organic baby wear. Click on any item to view details and order directly via WhatsApp.
          </p>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Follow our Instagram
          </a>
        </div>
      </section>

      {/* Flash Sale Section */}
      {flashSaleProducts && flashSaleProducts.length > 0 && (
        <section className="flash-sale-section animate-fade-in">
          <div className="flash-sale-header">
            <div className="flash-sale-title-box">
              <span className="flash-sale-tag">
                ⚡ Flash Sale
              </span>
              <div className="flash-sale-timer">
                <span>Ending In:</span>
                <div className="timer-digits">
                  <span className="timer-pill">{timeLeft.hours}</span>:
                  <span className="timer-pill">{timeLeft.minutes}</span>:
                  <span className="timer-pill">{timeLeft.seconds}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flash-sale-scroll">
            {flashSaleProducts.map((product) => {
              const hasDiscount = product.originalPrice > product.price;
              const discountPercentage = hasDiscount
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;
              const stockInfo = getMockFlashSaleStock(product.id, product.stock);

              return (
                <div key={`flash-${product.id}`} className="flash-card">
                  {hasDiscount && (
                    <span className="flash-badge">-{discountPercentage}% Off</span>
                  )}
                  <div className="flash-image-wrapper" onClick={() => onProductClick(product)}>
                    <img src={product.images[0]} alt={product.name} />
                  </div>
                  <div className="flash-info">
                    <h4 className="flash-title" onClick={() => onProductClick(product)} title={product.name}>
                      {product.name}
                    </h4>
                    <div className="flash-price-row">
                      <span className="flash-price">{currency}{product.price.toLocaleString()}</span>
                      {hasDiscount && (
                        <span className="flash-old-price">{currency}{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="stock-progress-container">
                      <div className="stock-progress-label">
                        <span>{stockInfo.percent}% Sold</span>
                        <span>{stockInfo.left} left</span>
                      </div>
                      <div className="stock-progress-track">
                        <div className="stock-progress-fill" style={{ width: `${stockInfo.percent}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Product List Header / Filters */}
      <section className="filter-bar">
        <h2 className="section-heading">
          {activeCategory === 'all' 
            ? 'Just For You' 
            : `Shop ${CATEGORY_LABELS[activeCategory]}`}
          <span style={{ fontSize: '1rem', color: 'var(--text-muted)', marginLeft: '12px', fontWeight: 500 }}>
            ({products.length} {products.length === 1 ? 'item' : 'items'})
          </span>
        </h2>
        <div className="filter-actions">
          <select
            className="filter-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            aria-label="Sort products"
          >
            <option value="default">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </section>

      {/* Product Catalog Grid */}
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-muted)' }}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginBottom: '16px' }}
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <h3>No products found</h3>
          <p style={{ marginTop: '8px' }}>Try resetting your search query or choosing another category.</p>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {products.slice(0, visibleCount).map((product) => {
              const hasDiscount = product.originalPrice > product.price;
              const discountPercentage = hasDiscount
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <article key={product.id} className="product-card">
                  {hasDiscount && (
                    <span className="product-badge">-{discountPercentage}% Off</span>
                  )}
                  
                  <div 
                    className="product-image-container"
                    onClick={() => onProductClick(product)}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                    />
                  </div>

                  <div className="product-info">
                    <span className="product-card-category">
                      {CATEGORY_LABELS[product.category] || product.category}
                    </span>
                    
                    <h3 
                      className="product-card-title"
                      onClick={() => onProductClick(product)}
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    <div className="product-card-footer">
                      <div className="product-price-box">
                        <span className="product-price">
                          {currency}{product.price.toLocaleString()}
                        </span>
                        {hasDiscount && (
                          <span className="product-original-price">
                            {currency}{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <button
                        className="product-card-buy-btn"
                        onClick={() => onProductClick(product)}
                        aria-label={`View options for ${product.name}`}
                        title="View Details & Order"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {hasMore && (
            <div className="load-more-container">
              <button className="btn-load-more animate-fade-in" onClick={onLoadMore}>
                Load More Products
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
