import "./globals.css";

export const metadata = {
  title: "EchoDesk Gemini Chat",
  description: "Next-gen enterprise support via Google Gemini API",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-950 text-white">
        {children}
      </body>
    </html>
  );
}
