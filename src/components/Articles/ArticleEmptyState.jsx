import { BookOpen } from "lucide-react";

const ArticleEmptyState = ({
  icon: Icon = BookOpen,
  title = "No articles found",
  description = "Try a different search or check back soon.",
  action = null,
}) => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#1E1E2F]/60 p-10 text-center text-[#CED4DA]">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1ABC9C]/10 text-[#1ABC9C]">
      <Icon className="h-8 w-8" />
    </div>
    <h2 className="text-xl font-bold">{title}</h2>
    <p className="mt-2 max-w-md text-sm leading-6 text-[#CED4DA]/65">
      {description}
    </p>
    {action ? <div className="mt-6">{action}</div> : null}
  </div>
);

export default ArticleEmptyState;
