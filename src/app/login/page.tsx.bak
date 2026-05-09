"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [showInviteCode, setShowInviteCode] = useState(false);

  return (
    <div className="min-h-screen bg-background-main flex flex-col items-center justify-center p-4">
      {/* Background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="w-full max-w-md z-10">
        {/* Brand */}
        <div className="text-center mb-10">
          <Link
            href="/"
            className="font-heading text-[48px] leading-[1.2] font-bold text-primary tracking-tight"
          >
            Floraputation
          </Link>
          <p className="font-body text-[16px] leading-[1.6] text-text-secondary mt-3">
            AI-powered flower variety catalog management
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface rounded-xl border border-border-muted shadow-sm p-8">
          {/* Tab Switch */}
          <div className="flex mb-8 border-b border-border-muted">
            <button
              onClick={() => setIsRegister(false)}
              className={`flex-1 pb-3 font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold transition-colors ${
                !isRegister
                  ? "text-primary border-b-2 border-primary"
                  : "text-text-secondary hover:text-primary"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`flex-1 pb-3 font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold transition-colors ${
                isRegister
                  ? "text-primary border-b-2 border-primary"
                  : "text-text-secondary hover:text-primary"
              }`}
            >
              Register
            </button>
          </div>

          <form className="space-y-5">
            {/* Email */}
            <div>
              <label className="block font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-text-secondary mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-surface-neutral border border-border-muted rounded-md px-4 py-2.5 font-body text-[14px] leading-[1.5] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder-outline"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-text-secondary mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-surface-neutral border border-border-muted rounded-md px-4 py-2.5 font-body text-[14px] leading-[1.5] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder-outline"
              />
            </div>

            {/* Confirm Password (Register only) */}
            {isRegister && (
              <div>
                <label className="block font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-text-secondary mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-surface-neutral border border-border-muted rounded-md px-4 py-2.5 font-body text-[14px] leading-[1.5] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder-outline"
                />
              </div>
            )}

            {/* Invitation Code */}
            {isRegister && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-text-secondary">
                    Invitation Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowInviteCode(!showInviteCode)}
                    className="font-body text-[11px] leading-[1.2] text-primary hover:underline"
                  >
                    {showInviteCode ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  type={showInviteCode ? "text" : "password"}
                  placeholder="Required for upload access"
                  className="w-full bg-surface-neutral border border-border-muted rounded-md px-4 py-2.5 font-body text-[14px] leading-[1.5] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder-outline font-mono"
                />
                <p className="mt-1.5 font-body text-[11px] leading-[1.2] text-text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    info
                  </span>
                  Enter code &quot;SJ9597&quot; to unlock upload access.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-surface-tint text-on-primary py-3 rounded-lg font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] mt-2"
            >
              {isRegister ? "Create Account" : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          {!isRegister && (
            <p className="text-center mt-6 font-body text-[13px] leading-[1.4] text-text-secondary">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setIsRegister(true)}
                className="text-primary hover:underline font-medium"
              >
                Register
              </button>
            </p>
          )}
        </div>

        {/* Bottom text */}
        <p className="text-center mt-6 font-body text-[11px] leading-[1.2] text-text-secondary">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
