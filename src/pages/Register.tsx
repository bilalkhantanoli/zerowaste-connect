import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Leaf, Loader2, Building2, Users, Bike, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from '@/types';

const roleConfig = {
  donor: {
    label: 'Donor',
    icon: Building2,
    description: 'Restaurants, stores, farms, and individuals with surplus food',
    benefits: ['List donations easily', 'Track your impact', 'Receive pickup scheduling'],
    color: 'border-primary bg-primary/5 hover:bg-primary/10',
    selectedColor: 'border-primary bg-primary/15 ring-2 ring-primary',
  },
  recipient: {
    label: 'Recipient',
    icon: Users,
    description: 'Charities, food banks, shelters, and community organizations',
    benefits: ['Browse available food', 'Request specific items', 'Track deliveries'],
    color: 'border-accent bg-accent/5 hover:bg-accent/10',
    selectedColor: 'border-accent bg-accent/15 ring-2 ring-accent',
  },
  volunteer: {
    label: 'Volunteer',
    icon: Bike,
    description: 'Make a difference by delivering food to those in need',
    benefits: ['Flexible schedule', 'Optimized routes', 'Community recognition'],
    color: 'border-success bg-success/5 hover:bg-success/10',
    selectedColor: 'border-success bg-success/15 ring-2 ring-success',
  },
};

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();

  const initialRole = (searchParams.get('role') as UserRole) || 'donor';

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const profile = await Promise.race([
        register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          role: selectedRole,
        }),
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('Registration timeout')), 12000),
        ),
      ]);

      if (!profile) {
        toast.success('Account created successfully!', {
          description: 'Please verify your email, then log in to continue.',
        });
        navigate('/login');
        return;
      }

      toast.success('Account created successfully!', {
        description: 'Welcome to ZeroWaste Connect',
      });

      navigate(`/${selectedRole}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Please try again later.';
      toast.error('Registration failed', {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-nature-gradient flex min-h-screen items-center justify-center p-4">
      <div className="absolute inset-0 bg-hero-pattern opacity-30" />

      <div className="relative w-full max-w-2xl">
        {/* Logo */}
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <Leaf className="h-10 w-10 text-primary" />
          <span className="text-2xl font-bold">
            ZeroWaste<span className="text-primary">Connect</span>
          </span>
        </Link>

        <Card variant="elevated" className="backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>
              {step === 1
                ? 'Choose how you want to contribute'
                : 'Fill in your details to get started'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Progress Steps */}
            <div className="mb-8 flex items-center justify-center gap-3">
              <div
                className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  1
                </div>
                <span className="hidden text-sm font-medium sm:block">Choose Role</span>
              </div>
              <div className="h-0.5 w-12 bg-muted">
                <div
                  className={`h-full bg-primary transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}
                />
              </div>
              <div
                className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  2
                </div>
                <span className="hidden text-sm font-medium sm:block">Your Details</span>
              </div>
            </div>

            {step === 1 ? (
              /* Step 1: Role Selection */
              <div className="space-y-4">
                {Object.entries(roleConfig).map(([role, config]) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role as UserRole)}
                    className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                      selectedRole === role ? config.selectedColor : config.color
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-background/80 p-2">
                        <config.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{config.label}</h3>
                          {selectedRole === role && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <p className="mb-3 mt-1 text-sm text-muted-foreground">
                          {config.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {config.benefits.map((benefit) => (
                            <span
                              key={benefit}
                              className="rounded-full bg-background/80 px-2 py-1 text-xs"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}

                <Button variant="hero" className="mt-6 w-full" size="lg" onClick={() => setStep(2)}>
                  Continue as {roleConfig[selectedRole].label}
                </Button>
              </div>
            ) : (
              /* Step 2: Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {selectedRole === 'volunteer' ? 'Full Name' : 'Organization Name'}
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder={selectedRole === 'volunteer' ? 'John Doe' : 'Your Organization'}
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  By creating an account, you agree to our{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="hero"
                    className="flex-1"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
