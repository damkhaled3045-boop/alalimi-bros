import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  return (
    <main className="brand-screen" dir="rtl" lang="ar">
      <section className="login-panel" aria-labelledby="brand-name">
        <header className="brand-lockup">
          <img
            className="brand-mark"
            src="/alalimi-bros-logo.png"
            alt="شعار العليمي اخوان"
            fetchPriority="high"
          />
          <h1 className="brand-name" id="brand-name">العليمي اخوان</h1>
        </header>
        <form className="login-form" onSubmit={(event) => event.preventDefault()}>
          <div className="field">
            <label htmlFor="account-number">رقم الحساب</label>
            <input id="account-number" name="account-number" type="text" inputMode="numeric" autoComplete="off" data-testid="input-account-number" />
          </div>
          <div className="field">
            <label htmlFor="registered-name">الاسم المسجل في الحساب</label>
            <input id="registered-name" name="registered-name" type="text" autoComplete="name" data-testid="input-registered-name" />
          </div>
          <div className="field">
            <label htmlFor="phone-number">رقم الهاتف</label>
            <input id="phone-number" name="phone-number" type="tel" inputMode="tel" autoComplete="tel" dir="rtl" data-testid="input-phone-number" />
          </div>
          <button className="submit-button" type="submit" data-testid="button-send-verification">
            إرسال رمز التحقق
          </button>
        </form>
      </section>
    </main>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
