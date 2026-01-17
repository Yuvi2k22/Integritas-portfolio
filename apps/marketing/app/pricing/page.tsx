import PricingCard from "@/components/PricingCard";


export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-20">

      {/* Header */}
      <section className="max-w-5xl mx-auto text-center mb-20">
        <p className="text-sm tracking-widest text-gray-400 uppercase">
          Pricing
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mt-4">
          Choose the right engagement
        </h1>
        <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
          We don’t lock you into payments.
          Pick a plan, talk to us, and we’ll tailor it exactly to your needs.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        <PricingCard
          title="Starter"
          price="₹50K – ₹1.5L"
          description="Perfect for early ideas and MVPs"
          features={[
            "UI/UX design",
            "Basic web or app setup",
            "Core pages & flows",
            "Deployment guidance"
          ]}
          cta="Discuss Starter"
          href="/contact"
        />

        <PricingCard
          title="Growth"
          price="₹2L – ₹5L"
          highlight
          description="For scalable products & startups"
          features={[
            "Advanced UI/UX",
            "Full-stack development",
            "Database & APIs",
            "Cloud deployment",
            "Performance optimization"
          ]}
          cta="Discuss Growth"
          href="/contact"
        />

        <PricingCard
          title="Premium"
          price="₹5L+"
          description="Enterprise-grade, end-to-end builds"
          features={[
            "Product strategy",
            "Complex integrations",
            "AI-powered features",
            "Scalable architecture",
            "Long-term support"
          ]}
          cta="Discuss Premium"
          href="/contact"
        />

      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto text-center mt-24">
        <h2 className="text-2xl font-semibold">
          Not sure which plan fits?
        </h2>
        <p className="text-gray-400 mt-4">
          Let’s talk. We’ll help you decide — no pressure, no payment upfront.
        </p>

        <a
          href="/contact"
          className="inline-block mt-8 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
        >
          Contact Us
        </a>
      </section>
    </main>
  );
}