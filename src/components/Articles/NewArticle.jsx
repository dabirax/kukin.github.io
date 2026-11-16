import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Send,
} from "lucide-react";
import AuthField, { inputClass } from "../Auth/AuthField.jsx";
import {
  createArticle,
  uploadArticleCover,
} from "../../api/articles.js";
import { useGlobalContext } from "../../useGlobalContext.js";
import { ARTICLE_CATEGORIES } from "./constants.js";

const initialForm = {
  title: "",
  category: "Nutrition",
  excerpt: "",
  content: "",
  tags: "",
  sourceLabel: "",
  sourceUrl: "",
};

const NewArticle = () => {
  const navigate = useNavigate();
  const { notify } = useGlobalContext();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [coverImage, setCoverImage] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverError, setCoverError] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState("");

  useEffect(
    () => () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    },
    [coverPreview]
  );

  const updateField = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleCoverChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setCoverError("Choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setCoverError("Image must be 5MB or smaller.");
      return;
    }

    const preview = URL.createObjectURL(file);
    setCoverPreview(preview);
    setCoverError("");
    setCoverUploading(true);

    try {
      const data = await uploadArticleCover(file);
      setCoverImage(data?.url || "");
      setCoverPreview("");
      URL.revokeObjectURL(preview);
      notify("Cover image uploaded");
    } catch (error) {
      setCoverError(error?.message || "Unable to upload that image.");
      setCoverPreview("");
    } finally {
      setCoverUploading(false);
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (form.title.trim().length < 5 || form.title.trim().length > 140) {
      nextErrors.title = "Use a title between 5 and 140 characters.";
    }

    if (
      form.excerpt.trim().length < 20 ||
      form.excerpt.trim().length > 400
    ) {
      nextErrors.excerpt = "Use an excerpt between 20 and 400 characters.";
    }

    if (form.content.trim().length < 40) {
      nextErrors.content = "Write at least 40 characters of content.";
    }

    if (!ARTICLE_CATEGORIES.includes(form.category)) {
      nextErrors.category = "Choose a category.";
    }

    const tags = form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (tags.length > 8) {
      nextErrors.tags = "Add no more than 8 tags.";
    }

    if (form.sourceLabel.trim() || form.sourceUrl.trim()) {
      if (!form.sourceLabel.trim() || !form.sourceUrl.trim()) {
        nextErrors.source = "Add both a source label and a source URL.";
      } else {
        try {
          const url = new URL(form.sourceUrl.trim());
          if (!["http:", "https:"].includes(url.protocol)) {
            throw new Error("Invalid URL");
          }
        } catch {
          nextErrors.source = "Enter a valid http(s) source URL.";
        }
      }
    }

    setErrors(nextErrors);
    return { valid: Object.keys(nextErrors).length === 0, tags };
  };

  const handleSubmit = async (status) => {
    if (coverUploading) {
      setFormError("Wait for the cover image to finish uploading.");
      return;
    }

    const { valid, tags } = validate();

    if (!valid) {
      setFormError("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(status);
    setFormError("");

    const sources =
      form.sourceLabel.trim() && form.sourceUrl.trim()
        ? [
            {
              label: form.sourceLabel.trim(),
              url: form.sourceUrl.trim(),
            },
          ]
        : [];

    try {
      const data = await createArticle({
        title: form.title.trim(),
        category: form.category,
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        tags,
        coverImage,
        sources,
        status,
      });

      const created = data?.article || data;
      notify(status === "draft" ? "Draft saved" : "Article published");
      navigate(
        status === "draft" || created?.status === "draft"
          ? "/articles/mine"
          : `/articles/${created?.slug}`
      );
    } catch (error) {
      setFormError(error?.message || "Unable to save this article.");
      setErrors(error?.errors || {});
    } finally {
      setSubmitting("");
    }
  };

  const preview = coverImage || coverPreview;

  return (
    <div className="container pb-10 text-[#CED4DA]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#1ABC9C] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to articles
            </Link>
            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              Write a new article
            </h1>
            <p className="mt-1 text-sm text-[#CED4DA]/60">
              Share a recipe, a nutrition guide, or a food safety tip with the
              Kukin community.
            </p>
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit("published");
          }}
          className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]"
        >
          <section className="space-y-5 rounded-3xl bg-[#1E1E2F] p-6 shadow-2xl ring-1 ring-white/10">
            <AuthField
              label="Title"
              id="article-title"
              value={form.title}
              onChange={updateField("title")}
              error={errors.title}
              placeholder="e.g. Five easy ways to add more vegetables to your day"
              maxLength={140}
              labelClassName="text-[#CED4DA]/75"
            />

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="article-category"
                className="text-sm font-semibold text-[#CED4DA]/75"
              >
                Category
              </label>
              <select
                id="article-category"
                value={form.category}
                onChange={updateField("category")}
                className={inputClass}
                aria-invalid={Boolean(errors.category)}
              >
                {ARTICLE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category ? (
                <p className="text-xs font-medium text-red-400">
                  {errors.category}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="article-excerpt"
                className="text-sm font-semibold text-[#CED4DA]/75"
              >
                Short excerpt
              </label>
              <textarea
                id="article-excerpt"
                value={form.excerpt}
                onChange={updateField("excerpt")}
                rows={3}
                maxLength={400}
                placeholder="A short summary shown on article cards."
                className={`${inputClass} resize-none`}
                aria-invalid={Boolean(errors.excerpt)}
              />
              <div className="flex justify-between gap-2 text-xs">
                <span className="text-red-400">{errors.excerpt || ""}</span>
                <span className="text-[#CED4DA]/40">
                  {form.excerpt.length}/400
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="article-content"
                className="text-sm font-semibold text-[#CED4DA]/75"
              >
                Article content
              </label>
              <textarea
                id="article-content"
                value={form.content}
                onChange={updateField("content")}
                rows={16}
                placeholder={
                  "Write your article here.\n\nSeparate paragraphs with a blank line."
                }
                className={`${inputClass} resize-y font-normal leading-7`}
                aria-invalid={Boolean(errors.content)}
              />
              {errors.content ? (
                <p className="text-xs font-medium text-red-400">
                  {errors.content}
                </p>
              ) : null}
            </div>

            <AuthField
              label="Tags"
              id="article-tags"
              value={form.tags}
              onChange={updateField("tags")}
              error={errors.tags}
              hint="Separate tags with commas. Up to 8 tags."
              placeholder="tomato, vitamins, healthy eating"
              labelClassName="text-[#CED4DA]/75"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <AuthField
                label="Source label"
                id="article-source-label"
                value={form.sourceLabel}
                onChange={updateField("sourceLabel")}
                error={errors.source}
                placeholder="WHO nutrition guidance"
                labelClassName="text-[#CED4DA]/75"
              />
              <AuthField
                label="Source URL"
                id="article-source-url"
                type="url"
                value={form.sourceUrl}
                onChange={updateField("sourceUrl")}
                placeholder="https://..."
                labelClassName="text-[#CED4DA]/75"
              />
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-3xl bg-[#1E1E2F] p-6 shadow-2xl ring-1 ring-white/10">
              <h2 className="text-lg font-bold">Cover image</h2>
              <p className="mt-1 text-xs leading-5 text-[#CED4DA]/50">
                Optional. Use a landscape image under 5MB.
              </p>

              <div className="mt-4 overflow-hidden rounded-2xl border border-dashed border-white/15 bg-[#05010f]/50">
                {preview ? (
                  <img
                    src={preview}
                    alt="Article cover preview"
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-44 flex-col items-center justify-center gap-2 text-[#CED4DA]/35">
                    {coverUploading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-[#1ABC9C]" />
                    ) : (
                      <ImagePlus className="h-9 w-9" />
                    )}
                    <span className="text-xs font-semibold">
                      {coverUploading ? "Uploading..." : "No image selected"}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={coverUploading}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#1ABC9C]/50 px-5 py-2.5 text-sm font-bold text-[#1ABC9C] transition hover:bg-[#1ABC9C]/10 disabled:opacity-60"
              >
                {coverUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                {preview ? "Change cover" : "Choose cover"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
              {coverError ? (
                <p className="mt-3 text-xs font-medium text-red-400">
                  {coverError}
                </p>
              ) : null}
            </section>

            <section className="rounded-3xl bg-[#1E1E2F] p-6 shadow-2xl ring-1 ring-white/10">
              <h2 className="text-lg font-bold">Publish</h2>
              <p className="mt-1 text-xs leading-5 text-[#CED4DA]/50">
                Drafts stay private. Published articles appear in the Kukin
                journal immediately.
              </p>

              {formError ? (
                <p className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                  {formError}
                </p>
              ) : null}

              <div className="mt-5 space-y-3">
                <button
                  type="submit"
                  disabled={Boolean(submitting) || coverUploading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1ABC9C] px-5 py-3 font-bold text-white transition hover:bg-[#16a085] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting === "published" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Publish article
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmit("draft")}
                  disabled={Boolean(submitting) || coverUploading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 font-bold text-[#CED4DA]/75 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting === "draft" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Save as draft
                </button>

                <Link
                  to="/articles"
                  className="block rounded-full px-5 py-3 text-center text-sm font-bold text-[#CED4DA]/55 transition hover:bg-white/5"
                >
                  Cancel
                </Link>
              </div>
            </section>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default NewArticle;
