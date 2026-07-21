import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import Layout from '@/components/layout';
import Home from '@/pages/home';
import Activation from '@/pages/activation';
import Rules from '@/pages/rules';
import Store from '@/pages/store';
import AdminLogin from '@/pages/admin-login';
import AdminDashboard from '@/pages/admin-dashboard';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Admin routes — no site layout */}
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />

      {/* Public routes */}
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/activation" component={Activation} />
            <Route path="/rules" component={Rules} />
            <Route path="/store" component={Store} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
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
