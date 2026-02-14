import { Helmet } from 'react-helmet-async'

/**
 * FAQSchema - JSON-LD structured data for FAQ pages
 *
 * @param {Array} faqs - Array of FAQ items
 *   Each item: { question: string, answer: string }
 */
export function FAQSchema({ faqs }) {
  if (!faqs || faqs.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  )
}

export default FAQSchema
