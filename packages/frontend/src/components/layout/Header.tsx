import { Link } from 'react-router-dom';
import { Button } from '../ui';
import { useAuth } from '../../contexts';

export interface HeaderProps {
  /** Affiche les boutons Connexion / Inscription quand true */
  showAuth?: boolean;
}

export function Header({ showAuth = true }: HeaderProps) {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 font-semibold text-[var(--color-text)]">
          <span className="text-xl text-[var(--color-primary)]">◇</span>
          Resource Manager
        </Link>

        {showAuth && !isLoading && (
          <nav className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-[var(--color-text-muted)]">
                  {user?.name || user?.email}
                </span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Inscription
                  </Button>
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
