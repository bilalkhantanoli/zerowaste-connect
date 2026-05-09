import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { ImpactSection } from '@/components/landing/ImpactSection';
import { RolesSection } from '@/components/landing/RolesSection';
import { CTASection } from '@/components/landing/CTASection';

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
        <ImpactSection />
        <RolesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
