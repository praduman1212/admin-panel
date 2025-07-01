import '@/styles/globals.css';
import { ThemeProvider } from 'next-themes';
import MainLayout from '@/components/Layout/MainLayout';

export default function App({ Component, pageProps }) {
  // List of paths that should not use the main layout
  const noLayoutPaths = ['/login', '/register', '/forgot-password'];
  
  // Check if the current path should use the layout
  const shouldUseLayout = !noLayoutPaths.includes(Component.pathname);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {shouldUseLayout ? (
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      ) : (
        <Component {...pageProps} />
      )}
    </ThemeProvider>
  );
}
