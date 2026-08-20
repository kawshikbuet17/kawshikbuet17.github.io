'use client';

import { EnvelopeIcon, DocumentArrowDownIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { Github, Linkedin } from 'lucide-react';

interface FooterProps {
  name: string;
  title: string;
  email?: string;
  social: {
    github?: string;
    linkedin?: string;
    google_scholar?: string;
    orcid?: string;
    research_gate?: string;
  };
  navigation: Array<{
    title: string;
    href: string;
  }>;
  cvDownloadUrl?: string;
}

// Custom ORCID icon component (same as in Profile)
const OrcidIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
    </svg>
);

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  google_scholar: AcademicCapIcon,
  orcid: OrcidIcon,
};

export default function Footer({ name, title, email, social, navigation, cvDownloadUrl }: FooterProps) {
  // Dynamic last updated date
  const currentDate = new Date();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
  const formattedDate = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  // Filter out navigation items that are external links
  const quickLinks = navigation.filter(item => item.href.startsWith('/')).slice(0, 4);

  return (
    <footer className="border-t border-neutral-200/60 dark:border-neutral-700/60 bg-neutral-50/80 dark:bg-neutral-900/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Left: Name, Title, Social */}
          <div className="md:w-1/3">
            <h3 className="font-serif font-bold text-base text-primary">{name}</h3>
            <p className="text-xs text-neutral-500 mb-3">{title}</p>
            <div className="flex gap-1.5">
              {Object.entries(social).map(([key, url]) => {
                if (!url) return null;
                const IconComponent = socialIcons[key as keyof typeof socialIcons];
                if (!IconComponent) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-md bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-accent hover:text-white transition-colors"
                    title={key}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Middle: Quick Links */}
          <div className="md:w-1/4">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-400 mb-2">
              Quick Links
            </h4>
            <ul className="space-y-1">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Contact */}
          <div className="md:w-1/3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-neutral-400 mb-2">
              Contact
            </h4>
            <ul className="space-y-1">
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors flex items-center gap-1.5"
                  >
                    <EnvelopeIcon className="w-3.5 h-3.5" />
                    {email}
                  </a>
                </li>
              )}
              {cvDownloadUrl && (
                <li>
                  <a
                    href={cvDownloadUrl}
                    download
                    className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors flex items-center gap-1.5"
                  >
                    <DocumentArrowDownIcon className="w-3.5 h-3.5" />
                    Download CV
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom: Copyright & Last Updated */}
        <div className="mt-6 pt-4 border-t border-neutral-200/50 dark:border-neutral-700/50 flex flex-col sm:flex-row justify-between items-center gap-1">
          <p className="text-xs text-neutral-500">
            © {currentDate.getFullYear()} {name}. All rights reserved.
          </p>
          <p className="text-xs text-neutral-400">
            Last updated: {formattedDate}
          </p>
        </div>
      </div>
    </footer>
  );
}
