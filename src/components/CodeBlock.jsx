import React, { useEffect, useState } from 'react';

const liveLanguages = ['javascript', 'jsx'];

const CodeBlock = ({ language, code, filename }) => {
  const [liveModule, setLiveModule] = useState(null);
  const [syntaxModule, setSyntaxModule] = useState(null);

  useEffect(() => {
    // Lazily load heavy libs only when needed
    if (liveLanguages.includes(language?.toLowerCase())) {
      import('react-live').then((mod) => setLiveModule(mod));
    } else {
      // Lazily import the Prism build (includes language support) to avoid runtime registration issues
      import('react-syntax-highlighter/dist/esm/prism').then((mod) => {
        const Syntax = mod.default || mod;
        import('react-syntax-highlighter/dist/esm/styles/prism').then((styles) => {
          setSyntaxModule({ SyntaxHighlighter: Syntax, style: styles.oneDark || styles.default || styles });
        });
      }).catch((err) => {
        console.error('Failed to load syntax highlighter', err);
      });
    }
  }, [language]);

  if (!code) return null;

  const renderLiveEditor = (codeString) => {
    if (!liveModule) return <div className="py-6">Loading editor preview…</div>;
    const { LiveProvider, LiveEditor, LiveError, LivePreview } = liveModule;
    return (
      <div className="my-6 rounded-lg overflow-hidden border border-gray-700">
        {filename && <div className="bg-gray-700 text-sm font-mono text-white py-2 px-4">{filename}</div>}
        <LiveProvider code={codeString} scope={{ React }}>
          <LiveEditor className="!bg-gray-800 font-mono text-sm" />
          <div className="p-4 bg-white">
            <LivePreview />
          </div>
          <LiveError className="m-0 p-4 bg-red-100 text-red-700 text-sm font-mono" />
        </LiveProvider>
      </div>
    );
  };

  const renderCodeBlock = (codeString) => {
    if (!syntaxModule) return <div className="py-6">Loading syntax highlighter…</div>;
    const SyntaxHighlighter = syntaxModule.SyntaxHighlighter || syntaxModule;
    const style = syntaxModule.style || {};
    return (
      <div className="my-6 rounded-lg overflow-hidden border border-gray-700">
        {filename && <div className="bg-gray-700 text-sm font-mono text-white py-2 px-4">{filename}</div>}
        <SyntaxHighlighter language={language || 'text'} style={style} showLineNumbers>
          {codeString}
        </SyntaxHighlighter>
      </div>
    );
  };

  if (liveLanguages.includes(language?.toLowerCase())) {
    return renderLiveEditor(code);
  } else {
    return renderCodeBlock(code);
  }
};

export default CodeBlock;