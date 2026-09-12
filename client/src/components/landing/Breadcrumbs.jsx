import { SITE_URL } from "../../lib/seo";

// No visible UI — just the BreadcrumbList schema, which is what actually
// matters for SEO (eligibility for a breadcrumb trail in Google search
// results, and a hierarchy signal for crawlers). The visible "Home / X"
// text row was dropped as a design call; removing it has no SEO effect
// since this schema doesn't depend on it. Page-to-page navigation is still
// covered by the Back button and the main Navbar.
const Breadcrumbs = ({ current }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: current,
      },
    ],
  };

  return <script type="application/ld+json">{JSON.stringify(schema)}</script>;
};

export default Breadcrumbs;
