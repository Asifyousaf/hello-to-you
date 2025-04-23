
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WorkoutsPage from "./pages/WorkoutsPage";
import NutritionPage from "./pages/NutritionPage";
import MindfulnessPage from "./pages/MindfulnessPage";
import CommunityPage from "./pages/CommunityPage";
import ProfilePage from "./pages/ProfilePage";
import StorePage from "./pages/StorePage";
import WorkoutTrackerPage from "./pages/WorkoutTrackerPage";
import AuthPage from "./pages/AuthPage";
import AboutPage from "./pages/AboutPage";
import CareersPage from "./pages/CareersPage";
import PressPage from "./pages/PressPage";
import BlogPage from "./pages/BlogPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import SafetyCenterPage from "./pages/SafetyCenterPage";
import CommunityGuidelinesPage from "./pages/CommunityGuidelinesPage";
import GeminiChat from "./components/gemini/GeminiChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GeminiChat />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/workout-tracker" element={<WorkoutTrackerPage />} />
          <Route path="/nutrition" element={<NutritionPage />} />
          <Route path="/mindfulness" element={<MindfulnessPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Footer Pages */}
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/press" element={<PressPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/help-center" element={<HelpCenterPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/safety-center" element={<SafetyCenterPage />} />
          <Route path="/community-guidelines" element={<CommunityGuidelinesPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
