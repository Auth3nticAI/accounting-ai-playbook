"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    PainPoint,
    SEVERITY_LABELS,
    SEVERITY_STYLES,
} from "../../lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export default function PainPointsListPage() {
    const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const url = activeCategory
                    ? `${API_URL}/pain-points?category=${encodeURIComponent(activeCategory)}`
                    : `${API_URL}/pain-points`;
                const [ppRes, catRes] = await Promise.all([
                    fetch(url),
                    fetch(`${API_URL}/categories`),
                ]);
                if (!ppRes.ok) throw new Error(`HTTP ${ppRes.status}`);
                if (!catRes.ok) throw new Error(`HTTP ${catRes.status}`);
                const ppData = (await ppRes.json()) as PainPoint[];
                const catData = (await catRes.json()) as string[];
                if (!cancelled) {
                    setPainPoints(ppData);
                    setCategories(catData);
                    setLoading(false);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error ? err.message : "Failed to load"
                    );
                    setLoading(false);
                }
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, [activeCategory]);

    return (
        <section className="max-w-5xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Pain Points
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Click any pain point to see the AI solutions you have
                        mapped to it.
                    </p>
                </div>
                <Link
                    href="/pain-points/new"
                    className="inline-flex items-center rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
                >
                    + Add Pain Point
                </Link>
            </div>

            {/* Category filter */}
            {categories.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveCategory(null)}
                        className={`text-sm font-medium px-3 py-1.5 rounded-full border transition-colors ${
                            activeCategory === null
                                ? "bg-blue-700 text-white border-blue-700"
                                : "bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                        }`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setActiveCategory(cat)}
                            className={`text-sm font-medium px-3 py-1.5 rounded-full border transition-colors ${
                                activeCategory === cat
                                    ? "bg-blue-700 text-white border-blue-700"
                                    : "bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {loading && (
                <p className="text-slate-500 text-center py-12">Loading...</p>
            )}

            {error && !loading && (
                <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-800">
                    Could not load pain points: {error}
                </div>
            )}

            {!loading && !error && painPoints.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-lg">
                    <p className="text-slate-600 mb-4">
                        No pain points{" "}
                        {activeCategory ? `in "${activeCategory}"` : "yet"}.
                    </p>
                    <Link
                        href="/pain-points/new"
                        className="inline-flex items-center rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
                    >
                        Add the first one
                    </Link>
                </div>
            )}

            {!loading && !error && painPoints.length > 0 && (
                <div className="grid gap-4">
                    {painPoints.map((pp) => (
                        <Link
                            key={pp.id}
                            href={`/pain-points/${pp.id}`}
                            className="block rounded-lg border border-slate-200 bg-white p-6 hover:border-slate-300 hover:shadow-sm transition-all"
                        >
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    {pp.title}
                                </h2>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span
                                        className={`text-xs font-medium px-2 py-1 rounded-full ${SEVERITY_STYLES[pp.severity]}`}
                                    >
                                        {SEVERITY_LABELS[pp.severity]}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                                <span className="font-medium">
                                    {pp.category}
                                </span>
                                <span aria-hidden="true">&middot;</span>
                                <span>
                                    {pp.solution_count}{" "}
                                    {pp.solution_count === 1
                                        ? "solution"
                                        : "solutions"}{" "}
                                    mapped
                                </span>
                            </div>

                            <p className="text-sm text-slate-600 line-clamp-2">
                                {pp.description}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}
