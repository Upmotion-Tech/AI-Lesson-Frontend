import LegalPageLayout from "../components/legal/LegalPageLayout.jsx";

const PrivacyPolicyPage = () => {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="Operated by Scottman Consulting LLC"
    >
      <div className="space-y-6 text-slate-700">
        <div className="space-y-2">
          <p className="text-sm text-slate-500">Effective Date: [Insert Date]</p>
        </div>

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
      </div>
    </LegalPageLayout>
  );
};

export default PrivacyPolicyPage;
