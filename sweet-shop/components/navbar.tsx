"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  { label: "Dashboard", href: "/" },
  { label: "Inventory", href: "/inventory" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="w-full border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-center px-6 py-4">
        <div className="flex gap-10">
          {routes.map((route) => {
            const isExactMatch = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={`transition-transform duration-300 ${
                  isExactMatch
                    ? "text-purple-600 font-semibold"
                    : "text-gray-500 hover:text-purple-500"
                }`}
              >
                {route.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
