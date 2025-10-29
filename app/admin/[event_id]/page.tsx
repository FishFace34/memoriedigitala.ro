'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageToggle from '../../components/LanguageToggle';

interface MediaItem {
  id: number;
  upload_type: string;
  file_url: string;
  file_name: string;
  uploaded_at: string;
}

interface Event {
  event_id: string;
  access_key: string;
  event_name: string;
  qr_print_enabled: boolean;
  voice_message_enabled: boolean;
  total_price: number;
  status: string;
}

export default function AdminPanel() {
  const params = useParams();
  const eventId = params.event_id as string;
  const { t } = useLanguage();

  const [event, setEvent] = useState<Event | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState('');
  const [editingName, setEditingName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [theme, setTheme] = useState<'classic' | 'dark' | 'pink' | 'blue' | 'gray' | 'green'>('classic');

  useEffect(() => {
    loadEventAndMedia();
  }, [eventId]);

  const loadEventAndMedia = async () => {
    try {
      const eventRes = await fetch(`/api/get-event?eventId=${eventId}`);
      const eventData = await eventRes.json();
      setEvent(eventData.event);

      const mediaRes = await fetch(`/api/get-media?eventId=${eventId}`);
      const mediaData = await mediaRes.json();
      setMedia(mediaData.media);

      if (eventData.event) {
        setEditingName(eventData.event.event_name || '');
        const baseUrl = (process.env.NEXT_PUBLIC_APP_URL as string) || (typeof window !== 'undefined' ? window.location.origin : '');
        const url = `${baseUrl}/e/${eventData.event.access_key}?theme=${theme}`;
        const qrUrl = await QRCode.toDataURL(url);
        setQrCodeUrl(qrUrl);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMedia = async (mediaId: number) => {
    if (!confirm('Sigur doriți să ștergeți această imagine?')) return;

    try {
      setRefreshing(true);
      await fetch(`/api/delete-media?id=${mediaId}&eventId=${eventId}`, {
        method: 'DELETE',
      });
      loadEventAndMedia();
      toast.success('Media deleted successfully!');
    } catch (error) {
      console.error('Error deleting media:', error);
      toast.error('Error deleting media');
    } finally {
      setRefreshing(false);
    }
  };

  const downloadAll = async () => {
    if (!event) return;
    
    try {
      if (media.length === 0) {
        toast.error('No media to download');
        return;
      }
      toast.loading('Creating ZIP file...');
      const downloadUrl = `/api/download-all-media?eventId=${event.event_id}`;
      window.open(downloadUrl, '_blank');
      toast.success('Download started!');
    } catch (error) {
      console.error('Error downloading all media:', error);
      toast.error('Error downloading media');
    }
  };

  const downloadQRTemplate = async () => {
    if (!event) return;
    
    try {
      // Create a simple HTML page with QR code that can be printed
      const baseUrl = (process.env.NEXT_PUBLIC_APP_URL as string) || (typeof window !== 'undefined' ? window.location.origin : '');
      const eventUrl = `${baseUrl}/e/${event.access_key}?theme=${theme}`;
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>QR Code - ${event.event_name || 'Event'}</title>
          <style>
            @media print { @page { size: A4; margin: 18mm; } }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #0f172a; }
            .wrap { max-width: 700px; margin: 0 auto; text-align: center; }
            .event-name { font-size: 42px; font-weight: 700; margin: 32px 0 24px; letter-spacing: .5px; }
            .qr-box { display: inline-block; padding: 28px; border-radius: 16px; border: 3px dashed #cbd5e1; }
            .qr-img { width: 280px; height: 280px; }
            .desc { margin: 28px auto 40px; font-size: 18px; line-height: 1.6; max-width: 560px; color: #334155; }
            .desc b { color: #0f172a; }
            .brand { margin-top: 28px; font-weight: 800; font-size: 28px; }
            .brand .g { background: linear-gradient(90deg, #2563eb, #7c3aed); -webkit-background-clip: text; background-clip: text; color: transparent; }
            .url { margin-top: 6px; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="wrap">
            <div class="event-name">${event.event_name || 'Event Name'}</div>
            <div class="qr-box">
              <img class="qr-img" src="${qrCodeUrl}" alt="QR Code" />
            </div>
            <div class="desc">
              Scan the QR code to share your <b>videos</b> and <b>photos</b> with us and leave us a <b>voice note</b>.
            </div>
            <div class="brand"><span class="g">MemorieDigitala</span></div>
            <div class="url">${eventUrl}</div>
          </div>
          
          <script>
            // Print when page loads
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `;
      
      // Create a blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-code-${event.event_id}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(t('QR code template downloaded!', 'Șablonul QR a fost descărcat!'));
    } catch (error) {
      console.error('Error downloading QR template:', error);
      toast.error(t('Error downloading QR template', 'Eroare la descărcarea șablonului QR'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-semibold">Se încarcă...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-semibold">Evenimentul nu a fost găsit.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in">
          {notification}
        </div>
      )}
      
      <header className="bg-white shadow-sm mb-6 sm:mb-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">Admin Panel</h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <a href="/" className="text-gray-900 font-bold hover:text-blue-600 text-sm md:text-base min-h-[44px] flex items-center">
                ← Back to site
              </a>
              <LanguageToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Event Info & Edit */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900">{t('Event Name', 'Nume Eveniment')}</label>
              <div className="flex gap-2">
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('Enter event name', 'Introdu numele evenimentului')}
                />
                <button
                  disabled={savingName}
                  onClick={async () => {
                    try {
                      setSavingName(true);
                      const res = await fetch('/api/update-event', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ eventId, eventName: editingName }),
                      });
                      const data = await res.json();
                      if (res.ok) {
                        setEvent({ ...(event as Event), event_name: data.event.event_name });
                        setNotification(t('Event name updated', 'Numele evenimentului a fost actualizat'));
                        setTimeout(() => setNotification(''), 2000);
                      } else {
                        alert(data.error || 'Error');
                      }
                    } finally {
                      setSavingName(false);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold"
                >
                  {t('Save', 'Salvează')}
                </button>
              </div>
            </div>
            <div>
              <p className="text-gray-900 font-bold">Status:</p>
              <p className="font-bold text-gray-900">{event.status}</p>
              <p className="text-gray-900 font-bold mt-2">Preț:</p>
              <p className="font-bold text-gray-900">{Number(event.total_price).toFixed(2)} RON</p>
            </div>
          </div>
        </div>

        {/* Theme Selector */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-8">
          <p className="text-gray-900 font-bold mb-3">{t('Upload Page Theme', 'Temă Pagină Upload')}</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {(['classic','dark','pink','blue','gray','green'] as const).map((th) => (
              <button
                key={th}
                onClick={async () => {
                  setTheme(th);
                  if (event) {
                    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL as string) || (typeof window !== 'undefined' ? window.location.origin : '');
                    const url = `${baseUrl}/e/${event.access_key}?theme=${th}`;
                    const qrUrl = await QRCode.toDataURL(url);
                    setQrCodeUrl(qrUrl);
                  }
                }}
                className={`px-3 py-2 rounded-lg border text-sm font-semibold capitalize ${theme === th ? 'border-blue-600' : 'border-gray-300'}`}
              >
                {th}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-2">{t('QR code and share link include selected theme.', 'QR-ul și linkul includ tema selectată.')}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 px-4">
          <button
            onClick={() => setShowQR(!showQR)}
            className="bg-blue-600 text-white p-4 sm:p-6 rounded-lg shadow hover:bg-blue-700 transition min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center"
          >
            <div className="text-2xl sm:text-3xl mb-2">📱</div>
            <div className="font-semibold text-xs sm:text-sm text-center">{t('View QR Code', 'Vizualizează QR Cod')}</div>
          </button>
          <button
            onClick={downloadQRTemplate}
            className="bg-green-600 text-white p-4 sm:p-6 rounded-lg shadow hover:bg-green-700 transition min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center"
          >
            <div className="text-2xl sm:text-3xl mb-2">📄</div>
            <div className="font-semibold text-xs sm:text-sm text-center">{t('Download QR Template', 'Descarcă Șablon QR')}</div>
          </button>
          <button
            onClick={downloadAll}
            className="bg-purple-600 text-white p-4 sm:p-6 rounded-lg shadow hover:bg-purple-700 transition min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center"
          >
            <div className="text-2xl sm:text-3xl mb-2">📦</div>
            <div className="font-semibold text-xs sm:text-sm text-center">{t('Download All Media', 'Descarcă Tot Media')}</div>
          </button>
        </div>

        {/* QR Code Modal */}
        {showQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('QR Code for Guests', 'Codul QR pentru Invitați')}</h3>
              <div className="mb-4 flex justify-center">
                <img src={qrCodeUrl} alt="QR Code" className="w-full max-w-xs" />
              </div>
              <div className="bg-gray-100 p-4 rounded mb-4 break-all border-2 border-gray-300">
              <p className="text-xs font-mono text-gray-900 font-bold">{`${((process.env.NEXT_PUBLIC_APP_URL as string) || (typeof window !== 'undefined' ? window.location.origin : ''))}/e/${event.access_key}?theme=${theme}`}</p>
              </div>
              <button
                onClick={() => setShowQR(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                {t('Close', 'Închide')}
              </button>
            </div>
          </div>
        )}

        {/* Media Gallery */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">{t('Gallery', 'Galerie')} ({media.length})</h2>
            <button
              onClick={() => {
                setRefreshing(true);
                loadEventAndMedia();
                setRefreshing(false);
              }}
              disabled={refreshing}
              className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              {refreshing ? `⟳ ${t('Loading...', 'Se încarcă...')}` : `⟳ ${t('Refresh', 'Actualizează')}`}
            </button>
          </div>

          {media.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📷</div>
              <p className="text-gray-900 font-bold">{t('No images uploaded yet. Share the QR code with guests!', 'Nicio imagine încărcată. Distribuie QR codul invitaților!')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {media.map((item) => (
                <div key={item.id} className="relative group">
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    {item.upload_type === 'photo' ? (
                      <img
                        src={item.file_url}
                        alt={item.file_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {item.upload_type === 'video' ? (
                          <div className="text-4xl">🎥</div>
                        ) : (
                          <div className="text-4xl">🎤</div>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteMedia(item.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

