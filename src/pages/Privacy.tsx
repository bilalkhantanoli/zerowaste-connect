import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const sections = [
  {
    title: 'Information We Store',
    body: 'We store account profile details, role information, donation activity, request records, delivery coordination data, and related operational metadata needed to run the platform.',
  },
  {
    title: 'How Information Is Used',
    body: 'Profile and logistics data are used to match donations, coordinate deliveries, manage role-based access, and provide dashboard reporting across donor, recipient, volunteer, and admin views.',
  },
  {
    title: 'Access and Visibility',
    body: 'Some information is visible to other participants when needed for pickups, drop-offs, and platform administration. Access is limited by authentication and role-based permissions.',
  },
  {
    title: 'Your Controls',
    body: 'You can update your profile information from the settings screen. If additional retention or deletion requirements apply, those should be implemented in the production policy workflow.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="mt-3 text-muted-foreground">
            This page summarizes how ZeroWaste Connect handles account and operations data.
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
