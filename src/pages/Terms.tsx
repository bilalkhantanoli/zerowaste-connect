import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const sections = [
  {
    title: 'Use of the Platform',
    body: 'ZeroWaste Connect helps donors, recipients, volunteers, and admins coordinate food redistribution. You agree to use the platform only for lawful food-sharing and logistics activity.',
  },
  {
    title: 'Account Responsibility',
    body: 'You are responsible for the accuracy of your account details, donation listings, pickup information, and delivery updates. Role-based access must not be shared with unauthorized users.',
  },
  {
    title: 'Food Safety Expectations',
    body: 'Donors should only list food that is safe to share, properly stored, and clearly described. Recipients and volunteers should report unsafe or damaged items immediately.',
  },
  {
    title: 'Operational Limits',
    body: 'ZeroWaste Connect provides coordination tools but does not physically inspect every donation. Users remain responsible for compliance with applicable local food handling rules.',
  },
];

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="mt-3 text-muted-foreground">
            These terms govern use of the ZeroWaste Connect platform and its role-based dashboards.
          </p>

          <div className="mt-10 space-y-6">
            {sections.map((section) => (
              <section key={section.title} className="rounded-xl border bg-card p-6">
                <h2 className="text-lg font-semibold">{section.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
