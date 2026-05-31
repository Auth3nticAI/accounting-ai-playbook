import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Accounting AI Playbook",
    description:
        "A library of accounting pain points and the AI solutions that address them.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
                <header className="border-b border-slate-200 bg-white">
                    <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                        <Link
                            href="/"
                            className="font-semibold text-slate-900 hover:text-blue-700 transition-colors"
                        >
                            Accounting AI Playbook
                        </Link>
                        <ul className="flex items-center gap-6 text-sm text-slate-600">
                            <li>
                                <Link
                                    href="/"
                                    className="hover:text-blue-700 transition-colors"
                                >
                                    Overview
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/pain-points"
                                    className="hover:text-blue-700 transition-colors"
                                >
                                    Pain Points
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/pain-points/new"
                                    className="inline-flex items-center rounded-md bg-blue-700 px-3 py-1.5 text-white font-medium hover:bg-blue-800 transition-colors"
                                >
                                    + Add
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </header>

                <main className="flex-1">{children}</main>

                <footer className="border-t border-slate-200 mt-16">
                    <div className="max-w-5xl mx-auto px-6 py-6 text-sm text-slate-500 text-center">
                        Accounting AI Playbook &middot; built for solo
                        AI-for-accounting consultants
                    </div>
                </footer>
            </body>
        </html>
    );
}
