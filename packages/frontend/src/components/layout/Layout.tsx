import { Header } from './Header';

export interface LayoutProps {
  children: React.ReactNode;
  /** Masque le header (pour des pages fullscreen) */
  showHeader?: boolean;
}

export function Layout({ children, showHeader = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      {showHeader && <Header />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
