import { Twitter, Linkedin, Github, Mail, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { name: "Home", href: "/" },
      { name: "Stats", href: "/stats" },
      { name: "Trends & Scope", href: "/trends" },
      { name: "Profile", href: "/profile" },
    ],
    Company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Press Kit", href: "/press" },
    ],
    Resources: [
      { name: "Documentation", href: "/docs" },
      { name: "API Reference", href: "/api" },
      { name: "Community", href: "/community" },
      { name: "Support", href: "/support" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Disclaimer", href: "/disclaimer" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Mail, href: "mailto:hello@nexusgenisis.ai", label: "Email" },
  ];

  return (
    <footer className="bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-extrabold bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
              NexusGenisis
            </h2>
            <p className="text-indigo-200 text-sm leading-relaxed mb-4">
              Empowering businesses with AI-driven insights, statistical analysis, and market intelligence for informed decision-making.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all transform hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-purple-500" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-lg font-bold mb-4 text-indigo-200">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-indigo-300 hover:text-white transition-colors hover:translate-x-1 inline-block transform"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-white border-opacity-20 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-xl font-bold mb-2 text-indigo-200">Stay Updated</h3>
            <p className="text-sm text-indigo-300 mb-4">
              Subscribe to our newsletter for the latest insights and updates
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button className="px-6 py-2 bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white border-opacity-20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-indigo-300">
            <p className="flex items-center gap-1">
              © {currentYear} NexusGenisis. Made with <Heart className="w-4 h-4 text-pink-400 fill-current" /> by the team
            </p>
            <p className="text-xs">
              Powered by AI • All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}