import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-[var(--color-primary)] text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Categories</h3>
            <ul className="mt-3 space-y-2">
              {["travel", "cashback", "rewards", "premium", "lifestyle"].map((cat) => (
                <li key={cat}>
                  <Link href={`/categories/${cat}`} className="text-sm hover:text-white capitalize">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Issuers</h3>
            <ul className="mt-3 space-y-2">
              {[
                { slug: "hdfc", name: "HDFC Bank" },
                { slug: "sbi", name: "SBI Card" },
                { slug: "icici", name: "ICICI Bank" },
                { slug: "axis", name: "Axis Bank" },
                { slug: "amex", name: "Amex" },
              ].map((issuer) => (
                <li key={issuer.slug}>
                  <Link href={`/issuers/${issuer.slug}`} className="text-sm hover:text-white">
                    {issuer.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Tools</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/cards" className="text-sm hover:text-white">Browse All Cards</Link>
              </li>
              <li>
                <Link href="/compare" className="text-sm hover:text-white">Compare Cards</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">About</h3>
            <p className="mt-3 text-sm leading-relaxed">
              CredComp helps you find the best Indian credit card for your spending habits. We compare rewards, fees, and benefits across all major issuers.
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} CredComp. All rights reserved.</p>
          <p className="mt-1">
            Information is for comparison purposes only. Please verify details with the card issuer before applying.
          </p>
        </div>
      </div>
    </footer>
  );
}
