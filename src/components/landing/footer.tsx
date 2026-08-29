"use client";

import { Facebook, Instagram, Mail, Twitter, Youtube } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import emblemAsset from "@/assets/agrismart-emblem.png.asset.json";

const SOCIALS = [
  { icon: Facebook, label: "Facebook" },
  { icon: Twitter, label: "Twitter" },
  { icon: Instagram, label: "Instagram" },
  { icon: Youtube, label: "YouTube" },
];

export function Footer() {
  const { t } = useLanguage();

  const LINKS = [
    { label: t.nav.features, href: "#features" },
    { label: t.nav.how, href: "#how-it-works" },
    { label: t.nav.crops, href: "#crops" },
    { label: t.nav.schemes, href: "#schemes" },
    { label: t.nav.about, href: "#about" },
  ];

  return (
    <footer className="bg-forest text-forest-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <a
            href="#home"
            className="flex flex-col items-center gap-2 md:items-start"
          >
            <span className="flex items-center gap-2.5">
              <img
                src={emblemAsset.url}
                alt="AgriSmart AI logo"
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 object-contain"
              />
              <span className="font-display text-xl font-extrabold tracking-tight text-forest-foreground">
                AgriSmart <span className="text-leaf">AI</span>
              </span>
            </span>
            <span className="block max-w-52 text-[11px] text-forest-foreground/60">
              {t.footer.tagline}
            </span>
          </a>

          <nav
            aria-label="Footer"
            className="flex flex-wrap justify-center gap-x-6 gap-y-2"
          >
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-forest-foreground/70 transition-colors hover:text-forest-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-forest-foreground/15 text-forest-foreground/70 transition-all hover:-translate-y-0.5 hover:border-leaf hover:text-leaf"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-forest-foreground/10 pt-6 text-xs text-forest-foreground/60 md:flex-row">
          <p>{t.footer.rights}</p>
          <div className="flex items-center gap-6">
            <a
              href="mailto:support@agrismart.com"
              className="flex items-center gap-1.5 transition-colors hover:text-forest-foreground"
            >
              <Mail className="h-3.5 w-3.5 text-leaf" />
              {t.footer.contact}
            </a>
            <a
              href="#"
              className="transition-colors hover:text-forest-foreground"
            >
              {t.footer.privacy}
            </a>
            <a
              href="#"
              className="transition-colors hover:text-forest-foreground"
            >
              {t.footer.terms}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
