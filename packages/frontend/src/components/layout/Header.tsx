import { Button } from '../ui';

export interface HeaderProps {
  /** Affiche les boutons Connexion / Inscription quand true */
  showAuth?: boolean;
}

export function Header({ showAuth = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2 font-semibold text-[var(--color-text)]">
          <span className="text-xl text-[var(--color-primary)]">◇</span>
          Resource Manager
        </a>

        {showAuth && (
          <nav className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Connexion
            </Button>
            <Button variant="primary" size="sm">
              Inscription
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
