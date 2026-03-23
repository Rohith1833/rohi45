export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>EchoDesk AI Backend</h1>
      <p>POST <code>/api/analyze</code> with <code>{"{ message: string }"}</code>.</p>
    </main>
  );
}

