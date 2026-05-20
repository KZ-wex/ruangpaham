import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/src/lib/firebase';
import { Button } from '@/src/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card';
import { GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { getLocale, translations } from '@/src/lib/i18n';

export function Auth() {
  const locale = getLocale();
  const t = translations[locale].auth;

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success(locale === 'id' ? 'Selamat datang di RuangPaham!' : 'Welcome to RuangPaham!');
    } catch (error: any) {
      console.error('Auth Error:', error);
      if (error.code === 'auth/network-request-failed' || error.message?.includes('network-request-failed')) {
        toast.error(
          locale === 'id'
            ? 'Gagal terhubung. Jika browser memblokir popup atau cookie pihak ketiga (seperti di iframe/Incognito), silakan buka aplikasi di tab baru.'
            : 'Network error. If your browser blocks popups or third-party cookies (e.g., in an iframe or Incognito), please open the app in a new tab.',
          {
            duration: 10000,
            action: {
              label: locale === 'id' ? 'Buka Tab Baru' : 'Open New Tab',
              onClick: () => window.open(window.location.href, '_blank'),
            },
          },
        );
      } else {
        toast.error(locale === 'id' ? 'Gagal masuk dengan Google. Silakan coba lagi.' : 'Failed to sign in with Google. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]" id="auth-container">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <Card className="w-full max-w-md shadow-2xl dark:shadow-none border-border bg-card text-card-foreground" id="auth-card">
          <CardHeader className="text-center pt-10">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                <GraduationCap className="w-10 h-10" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">{t.title}</CardTitle>
            <CardDescription className="text-muted-foreground text-base mt-2 px-4 leading-relaxed">{t.desc}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 py-10 px-8">
            <Button
              size="lg"
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-100 dark:hover:shadow-none active:scale-[0.98]"
              onClick={handleGoogleSignIn}
              id="google-signin-button"
            >
              {t.btn}
            </Button>
            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-border flex-1"></div>
              <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">Enterprise Edition</span>
              <div className="h-px bg-border flex-1"></div>
            </div>
            <p className="text-center text-[10px] text-muted-foreground/70 leading-relaxed max-w-60 mx-auto">{t.footer}</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
