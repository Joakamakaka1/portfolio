"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Copies the e-mail address and confirms it in place. */
export function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied; the address stays visible to copy by hand.
    }
  }

  return (
    <button type="button" onClick={copy} className={cn("cursor-pointer", className)}>
      <span aria-live="polite">{copied ? "Correo copiado" : "Copiar correo"}</span>
    </button>
  );
}
