import katex from 'katex';
import { Fragment } from 'react';
import { exerciseTextBlocks, inlineTokens } from '../lib/exercise-text';

function Inline({ text }: { text: string }) {
  return (
    <>
      {inlineTokens(text).map((part, index) => {
        if (part.kind === 'code') return <code key={index}>{part.text}</code>;
        if (part.kind === 'strong')
          return (
            <strong key={index}>
              <Inline text={part.text} />
            </strong>
          );
        if (part.kind === 'math')
          return (
            <span
              key={index}
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(part.text, {
                  throwOnError: false,
                  trust: false,
                  output: 'htmlAndMathml',
                }),
              }}
            />
          );
        return <Fragment key={index}>{part.text}</Fragment>;
      })}
    </>
  );
}

// Exercise prose is escaped by React; only KaTeX's untrusted-math output is HTML.
export default function Tex({
  text,
  tableLabel = 'Data table',
}: {
  text: string;
  tableLabel?: string;
}) {
  return (
    <>
      {exerciseTextBlocks(text).map((block, index) =>
        block.kind === 'text' ? (
          <Inline key={index} text={block.text} />
        ) : (
          <div
            key={index}
            className="exercise-data-wrap"
            tabIndex={0}
            role="region"
            aria-label={tableLabel}
          >
            <table className="exercise-data-table">
              <caption className="visually-hidden">{tableLabel}</caption>
              <thead>
                <tr>
                  {block.headers.map((header, col) => (
                    <th key={col} scope="col">
                      <Inline text={header} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => (
                      <td key={c}>
                        <Inline text={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ),
      )}
    </>
  );
}
