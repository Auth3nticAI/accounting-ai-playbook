"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

const CATEGORY_OPTIONS = [
    "AP/AR",
    "Audit",
    "Close cycle",
    "Tax",
    "Client management",
    "Reporting",
    "Advisory",
];

export default function NewPainPointPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("AP/AR");
    const [firmSize, setFirmSize] = useState("all");
    const [severity, setSeverity] = useState("medium");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/pain-points`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    category,
                    firm_size_fit: firmSize,
                    severity,
                }),
            });
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            const created = await res.json();
            router.push(`/pain-points/${created.id}`);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create");
            setIsSubmitting(false);
        }
    }

    return (
        <section className="max-w-2xl mx-auto px-6 py-12">
            <div className="mb-8">
                <Link
                    href="/pain-points"
                    className="text-sm text-slate-600 hover:text-blue-700 transition-colors"
                >
                    &larr; Back to pain points
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
                    Add a Pain Point
                </h1>
                <p className="text-slate-600 mt-1">
                    Capture a recurring accounting problem you keep hearing
                    about. You&apos;ll add the AI solutions on the next screen.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-slate-700 mb-1"
                    >
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="e.g. Manual AP invoice coding"
                    />
                </div>

                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-slate-700 mb-1"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        required
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="What does this look like in a firm? Why is it painful? Who feels it most?"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label
                            htmlFor="category"
                            className="block text-sm font-medium text-slate-700 mb-1"
                        >
                            Category
                        </label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                            {CATEGORY_OPTIONS.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="firmSize"
                            className="block text-sm font-medium text-slate-700 mb-1"
                        >
                            Firm size fit
                        </label>
                        <select
                            id="firmSize"
                            value={firmSize}
                            onChange={(e) => setFirmSize(e.target.value)}
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="all">All firm sizes</option>
                            <option value="small">Small firm</option>
                            <option value="mid">Mid-market</option>
                            <option value="enterprise">Enterprise</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="severity"
                            className="block text-sm font-medium text-slate-700 mb-1"
                        >
                            Severity
                        </label>
                        <select
                            id="severity"
                            value={severity}
                            onChange={(e) => setSeverity(e.target.value)}
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                        {error}
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center rounded-md bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? "Saving..." : "Save Pain Point"}
                    </button>
                    <Link
                        href="/pain-points"
                        className="inline-flex items-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </section>
    );
}
