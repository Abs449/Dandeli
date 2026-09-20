import { Link } from "react-router-dom";

const LINK_PATTERN = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;

// Renders plain text with [label](/internal/path/) links as router <Link>s,
// so guide copy in seedData.js can point at other pages without any JSX.
const RichText = ({ text }) => {
  const parts = [];
  let lastIndex = 0;

  for (const match of text.matchAll(LINK_PATTERN)) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <Link
        key={`${match[2]}-${match.index}`}
        to={match[2]}
        className="text-cyan-300 underline underline-offset-4 decoration-cyan-400/50 hover:text-amber-300 hover:decoration-amber-300 transition-colors"
      >
        {match[1]}
      </Link>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return <>{parts}</>;
};

export default RichText;
