import "./globals.css";

// The real <html>/<body> shell lives in app/[locale]/layout.tsx so that the
// document language and metadata can follow the active locale.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
