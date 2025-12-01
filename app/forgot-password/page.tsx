'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 relative">
        <div className="absolute top-4 right-4"><LanguageToggle /></div>
        <div className="text-center mb-6">
          <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">📸 MemorieDigitala</Link>
          <h1 className="text-2xl font-bold mt-2">{t('Forgot Password', 'Ai uitat parola')}</h1>
        </div>
        {sent ? (
          <p className="text-center text-gray-700 font-medium">{t('If an account exists for this email, a reset link was sent.', 'Dacă există un cont pentru acest email, a fost trimis un link de resetare.')}</p>
        ) : (
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <button disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold disabled:opacity-50">
              {loading ? t('Sending...', 'Se trimite...') : t('Send Reset Link', 'Trimite linkul de resetare')}
            </button>
          </form>
        )}
        <div className="text-center mt-4"><Link href="/login" className="text-gray-700 hover:underline">{t('Back to Login', 'Înapoi la autentificare')}</Link></div>
      </div>
    </div>
  );
}





