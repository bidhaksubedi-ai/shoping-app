import React, { useState, useEffect } from 'react';

export default function ProductDetail({
  product,
  onClose,
  onAddToCart,
  whatsappNumber,
  onCheckout,
  currency = 'Rs.'
}) {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (product) {
      setActiveImageIndex(0);
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0] || '');
    }
  }, [product]);

  // Build direct WhatsApp link for single item checkout
  const getWhatsAppLink = () => {
    const cleanPhone = whatsappNumber.replace(/\D/g, '');
    const productLink = `${window.location.origin}${window.location.pathname}?product=${product.id}`;
    const message = `Hello! I would like to buy this product from your store:

*Product Details:*
- *Name:* ${product.name}
${selectedSize ? `- *Size:* ${selectedSize}` : ''}
${selectedColor ? `- *Color:* ${selectedColor}` : ''}
- *Price:* ${currency}${product.price.toLocaleString()}
- *Link:* ${productLink}

Please let me know if it's available!`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const handleBuyNow = () => {
    onCheckout(getWhatsAppLink());
  };

  const handleAddClick = () => {
    onAddToCart(product, selectedSize, selectedColor);
  };

  const hasDiscount = product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="container detail-page-wrapper">
      {/* Back to Shop Navigation Button */}
      <button className="back-to-shop-btn" onClick={onClose} aria-label="Back to catalog">
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
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Catalog
      </button>

      {/* Grid Content */}
      <div className="detail-page-grid">
        {/* Gallery Column */}
        <div className="modal-gallery-container">
          <div className="modal-main-image">
            <img
              src={product.images[activeImageIndex]}
              alt={`${product.name} active preview`}
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="modal-thumbnails">
              {product.images.map((imgUrl, index) => (
                <div
                  key={index}
                  className={`thumbnail-item ${index === activeImageIndex ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img src={imgUrl} alt={`${product.name} thumb ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="modal-details">
          <div>
            <span className="modal-category">{product.category}</span>
            <h1 className="modal-title" style={{ marginTop: '4px' }}>{product.name}</h1>
          </div>



          {/* Price Box */}
          <div className="modal-prices">
            <span className="modal-price">
              {currency}{product.price.toLocaleString()}
            </span>
            {hasDiscount && (
              <>
                <span className="modal-original-price">
                  {currency}{product.originalPrice.toLocaleString()}
                </span>
                <span className="modal-discount">
                  {discountPercentage}% OFF
                </span>
              </>
            )}
          </div>

          {/* Product Description */}
          <p className="modal-description">{product.description}</p>

          {/* Sizes selector (if available) */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="selector-group">
              <span className="selector-label">Select Size</span>
              <div className="selector-options">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`option-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors selector (if available) */}
          {product.colors && product.colors.length > 0 && (
            <div className="selector-group">
              <span className="selector-label">Select Color / Option</span>
              <div className="selector-options">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`option-btn ${selectedColor === color ? 'active' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA Actions Bar */}
          <div className="modal-actions-bar">
            <button
              className="btn btn-secondary"
              onClick={handleAddClick}
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
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Add to Cart
            </button>

            <button
              className="btn btn-whatsapp"
              onClick={handleBuyNow}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ marginRight: '4px' }}
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.725-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 1.978 14.12 .953 11.5 .953 6.062.953 1.637 5.323 1.634 10.75c-.001 1.674.452 3.307 1.312 4.745L1.906 21.9l6.505-1.704zM18.23 15.65c-.328-.164-1.942-.958-2.242-1.069-.302-.109-.521-.164-.74.164-.219.328-.847 1.069-1.039 1.288-.192.219-.384.246-.712.083-.328-.164-1.383-.51-2.637-1.627-.975-.87-1.633-1.946-1.824-2.274-.192-.329-.02-.507.144-.67.147-.146.328-.384.492-.575.164-.191.219-.328.328-.546.11-.219.055-.41-.027-.574-.082-.164-.74-1.785-1.012-2.441-.266-.641-.539-.553-.74-.563-.19-.01-.41-.01-.628-.01-.219 0-.575.082-.875.41-.3.328-1.147 1.12-1.147 2.733 0 1.614 1.175 3.17 1.339 3.389.164.219 2.313 3.532 5.602 4.951.782.337 1.393.539 1.869.69.786.25 1.5.214 2.067.13.632-.093 1.942-.793 2.216-1.558.274-.766.274-1.422.192-1.559-.082-.137-.3-.22-.628-.383z" fill="currentColor"></path>
              </svg>
              Order on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
