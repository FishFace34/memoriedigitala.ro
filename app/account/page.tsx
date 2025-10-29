'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

export default function AccountSettingsPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');
    if (!token || !userRaw) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(userRaw);
    setEmail(user.email || '');
    setName(user.name || '');
    setLoading(false);
  }, [router]);

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        alert(t('Profile updated successfully', 'Profil actualizat cu succes'));
      } else {
        alert(data.error || 'Error');
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async () => {
    if (newPassword.length < 6) {
      alert(t('Password must be at least 6 characters', 'Parola trebuie să aibă cel puțin 6 caractere'));
      return;
    }
    if (newPassword !== confirmPassword) {
      alert(t('Passwords do not match', 'Parolele nu se potrivesc'));
      return;
    }
    setChangingPassword(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(t('Password changed successfully', 'Parola a fost schimbată cu succes'));
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert(data.error || 'Error');
      }
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              📸 MemorieDigitala
            </Link>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{t('Account Settings', 'Setări Cont')}</h1>

        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">{t('Profile Information', 'Informații Profil')}</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900">{t('Email Address', 'Adresă Email')}</label>
              <input value={email} disabled className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700" />
              <p className="text-xs text-gray-500 mt-1">{t('Email address cannot be changed', 'Adresa de email nu poate fi schimbată')}</p>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900">{t('Full Name', 'Nume Complet')}</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="flex justify-end">
              <button onClick={saveProfile} disabled={savingProfile} className="px-5 py-3 bg-rose-700 text-white rounded-xl font-semibold disabled:opacity-50">
                {t('Save Profile Information', 'Salvează Informațiile de Profil')}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold mb-4">{t('Change Password', 'Schimbă Parola')}</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900">{t('Current Password', 'Parola Curentă')}</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder={t('Enter your current password', 'Introduce parola curentă')} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900">{t('New Password', 'Parola Nouă')}</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder={t('Minimum 6 characters', 'Minim 6 caractere')} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900">{t('New Password (Again)', 'Parola Nouă (din nou)')}</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder={t('Re-enter your new password', 'Reintrodu parola nouă')} />
            </div>
            <div className="flex justify-end">
              <button onClick={changePassword} disabled={changingPassword} className="px-5 py-3 bg-rose-700/80 text-white rounded-xl font-semibold disabled:opacity-50">
                {t('Change Password', 'Schimbă Parola')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


