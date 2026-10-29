import Link from "next/link";
import type { ReactNode } from "react";

export function Button({ href, children, variant = "primary", arrow = true }: {
  href: string; children: ReactNode; variant?: "primary" | "secondary" | "outline"; arrow?: boolean;
}) {
  return <Link href={href} className={`button button--${variant}`}>{children}{arrow && <span aria-hidden="true"> →</span>}</Link>;
}
