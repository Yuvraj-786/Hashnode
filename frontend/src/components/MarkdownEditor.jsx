/** Plain Markdown textarea. The live preview is rendered next to it by PostForm. */
export default function MarkdownEditor({ value, onChange, error }) {
  return (
    <div className={`md-pane ${error ? 'md-pane--invalid' : ''}`}>
      <div className="md-pane__header">Markdown</div>
      <textarea
        className="md-pane__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Write your story in Markdown. Use ``` for code blocks."
        aria-label="Post content"
        aria-invalid={Boolean(error)}
        spellCheck="true"
      />
    </div>
  );
}
