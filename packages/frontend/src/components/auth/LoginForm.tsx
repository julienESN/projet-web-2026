import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { Button, Input, Card, CardHeader, CardBody, CardFooter } from '../ui';
import { useAuth } from '../../contexts';

// Client-side validation schema
const LoginSchema = z.object({
  email: z.string().email('Format email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type FieldErrors = {
  email?: string;
  password?: string;
};

export function LoginForm() {
  const { login, isLoading, error, clearError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function validateForm(): boolean {
    const result = LoginSchema.safeParse({ email: username, password });
    
    if (!result.success) {
      const errors: FieldErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof FieldErrors;
        errors[field] = err.message;
      });
      setFieldErrors(errors);
      return false;
    }
    
    setFieldErrors({});
    return true;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await login({ username, password });
    } catch {
      // Error is handled by context
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h1 className="text-2xl font-bold text-center text-[var(--color-text)]">
          Connexion
        </h1>
        <p className="text-center text-[var(--color-text-muted)] mt-1">
          Entrez vos identifiants pour accéder à votre compte
        </p>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardBody className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-[var(--color-error)]/10 border border-[var(--color-error)]/20">
              <p className="text-sm text-[var(--color-error)]">{error}</p>
            </div>
          )}
          
          <Input
            label="Email"
            type="email"
            placeholder="vous@exemple.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="email"
            disabled={isLoading}
            error={fieldErrors.email}
          />
          
          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={isLoading}
            error={fieldErrors.password}
          />
        </CardBody>
        
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>
          
          <p className="text-center text-sm text-[var(--color-text-muted)]">
            Pas encore de compte ?{' '}
            <Link 
              to="/register" 
              className="text-[var(--color-primary)] hover:underline font-medium"
            >
              Créer un compte
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
