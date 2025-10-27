import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (isSignUp) {
      // Handle Sign Up
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setMessage('¡Registro exitoso! Revisa tu correo para verificar tu cuenta.');
      }
    } else {
      // Handle Sign In
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError('Credenciales inválidas. Por favor, inténtalo de nuevo.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {isSignUp ? 'Crear Nueva Cuenta' : 'Bienvenido al CRM'}
        </h1>
        <p className="text-center text-gray-600 mb-6">
          {isSignUp ? 'Completa tus datos para registrarte.' : 'Ingresa tus credenciales para acceder.'}
        </p>
        
        <div className="mb-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                <button
                    onClick={() => setIsSignUp(false)}
                    className={`${
                        !isSignUp ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                >
                    Iniciar Sesión
                </button>
                <button
                    onClick={() => setIsSignUp(true)}
                    className={`${
                        isSignUp ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                >
                    Crear Cuenta
                </button>
            </nav>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              className="w-full bg-white text-gray-900 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
           <div>
            <label htmlFor="password" className="sr-only">Contraseña</label>
            <input
              id="password"
              className="w-full bg-white text-gray-900 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50"
              disabled={loading}
            >
              {loading ? <span>Procesando...</span> : <span>{isSignUp ? 'Registrarse' : 'Iniciar Sesión'}</span>}
            </button>
          </div>
        </form>
        {message && <p className="mt-4 text-center text-sm text-green-600 bg-green-50 p-3 rounded-md">{message}</p>}
        {error && <p className="mt-4 text-center text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
      </div>
    </div>
  );
};