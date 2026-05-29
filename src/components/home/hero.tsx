import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-surface-warm to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy leading-tight">
              Your Trusted Utah Mortgage Partner
            </h1>
            <p className="mt-6 text-lg text-text-muted max-w-xl">
              Helping families in Weber &amp; Davis counties find the right home loan.
              Expert guidance, competitive rates, and a commitment to your homeownership goals.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className={cn(buttonVariants({ size: "lg" }), "bg-emerald hover:bg-emerald-light text-white text-base px-8 py-6")}>
                Get Pre-Approved
              </Link>
              <Link href="/mortgage-calculator" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-2 border-navy text-navy hover:bg-navy hover:text-white text-base px-8 py-6")}>
                Calculate Your Payment
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex justify-center" aria-hidden="true">
            <svg width="500" height="350" viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 350L80 180L140 220L200 120L260 200L320 100L400 180L460 140L500 190V350H0Z" fill="#E5E7EB" />
              <path d="M0 350L100 200L170 250L250 140L330 220L420 160L500 220V350H0Z" fill="#003087" opacity="0.15" />
              <path d="M200 350L300 100L400 350H200Z" fill="#003087" opacity="0.25" />
              <path d="M230 350L300 150L370 350H230Z" fill="#003087" opacity="0.4" />
              <path d="M285 155L300 100L315 155L300 140L285 155Z" fill="white" />
              <circle cx="420" cy="80" r="30" fill="#00A86B" opacity="0.2" />
              <circle cx="420" cy="80" r="20" fill="#00A86B" opacity="0.3" />
              <rect x="140" y="290" width="40" height="30" fill="#003087" opacity="0.6" rx="2" />
              <path d="M135 290L160 265L185 290H135Z" fill="#003087" opacity="0.7" />
              <rect x="152" y="300" width="10" height="20" fill="#00A86B" opacity="0.5" rx="1" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
