"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Ticket,
  Users,
  AlertCircle,
  PlayCircle,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Activity,
  Clock,
} from "lucide-react";
import { useState } from "react";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Token Queue",
    href: "/admin/queue",
    icon: Ticket,
  },
  {
    title: "Book Token",
    href: "/admin/book",
    icon: Calendar,
  },
  {
    title: "Emergency",
    href: "/admin/emergency",
    icon: AlertCircle,
  },
  {
    title: "Simulation",
    href: "/admin/simulation",
    icon: PlayCircle,
  },
  {
    title: "Doctors",
    href: "/admin/doctors",
    icon: Users,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-[#1c3f39] text-white transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center border-b border-white/10 px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-[#1fa49f]" />
            <span className="text-xl font-bold">HospitEase</span>
          </Link>
        </div>

        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="px-3 py-4">
            <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-white/60">
              Token Management
            </div>
            <nav className="space-y-1">
              {sidebarNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:bg-white/10",
                    pathname === item.href
                      ? "bg-[#1fa49f] text-white"
                      : "text-white/80 hover:text-white",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              ))}
            </nav>

            <Separator className="my-4 bg-white/10" />

            <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-white/60">
              System
            </div>
            <nav className="space-y-1">
              <Link
                href="/admin/settings"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:bg-white/10",
                  pathname === "/admin/settings"
                    ? "bg-[#1fa49f] text-white"
                    : "text-white/80 hover:text-white",
                )}
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </nav>
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-white/80 hover:bg-white/10 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}
