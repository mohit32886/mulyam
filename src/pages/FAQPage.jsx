import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/layout'
import { Button } from '../components/ui'
import { ChevronDown, MessageCircle } from 'lucide-react'
import { PageSEO, FAQSchema, pageMeta } from '../seo'

const faqCategories = [
  {
    title: 'About Our Jewellery',
    faqs: [
      {
        question: 'What material is Mulyam jewellery made of?',
        answer:
          'Our jewellery is crafted using anti-tarnish gold stainless steel, designed for everyday wear and long-lasting shine.',
      },
      {
        question: 'Will the jewellery tarnish or fade?',
        answer:
          'Our pieces are made to resist tarnishing with proper care. However, like all jewellery, longevity depends on how lovingly you treat it. Avoid water, perfumes, and harsh chemicals for best results.',
      },
      {
        question: 'Is Mulyam jewellery safe for sensitive skin?',
        answer:
          'Yes! Our jewellery is skin-friendly and suitable for most skin types.',
      },
    ],
  },
  {
    title: 'Orders & Payments',
    faqs: [
      {
        question: 'How do I place an order?',
        answer:
          'Simply choose your favourite pieces, add them to cart, and checkout securely through our website.',
      },
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept UPI, debit/credit cards, net banking, and other secure online payment options.',
      },
      {
        question: 'Can I cancel my order?',
        answer:
          'Orders can be cancelled before dispatch only. Once shipped, cancellations are not possible (the jewellery has already started its journey).',
      },
    ],
  },
  {
    title: 'Shipping & Delivery',
    faqs: [
      {
        question: 'How long will my order take to arrive?',
        answer:
          'Orders are typically delivered within 3–7 business days, depending on your location.',
      },
      {
        question: 'How can I track my order?',
        answer:
          'Once your order is shipped, you\'ll receive a tracking link via WhatsApp and/or email. You can also contact us anytime with your Order ID.',
      },
    ],
  },
  {
    title: 'Returns, Exchanges & Refunds',
    faqs: [
      {
        question: 'What is your return or exchange policy?',
        answer:
          'We offer returns or exchanges within 4 days of delivery, provided the product is unused and in original condition.',
      },
      {
        question: 'What items are not eligible for return?',
        answer:
          'Sale items, used products, damaged items due to misuse, and customized pieces are non-returnable.',
      },
      {
        question: 'When will I receive my refund?',
        answer:
          'Approved refunds are processed within 5–7 business days to the original payment method.',
      },
    ],
  },
  {
    title: 'Support & Assistance',
    faqs: [
      {
        question: 'How can I contact Mulyam support?',
        answer:
          'You can reach us via Email at founders@mulyamjewels.com or WhatsApp by clicking on the WhatsApp icon on the website. We reply as fast as we can — because good support should shine too.',
      },
      {
        question: 'Do I need an unboxing video?',
        answer:
          'Yes, we strongly recommend recording an unboxing video to help us resolve any issues smoothly.',
      },
    ],
  },
  {
    title: 'Care Tips',
    faqs: [
      {
        question: 'How should I take care of my jewellery?',
        answer:
          'Store it in a dry place, avoid water, sweat, perfumes, and chemicals. Remove before sleeping or workouts. A little care goes a long way — just like good jewellery.',
      },
    ],
  },
]

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left"
      >
        <span className="font-medium text-dark pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600 leading-relaxed">{answer}</div>
      )}
    </div>
  )
}

// Flatten all FAQs for schema
const allFaqs = faqCategories.flatMap(cat => cat.faqs)

function FAQPage() {
  return (
    <Layout>
      <PageSEO
        title={pageMeta.faq.title}
        description={pageMeta.faq.description}
        canonical="/faq"
      />
      <FAQSchema faqs={allFaqs} />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-light-gray text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-dark">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-gray-600">
            Find answers to common questions about our jewellery, orders, shipping, and more.
          </p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          {faqCategories.map((category) => (
            <div key={category.title} className="mb-12">
              <h2 className="font-display font-semibold text-xl md:text-2xl text-dark mb-4">
                {category.title}
              </h2>
              <div className="bg-white rounded-lg">
                {category.faqs.map((faq) => (
                  <FAQItem
                    key={faq.question}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-12 md:py-16 bg-dark text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display font-semibold text-2xl">
            Still Have Questions?
          </h2>
          <p className="mt-2 text-white/70">
            We're here to help! Reach out to us on WhatsApp for quick support.
          </p>
          <a
            href="https://wa.me/919523882449?text=Hi!%20I%20have%20a%20question%20about%20Mulyam%20Jewels."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6"
          >
            <Button variant="coral" size="lg">
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </Button>
          </a>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="font-display font-semibold text-lg text-center mb-8">
            Quick Links
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Care Guide', path: '/care-guide' },
              { title: 'Shipping Info', path: '/shipping' },
              { title: 'Return Policy', path: '/returns' },
              { title: 'Warranty', path: '/warranty' },
            ].map((link) => (
              <Link
                key={link.title}
                to={link.path}
                className="p-4 bg-light-gray rounded-lg text-center hover:bg-tan/10 transition-colors"
              >
                <span className="font-medium text-dark">{link.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default FAQPage
