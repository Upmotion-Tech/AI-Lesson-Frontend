import { Link, useNavigate } from "react-router-dom";
import PageTransition from "../common/PageTransition.jsx";
import { ArrowLeft } from "lucide-react";

const legalLinks = [
  { to: "/legal", label: "Legal Documentation" },
  { to: "/legal/terms", label: "Terms of Service" },
  { to: "/legal/privacy", label: "Privacy Policy" },
  { to: "/legal/ai-disclaimer", label: "AI Disclaimer" },
  { to: "/legal/acceptable-use", label: "Acceptable Use Policy" },
];

const LegalPageLayout = ({ title, subtitle, children }) => {
  const navigate = useNavigate();
  const canGoBack = window.history.length > 1;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[rgb(var(--color-background))]">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="flex items-center gap-3">
              {canGoBack && (
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white/90 hover:text-white hover:border-white/50 transition"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              )}
              <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-300">
                AI Lesson Orbit
              </p>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-3">
              {title}
            </h1>
            {subtitle && (
              <p className="text-slate-200 mt-3 max-w-2xl text-sm md:text-base">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <nav className="flex flex-wrap gap-2">
            {legalLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_30px_80px_-40px_rgba(15,23,42,0.3)] p-6 md:p-10">
            {children}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LegalPageLayout;
