import { Check } from "lucide-react"

export function AboutSection() {
    const features = [
        "Premium Quality Products",
        "Fast & Reliable Shipping",
        "Expert Customer Support",
        "Secure Transactions",
    ]

    return (
        <section id="about" className="py-20 bg-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Image */}
                    <div className="hidden md:flex justify-center">
                        <div className="w-full aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                            <div className="text-6xl">💡</div>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose TechHub?</h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            We&apos;mitted to bringing you the latest and greatest in electronics. With years of experience and a
                            passion for technology, we ensure every customer gets the best products at the best prices.
                        </p>

                        <div className="space-y-4">
                            {features.map((feature) => (
                                <div key={feature} className="flex items-center space-x-3">
                                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                    <span className="text-foreground">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
