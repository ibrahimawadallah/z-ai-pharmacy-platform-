import { AppLayout } from "@/components/layout/AppLayout";
import { SecondaryPanelProvider } from "@/components/intelligence/secondary-panel";
import { MohAlertBanner } from "@/components/intelligence/moh-alert-banner";

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SecondaryPanelProvider>
      <AppLayout>
        <div className="max-w-7xl mx-auto w-full">
          <MohAlertBanner />
        </div>
        {children}
      </AppLayout>
    </SecondaryPanelProvider>
  );
}
