'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const userRaw = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token && !!userRaw);
    if (userRaw) setName(JSON.parse(userRaw).name || '');
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!isLoggedIn) return null;

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold min-h-[40px]">
        {name || 'Account'} ▾
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-50">
          <Link href="/orders" className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-900 font-medium">My Orders</Link>
          <Link href="/account" className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-900 font-medium">Account Settings</Link>
          <button onClick={logout} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-900 font-medium">Logout</button>
        </div>
      )}
    </div>
  );
}





