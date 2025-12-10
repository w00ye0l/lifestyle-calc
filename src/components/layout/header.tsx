"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Car, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/home",
    label: "월세 계산기",
    icon: Home,
  },
  {
    href: "/car",
    label: "차량 추천",
    icon: Car,
  },
  {
    href: "/savings",
    label: "저축 플래너",
    icon: PiggyBank,
  },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-4xl items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Home className="h-4 w-4" />
          </div>
          <span className="hidden font-semibold sm:inline-block">
            내 월급으로
          </span>
        </Link>

        <nav className="flex flex-1 items-center justify-end space-x-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
