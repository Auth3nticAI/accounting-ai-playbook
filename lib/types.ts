export interface AISolution {
    id: number;
    pain_point_id: number;
    title: string;
    description: string;
    tech_stack: string;
    maturity: "concept" | "prototype" | "proven";
    setup_days: number | null;
    pricing_model: "fixed" | "monthly" | "per-seat" | "usage" | "custom";
    estimated_price_usd: number | null;
    created_at: string;
}

export interface PainPoint {
    id: number;
    title: string;
    description: string;
    category: string;
    firm_size_fit: "small" | "mid" | "enterprise" | "all";
    severity: "low" | "medium" | "high";
    created_at: string;
    solution_count: number;
}

export interface PainPointDetail extends PainPoint {
    solutions: AISolution[];
}

export interface Stats {
    pain_point_total: number;
    solution_total: number;
    pain_points_by_category: Record<string, number>;
    pain_points_by_severity: Record<string, number>;
    solutions_by_maturity: Record<string, number>;
}

export const SEVERITY_STYLES: Record<PainPoint["severity"], string> = {
    low: "bg-slate-100 text-slate-700",
    medium: "bg-amber-100 text-amber-800",
    high: "bg-red-100 text-red-800",
};

export const SEVERITY_LABELS: Record<PainPoint["severity"], string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
};

export const FIRM_SIZE_LABELS: Record<PainPoint["firm_size_fit"], string> = {
    small: "Small firm",
    mid: "Mid-market",
    enterprise: "Enterprise",
    all: "All firm sizes",
};

export const MATURITY_STYLES: Record<AISolution["maturity"], string> = {
    concept: "bg-slate-100 text-slate-700",
    prototype: "bg-blue-100 text-blue-800",
    proven: "bg-green-100 text-green-800",
};

export const MATURITY_LABELS: Record<AISolution["maturity"], string> = {
    concept: "Concept",
    prototype: "Prototype",
    proven: "Proven",
};

export const PRICING_LABELS: Record<AISolution["pricing_model"], string> = {
    fixed: "Fixed fee",
    monthly: "Monthly retainer",
    "per-seat": "Per seat",
    usage: "Usage-based",
    custom: "Custom",
};
