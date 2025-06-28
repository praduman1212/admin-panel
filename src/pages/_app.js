import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAuthPage = router.pathname === '/login' || router.pathname === '/dashboard';

  return (
    <ThemeProvider attribute="class">
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {!isAuthPage && <Navbar />}
        <main className={!isAuthPage ? "pt-16" : ""}>
          <Component {...pageProps} />
        </main>
      </div>
    </ThemeProvider>
  );
}
