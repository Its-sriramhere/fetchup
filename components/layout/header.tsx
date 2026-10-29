"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/data/content";

export function Brand() {
  return <Link className="brand" href="/" aria-label="FetchUp home"><Image src="/brand/wordmark.svg" alt="FetchUp" width={176} height={37} priority /></Link>;
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const element = dialog.current;
    if (open) element?.showModal();
    else if (element?.open) element.close();
    const oldOverflow = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = oldOverflow; };
  }, [open]);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const close = () => { if (media.matches) setOpen(false); };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);

  return <header className="header">
    <div className="container header-inner">
      <Brand />
      <nav className="desktop-navigation" aria-label="Main navigation">
        {navigation.slice(0, 4).map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>)}
        <Link className="button button--primary" href="/contact" aria-current={pathname === "/contact" ? "page" : undefined}>Let’s talk <span aria-hidden="true">→</span></Link>
      </nav>
      <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}>Menu</button>
    </div>
    <dialog ref={dialog} id="mobile-menu" className="mobile-menu" onCancel={() => setOpen(false)} onClose={() => { setOpen(false); toggle.current?.focus(); }} aria-label="Navigation menu">
      <div className="mobile-menu-header"><span onClick={() => setOpen(false)}><Brand /></span><button className="menu-toggle" autoFocus onClick={() => setOpen(false)}>Close <span aria-hidden="true">×</span></button></div>
      <nav aria-label="Mobile navigation">{navigation.map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={() => setOpen(false)}>{item.label}</Link>)}</nav>
    </dialog>
  </header>;
}
