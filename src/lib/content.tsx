import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

// Texts taken from the reference store (poedagarparis.com, English/Germany market).

export const FAQ: { q: string; a: ReactNode }[] = [
  {
    q: 'How do I know if my watch will fit me perfectly?',
    a: (
      <>
        <p>We've thought of everything to ensure your watch fits perfectly as soon as you receive it:</p>
        <ul>
          <li>Each model features an easily adjustable strap to comfortably fit your wrist.</li>
          <li>We include a practical and discreet tool that allows you to adjust your strap with ease, without the need to visit a jeweler.</li>
          <li>With clear instructions provided, you can adjust your watch in just a few minutes.</li>
        </ul>
        <p>✨ So, your Poedagar will be ready to adorn your wrist right out of the box.</p>
      </>
    ),
  },
  {
    q: 'How long will it take for my watch to be delivered?',
    a: (
      <>
        <p>Your order will be prepared and shipped with the utmost care.</p>
        <p>Delivery is fast, between <strong>3 to 7 working days</strong>, depending on your location.</p>
        <p>We are committed to ensuring that your Poedagar watch reaches you as quickly as possible, carefully packaged in its case.</p>
      </>
    ),
  },
  {
    q: 'What warranty do you offer for your watches?',
    a: (
      <>
        <p>At Poedagar®, your satisfaction is our priority. That's why we offer:</p>
        <ul>
          <li>A 1-year international warranty covering any manufacturing defect or issue related to watchmaking craftsmanship. If a problem arises during this period, we will repair or replace your watch free of charge.</li>
          <li>A 14-day satisfaction or your money back policy: if your watch doesn't suit you, you can return it and receive a full refund.</li>
        </ul>
      </>
    ),
  },
  {
    q: 'How can we reach you?',
    a: (
      <>
        <p>📞 Our customer service is always available for you. From 10 AM to 6 PM, Monday to Friday.</p>
        <p>Our team can be reached by phone, WhatsApp, or via <Link to="/pages/contact">our contact form</Link> to assist you every step of the way.</p>
      </>
    ),
  },
];

export const COMMITMENTS = [
  { icon: 'truck', title: 'Free delivery', text: 'Free delivery is available for eligible destinations. Estimated delivery times and any applicable charges are shown before you place your order.' },
  { icon: 'shield', title: 'Money-back guarantee', text: 'Not satisfied? You can exercise your right of withdrawal within 14 days of receipt, without giving a reason. For our Buy 1, Get 1 Free offer, direct return shipping costs are your responsibility under our Terms and Conditions.' },
  { icon: 'chat', title: "We're here to help", text: 'Our team is here to help before, during and after your purchase.' },
  { icon: 'lock', title: 'Secure payment', text: 'Your payments are processed securely. 3D Secure authentication may be required depending on the payment method.' },
  { icon: 'award', title: '2-year legal warranty', text: 'Your watches benefit from the two-year statutory guarantee of conformity, in accordance with applicable law.' },
  { icon: 'star', title: 'Thoughtful design', text: 'Distinctive watch designs with attention to detail and finishes.' },
] as const;
