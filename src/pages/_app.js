import '@/styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/context/Auth.context';
import { CourseProvider } from '@/context/Course.context';
import { Toaster } from 'sonner';
import MainLayout from '@/components/Layout/MainLayout';
import { useRouter } from 'next/router';

const publicPages = ['/login', '/signUp'];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isPublicPage = publicPages.includes(router.pathname);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <CourseProvider>
          {isPublicPage ? (
            <Component {...pageProps} />
          ) : (
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout>
          )}
          <Toaster richColors position="top-center" />
        </CourseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
