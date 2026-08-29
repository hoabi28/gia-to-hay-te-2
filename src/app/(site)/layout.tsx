import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CompareBar } from "@/components/compare/CompareBar";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          description: SITE_DESCRIPTION,
          url: SITE_URL,
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/laptop?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <Header />
      <main className="flex flex-1 flex-col pb-16">{children}</main>
      <Footer />
      <CompareBar />
    </>
  );
}
