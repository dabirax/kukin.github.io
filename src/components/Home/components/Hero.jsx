import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, UtensilsCrossed } from "lucide-react";
import { MdFastfood } from "react-icons/md";
import bgImg from "../../../assets/bgImg.jpg";

const Hero = ({ image }) => {
  const visual = image || bgImg;

  return (
    <section className="relative my-4 overflow-hidden rounded-3xl bg-[#1E1E2F] shadow-2xl ring-1 ring-white/10 md:flex md:items-center md:gap-4">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-35 md:hidden"
        style={{ backgroundImage: `url(${visual})` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#05010f]/95 via-[#05010f]/75 to-[#1ABC9C]/10 md:hidden"
      />

      <div className="relative min-w-0 px-6 py-7 sm:px-8 sm:py-9 md:flex-1 md:px-5 md:py-8 lg:px-8 xl:px-12">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-[#CED4DA]/70">
          Welcome to
          <span className="flex font-serif italic text-[#F39C12] text-2xl">
            KUKIN
            <span className="text-[#1ABC9C]">
              <MdFastfood aria-hidden="true" />
            </span>
          </span>
        </p>

        <h1 className="mt-2 text-3xl font-black leading-tight text-white sm:text-4xl xl:text-5xl">
          Good food, good stories, all in one place.
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-[#CED4DA]/70 sm:text-base">
          Discover Nigerian favourites, save what you love, and read stories from
          the kitchen.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 rounded-full bg-[#1ABC9C] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#16a085] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <UtensilsCrossed aria-hidden="true" className="h-4 w-4" />
            Explore menu
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-[#CED4DA] transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1ABC9C]"
          >
            <BookOpen aria-hidden="true" className="h-4 w-4" />
            Read articles
          </Link>
        </div>
      </div>

      <div className="relative mr-5 hidden shrink-0 lg:mr-8 xl:mr-12 md:block">
        <div
          aria-hidden="true"
          className="absolute -inset-4 rounded-full bg-[#1ABC9C]/10 blur-2xl"
        />
        <img
          src={visual}
          alt=""
          className="relative h-28 w-28 animate-hero-spin rounded-full object-cover shadow-2xl ring-4 ring-[#1ABC9C]/30 motion-reduce:animate-none lg:h-44 lg:w-44 xl:h-64 xl:w-64 2xl:h-72 2xl:w-72"
        />
      </div>
    </section>
  );
};

export default Hero;
