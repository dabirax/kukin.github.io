const SectionHeader = ({
  title,
  action,
  tabs = [],
  activeTab,
  onTabChange,
  panelId,
  titleId,
}) => {
  const handleTabKeyDown = (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    if (!tabs.length) return;

    event.preventDefault();

    const currentIndex = Math.max(
      tabs.findIndex((tab) => tab.id === activeTab),
      0
    );
    const nextIndex =
      event.key === "ArrowRight"
        ? (currentIndex + 1) % tabs.length
        : (currentIndex - 1 + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];

    onTabChange?.(nextTab.id);
    document.getElementById(`${panelId}-tab-${nextTab.id}`)?.focus();
  };

  return (
    <div className="mb-3 flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id={titleId} className="text-2xl font-extrabold text-white sm:text-3xl">
            {title}
          </h2>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      {tabs.length > 0 ? (
        <div
          role="tablist"
          aria-label={`${title} filters`}
          onKeyDown={handleTabKeyDown}
          className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                id={`${panelId}-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={panelId}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onTabChange?.(tab.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1ABC9C] ${
                  isActive
                    ? "bg-[#1ABC9C] text-white shadow-lg shadow-[#1ABC9C]/20"
                    : "bg-white/5 text-[#CED4DA]/70 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {tab.label}
                {tab.count !== undefined ? (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[0.65rem] font-black ${
                      isActive ? "bg-white/20" : "bg-white/10 text-[#CED4DA]/60"
                    }`}
                  >
                    {tab.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default SectionHeader;
