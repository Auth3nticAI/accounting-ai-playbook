"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Stats } from "../lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export default function HomePage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const res = await fetch(`${API_URL}/stats`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = (await res.json()) as Stats;
                if (!cancelled) {
                    setStats(data);
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
    }, []);

    return (
        <section className="max-w-5xl mx-auto px-6 py-16">
            <div className="max-w-3xl">
                <p className="text-sm font-medium text-blue-700 mb-3">
                    For solo AI-for-accounting consultants
                </p>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
                    The Accounting AI Playbook
                </h1>
                <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                    A library of accounting pain points and the AI solutions
                    that address them. So when a prospect mentions a problem,
                    you can land on a real, priced, tech-stacked solution
                    instead of pitching vapor.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                        href="/pain-points"
                        className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
                    >
                        Browse Pain Points
                    </Link>
                    <Link
                        href="/pain-points/new"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-colors"
                    >
                        Add a Pain Point
                    </Link>
                </div>
            </div>

            <div className="mt-14">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
                    Playbook at a glance
                </h2>

                {loading && (
                    <p className="text-slate-500">Loading stats...</p>
                )}

                {error && !loading && (
                    <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-800">
                        Could not load stats: {error}.{" "}
                        <span className="text-red-700">
                            Make sure the backend is running at{" "}
                            <code>{API_URL}</code>.
                        </span>
                    </div>
                )}

                {!loading && !error && stats && (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 mb-8">
                            <StatCard
                                label="Pain points catalogued"
                                value={stats.pain_point_total}
                            />
                            <StatCard
                                label="AI solutions mapped"
                                value={stats.solution_total}
                            />
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            <BreakdownCard
                                title="By category"
                                data={stats.pain_points_by_category}
                            />
                            <BreakdownCard
                                title="By severity"
                                data={stats.pain_points_by_severity}
                            />
                            <BreakdownCard
                                title="Solutions by maturity"
                                data={stats.solutions_by_maturity}
                            />
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="text-4xl font-bold text-slate-900">{value}</div>
            <div className="mt-1 text-sm text-slate-600">{label}</div>
        </div>
    );
}

function BreakdownCard({
    title,
    data,
}: {
    title: string;
    data: Record<string, number>;
}) {
    const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((sum, [, v]) => sum + v, 0);
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
                {title}
            </h3>
            <ul className="space-y-2">
                {entries.map(([key, value]) => (
                    <li key={key} className="flex items-center justify-between text-sm">
                        <span className="text-slate-700 capitalize">{key}</span>
                        <span className="text-slate-500">
                            {value}
                            {total > 0 && (
                                <span className="text-slate-400 ml-1">
                                    ({Math.round((value / total) * 100)}%)
                                </span>
                            )}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
