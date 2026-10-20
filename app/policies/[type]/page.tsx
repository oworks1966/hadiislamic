const pages: Record<string, { title: string; subtitle: string; text: string[] }> = {
  shipping: {
    title: 'Shipping & Delivery Policy',
    subtitle: 'Fast, secure delivery across all major cities and towns in Pakistan.',
    text: [
      'We offer nationwide delivery across Pakistan where courier coverage is available. All orders are packed securely with food-grade protective wrap to preserve date freshness and packaging integrity.',
      'Delivery Timeline: Orders in Lahore and surrounding regions are typically delivered within 24 to 48 hours. Orders to Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, and other cities are delivered within 2 to 4 working days.',
      'Shipping Fees: Standard nationwide shipping is Rs. 250. Orders over Rs. 3,000 qualify for FREE standard delivery across Pakistan.',
      'Cash on Delivery (COD): Available for all destinations. Please inspect parcel exterior before paying the courier rider.',
      'Order Tracking: You will receive tracking details via SMS/WhatsApp once your order is dispatched from our Lahore central dispatch facility.'
    ]
  },
  returns: {
    title: 'Return & Refund Policy',
    subtitle: 'Transparent, customer-friendly return guidelines for complete peace of mind.',
    text: [
      'Customer satisfaction is our utmost priority at Hadi Islamic. If you receive a damaged, compromised, or incorrect product, please notify us within 7 days of delivery.',
      'To initiate a return or exchange, send photos of the parcel and invoice to our WhatsApp helpline (+92 345 1579846). Our support team is available 24/7 to resolve your issue.',
      'Eligible Items: Unused prayer mats, unopened Ihram fabrics, accessories, and sealed non-perishable goods in original condition.',
      'Perishable / Edible Items: For health, hygiene, and Halal food safety standards, opened food items such as dates and honey cannot be returned unless received in spoiled or damaged condition upon arrival.',
      'Refunds: Approved refunds are processed via Bank Transfer, Raast, or JazzCash within 3 to 5 business days.'
    ]
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How we collect, protect, and handle your personal shopping details.',
    text: [
      'Hadi Islamic respects your privacy and is committed to protecting your personal information. We collect only necessary details to process your orders, arrange delivery, and provide customer support.',
      'Information Collected: Your name, contact telephone number, delivery address, email, and any specific delivery notes.',
      'Use of Information: Your data is exclusively used for courier consignment generation, order status notifications, and customer service. We never sell, rent, or trade your personal information to third parties.',
      'Payment Security: Online payments and manual transfers are conducted securely. We do not store credit card or banking credentials on our web servers.'
    ]
  },
  terms: {
    title: 'Terms & Conditions',
    subtitle: 'Standard operational terms governing orders placed on Hadi Islamic.',
    text: [
      'By placing an order on Hadi Islamic, you agree to these operational terms. All prices are listed in Pakistani Rupees (PKR) and include applicable local duties.',
      'Product Authenticity: All Saudi dates, Zam Zam water, and Sunnah items are genuine imports sourced from trusted growers and certified distributors.',
      'Order Confirmation: Orders placed on the website or through WhatsApp are subject to item availability and confirmation by our operations desk.',
      'Store Location: Our registered physical flagship store is located at Shop # G-5 Ground Floor, Shalimar Square Mall, Shalimar Link Road, Singhpura, Lahore, 54000, Pakistan (Open 24 Hours).'
    ]
  }
};

export default async function Policy({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const p = pages[type] || pages.privacy;
  return (
    <div className="shell section policy-page">
      <p className="eyebrow">CUSTOMER SUPPORT & GUIDANCE</p>
      <h1>{p.title}</h1>
      <p className="policy-subtitle">{p.subtitle}</p>
      <div className="policy-card">
        {p.text.map((t, idx) => (
          <p key={idx} className="policy-para">{t}</p>
        ))}
      </div>
      <div className="policy-contact-box">
        <h3>Have questions or need assistance?</h3>
        <p>Our Lahore helpline is open 24 hours a day, 7 days a week.</p>
        <a 
          href="https://wa.me/923451579846?text=Assalamualaikum,%20I%20have%20a%20question%20regarding%20store%20policies."
          target="_blank" 
          rel="noreferrer"
          className="btn btn-wa-sm"
        >
          Chat with Customer Support on WhatsApp
        </a>
      </div>
    </div>
  );
}
