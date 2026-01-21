import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { Button, Input, Card, CardHeader, CardBody, CardFooter } from '../components/ui';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(formData);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Échec de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center text-[var(--color-primary)]">Connexion</h1>
          <p className="text-center text-[var(--color-text-muted)] mt-2">
            Accédez à vos ressources
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardBody className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-[var(--color-error)] bg-red-50 rounded-md">
                {error}
              </div>
            )}

            <Input
              label="Nom d'utilisateur"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              placeholder="votre_pseudo"
            />

            <Input
              label="Mot de passe"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="••••••••"
            />
          </CardBody>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
            <p className="text-center text-sm text-[var(--color-text-muted)]">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-[var(--color-primary)] hover:underline">
                S'inscrire
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
