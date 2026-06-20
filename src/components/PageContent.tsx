import Link from "next/link";
import type { SitePage } from "@/lib/site";

type PageContentProps = {
  page: SitePage;
};

export function PageContent({ page }: PageContentProps) {
  return (
    <main id="main-content">
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-base font-semibold uppercase tracking-wide text-brand-green">
              {page.eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-brand-ink sm:text-5xl">
              {page.title}
            </h1>
            <p className="mt-6 text-xl leading-8 text-slate-700">
              {page.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/find-care"
                className="inline-flex items-center justify-center rounded-md bg-brand-blue px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-4"
              >
                Find care
              </Link>
              <Link
                href="/sources"
                className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-brand-ink shadow-sm hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-4"
              >
                View sources
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
          {page.sections.map((section) => (
            <article
              key={section.title}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-brand-ink">
                {section.title}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-700">
                {section.body}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
