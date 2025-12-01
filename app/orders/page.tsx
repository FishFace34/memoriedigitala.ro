'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

interface Order {
  id: number;
  event_id: string;
  event_name: string;
  total_price: number;
  payment_status: string;
  created_at: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/orders', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      setOrders(data.orders || []);
    } finally {
      setLoading(false);
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
            <Link href="/" className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">📸 MemorieDigitala</Link>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{t('My Orders', 'Comenzile Mele')}</h1>
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow">
            <p className="text-gray-700 font-medium mb-4">{t('You have no orders yet.', 'Nu ai comenzi încă.')}</p>
            <Link href="/siparis" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold">{t('Create Order', 'Creează Comandă')}</Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((o) => (
              <div key={o.id} className="bg-white rounded-2xl p-6 shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-gray-900 font-bold text-lg">{o.event_name || 'Event'} ({o.event_id})</div>
                  <div className="text-sm text-gray-700 font-medium">📅 {new Date(o.created_at).toLocaleDateString()} • 💵 {Number(o.total_price).toFixed(2)} RON</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">{o.payment_status}</span>
                  <Link href={`/admin/${o.event_id}`} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold">{t('Open Panel', 'Deschide Panoul')}</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}





