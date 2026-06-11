import React from 'react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  whatsappNumber,
  onCheckout,
  currency = 'Rs.'
}) {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Generate WhatsApp redirection URL for multiple items
  const getWhatsAppCartLink = () => {
    const cleanPhone = whatsappNumber.replace(/\D/g, '');
    
    let itemsText = '';
    cartItems.forEach((item, index) => {
      const productLink = `${window.location.origin}${window.location.pathname}?product=${item.id}`;
      itemsText += `${index + 1}. *${item.name}*\n`;
      if (item.size || item.color) {
        const variants = [];
        if (item.size) variants.push(`Size: ${item.size}`);
        if (item.color) variants.push(`Color: ${item.color}`);
        itemsText += `   _${variants.join(' | ')}_\n`;
      }
      itemsText += `   Qty: ${item.qty} × ${currency}${item.price.toLocaleString()} = *${currency}${(item.price * item.qty).toLocaleString()}*\n`;
      itemsText += `   _Link:_ ${productLink}\n\n`;
    });

    const message = `Hello! I would like to order the following items from your shop:

*Order Summary:*
${itemsText}*Total Amount:* *${currency}${subtotal.toLocaleString()}*

Please verify availability and let me know the payment options. Thanks!`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const handleCheckout = () => {
    onCheckout(getWhatsAppCartLink());
  };

  return (
    <>
      {/* Overlay Background */}
      {isOpen && (
        <div 
          className="cart-drawer-overlay" 
          onClick={onClose}
        />
      )}

      {/* Cart Drawer Container */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h2>Your Cart ({cartItems.reduce((sum, item) => sum + item.qty, 0)})</h2>
          <button 
            className="cart-close-btn" 
            onClick={onClose}
            aria-label="Close cart drawer"
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Cart Items List */}
        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything to your cart yet. Let's find some amazing style items!</p>
              <button 
                className="btn btn-secondary" 
                onClick={onClose}
                style={{ marginTop: '8px' }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.uniqueKey} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="cart-item-details">
                  <h4 className="cart-item-name">{item.name}</h4>
                  
                  {(item.size || item.color) && (
                    <span className="cart-item-variant">
                      {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`]
                        .filter(Boolean)
                        .join(' | ')}
                    </span>
                  )}

                  <span className="cart-item-price">
                    {currency}{(item.price * item.qty).toLocaleString()}
                  </span>

                  <div className="cart-item-actions">
                    <div className="quantity-selector">
                      <button 
                        className="qty-btn"
                        onClick={() => onUpdateQty(item.uniqueKey, item.qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="qty-value">{item.qty}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => onUpdateQty(item.uniqueKey, item.qty + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button 
                      className="cart-item-remove"
                      onClick={() => onRemoveItem(item.uniqueKey)}
                      aria-label="Remove item"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Summary and Action */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-row">
              <span>Total Items:</span>
              <span>{cartItems.reduce((sum, item) => sum + item.qty, 0)}</span>
            </div>
            <div className="cart-summary-row cart-summary-total">
              <span>Total Amount:</span>
              <span className="gradient-text">
                {currency}{subtotal.toLocaleString()}
              </span>
            </div>
            
            <button
              className="btn btn-whatsapp cart-checkout-btn"
              onClick={handleCheckout}
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
              Place Order on WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
