import LegalPageLayout from "../components/legal/LegalPageLayout.jsx";

const AIDisclaimerPage = () => {
  return (
    <LegalPageLayout
      title="AI Disclaimer"
      subtitle="Operated by Scottman Consulting LLC"
    >
      <div className="space-y-6 text-slate-700">
        <div className="space-y-2">
          <p className="text-sm text-slate-500">Effective Date: [Insert Date]</p>
        </div>

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
      </div>
    </LegalPageLayout>
  );
};

export default AIDisclaimerPage;
