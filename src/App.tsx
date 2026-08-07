import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/auth'
import { useAnalytics } from './lib/analytics'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import { ListingGridSkeleton, DetailSkeleton } from './components/Skeletons'
import Logo from './components/Logo'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const BrowsePage = lazy(() => import('./pages/BrowsePage'))
const ListingDetailPage = lazy(() => import('./pages/ListingDetailPage'))
const ListPropertyPage = lazy(() => import('./pages/ListPropertyPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const RefundPage = lazy(() => import('./pages/RefundPage'))
const AccountDeletionPolicyPage = lazy(() => import('./pages/AccountDeletionPolicyPage'))
const AppealsPolicyPage = lazy(() => import('./pages/AppealsPolicyPage'))
const CommunityGuidelinesPage = lazy(() => import('./pages/CommunityGuidelinesPage'))
const ContentPolicyPage = lazy(() => import('./pages/ContentPolicyPage'))
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'))
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage'))
const FaqPage = lazy(() => import('./pages/FaqPage'))
const IntellectualPropertyPolicyPage = lazy(() => import('./pages/IntellectualPropertyPolicyPage'))
const PaymentPolicyPage = lazy(() => import('./pages/PaymentPolicyPage'))
const SafetyPolicyPage = lazy(() => import('./pages/SafetyPolicyPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const RentCalculatorPage = lazy(() => import('./pages/RentCalculatorPage'))
const LocalityGuidePage = lazy(() => import('./pages/LocalityGuidePage'))
const HelpCenterPage = lazy(() => import('./pages/HelpCenterPage'))
const SavedPropertiesPage = lazy(() => import('./pages/SavedPropertiesPage'))
const MapSearchPage = lazy(() => import('./pages/MapSearchPage'))
const MessagesPage = lazy(() => import('./pages/MessagesPage'))

function PageLoader({ children }: { children: React.ReactNode }) {
  return <div className="container-app">{children}</div>
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader><ListingGridSkeleton count={3} /></PageLoader>
  if (!user) return <Navigate to="/auth" replace />
  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return <PageLoader><ListingGridSkeleton count={3} /></PageLoader>
  if (!user) return <Navigate to="/auth" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  const { loading } = useAuth()
  useAnalytics()

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50">
        <Logo size="xl" />
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      </div>
    )
  }

  return (
    <Layout>
      <Suspense fallback={<PageLoader><ListingGridSkeleton count={6} /></PageLoader>}>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/signin" element={<AuthPage initialMode="signin" />} />
          <Route path="/login" element={<AuthPage initialMode="signin" />} />
          <Route path="/signup" element={<AuthPage initialMode="signup" />} />
          <Route path="/register" element={<AuthPage initialMode="signup" />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />
          <Route path="/list-property" element={<ProtectedRoute><ListPropertyPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/refund-policy" element={<RefundPage />} />
          <Route path="/account-deletion" element={<AccountDeletionPolicyPage />} />
          <Route path="/account-deletion-policy" element={<AccountDeletionPolicyPage />} />
          <Route path="/appeals" element={<AppealsPolicyPage />} />
          <Route path="/appeals-policy" element={<AppealsPolicyPage />} />
          <Route path="/community-guidelines" element={<CommunityGuidelinesPage />} />
          <Route path="/guidelines" element={<CommunityGuidelinesPage />} />
          <Route path="/content-policy" element={<ContentPolicyPage />} />
          <Route path="/listing-policy" element={<ContentPolicyPage />} />
          <Route path="/cookies" element={<CookiePolicyPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/rentiefy-disclaimer" element={<DisclaimerPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/faqs" element={<FaqPage />} />
          <Route path="/intellectual-property" element={<IntellectualPropertyPolicyPage />} />
          <Route path="/ip-policy" element={<IntellectualPropertyPolicyPage />} />
          <Route path="/payment-policy" element={<PaymentPolicyPage />} />
          <Route path="/payments-and-subscriptions" element={<PaymentPolicyPage />} />
          <Route path="/safety-policy" element={<SafetyPolicyPage />} />
          <Route path="/safety" element={<SafetyPolicyPage />} />
          <Route path="/rent-calculator" element={<RentCalculatorPage />} />
          <Route path="/locality-guide" element={<LocalityGuidePage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/saved" element={<ProtectedRoute><SavedPropertiesPage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="/map-search" element={<MapSearchPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
