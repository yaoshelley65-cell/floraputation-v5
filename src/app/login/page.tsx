"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, VALID_INVITATION_CODE } from "@/lib/supabase";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/search");
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/search` },
        });
        if (signUpError) throw signUpError;
        if (data.user && data.session) {
          router.replace("/search");
        } else {
          setSuccessMsg(
            "Account created! Check your email to confirm, then sign in."
          );
        }
      } else {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        router.replace("/search");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background-main flex flex-col items-center justify-center p-4">
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
              onClick={() => { setMode("signin"); setError(null); }}
              className={`flex-1 pb-3 font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold transition-colors ${
                mode === "signin"
                  ? "text-primary border-b-2 border-primary"
                  : "text-text-secondary hover:text-primary"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("signup"); setError(null); }}
              className={`flex-1 pb-3 font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold transition-colors ${
                mode === "signup"
                  ? "text-primary border-b-2 border-primary"
                  : "text-text-secondary hover:text-primary"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-text-secondary mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-surface-neutral border border-border-muted rounded-md px-4 py-2.5 font-body text-[14px] leading-[1.5] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder-outline"
              />
            </div>

            {/* Confirm Password (signup only) */}
            {mode === "signup" && (
              <div>
                <label className="block font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold text-text-secondary mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-surface-neutral border border-border-muted rounded-md px-4 py-2.5 font-body text-[14px] leading-[1.5] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder-outline"
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                <p className="font-body text-[13px] text-red-600">{error}</p>
              </div>
            )}
            {/* Success */}
            {successMsg && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
                <p className="font-body text-[13px] text-green-700">{successMsg}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-surface-tint text-on-primary py-3 rounded-lg font-body text-[12px] leading-[1.2] tracking-[0.05em] font-bold transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Please wait…"
                : mode === "signin"
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          {/* Invitation code info */}
          <div className="mt-6 pt-5 border-t border-border-muted">
            <p className="font-body text-[11px] leading-[1.4] text-text-secondary flex items-start gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-primary mt-0.5">
                key
              </span>
              <span>
                Upload access requires invitation code{" "}
                <span className="font-mono font-bold text-primary">
                  {VALID_INVITATION_CODE}
                </span>
                . Enter it on the Upload page after signing in.
              </span>
            </p>
          </div>
        </div>

        <p className="text-center mt-6 font-body text-[11px] leading-[1.2] text-text-secondary">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
