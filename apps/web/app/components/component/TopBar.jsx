import Link from "next/link";
import AccountButton from "./AccountButton";
import Image from "next/image";

export default function TopBar() {
  return (
    <div>
      <div className="flex items-center justify-between h-20">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.jpeg"
            width={50}
            height={50}
            alt="logo"
            className="rounded-full hover:border-2 hover:border-[#1fa49f]"
          />
          <div className="flex-shrink-0">HospitEase</div>
        </Link>
        {/* Right side buttons */}
        <AccountButton />
      </div>
    </div>
  );
}
