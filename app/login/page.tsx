'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast.success(t('Login successful!', 'Autentificare reușită!'));
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(data.error || t('Login failed', 'Autentificare eșuată'));
        toast.error(data.error || t('Login failed', 'Autentificare eșuată'));
      }
    } catch (error) {
      console.error('Error:', error);
      setError(t('An error occurred. Please try again.', 'A apărut o eroare. Te rugăm să încerci din nou.'));
      toast.error(t('An error occurred. Please try again.', 'A apărut o eroare. Te rugăm să încerci din nou.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 relative">
        {/* Language Toggle */}
        <div className="absolute top-4 right-4">
          <LanguageToggle />
        </div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 block">
            📸 MemorieDigitala
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('Welcome Back!', 'Bun venit înapoi!')}</h1>
          <p className="text-gray-700 font-medium">{t('Login to manage your events', 'Autentifică-te pentru a gestiona evenimentele')}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-300 text-red-900 px-4 py-3 rounded-xl mb-6 font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-900">
              {t('Email', 'Email')} *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-600 placeholder:font-medium text-gray-900 font-medium"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-900">
              {t('Password', 'Parolă')} *
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-600 placeholder:font-medium text-gray-900 font-medium"
              placeholder={t('Enter your password', 'Introdu parola ta')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? `⏳ ${t('Logging in...', 'Se autentifică...')}` : `🔐 ${t('Login', 'Autentificare')}`}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-700 font-medium">
          <p>
            {t('Don\'t have an account?', 'Nu ai cont?')}{' '}
            <Link href="/register" className="text-blue-600 font-bold hover:underline">
              {t('Sign Up', 'Înregistrare')}
            </Link>
          </p>
          <p className="mt-2">
            <Link href="/forgot-password" className="text-blue-600 font-bold hover:underline">
              {t('Forgot your password?', 'Ai uitat parola?')}
            </Link>
          </p>
          <p className="mt-2">
            <Link href="/" className="text-gray-600 hover:underline">
              ← {t('Back to Home', 'Înapoi la Pagina Principală')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


