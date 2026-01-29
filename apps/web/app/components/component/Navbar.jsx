"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.jpeg"
            width={50}
            height={50}
            alt="logo"
            className="rounded-full hover:border-2 hover:border-[#1fa49f]"
          />
          <span className="text-md font-semibold text-gray-800 tracking-wide">
            Hospit-Ease
          </span>
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link href="#" className="text-gray-600 hover:text-emerald-600">
            Home
          </Link>
          <Link href="#" className="text-gray-600 hover:text-emerald-600">
            About
          </Link>
          <Link href="#" className="text-gray-600 hover:text-emerald-600">
            Services
          </Link>
          <Link href="#" className="text-gray-600 hover:text-emerald-600">
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link
            href="/patient/login"
            className="bg-[#1c3f39] text-white px-4 py-2 rounded-md hover:bg-emerald-100 hover:text-[#1fa49f] transition duration-300"
          >
            Login
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-gray-600 hover:text-gray-800">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
