import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { RegisterForm } from './RegisterForm';

// Mock the auth context
const mockRegister = vi.fn();
const mockClearError = vi.fn();

vi.mock('../../contexts', () => ({
  useAuth: () => ({
    register: mockRegister,
    isLoading: false,
    error: null,
    clearError: mockClearError,
  }),
}));

function renderRegisterForm() {
  return render(
    <BrowserRouter>
      <RegisterForm />
    </BrowserRouter>
  );
}

function getForm() {
  return screen.getByRole('button', { name: /s'inscrire/i }).closest('form')!;
}

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders register form with all required fields', () => {
    renderRegisterForm();

    expect(screen.getByLabelText(/nom d'utilisateur/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^mot de passe$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmer le mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeInTheDocument();
  });

  it('renders link to login page', () => {
    renderRegisterForm();

    expect(screen.getByText(/déjà un compte/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /se connecter/i })).toHaveAttribute('href', '/login');
  });

  it('calls register function with correct data on valid submit', async () => {
    const user = userEvent.setup();
    renderRegisterForm();

    await user.type(screen.getByLabelText(/nom d'utilisateur/i), 'testuser');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^mot de passe$/i), 'password123');
    await user.type(screen.getByLabelText(/confirmer le mot de passe/i), 'password123');
    
    fireEvent.submit(getForm());

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('shows error when username is too short', async () => {
    const user = userEvent.setup();
    renderRegisterForm();

    await user.type(screen.getByLabelText(/nom d'utilisateur/i), 'ab');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^mot de passe$/i), 'password123');
    await user.type(screen.getByLabelText(/confirmer le mot de passe/i), 'password123');
    
    fireEvent.submit(getForm());

    await waitFor(() => {
      expect(screen.getByText(/le nom d'utilisateur doit contenir au moins 3 caractères/i)).toBeInTheDocument();
    });
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('shows error when email is invalid', async () => {
    const user = userEvent.setup();
    renderRegisterForm();

    await user.type(screen.getByLabelText(/nom d'utilisateur/i), 'testuser');
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.type(screen.getByLabelText(/^mot de passe$/i), 'password123');
    await user.type(screen.getByLabelText(/confirmer le mot de passe/i), 'password123');
    
    fireEvent.submit(getForm());

    await waitFor(() => {
      expect(screen.getByText(/format email invalide/i)).toBeInTheDocument();
    });
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup();
    renderRegisterForm();

    await user.type(screen.getByLabelText(/nom d'utilisateur/i), 'testuser');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^mot de passe$/i), 'password123');
    await user.type(screen.getByLabelText(/confirmer le mot de passe/i), 'differentpassword');
    
    fireEvent.submit(getForm());

    await waitFor(() => {
      expect(screen.getByText(/les mots de passe ne correspondent pas/i)).toBeInTheDocument();
    });
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('shows error when password is too short', async () => {
    const user = userEvent.setup();
    renderRegisterForm();

    await user.type(screen.getByLabelText(/nom d'utilisateur/i), 'testuser');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^mot de passe$/i), '12345');
    await user.type(screen.getByLabelText(/confirmer le mot de passe/i), '12345');
    
    fireEvent.submit(getForm());

    await waitFor(() => {
      expect(screen.getByText(/le mot de passe doit contenir au moins 6 caractères/i)).toBeInTheDocument();
    });
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('clears error when form is submitted', async () => {
    const user = userEvent.setup();
    renderRegisterForm();

    await user.type(screen.getByLabelText(/nom d'utilisateur/i), 'testuser');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^mot de passe$/i), 'password123');
    await user.type(screen.getByLabelText(/confirmer le mot de passe/i), 'password123');
    
    fireEvent.submit(getForm());

    await waitFor(() => {
      expect(mockClearError).toHaveBeenCalled();
    });
  });
});
