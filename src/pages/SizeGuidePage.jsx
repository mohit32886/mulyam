import { Layout } from '../components/layout'
import { Ruler, HelpCircle } from 'lucide-react'
import { PageSEO, pageMeta } from '../seo'

function SizeGuidePage() {
  return (
    <Layout>
      <PageSEO
        title={pageMeta['size-guide'].title}
        description={pageMeta['size-guide'].description}
        canonical="/size-guide"
      />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-light-gray text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-dark">
            Size Guide
          </h1>
          <p className="mt-4 text-gray-600">
            Find your perfect fit with our sizing guides.
          </p>
        </div>
      </section>

      {/* Ring Sizes */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-tan/20 rounded-full flex items-center justify-center">
              <Ruler className="w-5 h-5 text-tan" />
            </div>
            <h2 className="font-display font-semibold text-2xl">Ring Sizes</h2>
          </div>

          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full">
              <thead className="bg-light-gray">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Indian Size</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">US Size</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Diameter (mm)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Circumference (mm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { indian: '6', us: '3', diameter: '14.1', circumference: '44.2' },
                  { indian: '8', us: '4', diameter: '14.9', circumference: '46.8' },
                  { indian: '10', us: '5', diameter: '15.7', circumference: '49.3' },
                  { indian: '12', us: '6', diameter: '16.5', circumference: '51.8' },
                  { indian: '14', us: '7', diameter: '17.3', circumference: '54.4' },
                  { indian: '16', us: '8', diameter: '18.1', circumference: '56.9' },
                  { indian: '18', us: '9', diameter: '18.9', circumference: '59.5' },
                  { indian: '20', us: '10', diameter: '19.8', circumference: '62.1' },
                ].map((size) => (
                  <tr key={size.indian} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{size.indian}</td>
                    <td className="px-4 py-3 text-sm">{size.us}</td>
                    <td className="px-4 py-3 text-sm">{size.diameter}</td>
                    <td className="px-4 py-3 text-sm">{size.circumference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-tan/10 rounded-lg">
            <h4 className="font-semibold flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              How to Measure
            </h4>
            <ol className="mt-2 text-sm text-gray-600 list-decimal list-inside space-y-1">
              <li>Wrap a piece of string around the base of your finger</li>
              <li>Mark where the string overlaps</li>
              <li>Measure the length with a ruler (this is the circumference)</li>
              <li>Find your size in the chart above</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Bracelet Sizes */}
      <section className="py-12 md:py-16 bg-light-gray">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display font-semibold text-2xl mb-6">Bracelet Sizes</h2>

          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Size</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Wrist Size (inches)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Wrist Size (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { size: 'Small', inches: '5.5" - 6"', cm: '14 - 15.2' },
                  { size: 'Medium', inches: '6" - 6.5"', cm: '15.2 - 16.5' },
                  { size: 'Large', inches: '6.5" - 7"', cm: '16.5 - 17.8' },
                  { size: 'X-Large', inches: '7" - 7.5"', cm: '17.8 - 19' },
                ].map((size) => (
                  <tr key={size.size} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{size.size}</td>
                    <td className="px-4 py-3 text-sm">{size.inches}</td>
                    <td className="px-4 py-3 text-sm">{size.cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            <strong>Tip:</strong> For a comfortable fit, add 0.5" to your wrist measurement.
            Bangles should slide over your hand, while chain bracelets can be fitted.
          </p>
        </div>
      </section>

      {/* Necklace Lengths */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display font-semibold text-2xl mb-6">Necklace Lengths</h2>

          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full">
              <thead className="bg-light-gray">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Style</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Length</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Sits At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { style: 'Choker', length: '14" - 16"', sits: 'Base of neck' },
                  { style: 'Princess', length: '17" - 19"', sits: 'Collarbone' },
                  { style: 'Matinee', length: '20" - 24"', sits: 'Above bust' },
                  { style: 'Opera', length: '28" - 36"', sits: 'Below bust' },
                ].map((item) => (
                  <tr key={item.style} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{item.style}</td>
                    <td className="px-4 py-3 text-sm">{item.length}</td>
                    <td className="px-4 py-3 text-sm">{item.sits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 md:py-16 bg-light-gray">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display font-semibold text-xl">
            Still unsure about your size?
          </h2>
          <p className="mt-2 text-gray-600">
            We're happy to help! Send us a message on WhatsApp.
          </p>
          <a
            href="https://wa.me/919523882449?text=Hi!%20I%20need%20help%20finding%20my%20size."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-coral hover:underline font-medium"
          >
            Get Size Help →
          </a>
        </div>
      </section>
    </Layout>
  )
}

export default SizeGuidePage
