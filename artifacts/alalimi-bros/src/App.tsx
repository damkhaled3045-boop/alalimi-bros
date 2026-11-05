import { useState, type FormEvent, type ReactNode } from 'react';
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
  const [, setLocation] = useLocation();

  return (
    <main className="welcome-screen" dir="rtl" lang="ar">
      <section className="welcome-content" aria-label="العليمي اخوان">
        <img
          className="brand-logo"
          src="/alalimi-bros-logo-white.png"
          alt="شعار العليمي اخوان"
          fetchPriority="high"
        />
        <button
          className="continue-button"
          type="button"
          data-testid="button-continue"
          onClick={() => setLocation('/login')}
        >
          الموافقة والمتابعة
        </button>
      </section>
    </main>
  );
}

function Login() {
  const [, setLocation] = useLocation();
  const [notice, setNotice] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice('لم يتم ربط خدمة إرسال رمز التحقق بعد.');
  }

  return (
    <main className="login-screen" dir="rtl" lang="ar">
      <section className="login-shell" aria-labelledby="login-title">
        <button
          className="login-back"
          type="button"
          onClick={() => setLocation('/')}
        >
          العودة
        </button>

        <img
          className="login-logo"
          src="/alalimi-bros-logo-white.png"
          alt="شعار العليمي اخوان"
        />

        <h1 className="login-title" id="login-title">تسجيل الدخول</h1>
        <p className="login-greeting">مرحبا بك عميلنا العزيز</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field">
            <span>رقم حسابك لدينا</span>
            <input
              name="accountNumber"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              required
            />
          </label>

          <label className="login-field">
            <span>الاسم المرتبط بالحساب الآجل</span>
            <input
              name="accountName"
              type="text"
              autoComplete="name"
              required
            />
          </label>

          <label className="login-field">
            <span>الرقم المرتبط بالحساب لدينا</span>
            <input
              name="phoneNumber"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
              required
            />
          </label>

          <button
            className="login-submit"
            type="submit"
            data-testid="button-send-verification"
          >
            إرسال رمز التحقق
          </button>

          {notice && <p className="login-notice" role="status">{notice}</p>}
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
        <Route path="/login" component={Login} />
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
