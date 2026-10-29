import Link from "next/link";
import { navigation } from "@/data/content";
import { Brand } from "./header";
import { MotionControl } from "@/components/journey/arrow-journey";

export function Footer() {
  return <footer className="footer" data-journey-anchor="footer" id="footer">
    <div className="container"><div className="content footer-content">
      <Brand />
      <nav aria-label="Footer navigation">{navigation.map(item => <Link href={item.href} key={item.href}>{item.label}</Link>)}</nav>
      <p>Thoughtful software. Shared progress.</p>
      <div className="footer-bottom"><small>© FetchUp {new Date().getFullYear()} <span aria-hidden="true"> · </span> Higher Together</small><MotionControl /></div>
    </div></div>
  </footer>;
}
