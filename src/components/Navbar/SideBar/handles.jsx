const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com",
    icon: "fab fa-facebook",
  },
  {
    label: "X (formerly Twitter)",
    href: "https://x.com",
    icon: "fab fa-twitter",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com",
    icon: "fab fa-instagram",
  },
];

export function Handles({ className = "" }) {
  return (
    <ul
      aria-label="KUKIN social links"
      className={`flex items-center gap-6 text-2xl text-[#1ABC9C] ${className}`}
    >
      {SOCIAL_LINKS.map(({ label, href, icon }) => (
        <li
          key={label}
          className="transition duration-200 hover:scale-110 hover:text-[#CED4DA]"
        >
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`KUKIN on ${label}`}
            className="inline-flex rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1ABC9C]"
          >
            <i className={icon} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
