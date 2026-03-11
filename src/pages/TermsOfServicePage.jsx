import LegalPageLayout from "../components/legal/LegalPageLayout.jsx";

const TermsOfServicePage = () => {
  return (
    <LegalPageLayout
      title="Terms of Service"
      subtitle="Operated by Scottman Consulting LLC"
    >
      <div className="space-y-6 text-slate-700">
        <div className="space-y-2">
          <p className="text-sm text-slate-500">Effective Date: [Insert Date]</p>
        </div>

        <p>
          Welcome to AI Lesson Orbit ("Platform"), a service operated by Scottman Consulting LLC
          ("Company," "we," "our," or "us"). These Terms of Service ("Terms") govern your use of
          AILessonOrbit.com and related services. By accessing or using the Service, you agree to these
          Terms.
        </p>

        <div>
          <p className="font-semibold text-slate-900">Eligibility:</p>
          <p>You must be at least 18 years old and have the authority to enter into a legally binding agreement.</p>
        </div>

        <div>
          <p className="font-semibold text-slate-900">User Accounts:</p>
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
            <li>Provide accurate information.</li>
            <li>Maintain account confidentiality.</li>
            <li>Be responsible for activities under your account.</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-slate-900">Acceptable Use:</p>
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
            <li>Do not use the Service for unlawful purposes.</li>
            <li>Do not generate harmful or inappropriate content.</li>
            <li>Do not interfere with platform security.</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-slate-900">AI Content Disclaimer:</p>
          <p>AI-generated content may contain inaccuracies. Teachers must review all materials before classroom use.</p>
        </div>

        <div>
          <p className="font-semibold text-slate-900">Limitation of Liability:</p>
          <p>Scottman Consulting LLC is not liable for indirect or consequential damages, data loss, or classroom outcomes.</p>
        </div>

        <div>
          <p className="font-semibold text-slate-900">Termination:</p>
          <p>The Company may suspend or terminate accounts for violations. Users may discontinue use at any time.</p>
        </div>

        <div>
          <p className="font-semibold text-slate-900">Changes to Terms:</p>
          <p>Updated Terms will be posted on the Platform; continued use constitutes acceptance.</p>
        </div>

        <div>
          <p className="font-semibold text-slate-900">Governing Law:</p>
          <p>These Terms are governed by U.S. law and the state in which Scottman Consulting LLC is registered.</p>
        </div>

        <div>
          <p className="font-semibold text-slate-900">Contact Information:</p>
          <p>Scottman Consulting LLC</p>
          <p>Website: AILessonOrbit.com</p>
          <p>Email: CustomerSupport@scottmanconsulting.com</p>
        </div>
      </div>
    </LegalPageLayout>
  );
};

export default TermsOfServicePage;
