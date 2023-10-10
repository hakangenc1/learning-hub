"use client";

import { usePathname } from "next/navigation";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/chapter");

  return (
    <div className="flex ml-auto gap-x-2">
      {isTeacherPage || isPlayerPage ? (
        <Link href="/">
          <Button size="sm" variant="ghost">
            <LogOut className="w-4 h-4 mr-2" />
            Exit
          </Button>
        </Link>
      ) : (
        <Link href="/teacher/courses">
          <Button size="sm" variant="ghost">
            Teacher mode
          </Button>
        </Link>
      )}
      <ClerkLoading>
        <div className="bg-gray-300 rounded-full w-9 h-9 animate-pulse"></div>
      </ClerkLoading>
      <ClerkLoaded>
        <UserButton afterSignOutUrl="/" />
      </ClerkLoaded>
    </div>
  );
};
