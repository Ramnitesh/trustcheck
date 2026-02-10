'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <span className="text-2xl font-bold text-blue-600">TrustCheck</span>
          </Link>

          <div className="flex items-center gap-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        pathname === '/dashboard'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Dashboard
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          pathname === '/admin'
                            ? 'bg-purple-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Register
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
