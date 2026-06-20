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
            {page.lastReviewed ? (
              <p className="mt-5 inline-flex rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                Last reviewed: {page.lastReviewed}
              </p>
            ) : null}
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

      {page.helpsWith ? (
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold text-brand-ink">
                What this page helps with
              </h2>
              <ul className="mt-5 grid gap-3 text-base leading-7 text-slate-700">
                {page.helpsWith.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-slate-200 bg-white p-4"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {page.nextSteps ? (
        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold text-brand-ink">
                What to do next
              </h2>
              <ol className="mt-5 grid gap-3 text-base leading-7 text-slate-700">
                {page.nextSteps.map((item, index) => (
                  <li
                    key={item}
                    className="flex gap-4 rounded-md border border-slate-200 bg-slate-50 p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      ) : null}

      {page.sources ? (
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold text-brand-ink">
                Sources used
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-700">
                These are placeholder source cards for the MVP. Replace them
                with exact official URLs and verified review dates before using
                the content for detailed guidance.
              </p>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {page.sources.map((source) => (
                <article
                  key={`${source.organization}-${source.title}`}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-sm font-semibold uppercase tracking-wide text-brand-green">
                    {source.organization}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-brand-ink">
                    {source.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {source.note}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
