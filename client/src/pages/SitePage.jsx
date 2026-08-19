import { Link } from "react-router-dom";

const PAGES = {
  about: {
    title: "About Web Work Co",
    body: (
      <>
        <p>Web Work Co is a web studio run by Ryan Mostert. We design, build, and launch business websites and online stores — and we rescue sites that already exist but don’t work.</p>
        <p>Work is remote and worldwide. You get a preview link, then the site goes live on a domain you own. The code is yours (GitHub + Cloudflare). There is no locked monthly website builder.</p>
        <p>Contact: <a href="mailto:ryan@webworkco.com">ryan@webworkco.com</a> · <a href="https://wa.me/27786218429">WhatsApp 078 621 8429</a></p>
        <p>Hours: daily 06:00–22:00</p>
        <p>Website: <a href="https://webworkco.com">webworkco.com</a></p>
      </>
    ),
  },
  privacy: {
    title: "Privacy",
    body: (
      <>
        <p>Web Work Co is run by Ryan Mostert. This page explains what we collect.</p>
        <p>If you use the “Request a plan” form, we receive your name, email, location, package choice, and the message you type. That is sent to ryan@webworkco.com so we can reply. We do not sell that information.</p>
        <p>The site uses your browser’s local storage only to remember the currency you picked.</p>
        <p>Hosting is on Cloudflare. Their servers may log basic technical data (like an IP address) to keep the site running.</p>
        <p>To ask us to delete a message you sent, email ryan@webworkco.com.</p>
      </>
    ),
  },
  terms: {
    title: "Terms",
    body: (
      <>
        <p>By requesting a plan you are asking for a quote, not buying a finished website. Work starts when we both agree a price and a scope in writing (email is fine).</p>
        <p>You keep your domain and the code we deliver for your project. Sample sites on this website (Harbour Kitchen, Drift Supply) are demos, not real businesses and not included in a purchase.</p>
        <p>Quotes are estimates until we have seen your content or your current site. Payment terms are agreed per job.</p>
        <p>Questions: ryan@webworkco.com</p>
      </>
    ),
  },
};

export default function SitePage({ kind }) {
  const page = PAGES[kind];
  return (
    <div className="studio legal-page">
      <header className="studio-nav">
        <div className="wrap nav-bar">
          <Link className="brand" to="/">
            <img src="/logo.png" alt="Web Work Co" />
            Web Work Co
          </Link>
          <Link to="/#start">Contact</Link>
        </div>
      </header>
      <main className="wrap legal-body">
        <p className="kicker">Web Work Co</p>
        <h1 className="display section-title">{page.title}</h1>
        <div className="legal-copy">{page.body}</div>
        <p><Link to="/">← Back to home</Link></p>
      </main>
    </div>
  );
}
