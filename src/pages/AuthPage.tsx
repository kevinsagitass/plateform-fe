// src/pages/AuthPage.tsx
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  ChefHat,
  Loader2,
  BarChart3,
  ClipboardList,
  Users,
  Star,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type AuthMode = "login" | "register";

interface FormData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ─── Reusable Input ───────────────────────────────────────────────────────────
interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: string;
}

const InputField = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
  rightElement,
  error,
}: InputFieldProps) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-medium text-neutral-700">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
        {icon}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-2.5 bg-surface border rounded-lg text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-all duration-200
          focus:ring-2 focus:ring-primary-400 focus:border-primary-400
          ${
            error
              ? "border-error ring-1 ring-error"
              : "border-neutral-200 hover:border-neutral-300"
          }`}
      />
      {rightElement && (
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
    {error && (
      <p className="text-xs text-error flex items-center gap-1 animate-fade-in">
        <span className="inline-block w-1 h-1 rounded-full bg-error" />
        {error}
      </p>
    )}
  </div>
);

// ─── Google SVG ───────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

// ─── Left Panel Data ──────────────────────────────────────────────────────────
const features = [
  {
    icon: <ClipboardList className="w-5 h-5" />,
    title: "Smart Order Management",
    desc: "Pantau dan kelola order dengan cepat dan efisien",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Revenue Analytics",
    desc: "Analisa penjualan cerdas berbasis AI",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Team Collaboration",
    desc: "Koordinasi front to back yang lebih terhubung",
  },
];

const stats = [
  { value: "100+", label: "Restaurants" },
  { value: "99%", label: "Uptime" },
  {
    value: "4.9",
    label: "App Rating",
    icon: <Star className="w-3 h-3 fill-primary-400 text-primary-400" />,
  },
];

// const testimonial = {
//   quote:
//     "Plateform membantu kami dalam mengurangi kesalahan manual yang terjadi di restoran kami.",
//   author: "Vella",
//   role: "Owner, Café Lumière",
//   avatar: "MS",
// };

// ─── Left Decorative Panel ────────────────────────────────────────────────────
const LeftPanel = () => (
  <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative bg-gradient-dark flex-col justify-between overflow-hidden p-12 xl:p-16">
    {/* Gradient orbs */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-600/20 blur-3xl" />
      <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-secondary-600/15 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 w-72 h-72 rounded-full bg-primary-500/10 blur-3xl" />
    </div>

    {/* Grid pattern overlay */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }}
    />

    {/* Content */}
    <div className="relative z-10 flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-warm rounded-xl flex items-center justify-center shadow-order">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white tracking-tight">
            Plateform
          </span>
        </Link>
      </div>

      {/* Hero text */}
      <div className="mt-16 xl:mt-20">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-3.5 py-1.5 mb-6">
          <TrendingUp className="w-3.5 h-3.5 text-primary-400" />
          <span className="text-xs font-medium text-primary-300">
            Trusted by 100+ restaurants in Indonesia
          </span>
        </div>

        <h2 className="font-display font-bold text-4xl xl:text-5xl text-white leading-tight mb-4">
          Jalankan bisnis anda dengan{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-300">
            Mudah
          </span>
        </h2>
        <p className="text-neutral-400 text-base leading-relaxed max-w-sm">
          Semua yang dibutuhkan tim Anda pesanan, analitik, dan manajemen staf
          dalam satu platform yang sangat sederhana.
        </p>
      </div>

      {/* Features */}
      <div className="mt-10 space-y-5">
        {features.map((f) => (
          <div key={f.title} className="flex items-start gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-primary-400 shrink-0 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 transition-all duration-200">
              {f.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-white mb-0.5">
                {f.title}
              </p>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div className="mt-10 flex items-center gap-6 xl:gap-8">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="flex items-center gap-1">
              <span className="font-display font-bold text-2xl text-white">
                {s.value}
              </span>
              {s.icon}
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Testimonial card */}
      {/* <div className="mt-auto pt-10">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
          <div className="flex gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 fill-primary-400 text-primary-400"
              />
            ))}
          </div>
          <p className="text-sm text-neutral-300 leading-relaxed italic mb-4">
            "{testimonial.quote}"
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-warm flex items-center justify-center text-white text-xs font-bold">
              {testimonial.avatar}
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                {testimonial.author}
              </p>
              <p className="text-2xs text-neutral-500">{testimonial.role}</p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const { login, register } = useAuth();

  const handleChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (mode === "register" && !formData.name.trim())
      newErrors.name = "Full name is required";
    if (mode === "register" && !formData.username.trim())
      newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email address";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (mode === "register") {
      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Please confirm your password";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsLoading(true);

      if (mode === "login") {
        await login(formData.email, formData.password);
      } else {
        await register({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });

        await login(formData.email, formData.password);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsGoogleLoading(false);
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrors({});
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* ── Left Panel ── */}
      <LeftPanel />

      {/* ── Right Panel (Form) ── */}
      <div className="flex-1 flex flex-col bg-surface-secondary relative overflow-y-auto">
        {/* Subtle top bar on mobile */}
        <div className="lg:hidden flex items-center gap-2.5 px-6 py-5 border-b border-neutral-100 bg-surface">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-warm rounded-lg flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-neutral-900">
              Plateform
            </span>
          </Link>
        </div>

        {/* Centered form area */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md animate-fade-in">
            {/* Heading */}
            <div className="mb-8">
              <h1 className="font-display font-bold text-3xl text-neutral-900 mb-2">
                {mode === "login"
                  ? "Sign in to your account"
                  : "Create your account"}
              </h1>
              <p className="text-sm text-neutral-500">
                {mode === "login"
                  ? "Selamat Datang Kembali! masukan detail anda untuk memulai"
                  : "Mulai gratis!, tanpa kartu kredit"}
              </p>
            </div>

            {/* Tab switcher */}
            <div className="flex bg-neutral-100 rounded-xl p-1 mb-6">
              {(["login", "register"] as AuthMode[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => switchMode(tab)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      mode === tab
                        ? "bg-surface text-neutral-900 shadow-card"
                        : "text-neutral-500 hover:text-neutral-700"
                    }`}
                >
                  {tab === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-surface border border-neutral-200 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 hover:shadow-card transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
              ) : (
                <GoogleIcon />
              )}
              <span>
                {isGoogleLoading ? "Connecting..." : "Continue with Google"}
              </span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-xs text-neutral-400 font-medium">
                or continue with email
              </span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name - register only */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  mode === "register"
                    ? "max-h-28 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <InputField
                  id="name"
                  label="Full Name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange("name")}
                  placeholder="John Doe"
                  icon={<User className="w-4 h-4" />}
                  error={errors.name}
                />
              </div>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  mode === "register"
                    ? "max-h-28 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <InputField
                  id="username"
                  label="Username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange("username")}
                  placeholder="johndoe"
                  icon={<User className="w-4 h-4" />}
                  error={errors.username}
                />
              </div>

              {/* Email */}
              <InputField
                id="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                placeholder="you@example.com"
                icon={<Mail className="w-4 h-4" />}
                error={errors.email}
              />

              {/* Password */}
              <InputField
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange("password")}
                placeholder={
                  mode === "register"
                    ? "Min. 8 characters"
                    : "Enter your password"
                }
                icon={<Lock className="w-4 h-4" />}
                error={errors.password}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
              />

              {/* Confirm Password - register only */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  mode === "register"
                    ? "max-h-28 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <InputField
                  id="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  placeholder="Re-enter your password"
                  icon={<Lock className="w-4 h-4" />}
                  error={errors.confirmPassword}
                  rightElement={
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  }
                />
              </div>

              {/* Forgot password */}
              {mode === "login" && (
                <div className="flex justify-end -mt-1">
                  <button
                    type="button"
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Terms */}
              {mode === "register" && (
                <p className="text-xs text-neutral-500 leading-relaxed">
                  By creating an account, you agree to our{" "}
                  <button
                    type="button"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Privacy Policy
                  </button>
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-warm text-white font-semibold text-sm rounded-xl shadow-order hover:shadow-lg hover:opacity-95 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      {mode === "login"
                        ? "Signing in..."
                        : "Creating account..."}
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      {mode === "login" ? "Sign In" : "Create Account"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Switch mode */}
            <p className="text-center text-sm text-neutral-500 mt-6">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                onClick={() =>
                  switchMode(mode === "login" ? "register" : "login")
                }
                className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                {mode === "login" ? "Sign up free" : "Sign in"}
              </button>
            </p>

            {/* Trust badges */}
            <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-center gap-6">
              {[
                {
                  icon: (
                    <CheckCircle2 className="w-3.5 h-3.5 text-secondary-500" />
                  ),
                  label: "No credit card",
                },
                {
                  icon: (
                    <CheckCircle2 className="w-3.5 h-3.5 text-secondary-500" />
                  ),
                  label: "Free 30-day trial",
                },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-1.5">
                  {b.icon}
                  <span className="text-xs text-neutral-500">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 text-center border-t border-neutral-100">
          <p className="text-xs text-neutral-400">
            © 2026 Plateform ·
            <button className="hover:text-neutral-600 transition-colors mx-1">
              Privacy
            </button>
            ·
            <button className="hover:text-neutral-600 transition-colors mx-1">
              Terms
            </button>
            ·
            <button className="hover:text-neutral-600 transition-colors mx-1">
              Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
