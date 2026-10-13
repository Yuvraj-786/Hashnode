import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

/**
 * Renders Markdown safely: raw HTML in the content is NOT executed
 * (react-markdown ignores it by default). Fenced code blocks are highlighted.
 */
export default function MarkdownPreview({ content }) {
  if (!content?.trim()) {
    return <p className="muted">Nothing to preview yet.</p>;
  }

  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
