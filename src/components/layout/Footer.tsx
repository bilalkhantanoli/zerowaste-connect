import { Link } from 'react-router-dom';
import { Leaf, Heart, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const footerLinks = {
  platform: [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'For Donors', href: '/donor' },
    { label: 'For Recipients', href: '/recipient' },
    { label: 'For Volunteers', href: '/volunteer' },
  ],
  resources: [
    { label: 'Food Safety Guidelines', href: '/safety' },
    { label: 'Community Stories', href: '/community' },
    { label: 'Impact Report', href: '/impact' },
    { label: 'FAQ', href: '/faq' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Mail, href: 'mailto:hello@zerowaste.connect', label: 'Email' },
];

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-6">
          {/* Brand Section */}
          <div className="col-span-2">
            <Link to="/" className="mb-4 flex items-center gap-2">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">
                ZeroWaste<span className="text-primary">Connect</span>
              </span>
            </Link>
            <p className="mb-4 max-w-xs text-sm text-muted-foreground">
              Connecting communities to reduce food waste and fight hunger through smart
              redistribution.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <Button key={social.label} variant="ghost" size="icon" asChild className="h-9 w-9">
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Platform</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ZeroWaste Connect. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Made with <Heart className="h-4 w-4 fill-urgent text-urgent" /> for a sustainable future
          </p>
        </div>
      </div>
    </footer>
  );
}
