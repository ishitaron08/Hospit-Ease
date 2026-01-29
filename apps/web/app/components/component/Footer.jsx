import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#1c3f39] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
            <p className="text-sm">
              Lovely Professional University, Phagwara
              <br />
              Punjab, India
              <br />
              Ph No. - 9528614140
              <br />
              ishitaron08@gmail.com
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Important Links</h2>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/accessibility">Accessibility Statement</Link>
              </li>
              <li>
                <Link href="/terms">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/sitemap">Sitemap</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/features">Features</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Sitemap</h2>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/department">Department</Link>
              </li>
              <li>
                <Link href="/features">Features</Link>
              </li>
              <li>
                <Link href="/gallery">Gallery</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Others</h2>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/accessibility">Accessibility Statement</Link>
              </li>
              <li>
                <Link href="/terms">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/sitemap">Sitemap</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/features">Features</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-center">
          <p>
            © Copyright Hospital Management Information Systems, All Rights
            Reserved
          </p>
          <p>Designed by CDAC</p>
        </div>
      </div>
    </footer>
  );
}
