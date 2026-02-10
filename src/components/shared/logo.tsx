"use client"

import { cn } from "@/lib/utils"

export const Logo = () => {
    return (
        <div className="flex items-center gap-x-2 group cursor-pointer select-none">
            {/* Icon Container */}
            <div className="relative w-10 h-10 flex items-center justify-center">
                {/* Glow Background */}
                <div className="absolute inset-0 bg-primary/40 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* SVG Logo */}
                <svg
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                >
                    {/* The V Shape */}
                    <path
                        d="M8 8L18 32L30 18"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                    />

                    {/* Play Button Triangle (Implicit or Explicit) - Let's add a small triangle inside */}
                    <path
                        d="M18 16L24 20L18 24Z"
                        fill="currentColor"
                        className="text-white group-hover:text-primary-foreground transition-colors"
                        style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.5))" }}
                    />

                    {/* Signal Waves */}
                    <path
                        d="M28 12C31 15 31 19 29 22"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="text-primary opacity-80"
                    />
                    <path
                        d="M32 8C37 13 37 21 33 26"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="text-primary opacity-60"
                    />
                </svg>
            </div>

            {/* Text Logo */}
            <div className="flex items-baseline">
                <span className="text-2xl font-black tracking-tighter text-primary drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                    V
                </span>
                <span className="text-2xl font-extrabold tracking-tight text-white group-hover:text-gray-200 transition-colors">
                    oxo
                </span>
            </div>
        </div>
    )
}
