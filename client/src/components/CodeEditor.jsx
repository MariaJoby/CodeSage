import Editor from "@monaco-editor/react";

export default function CodeEditor({ language, code, setCode }) {
  return (
    <div style={{ position: "relative", zIndex: 0 }}>
      <Editor
        height="500px"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          automaticLayout: true,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}