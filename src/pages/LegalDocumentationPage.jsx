import LegalPageLayout from "../components/legal/LegalPageLayout.jsx";

const LegalDocumentationPage = () => {
  return (
    <LegalPageLayout
      title="Legal Documentation"
      subtitle="Operated by Scottman Consulting LLC"
    >
      <div className="space-y-8 text-slate-700">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">AI Lesson Orbit Legal Documentation</h2>
          <p className="text-sm font-semibold text-slate-600">Operated by Scottman Consulting LLC</p>
          <p className="text-sm text-slate-500">Effective Date: [Insert Date]</p>
        </div>

        <section className="space-y-3">
          <h3 className="text-lg font-black text-slate-900">Table of Contents</h3>
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
            <li>
              <a href="#terms-of-service" className="text-emerald-700 font-semibold hover:underline">
                1. Terms of Service
              </a>
            </li>
            <li>
              <a href="#privacy-policy" className="text-emerald-700 font-semibold hover:underline">
                2. Privacy Policy
              </a>
            </li>
            <li>
              <a href="#ai-disclaimer" className="text-emerald-700 font-semibold hover:underline">
                3. AI Disclaimer
              </a>
            </li>
            <li>
              <a href="#acceptable-use" className="text-emerald-700 font-semibold hover:underline">
                4. Acceptable Use Policy
              </a>
            </li>
          </ul>
        </section>

        <section id="terms-of-service" className="space-y-4">
          <h3 className="text-xl font-black text-slate-900">1. Terms of Service</h3>
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
        </section>

        <section id="privacy-policy" className="space-y-4">
          <h3 className="text-xl font-black text-slate-900">2. Privacy Policy</h3>
          <p>
            Scottman Consulting LLC ("Company") respects your privacy. This Policy explains how we collect,
            use, and protect information.
          </p>

          <div>
            <p className="font-semibold text-slate-900">Information We Collect:</p>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              <li>Account information (name, email, credentials).</li>
              <li>Usage data (actions on the platform).</li>
              <li>Technical data (IP, device, browser).</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-slate-900">Use of Information:</p>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              <li>Provide and maintain Service.</li>
              <li>Communicate updates and support.</li>
              <li>Improve features and security.</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-slate-900">Data Sharing:</p>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
              <li>Service providers assisting operations.</li>
              <li>Legal authorities as required by law.</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-slate-900">Data Security:</p>
            <p>We use reasonable safeguards but cannot guarantee absolute security.</p>
          </div>

          <div>
            <p className="font-semibold text-slate-900">User Rights:</p>
            <p>Request access or deletion by contacting CustomerSupport@scottmanconsulting.com.</p>
          </div>
        </section>

        <section id="ai-disclaimer" className="space-y-4">
          <h3 className="text-xl font-black text-slate-900">3. AI Disclaimer</h3>
          <p>
            AI Lesson Orbit uses artificial intelligence to generate lesson plans and educational materials.
          </p>
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
            <li>Accuracy: Content may contain errors.</li>
            <li>Responsibility: Educators must review before use.</li>
            <li>No Guarantee: Outcomes or compliance with curriculum are not assured.</li>
          </ul>
          <p>
            By using the Service, you acknowledge AI outputs are for informational and educational assistance only.
          </p>
        </section>

        <section id="acceptable-use" className="space-y-4">
          <h3 className="text-xl font-black text-slate-900">4. Acceptable Use Policy</h3>
          <p>Users must:</p>
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
            <li>Use the Platform responsibly.</li>
            <li>Not upload illegal, harmful, or discriminatory content.</li>
            <li>Not bypass security measures.</li>
            <li>Not share accounts or credentials.</li>
            <li>Comply with laws and school policies.</li>
          </ul>
          <p>Violations may result in suspension or termination.</p>
        </section>
      </div>
    </LegalPageLayout>
  );
};

export default LegalDocumentationPage;
