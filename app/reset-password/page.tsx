'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

function ResetPasswordInner() {
  const { t } = useLanguage();
  const params = useSearchParams();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tk = params.get('token') || '';
    setToken(tk);
  }, [params]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert(t('Password must be at least 6 characters', 'Parola trebuie să aibă cel puțin 6 caractere'));
      return;
    }
    if (newPassword !== confirmPassword) {
      alert(t('Passwords do not match', 'Parolele nu se potrivesc'));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      if (res.ok) setDone(true);
      else {
        const data = await res.json();
        alert(data.error || 'Error');
      }
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
          <h1 className="text-2xl font-bold mt-2">{t('Reset Password', 'Resetează Parola')}</h1>
        </div>
        {done ? (
          <div className="text-center">
            <p className="text-gray-700 font-medium mb-4">{t('Your password has been reset.', 'Parola a fost resetată.')}</p>
            <Link href="/login" className="text-blue-600 font-bold hover:underline">{t('Go to Login', 'Mergi la Autentificare')}</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900">{t('New Password', 'Parola Nouă')}</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900">{t('New Password (Again)', 'Parola Nouă (din nou)')}</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <button disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold disabled:opacity-50">
              {loading ? t('Saving...', 'Se salvează...') : t('Reset Password', 'Resetează Parola')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}


