
import {
  createContext,
  useContext,
  useRef,
  useState,
  type Dispatch,
  type FormEvent,
  type ReactNode,
  type SetStateAction,
} from 'react';
import {
  Bell,
  FileText,
  Home as HomeIcon,
  Menu,
  PackagePlus,
  Search,
  TrendingUp,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import PriceUpdates from './components/price-updates';
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

type CustomerDetails = {
  accountNumber: string;
  accountName: string;
  phoneNumber: string;
};

type CustomerDetailsContextValue = {
  customerDetails: CustomerDetails;
  setCustomerDetails: Dispatch<SetStateAction<CustomerDetails>>;
};

const CustomerDetailsContext = createContext<CustomerDetailsContextValue | null>(null);

function useCustomerDetails() {
  const context = useContext(CustomerDetailsContext);
  if (!context) {
    throw new Error('CustomerDetailsContext is missing');
  }
  return context;
}

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

      <footer className="welcome-footer">
        <p>© 2026 العليمي إخوان</p>
        <p>جميع الحقوق محفوظة</p>
      </footer>
    </main>
  );
}

function Login() {
  const [, setLocation] = useLocation();
  const { setCustomerDetails } = useCustomerDetails();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setCustomerDetails({
      accountNumber: String(formData.get('accountNumber') ?? ''),
      accountName: String(formData.get('accountName') ?? ''),
      phoneNumber: String(formData.get('phoneNumber') ?? ''),
    });
    setLocation('/verify');
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
          <p className="verification-helper">
            ستصلك رسالة عبر واتساب تحتوي على رمز مكوّن من 6 أرقام.
          </p>
        </form>
      </section>
    </main>
  );
}

function VerifyCode() {
  const [, setLocation] = useLocation();
  const [code, setCode] = useState('');

  function handleCodeChange(value: string) {
    const normalized = value
      .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
      .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
      .replace(/\D/g, '')
      .slice(0, 6);
    setCode(normalized);
  }

  function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (code.length === 6) {
      setLocation('/dashboard');
    }
  }

  return (
    <main className="login-screen" dir="rtl" lang="ar">
      <section className="login-shell" aria-labelledby="verify-title">
        <button
          className="login-back"
          type="button"
          onClick={() => setLocation('/login')}
        >
          العودة
        </button>

        <img
          className="login-logo"
          src="/alalimi-bros-logo-white.png"
          alt="شعار العليمي اخوان"
        />

        <h1 className="login-title" id="verify-title">إدخال رمز التحقق</h1>
        <p className="login-greeting">
          أدخل الرمز المكوّن من 6 أرقام الذي سيصلك عبر واتساب.
        </p>

        <form className="login-form" onSubmit={handleVerify}>
          <label className="login-field">
            <span>رمز التحقق</span>
            <div className="verification-entry" dir="ltr">
              <div className="verification-cells" aria-hidden="true">
                {Array.from({ length: 6 }, (_, index) => (
                  <span className="verification-cell" key={index}>
                    {code[index] ?? ''}
                  </span>
                ))}
              </div>
              <input
                className="verification-input"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(event) => handleCodeChange(event.currentTarget.value)}
                aria-label="رمز التحقق المكوّن من 6 أرقام"
                required
              />
            </div>
          </label>

          <button
            className="login-submit"
            type="submit"
            data-testid="button-verify-code"
            disabled={code.length !== 6}
          >
            تحقق
          </button>
        </form>
      </section>
    </main>
  );
}

const dashboardTabs = [
  { id: 'home', label: 'الرئيسية', Icon: HomeIcon },
  { id: 'prices', label: 'تحديثات الأسعار', Icon: TrendingUp },
  { id: 'new-items', label: 'الأصناف الجديدة', Icon: PackagePlus },
  { id: 'accounts', label: 'حسابات', Icon: FileText },
  { id: 'notifications', label: 'إشعارات', Icon: Bell },
] as const;

type DashboardTabId = (typeof dashboardTabs)[number]['id'];

function Dashboard() {
  const { customerDetails } = useCustomerDetails();
  const [activeTab, setActiveTab] = useState<DashboardTabId>(() =>
    new URLSearchParams(window.location.search).get('tab') === 'prices'
      ? 'prices'
      : 'home',
  );
  const [customerDetailsOpen, setCustomerDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeTabLabel =
    dashboardTabs.find((tab) => tab.id === activeTab)?.label ?? 'الرئيسية';

  return (
    <main className="dashboard-screen" dir="rtl" lang="ar">
      <div className="dashboard-top">
        <header className="dashboard-header">
          <button
            className="dashboard-menu-button"
            type="button"
            aria-label="عرض بيانات العميل"
            aria-expanded={customerDetailsOpen}
            aria-controls="customer-details-panel"
            onClick={() => setCustomerDetailsOpen((open) => !open)}
          >
            <Menu size={22} strokeWidth={2} aria-hidden="true" />
          </button>
          <img
            className="dashboard-logo"
            src="/alalimi-bros-logo-white.png"
            alt="العليمي اخوان"
          />
        </header>

        {customerDetailsOpen && (
          <section
            className="customer-details-panel"
            id="customer-details-panel"
            aria-label="بيانات العميل"
          >
            <h2>بيانات العميل</h2>
            <dl>
              <div className="customer-detail-row">
                <dt>الاسم المرتبط بالحساب الآجل</dt>
                <dd>{customerDetails.accountName || '—'}</dd>
              </div>
              <div className="customer-detail-row">
                <dt>رقم الحساب</dt>
                <dd dir="ltr">{customerDetails.accountNumber || '—'}</dd>
              </div>
              <div className="customer-detail-row">
                <dt>رقم الجوال</dt>
                <dd dir="ltr">{customerDetails.phoneNumber || '—'}</dd>
              </div>
            </dl>
          </section>
        )}
      </div>

      <section className="dashboard-main" aria-label={activeTabLabel}>
        <h1 className="dashboard-page-title">{activeTabLabel}</h1>
        <form
          className="dashboard-search"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            placeholder="بحث"
            aria-label="بحث"
          />
          <button
            type="button"
            aria-label="بدء البحث"
            onClick={() => searchInputRef.current?.focus()}
          >
            <Search size={20} strokeWidth={2} aria-hidden="true" />
          </button>
        </form>
        {activeTab === 'prices' && <PriceUpdates />}
      </section>

      <nav className="dashboard-bottom-nav" aria-label="التنقل الرئيسي">
        {dashboardTabs.map(({ id, label, Icon }) => (
          <button
            className={`dashboard-nav-item${activeTab === id ? ' is-active' : ''}`}
            type="button"
            key={id}
            aria-current={activeTab === id ? 'page' : undefined}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={19} strokeWidth={1.9} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/verify" component={VerifyCode} />
        <Route path="/dashboard" component={Dashboard} />
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
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    accountNumber: '',
    accountName: '',
    phoneNumber: '',
  });

  return (
    <CustomerDetailsContext.Provider value={{ customerDetails, setCustomerDetails }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </CustomerDetailsContext.Provider>
  );
}

export default App;
