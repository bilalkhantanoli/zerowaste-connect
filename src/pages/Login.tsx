import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Leaf, Loader2, Building2, Users, Bike, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from '@/types';

const roleConfig = {
  donor: {
    label: 'Donor',
    icon: Building2,
    description: 'Share surplus food',
    color: 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
  },
  recipient: {
    label: 'Recipient',
    icon: Users,
    description: 'Receive food donations',
    color: 'data-[state=active]:bg-accent data-[state=active]:text-accent-foreground',
  },
  volunteer: {
    label: 'Volunteer',
    icon: Bike,
    description: 'Deliver food',
    color: 'data-[state=active]:bg-success data-[state=active]:text-success-foreground',
  },
  admin: {
    label: 'Admin',
    icon: ShieldCheck,
    description: 'Manage platform',
    color: 'data-[state=active]:bg-muted data-[state=active]:text-foreground',
  },
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('donor');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password, selectedRole);
      toast.success('Welcome back!', {
        description: `Logged in as ${roleConfig[selectedRole].label}`,
      });
      
      // Navigate to role-specific dashboard
      navigate(`/${selectedRole}`);
    } catch (error) {
      toast.error('Login failed', {
        description: 'Please check your credentials and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nature-gradient flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-30" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Leaf className="h-10 w-10 text-primary" />
          <span className="text-2xl font-bold">
            ZeroWaste<span className="text-primary">Connect</span>
          </span>
        </Link>

        <Card variant="elevated" className="backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to continue making an impact
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Role Selection */}
            <div className="mb-6">
              <Label className="text-sm font-medium mb-3 block">Sign in as</Label>
              <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
                <TabsList className="grid grid-cols-4 h-auto p-1">
                  {Object.entries(roleConfig).map(([role, config]) => (
                    <TabsTrigger
                      key={role}
                      value={role}
                      className={`flex flex-col items-center gap-1 py-2 px-2 ${config.color}`}
                    >
                      <config.icon className="h-4 w-4" />
                      <span className="text-xs">{config.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                variant="hero"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground text-center">
              <strong>Demo:</strong> Any email/password with selected role
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  New to ZeroWaste Connect?
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full" asChild>
              <Link to="/register">Create an account</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
