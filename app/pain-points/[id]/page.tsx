"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    AISolution,
    FIRM_SIZE_LABELS,
    MATURITY_LABELS,
    MATURITY_STYLES,
    PainPointDetail,
    PRICING_LABELS,
    SEVERITY_LABELS,
    SEVERITY_STYLES,
} from "../../../lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export default function PainPointDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const painId = parseInt(id, 10);
    const router = useRouter();

    const [data, setData] = useState<PainPointDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddSolution, setShowAddSolution] = useState(false);

    async function reload() {
        try {
            const res = await fetch(`${API_URL}/pain-points/${painId}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const fresh = (await res.json()) as PainPointDetail;
            setData(fresh);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
        }
    }

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const res = await fetch(`${API_URL}/pain-points/${painId}`);
                if (!res.ok) {
                    throw new Error(
                        res.status === 404
                            ? "Pain point not found"
                            : `HTTP ${res.status}`
                    );
                }
                const fresh = (await res.json()) as PainPointDetail;
                if (!cancelled) {
                    setData(fresh);
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
    }, [painId]);

    async function updateSeverity(newSeverity: PainPointDetail["severity"]) {
        if (!data) return;
        const res = await fetch(`${API_URL}/pain-points/${painId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ severity: newSeverity }),
        });
        if (res.ok) {
            await reload();
        }
    }

    async function deleteSolution(solutionId: number) {
        if (!confirm("Delete this solution?")) return;
        const res = await fetch(`${API_URL}/solutions/${solutionId}`, {
            method: "DELETE",
        });
        if (res.ok) {
            await reload();
        }
    }

    async function deletePainPoint() {
        if (!data) return;
        if (
            !confirm(
                `Delete "${data.title}" and all its solutions? This cannot be undone.`
            )
        )
            return;
        const res = await fetch(`${API_URL}/pain-points/${painId}`, {
            method: "DELETE",
        });
        if (res.ok) {
            router.push("/pain-points");
            router.refresh();
        }
    }

    if (loading) {
        return (
            <section className="max-w-3xl mx-auto px-6 py-12">
                <p className="text-slate-500">Loading...</p>
            </section>
        );
    }

    if (error || !data) {
        return (
            <section className="max-w-3xl mx-auto px-6 py-12">
                <Link
                    href="/pain-points"
                    className="text-sm text-slate-600 hover:text-blue-700"
                >
                    &larr; Back to pain points
                </Link>
                <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-800">
                    {error ?? "Pain point not found"}
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-3xl mx-auto px-6 py-12">
            <Link
                href="/pain-points"
                className="text-sm text-slate-600 hover:text-blue-700 transition-colors"
            >
                &larr; Back to pain points
            </Link>

            <div className="mt-4 rounded-lg border border-slate-200 bg-white p-8">
                <div className="flex items-start justify-between gap-4 mb-3">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        {data.title}
                    </h1>
                    <span
                        className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${SEVERITY_STYLES[data.severity]}`}
                    >
                        {SEVERITY_LABELS[data.severity]} severity
                    </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-500 mb-5">
                    <span className="font-medium text-slate-700">
                        {data.category}
                    </span>
                    <span aria-hidden="true">&middot;</span>
                    <span>{FIRM_SIZE_LABELS[data.firm_size_fit]}</span>
                </div>

                <p className="text-slate-700 leading-relaxed mb-6">
                    {data.description}
                </p>

                <div className="border-t border-slate-200 pt-4">
                    <h2 className="text-sm font-semibold text-slate-700 mb-2">
                        Update severity
                    </h2>
                    <div className="flex gap-2">
                        {(["low", "medium", "high"] as const).map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => updateSeverity(s)}
                                disabled={data.severity === s}
                                className={`text-sm px-3 py-1.5 rounded-md border transition-colors ${
                                    data.severity === s
                                        ? "bg-blue-700 text-white border-blue-700"
                                        : "bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {SEVERITY_LABELS[s]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900">
                        AI Solutions{" "}
                        <span className="text-slate-400 font-normal">
                            ({data.solutions.length})
                        </span>
                    </h2>
                    <button
                        type="button"
                        onClick={() => setShowAddSolution((v) => !v)}
                        className="inline-flex items-center rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
                    >
                        {showAddSolution ? "Cancel" : "+ Add Solution"}
                    </button>
                </div>

                {showAddSolution && (
                    <AddSolutionForm
                        painId={painId}
                        onAdded={async () => {
                            setShowAddSolution(false);
                            await reload();
                        }}
                    />
                )}

                {data.solutions.length === 0 && !showAddSolution && (
                    <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-lg">
                        <p className="text-slate-600 mb-3">
                            No AI solutions mapped yet.
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowAddSolution(true)}
                            className="text-sm font-semibold text-blue-700 hover:text-blue-800"
                        >
                            Add the first solution &rarr;
                        </button>
                    </div>
                )}

                <div className="space-y-4">
                    {data.solutions.map((s) => (
                        <SolutionCard
                            key={s.id}
                            solution={s}
                            onDelete={() => deleteSolution(s.id)}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-12 pt-6 border-t border-slate-200">
                <button
                    type="button"
                    onClick={deletePainPoint}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                    Delete this pain point
                </button>
            </div>
        </section>
    );
}

function SolutionCard({
    solution,
    onDelete,
}: {
    solution: AISolution;
    onDelete: () => void;
}) {
    return (
        <article className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-lg font-semibold text-slate-900">
                    {solution.title}
                </h3>
                <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${MATURITY_STYLES[solution.maturity]}`}
                >
                    {MATURITY_LABELS[solution.maturity]}
                </span>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed mb-4">
                {solution.description}
            </p>

            {solution.tech_stack && (
                <div className="mb-3">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Stack
                    </div>
                    <div className="text-sm text-slate-700">
                        {solution.tech_stack}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100 text-sm">
                <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase">
                        Setup
                    </div>
                    <div className="text-slate-700 mt-0.5">
                        {solution.setup_days !== null
                            ? `${solution.setup_days} days`
                            : "—"}
                    </div>
                </div>
                <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase">
                        Pricing
                    </div>
                    <div className="text-slate-700 mt-0.5">
                        {PRICING_LABELS[solution.pricing_model]}
                    </div>
                </div>
                <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase">
                        Est. price
                    </div>
                    <div className="text-slate-700 mt-0.5">
                        {solution.estimated_price_usd !== null
                            ? `$${solution.estimated_price_usd.toLocaleString()}`
                            : "—"}
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onDelete}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                    Delete solution
                </button>
            </div>
        </article>
    );
}

function AddSolutionForm({
    painId,
    onAdded,
}: {
    painId: number;
    onAdded: () => void | Promise<void>;
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [techStack, setTechStack] = useState("");
    const [maturity, setMaturity] = useState("concept");
    const [setupDays, setSetupDays] = useState("");
    const [pricingModel, setPricingModel] = useState("fixed");
    const [estPrice, setEstPrice] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setErr(null);

        try {
            const res = await fetch(
                `${API_URL}/pain-points/${painId}/solutions`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title,
                        description,
                        tech_stack: techStack,
                        maturity,
                        setup_days: setupDays
                            ? parseInt(setupDays, 10)
                            : null,
                        pricing_model: pricingModel,
                        estimated_price_usd: estPrice
                            ? parseInt(estPrice, 10)
                            : null,
                    }),
                }
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            await onAdded();
        } catch (e) {
            setErr(e instanceof Error ? e.message : "Failed");
            setSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={submit}
            className="rounded-lg border border-blue-200 bg-blue-50/50 p-6 mb-4 space-y-4"
        >
            <h3 className="text-sm font-semibold text-slate-900">
                Add a new AI solution
            </h3>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Title
                </label>
                <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g. Claude + Textract invoice extraction"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                </label>
                <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="What does the solution do, and how does it address the pain?"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tech stack
                </label>
                <input
                    type="text"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g. Claude API, FastAPI, Postgres"
                />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                        Maturity
                    </label>
                    <select
                        value={maturity}
                        onChange={(e) => setMaturity(e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
                    >
                        <option value="concept">Concept</option>
                        <option value="prototype">Prototype</option>
                        <option value="proven">Proven</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                        Setup (days)
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={setupDays}
                        onChange={(e) => setSetupDays(e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                        Pricing
                    </label>
                    <select
                        value={pricingModel}
                        onChange={(e) => setPricingModel(e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
                    >
                        <option value="fixed">Fixed</option>
                        <option value="monthly">Monthly</option>
                        <option value="per-seat">Per seat</option>
                        <option value="usage">Usage</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                        Est. $ USD
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={estPrice}
                        onChange={(e) => setEstPrice(e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
                    />
                </div>
            </div>

            {err && (
                <div className="rounded-md bg-red-50 border border-red-200 p-2 text-sm text-red-800">
                    {err}
                </div>
            )}

            <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
                {submitting ? "Saving..." : "Save Solution"}
            </button>
        </form>
    );
}
