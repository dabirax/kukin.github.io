import { Link } from "react-router-dom";
import {
  Bookmark,
  BookOpen,
  Settings as SettingsIcon,
  UtensilsCrossed,
} from "lucide-react";
import { MdFastfood } from "react-icons/md";
import { Handles } from "../Navbar/SideBar/handles.jsx";

const FOOTER_LINKS = [
  { to: "/menu", label: "Explore menu", icon: UtensilsCrossed },
  { to: "/articles", label: "Read articles", icon: BookOpen },
  { to: "/articles/saved", label: "Saved articles", icon: Bookmark },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

const Footer = () => (
  <footer className="container pb-8 pt-2">
    <div className="p-5 sm:p-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <p className="flex font-serif italic text-[#F39C12] text-2xl">
            KUKIN
            <span className="text-[#1ABC9C]">
              <MdFastfood aria-hidden="true" />
            </span>
          </p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-[#CED4DA]/60">
            Good food, good stories, all in one place.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="text-xs font-black uppercase tracking-widest text-white">
            Explore
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {FOOTER_LINKS.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="inline-flex items-center gap-2 text-sm text-[#CED4DA]/70 transition hover:text-[#1ABC9C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1ABC9C]"
                >
                  <Icon aria-hidden="true" className="h-4 w-4 text-[#1ABC9C]" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-black uppercase tracking-widest text-white">
            Follow us
          </h2>
          <Handles className="mt-3 justify-start gap-4" />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-[#CED4DA]/50 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} KUKIN. All rights reserved.</p>
        <p>Made for food lovers and storytellers.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
