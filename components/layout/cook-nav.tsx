import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BiMenuAltRight } from 'react-icons/bi';
import { AiOutlineClose } from 'react-icons/ai';

const CookNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // Add logout logic here
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/cook/dashboard">
              <Image
                src="/logo.png"
                alt="Campus Dabba"
                width={120}
                height={40}
                className="cursor-pointer"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/cook/dashboard"
              className={`${
                router.pathname === '/cook/dashboard'
                  ? 'text-orange-500'
                  : 'text-gray-600'
              } hover:text-orange-500 transition-colors`}
            >
              Dashboard
            </Link>
            <Link
              href="/cook/orders"
              className={`${
                router.pathname === '/cook/orders'
                  ? 'text-orange-500'
                  : 'text-gray-600'
              } hover:text-orange-500 transition-colors`}
            >
              Orders
            </Link>
            <Link
              href="/cook/profile"
              className={`${
                router.pathname === '/cook/profile'
                  ? 'text-orange-500'
                  : 'text-gray-600'
              } hover:text-orange-500 transition-colors`}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <AiOutlineClose size={24} />
              ) : (
                <BiMenuAltRight size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/cook/dashboard"
              className={`${
                router.pathname === '/cook/dashboard'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600'
              } block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-500 hover:text-white transition-colors`}
            >
              Dashboard
            </Link>
            <Link
              href="/cook/orders"
              className={`${
                router.pathname === '/cook/orders'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600'
              } block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-500 hover:text-white transition-colors`}
            >
              Orders
            </Link>
            <Link
              href="/cook/profile"
              className={`${
                router.pathname === '/cook/profile'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600'
              } block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-500 hover:text-white transition-colors`}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default CookNav;