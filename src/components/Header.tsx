import Link from "next/link";
import { navigation } from "@/lib/site";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between lg:gap-8">
            <Link
              href="/"
              className="text-xl font-bold text-brand-ink underline-offset-4 hover:underline"
            >
              Ontario Health Navigator
            </Link>
            <label className="flex max-w-56 items-center gap-2 text-sm font-medium text-slate-700">
              <span>Language</span>
              <select
                aria-label="Language selector placeholder"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                defaultValue="en"
              >
                <option value="en">English</option>
              </select>
            </label>
          </div>
          <nav aria-label="Main navigation">
            <ul className="flex flex-wrap gap-x-4 gap-y-3 text-sm font-semibold text-slate-700">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded-sm underline-offset-4 hover:text-brand-blue hover:underline focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-4"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
