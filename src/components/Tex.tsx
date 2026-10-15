import katex from 'katex';
import { Fragment } from 'react';

// Exercise strings mix prose with inline $…$ mathematics (identical in French
// and English). Render the maths with KaTeX, as lesson pages do.
export default function Tex({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\$[^$]+\$)/g).map((part, index) =>
        part.length > 2 && part.startsWith('$') && part.endsWith('$') ? (
          <span
            key={index}
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(part.slice(1, -1), {
                throwOnError: false,
                output: 'htmlAndMathml',
              }),
            }}
          />
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
