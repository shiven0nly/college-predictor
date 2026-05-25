"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FiSearch, FiBookmark, FiUser, FiLogOut } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">IIT Discovery</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/predictor"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Predictor
          </Link>
          <Link
            href="/compare"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Compare
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
          ) : session?.user ? (
            <>
              {/* Saved Colleges Button */}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/saved-colleges" className="gap-2">
                  <FiBookmark className="h-4 w-4" />
                  <span className="hidden sm:inline">Saved</span>
                </Link>
              </Button>

              {/* User Menu */}
              <Select onValueChange={(value) => {
                if (value === "logout") {
                  signOut({ callbackUrl: "/" });
                }
              }}>
                <SelectTrigger className="w-auto gap-2 border-none">
                  <div className="flex items-center gap-2">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <FiUser className="h-4 w-4" />
                      </div>
                    )}
                    <span className="hidden sm:inline text-sm font-medium">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="profile" disabled>
                    <div className="flex flex-col">
                      <span className="font-medium">{session.user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {session.user.email}
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="saved-colleges">
                    <Link href="/saved-colleges" className="flex items-center gap-2">
                      <FiBookmark className="h-4 w-4" />
                      Saved Colleges
                    </Link>
                  </SelectItem>
                  <SelectItem value="logout" className="text-red-600">
                    <div className="flex items-center gap-2">
                      <FiLogOut className="h-4 w-4" />
                      Logout
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
