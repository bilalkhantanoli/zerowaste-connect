import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Community from './pages/Community';
import NotFound from './pages/NotFound';
import PlaceholderPage from './pages/PlaceholderPage';
import SettingsPage from './pages/Settings';
import NotificationsPage from './pages/Notifications';

// Donor Pages
import DonorDashboard from './pages/donor/DonorDashboard';
import AddDonation from './pages/donor/AddDonation';

// Recipient Pages
import RecipientDashboard from './pages/recipient/RecipientDashboard';

// Volunteer Pages
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

const queryClient = new QueryClient();

function ProtectedRoute({ allowedRoles }: { allowedRoles: UserRole[] }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return <Outlet />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/community" element={<Community />} />
            <Route
              path="/about"
              element={
                <PlaceholderPage
                  title="About ZeroWaste Connect"
                  description="About page is now available. You can replace this with your full content anytime."
                />
              }
            />
            <Route
              path="/terms"
              element={
                <PlaceholderPage
                  title="Terms of Service"
                  description="Terms route is now active so registration links no longer break."
                />
              }
            />
            <Route
              path="/privacy"
              element={
                <PlaceholderPage
                  title="Privacy Policy"
                  description="Privacy route is now active so registration links no longer break."
                />
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PlaceholderPage
                  title="Forgot Password"
                  description="Password reset screen route is now active. Integrate reset flow here next."
                />
              }
            />

            {/* Donor Routes */}
            <Route element={<ProtectedRoute allowedRoles={['donor']} />}>
              <Route path="/donor" element={<DonorDashboard />} />
              <Route path="/donor/add" element={<AddDonation />} />
              <Route path="/donor/donations" element={<DonorDashboard />} />
              <Route path="/donor/history" element={<DonorDashboard />} />
            </Route>

            {/* Recipient Routes */}
            <Route element={<ProtectedRoute allowedRoles={['recipient']} />}>
              <Route path="/recipient" element={<RecipientDashboard />} />
              <Route path="/recipient/browse" element={<RecipientDashboard />} />
              <Route path="/recipient/requests" element={<RecipientDashboard />} />
              <Route path="/recipient/deliveries" element={<RecipientDashboard />} />
              <Route path="/recipient/history" element={<RecipientDashboard />} />
            </Route>

            {/* Volunteer Routes */}
            <Route element={<ProtectedRoute allowedRoles={['volunteer']} />}>
              <Route path="/volunteer" element={<VolunteerDashboard />} />
              <Route path="/volunteer/deliveries" element={<VolunteerDashboard />} />
              <Route path="/volunteer/history" element={<VolunteerDashboard />} />
              <Route path="/volunteer/achievements" element={<VolunteerDashboard />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminDashboard />} />
              <Route path="/admin/donations" element={<AdminDashboard />} />
              <Route path="/admin/deliveries" element={<AdminDashboard />} />
              <Route path="/admin/reports" element={<AdminDashboard />} />
              <Route path="/admin/settings" element={<AdminDashboard />} />
            </Route>

            {/* Shared authenticated routes */}
            <Route element={<ProtectedRoute allowedRoles={['donor', 'recipient', 'volunteer', 'admin']} />}>
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
