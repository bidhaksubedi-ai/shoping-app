import React from 'react';

const TABS = [
  { id: 'help', label: 'Help Center / FAQs', icon: '❓' },
  { id: 'how-to-buy', label: 'How to Buy', icon: '🛒' },
  { id: 'payments', label: 'Digital Payments', icon: '💳' },
  { id: 'terms', label: 'Terms & Conditions', icon: '📜' },
  { id: 'privacy', label: 'Privacy Policy', icon: '🔒' },
  { id: 'contact', label: 'Contact Us', icon: '📞' }
];

export default function HelpCenter({ activeTab, setActiveTab, onClose, shopName, whatsappNumber }) {
  const currentTab = TABS.find((t) => t.id === activeTab) ? activeTab : 'help';

  const renderContent = () => {
    switch (currentTab) {
      case 'help':
        return (
          <div className="help-content-section animate-fade-in">
            <h2>Frequently Asked Questions (FAQs)</h2>
            <p className="help-intro-text">Have a question? Find immediate answers to our most common inquiries below.</p>
            
            <div className="faq-list">
              <div className="faq-item">
                <h3 className="faq-question">1. How do I place an order?</h3>
                <p className="faq-answer">
                  Browse our collections and add products to your cart. Once you're ready, open the cart and click "Place Order on WhatsApp". This will open a WhatsApp window pre-filled with your order details. Simply hit send to connect with our sales representative, who will confirm availability and complete your order.
                </p>
              </div>

              <div className="faq-item">
                <h3 className="faq-question">2. What are the delivery charges and timescales?</h3>
                <p className="faq-answer">
                  We offer standard home delivery nationwide. Inside the main valley, delivery takes 1-2 business days (Rs. 100). Outside the valley takes 2-4 business days (Rs. 150). We offer **Free Shipping** on orders above Rs. 5,000!
                </p>
              </div>

              <div className="faq-item">
                <h3 className="faq-question">3. Can I modify or cancel my order after checkout?</h3>
                <p className="faq-answer">
                  Yes! Since all order agreements and shipping details are finalized through WhatsApp chats, you can ask our support staff directly to update sizes, quantities, or cancellation requests before the courier dispatch.
                </p>
              </div>

              <div className="faq-item">
                <h3 className="faq-question">4. What if I receive a damaged or wrong size product?</h3>
                <p className="faq-answer">
                  Please check the package immediately at delivery. If there is a sizing issue or defect, report it to our WhatsApp support agent with pictures within 24 hours of delivery. We will arrange a replacement at no extra courier charge.
                </p>
              </div>
            </div>
          </div>
        );

      case 'how-to-buy':
        return (
          <div className="help-content-section animate-fade-in">
            <h2>Step-by-Step Purchase Guide</h2>
            <p className="help-intro-text">Shopping with StyleVault is designed to be personalized, simple, and secure.</p>
            
            <div className="steps-container">
              <div className="step-card">
                <div className="step-num">01</div>
                <h4>Explore Collections</h4>
                <p>Browse through category stories or search for your favorite styles under the "Just For You" catalog section.</p>
              </div>

              <div className="step-card">
                <div className="step-num">02</div>
                <h4>Choose Details</h4>
                <p>Click on any product card to see more images and description. Select your preferred color variation and sizing dimensions.</p>
              </div>

              <div className="step-card">
                <div className="step-num">03</div>
                <h4>Add to Cart</h4>
                <p>Click "Add to Cart" to store items in your drawer. You can add items from different categories and review quantities at any time.</p>
              </div>

              <div className="step-card">
                <div className="step-num">04</div>
                <h4>WhatsApp Checkout</h4>
                <p>Open your Shopping Cart drawer and click "Place Order on WhatsApp". Your browser/app will automatically launch a secure chat containing your formatted shopping bag detail list.</p>
              </div>

              <div className="step-card">
                <div className="step-num">05</div>
                <h4>Confirm Delivery</h4>
                <p>Send the auto-written text block, then share your shipping address and payment choice with our representative to lock in delivery.</p>
              </div>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="help-content-section animate-fade-in">
            <h2>Accepted Digital Payment Methods</h2>
            <p className="help-intro-text">All orders are fully prepaid prior to shipping. We support instant digital wallet scan codes or direct bank transfers. Cash on Delivery (COD) is not supported.</p>

            <div className="payment-methods-showcase">
              <div className="payment-channel-card">
                <div className="payment-icon-large wallet">💳</div>
                <h4>eSewa / Khalti / IME Pay</h4>
                <p>Direct wallet transfers. You can send payment directly to our merchant wallet ID during order review in WhatsApp.</p>
              </div>

              <div className="payment-channel-card">
                <div className="payment-icon-large bank">🏦</div>
                <h4>Fonepay / Bank Transfer</h4>
                <p>Instant mobile banking transfer. We will send you a secure Fonepay QR code or bank account coordinates upon order confirmation.</p>
              </div>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div className="help-content-section animate-fade-in">
            <h2>Terms & Conditions of Service</h2>
            <p className="help-intro-text">Please review the rules that guide the usage of the StyleVault web storefront.</p>
            <div className="text-document">
              <p><strong>1. Introduction</strong>: Welcome to {shopName}. By accessing or using our store, you agree to comply with our Terms of Service.</p>
              <p><strong>2. Product Representations</strong>: We make every effort to display the colors, sizing, and details of our products as accurately as possible. However, the vector illustrations and screens may result in slight visual variance.</p>
              <p><strong>3. Ordering & Contracts</strong>: Placing items in the cart or triggering the WhatsApp redirect does not constitute a binding transaction contract. A purchase contract is established only when our customer care representative confirms order availability and schedules the courier dispatch.</p>
              <p><strong>4. Pricing and Availability</strong>: Prices are listed in Nepalese Rupees. In the event of pricing errors or sudden out-of-stock items, we reserve the right to decline confirmation of the order.</p>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="help-content-section animate-fade-in">
            <h2>Privacy Policy</h2>
            <p className="help-intro-text">Your privacy is extremely important to us. Learn how we handle your shipping details securely.</p>
            <div className="text-document">
              <p><strong>Data Minimization</strong>: We respect your choices. We do not run intrusive tracking cookies, tracking scripts, or custom account registrations. We do not store your name, passwords, or financial credentials on our site.</p>
              <p><strong>Cart Storage</strong>: The items you add to your shopping cart are stored locally on your device. This shopping bag data never leaves your device unless you choose to check out.</p>
              <p><strong>Third-Party Sharing</strong>: When checkout is requested, data is packaged as a WhatsApp link. All messaging interactions are covered under WhatsApp's End-to-End Encryption. Settle details, delivery addresses, and payments within the private chat window.</p>
              <p><strong>Usage of Contact Details</strong>: Senders' names and delivery addresses received on WhatsApp are exclusively handled for shipping logistics, tracking packages, and finalizing payments. We will never sell, lease, or lease your private coordinates to third parties.</p>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="help-content-section animate-fade-in">
            <h2>Contact Us</h2>
            <p className="help-intro-text">Need assistance? Contact our team directly through any of our channels below. We generally respond within a few minutes during business hours.</p>

            <div className="contact-details-box" style={{ maxWidth: '480px', margin: '0 auto' }}>
              <div className="contact-row">
                <span className="contact-icon">📱</span>
                <div>
                  <strong>WhatsApp Line</strong>
                  <p><a href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">{whatsappNumber.startsWith('+') ? whatsappNumber : `+${whatsappNumber}`}</a></p>
                </div>
              </div>

              <div className="contact-row">
                <span className="contact-icon">✉️</span>
                <div>
                  <strong>Email Support</strong>
                  <p><a href="mailto:support@stylevault.com">support@stylevault.com</a></p>
                </div>
              </div>

              <div className="contact-row">
                <span className="contact-icon">🏢</span>
                <div>
                  <strong>Office Location</strong>
                  <p>Butwal, Nepal</p>
                </div>
              </div>

              <div className="contact-row">
                <span className="contact-icon">🕒</span>
                <div>
                  <strong>Operating Hours</strong>
                  <p>Everyday: 5:00 AM - 12:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container help-center-page" style={{ flexGrow: 1, padding: '40px 16px' }}>
      <div className="help-header">
        <button className="btn-back" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Shop
        </button>
        <h1>StyleVault Customer Portal</h1>
      </div>

      <div className="help-body-layout">
        {/* Navigation Sidebar */}
        <aside className="help-sidebar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`help-sidebar-btn ${currentTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Dynamic Content Window */}
        <main className="help-content-window">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
