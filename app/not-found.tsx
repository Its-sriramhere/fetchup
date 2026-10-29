import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <section className="section not-found dark-section" data-journey-anchor="hero"><div className="container"><p className="eyebrow">404 · Page not found</p><h1>Let’s find your<br />next step.</h1><p>The page you’re looking for isn’t here.</p><Button href="/">Back to home</Button></div></section>;
}
