import LegalPageLayout from "../components/legal/LegalPageLayout.jsx";

const AcceptableUsePolicyPage = () => {
  return (
    <LegalPageLayout
      title="Acceptable Use Policy"
      subtitle="Operated by Scottman Consulting LLC"
    >
      <div className="space-y-6 text-slate-700">
        <div className="space-y-2">
          <p className="text-sm text-slate-500">Effective Date: [Insert Date]</p>
        </div>

        <p>Users must:</p>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
          <li>Use the Platform responsibly.</li>
          <li>Not upload illegal, harmful, or discriminatory content.</li>
          <li>Not bypass security measures.</li>
          <li>Not share accounts or credentials.</li>
          <li>Comply with laws and school policies.</li>
        </ul>
        <p>Violations may result in suspension or termination.</p>
      </div>
    </LegalPageLayout>
  );
};

export default AcceptableUsePolicyPage;
