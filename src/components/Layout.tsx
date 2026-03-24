import { Outlet, useNavigate, useLocation } from 'react-router';
import { Header } from './Header';
import { GestureProvider } from '../context/GestureContext';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (page: string) => {
    const routeMap: Record<string, string> = {
      home: '/',
    };
    navigate(routeMap[page] || '/');
  };

  const currentPage = location.pathname === '/library' ? 'library' : 'home';

  return (
    <GestureProvider>
      <div className="min-h-screen flex flex-col">
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
        <main className="flex-1">
          <Outlet context={{ onNavigate: handleNavigate }} />
        </main>
      </div>
    </GestureProvider>
  );
}
