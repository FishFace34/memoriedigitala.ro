'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserMenu from '../app/components/UserMenu';

interface User {
  name: string;
  email: string;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, [pathname]);

  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register');
  const isAdminPage = pathname?.includes('/admin') || pathname?.includes('/e/');

  // Don't show header/footer on auth pages and special pages
  if (isAuthPage || isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform">
              📸 MemorieDigitala
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className={`font-medium transition-colors ${pathname === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                Home
              </Link>
              <Link href="/siparis" className={`font-medium transition-colors ${pathname === '/siparis' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                Order
              </Link>
              <Link href="/sss" className={`font-medium transition-colors ${pathname === '/sss' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                FAQ
              </Link>
              <Link href="/contact" className={`font-medium transition-colors ${pathname === '/contact' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                Contact
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className={`font-medium transition-colors ${pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                    Dashboard
                  </Link>
                  <span className="text-gray-500">|</span>
                  <span className="text-sm text-gray-600">{user?.name}</span>
                </>
              ) : (
                <Link href="/login" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  Login
                </Link>
              )}
              
              <UserMenu />
              <Link href="/siparis" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all">
                Order Now
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold mb-4">📸 MemorieDigitala</h3>
              <p className="text-gray-400 text-sm">
                Collect all your event memories in one place, effortlessly.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/siparis" className="text-gray-400 hover:text-white transition-colors">Create Order</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">My Dashboard</Link></li>
                <li><Link href="/sss" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/politica-de-confidentialitate" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/termeni-si-conditii" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📧 contact@memoriedigitala.ro</li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Form</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 MemorieDigitala.ro - All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}





