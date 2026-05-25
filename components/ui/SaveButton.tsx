"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiBookmark } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  collegeId: string;
  initialSaved?: boolean;
  variant?: "default" | "icon";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onSaveChange?: (saved: boolean) => void;
}

export function SaveButton({
  collegeId,
  initialSaved = false,
  variant = "default",
  size = "default",
  className,
  onSaveChange,
}: SaveButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  const handleSave = async () => {
    // Redirect to login if not authenticated
    if (status === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!session?.user?.id) return;

    // Optimistic update
    const previousState = isSaved;
    setIsSaved(!isSaved);
    onSaveChange?.(!isSaved);

    startTransition(async () => {
      try {
        if (isSaved) {
          // Unsave
          const res = await fetch(`/api/saved-colleges/${collegeId}`, {
            method: "DELETE",
          });

          if (!res.ok) {
            throw new Error("Failed to unsave college");
          }
        } else {
          // Save
          const res = await fetch("/api/saved-colleges", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ collegeId }),
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Failed to save college");
          }
        }
      } catch (error) {
        // Revert optimistic update on error
        setIsSaved(previousState);
        onSaveChange?.(previousState);
        console.error("Save/unsave error:", error);
        alert(error instanceof Error ? error.message : "Something went wrong");
      }
    });
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSave}
        disabled={isPending || status === "loading"}
        className={cn(
          "transition-colors",
          isSaved && "text-primary",
          className
        )}
        aria-label={isSaved ? "Remove from saved" : "Save college"}
      >
        <FiBookmark
          className={cn(
            "h-5 w-5 transition-all",
            isSaved && "fill-current"
          )}
        />
      </Button>
    );
  }

  return (
    <Button
      variant={isSaved ? "default" : "outline"}
      size={size}
      onClick={handleSave}
      disabled={isPending || status === "loading"}
      className={cn("gap-2", className)}
    >
      <FiBookmark
        className={cn(
          "h-4 w-4 transition-all",
          isSaved && "fill-current"
        )}
      />
      {isSaved ? "Saved" : "Save College"}
    </Button>
  );
}
