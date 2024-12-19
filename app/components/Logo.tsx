import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
    >
      <Image
        src="/logo.png"
        alt="美食分享"
        width={40}
        height={40}
        className="w-8 h-8"
      />
      <span className="text-lg font-display font-bold bg-gradient-to-r from-orange-600 to-pink-600 text-transparent bg-clip-text">
        美食分享
      </span>
    </Link>
  );
}
