// Minimal, safe text formatter: ``` fenced code blocks, `inline code` and paragraphs.
// Everything renders as React text nodes, so user content is never injected as HTML.

function inline(text, keyPrefix) {
    return text.split(/(`[^`\n]+`)/g).map((part, i) =>
        part.startsWith('`') && part.endsWith('`') && part.length > 2
            ? <code key={`${keyPrefix}-${i}`}>{part.slice(1, -1)}</code>
            : part
    );
}

export default function RichText({ text = '', className = '' }) {
    const blocks = text.split(/```[a-z]*\n?/i);
    return (
        <div className={`richtext ${className}`}>
            {blocks.map((block, i) => {
                if (i % 2 === 1) return <pre key={i}><code>{block.replace(/\n$/, '')}</code></pre>;
                return block.split(/\n{2,}/).filter((p) => p.trim()).map((para, j) => (
                    <p key={`${i}-${j}`}>{inline(para.trim(), `${i}-${j}`)}</p>
                ));
            })}
        </div>
    );
}
