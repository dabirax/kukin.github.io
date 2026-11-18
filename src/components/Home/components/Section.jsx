import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "./SectionHeader";

const Section = ({
  id,
  title,
  action,
  tabs = [],
  activeTab,
  onTabChange,
  children,
  empty = null,
}) => {
  const scrollerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const titleId = `${id}-title`;

  const updateArrows = useCallback(() => {
    const element = scrollerRef.current;
    if (!element) return;

    setCanScrollLeft(element.scrollLeft > 2);
    setCanScrollRight(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 2
    );
  }, []);

  useEffect(() => {
    const element = scrollerRef.current;
    if (!element || empty) return undefined;

    updateArrows();
    element.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);

    return () => {
      element.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [children, empty, updateArrows]);

  const scroll = (direction) => {
    const element = scrollerRef.current;
    if (!element) return;

    element.scrollBy({
      left: direction * Math.max(element.clientWidth * 0.8, 280),
      behavior: "smooth",
    });
  };

  const handleScrollerKeyDown = (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    scroll(event.key === "ArrowRight" ? 1 : -1);
  };

  const labelledBy = activeTab ? `${id}-tab-${activeTab}` : titleId;

  return (
    <section
      aria-labelledby={titleId}
      className="rounded-3xl bg-[#1E1E2F]/80 p-4 shadow-2xl ring-1 ring-white/10 sm:p-5"
    >
      <SectionHeader
        title={title}
        action={action}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        panelId={id}
        titleId={titleId}
      />

      {empty ? (
        empty
      ) : (
        <div className="relative">
          <button
            type="button"
            aria-label={`Scroll ${title} left`}
            disabled={!canScrollLeft}
            onClick={() => scroll(-1)}
            className="absolute left-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#05010f]/90 text-white ring-1 ring-white/15 transition hover:bg-[#1ABC9C] disabled:pointer-events-none disabled:opacity-0 sm:flex"
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>

          <div
            ref={scrollerRef}
            id={id}
            role={activeTab ? "tabpanel" : undefined}
            aria-labelledby={labelledBy}
            tabIndex={0}
            onKeyDown={handleScrollerKeyDown}
            className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-2xl px-4 pb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1ABC9C] [scrollbar-width:thin] sm:mx-0 sm:px-1"
          >
            {children}
          </div>

          <button
            type="button"
            aria-label={`Scroll ${title} right`}
            disabled={!canScrollRight}
            onClick={() => scroll(1)}
            className="absolute right-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#05010f]/90 text-white ring-1 ring-white/15 transition hover:bg-[#1ABC9C] disabled:pointer-events-none disabled:opacity-0 sm:flex"
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  );
};

export default Section;
