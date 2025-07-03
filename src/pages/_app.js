import '@/styles/globals.css';
import { ThemeProvider } from 'next-themes';
import MainLayout from '@/components/Layout/MainLayout';
import { Toaster } from "@/components/ui/toaster"

const publicPages = ['/login']; 

export default function App({ Component, pageProps, router }) {
  const isPublicPage = publicPages.includes(router.pathname);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {isPublicPage ? (
        <>
          <Component {...pageProps} />
          <Toaster />
        </>
      ) : (
        <MainLayout>
          <Component {...pageProps} />
          <Toaster />
        </MainLayout>
      )}
    </ThemeProvider>
  );
}
