import "./globals.css";

export const metadata = {
  title: "Quem Votar",
  description: "Compatibilidade entre eleitor e candidatos"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
