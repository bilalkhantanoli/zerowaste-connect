import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";

// Donor Pages
import DonorDashboard from "./pages/donor/DonorDashboard";
import AddDonation from "./pages/donor/AddDonation";

// Recipient Pages
import RecipientDashboard from "./pages/recipient/RecipientDashboard";

// Volunteer Pages
import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

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

            {/* Donor Routes */}
            <Route path="/donor" element={<DonorDashboard />} />
            <Route path="/donor/add" element={<AddDonation />} />
            <Route path="/donor/donations" element={<DonorDashboard />} />
            <Route path="/donor/history" element={<DonorDashboard />} />

            {/* Recipient Routes */}
            <Route path="/recipient" element={<RecipientDashboard />} />
            <Route path="/recipient/browse" element={<RecipientDashboard />} />
            <Route path="/recipient/requests" element={<RecipientDashboard />} />
            <Route path="/recipient/deliveries" element={<RecipientDashboard />} />
            <Route path="/recipient/history" element={<RecipientDashboard />} />

            {/* Volunteer Routes */}
            <Route path="/volunteer" element={<VolunteerDashboard />} />
            <Route path="/volunteer/deliveries" element={<VolunteerDashboard />} />
            <Route path="/volunteer/history" element={<VolunteerDashboard />} />
            <Route path="/volunteer/achievements" element={<VolunteerDashboard />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminDashboard />} />
            <Route path="/admin/donations" element={<AdminDashboard />} />
            <Route path="/admin/deliveries" element={<AdminDashboard />} />
            <Route path="/admin/reports" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<AdminDashboard />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
