import Link from "next/link";
import { footerLinks } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <p className="text-lg font-semibold">Ontario Health Navigator</p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              General placeholder information for navigation only. Confirm
              healthcare details with official sources or qualified
              professionals.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-slate-200 md:justify-end">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-4 focus:ring-offset-slate-950"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
