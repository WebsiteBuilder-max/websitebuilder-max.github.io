import { useEffect } from "react";
import { Link } from "react-router-dom";
import { setSeo } from "../seo.js";

const PAGES = {
  about: {
    title: "Hi — I’m Ryan.",
    body: (
      <>
        <p>Web Work Co is me. Ryan Mostert. I design, build, and launch websites for real businesses — shops, firms, restaurants, hospitals, the people who already have customers and just need the site to catch up.</p>
        <p>The name is three words: Web Work Co. The site is <a href="https://webworkco.com">webworkco.com</a>. We are not webwork.co.za or anyone else with a similar name. If you searched “Web Work Co” for a website studio, you’re in the right place.</p>
        <p>I work from behind a laptop, not a big office. That means you write to a person. Email or WhatsApp. I reply from ryan@webworkco.com. Hours are daily 06:00–22:00, so we can talk across time zones.</p>
        <p>How it feels to work with me: you send what the site has to do — or the URL you already have. I send a short plan. If it feels right, I build a private preview. Only you see that link. We change the words, the pages, the bookings, until it feels like your business. Then it goes live on a domain you own. You keep the code (GitHub + Cloudflare). There is no monthly builder that traps you.</p>
        <p>If you already have a site, I don’t rip out what’s useful. Bookings, email, phone, appointments — if they work, they stay. Rescue jobs get a custom quote after I’ve looked. No set price until I’ve seen your URL.</p>
        <p>New sites start from a Starter page, a full Business site, or a Store. You pick the currency that matches how you get paid.</p>
        <p>If now isn’t the time, that’s fine. The first note is a plan, not a contract.</p>
        <p>Contact: <a href="mailto:ryan@webworkco.com">ryan@webworkco.com</a> · <a href="https://wa.me/27786218429">WhatsApp 078 621 8429</a></p>
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

const SEO = {
  about: {
    title: "About Web Work Co | Website studio",
    description: "Ryan Mostert runs Web Work Co at webworkco.com. Business websites, shops, and rescue of sites you already have. You see a preview first. You own the code.",
    url: "https://webworkco.com/about",
  },
  privacy: {
    title: "Privacy | Web Work Co",
    description: "How Web Work Co handles the details you send on the request-a-plan form.",
    url: "https://webworkco.com/privacy",
  },
  terms: {
    title: "Terms | Web Work Co",
    description: "How Web Work Co quotes and delivers website work.",
    url: "https://webworkco.com/terms",
  },
};

export default function SitePage({ kind }) {
  const page = PAGES[kind];
  useEffect(() => {
    setSeo(SEO[kind]);
  }, [kind]);
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
