import '@/styles/globals.css';
import { ThemeProvider } from 'next-themes';
import MainLayout from '@/components/Layout/MainLayout';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/context/Auth.context';

const publicPages = ['/login', '/signUp']; 

export default function App({ Component, pageProps, router }) {
  const isPublicPage = publicPages.includes(router.pathname);

  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {isPublicPage ? (
          <Component {...pageProps} />
        ) : (
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        )}
      </ThemeProvider>
      <Toaster richColors/>
    </AuthProvider>
  );
}
