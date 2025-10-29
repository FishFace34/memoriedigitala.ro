'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from './contexts/LanguageContext';
import LanguageToggle from './components/LanguageToggle';
import UserMenu from './components/UserMenu';

export default function Home() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentLang, t } = useLanguage();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const faqs = [
    {
      question: t('How does MemorieDigitala.ro work?', 'Cum funcționează MemorieDigitala.ro?'),
      answer: t(
        'After placing an order, you receive a unique QR code for your event. Share the QR code with your guests, and they can upload photos and videos directly, without installing apps or registering.',
        'După ce plasezi comanda, primești un QR cod unic pentru evenimentul tău. Distribui QR codul invitaților, iar ei pot încărca fotografiile și videoclipurile direct, fără aplicații sau înregistrări.'
      ),
    },
    {
      question: t('Is there a limit on the number of photos?', 'Există o limită pentru numărul de fotografii?'),
      answer: t(
        'No, we offer unlimited photo and video uploads for the entire access period (12 months).',
        'Nu, oferim încărcări nelimitate de fotografii și videoclipuri pentru întreaga perioadă de acces (12 luni).'
      ),
    },
    {
      question: t('How long do I have access to the content?', 'Cât timp am acces la conținut?'),
      answer: t(
        'Your event access lasts 12 months from the order date. You can download content at any time during this period.',
        'Accesul la eveniment durează 12 luni de la data comenzii. Poți descărca conținutul oricând în această perioadă.'
      ),
    },
    {
      question: t('Can you deliver physical QR cards?', 'Puteți livra carduri QR fizice?'),
      answer: t(
        'Yes! You can order physical QR cards on the page. They are delivered within 5-7 business days, so place your order at least 10 days before the event.',
        'Da! Poți comanda carduri QR fizice pe pagină. Sunt livrate în 5-7 zile lucrătoare, deci plasează comanda cu cel puțin 10 zile înainte de eveniment.'
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Modern Header with Glass Effect */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform">
              📸 MemorieDigitala
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/sss" className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1 min-h-[44px] flex items-center">
                {t('FAQ', 'Întrebări')}
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1 min-h-[44px] flex items-center">
                {t('Contact', 'Contact')}
              </Link>
              {isLoggedIn ? (
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1 min-h-[44px] flex items-center">
                  {t('Dashboard', 'Panou')}
                </Link>
              ) : (
                <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1 min-h-[44px] flex items-center">
                  {t('Login', 'Autentificare')}
                </Link>
              )}
              <LanguageToggle />
              <UserMenu />
              <Link href="/siparis" className="px-4 md:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all min-h-[44px] flex items-center">
                {t('Order Now', 'Comandă Acum')}
              </Link>
            </nav>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center gap-2">
              <LanguageToggle />
              <UserMenu />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Menu"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 space-y-2">
              <Link 
                href="/sss" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex text-gray-700 hover:text-blue-600 font-medium transition-colors px-4 py-3 rounded-lg hover:bg-gray-50 min-h-[44px] items-center"
              >
                {t('FAQ', 'Întrebări')}
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex text-gray-700 hover:text-blue-600 font-medium transition-colors px-4 py-3 rounded-lg hover:bg-gray-50 min-h-[44px] items-center"
              >
                {t('Contact', 'Contact')}
              </Link>
              {isLoggedIn ? (
                <Link 
                  href="/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex text-gray-700 hover:text-blue-600 font-medium transition-colors px-4 py-3 rounded-lg hover:bg-gray-50 min-h-[44px] items-center"
                >
                  {t('Dashboard', 'Panou')}
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex text-gray-700 hover:text-blue-600 font-medium transition-colors px-4 py-3 rounded-lg hover:bg-gray-50 min-h-[44px] items-center"
                >
                  {t('Login', 'Autentificare')}
                </Link>
              )}
              <Link 
                href="/siparis" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all text-center min-h-[44px] items-center justify-center"
              >
                {t('Order Now', 'Comandă Acum')}
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section - Modern & Beautiful */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              {t('✨ Collect all memories with a single QR code', '✨ Colectează toate amintirile cu un singur cod QR')}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              {t('All your event memories, in one place.', 'Toate amintirile evenimentului tău, într-un singur loc.')}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              {t(
                'Effortlessly collect all photos, videos and messages from guests with a single QR code. No apps, no registration.',
                'Colectează fără efort toate fotografiile, videoclipurile și mesajele de la invitați cu un singur cod QR. Fără aplicații, fără înregistrări.'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/siparis"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 min-h-[44px]"
              >
                {t('Create Order Now', 'Creează Comanda Acum')}
                <span className="text-xl sm:text-2xl">→</span>
              </Link>
              <button className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-300 rounded-xl text-base sm:text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all min-h-[44px]">
                {t('See Demo', 'Vezi Demo')}
                <span className="text-lg sm:text-xl">▶</span>
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative bg-white rounded-3xl p-12 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
                <div className="text-8xl mb-4">📱</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">QR Code</div>
                <div className="text-gray-700 font-medium">Scanează pentru a încărca</div>
                <div className="mt-6 w-48 h-48 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center text-6xl">
                  ▢
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Modern Cards */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
              {t('In 3 simple steps', 'În 3 pași simpli')}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('How It Works?', 'Cum Funcționează?')}
            </h2>
            <p className="text-lg md:text-xl text-gray-700 font-medium">
              {t('Simple, fast and elegant', 'Simplu, rapid și elegant')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🛒',
                title: t('Order Package', 'Comandă Pachetul'),
                description: t(
                  'Choose the package and fill in your event details.',
                  'Alege pachetul și completează detaliile evenimentului.'
                ),
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: '📱',
                title: t('Share QR Code', 'Distribuie QR Cod'),
                description: t(
                  'Share the QR code or link with your guests.',
                  'Distribuie QR codul sau linkul invitaților.'
                ),
                color: 'from-purple-500 to-purple-600',
              },
              {
                icon: '📸',
                title: t('Collect Memories', 'Colectează Amintiri'),
                description: t(
                  'Get all photos and videos in one place.',
                  'Primește toate fotografiile și videoclipurile într-un singur loc.'
                ),
                color: 'from-pink-500 to-pink-600',
              },
            ].map((step, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl rounded-3xl transition-opacity duration-300" style={{background: `linear-gradient(135deg, ${step.color.split(' ')[0]}, ${step.color.split(' ')[1]})`}}></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-center group-hover:scale-105">
                  <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-300">{step.icon}</div>
                  <div className="text-3xl font-bold mb-2 text-gray-900">{index + 1}</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{step.title}</h3>
                  <p className="text-gray-700 leading-relaxed font-medium">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Details & Pricing - Premium Design */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              💎 Premium Package
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Digital Memory Box</h2>
            <p className="text-base md:text-xl text-gray-700 font-medium">Save and share event memories digitally.</p>
          </div>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Features */}
            <div className="space-y-6">
              {[
                { icon: '⏰', text: '12 months access' },
                { icon: '♾️', text: 'Unlimited photo/video uploads' },
                { icon: '🎨', text: '8 QR card design templates' },
                { icon: '📦', text: 'Bulk content download' },
                { icon: '💬', text: 'Technical support' },
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-4 group">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <div className="text-xl font-bold text-gray-900">{feature.text}</div>
                </div>
              ))}
            </div>

            {/* Right: Pricing Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-white rounded-3xl p-12 shadow-2xl border-2 border-blue-100">
                <div className="text-center mb-8">
                  <div className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-bold mb-4 animate-pulse">
                    ⚡ {t('Limited Offer', 'Ofertă Limită')}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <p className="text-gray-600 line-through text-3xl font-semibold">1190</p>
                    <p className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">950</p>
                    <span className="text-2xl font-semibold text-gray-700">RON</span>
                  </div>
                  <p className="text-gray-700 mb-6 font-medium">{t('Order in 2 minutes', 'Comandă în 2 minute')}</p>
                </div>
                <Link
                  href="/siparis"
                  className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-5 rounded-2xl text-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  {t('Create Order Now', 'Creează Comanda Acum')} →
                </Link>
                <div className="mt-6 text-center text-sm text-gray-700 font-medium">
                  ✓ {t('Secure payment via Stripe', 'Plată securizată prin Stripe')}
                  <br />
                  ✓ {t('No questions asked return policy', 'Politică de returnare fără întrebări')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Modern */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('Frequently Asked Questions', 'Întrebări Frecvente')}
            </h2>
            <p className="text-base md:text-xl text-gray-700 font-medium">
              {t('Find answers to your questions', 'Găsește răspunsuri la întrebările tale')}
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="group">
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 text-left flex justify-between items-center hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-200"
                >
                  <span className="font-bold text-lg text-gray-900 pr-4">{faq.question}</span>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl transition-transform duration-300 ${openFAQ === index ? 'rotate-180' : ''}`}>
                    +
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-6 py-4 text-gray-700 font-medium leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Modern */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">MemorieDigitala</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('Collect all your event memories in one place. Simple, elegant, efficient.', 'Colectează toate amintirile evenimentului într-un singur loc. Simplu, elegant, eficient.')}
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">{t('Legal', 'Legal')}</h4>
              <ul className="space-y-3 text-gray-600">
                <li>
                  <Link href="/politica-de-confidentialitate" className="hover:text-white transition-colors flex items-center gap-2">
                    <span>→</span> {t('Privacy Policy', 'Politica de Confidențialitate')}
                  </Link>
                </li>
                <li>
                  <Link href="/termeni-si-conditii" className="hover:text-white transition-colors flex items-center gap-2">
                    <span>→</span> {t('Terms & Conditions', 'Termeni și Condiții')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">{t('Support', 'Suport')}</h4>
              <ul className="space-y-3 text-gray-600">
                <li>
                  <Link href="/sss" className="hover:text-white transition-colors flex items-center gap-2">
                    <span>→</span> {t('Frequently Asked Questions', 'Întrebări Frecvente')}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors flex items-center gap-2">
                    <span>→</span> {t('Contact', 'Contact')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">{t('Follow Us', 'Urmărește-ne')}</h4>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center cursor-pointer transition-colors">📘</div>
                <div className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center cursor-pointer transition-colors">📷</div>
                <div className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center cursor-pointer transition-colors">📧</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-600">&copy; 2024 MemorieDigitala.ro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
