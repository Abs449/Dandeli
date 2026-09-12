import { Link } from "react-router-dom";
import { SITE_URL } from "../../lib/seo";

// Visible breadcrumb trail + a matching BreadcrumbList schema so Google can
// show the trail in search results and understand the page's place in the
// site hierarchy.
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

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-5 text-xs font-body">
        <ol className="flex items-center justify-center gap-2 flex-wrap text-gray-300">
          <li>
            <Link to="/" className="hover:text-cyan-300 transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-cyan-300 font-semibold">
            {current}
          </li>
        </ol>
      </nav>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </>
  );
};

export default Breadcrumbs;
