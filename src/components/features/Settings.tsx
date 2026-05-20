import { auth } from "@/src/lib/firebase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { User, Globe, Shield, LogOut, Bell, Moon, Sun, Monitor, Palette } from "lucide-react";
import { getLocale } from "@/src/lib/i18n";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Settings() {
  const user = auth.currentUser;
  const locale = getLocale();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const translations = locale === 'id' ? {
    title: "Pengaturan",
    desc: "Kelola akun dan preferensi aplikasi Anda.",
    profile: "Profil Pengguna",
    language: "Bahasa",
    theme: "Tema Tampilan",
    themeDesc: "Pilih tema aplikasi yang Anda inginkan",
    light: "Terang",
    dark: "Gelap",
    system: "Sistem",
    security: "Keamanan",
    notifications: "Notifikasi",
    signOut: "Keluar",
  } : {
    title: "Settings",
    desc: "Manage your account and application preferences.",
    profile: "User Profile",
    language: "Language",
    theme: "Appearance Theme",
    themeDesc: "Select your preferred application theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    security: "Security",
    notifications: "Notifications",
    signOut: "Sign Out",
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-foreground">{translations.title}</h1>
          <p className="text-muted-foreground">{translations.desc}</p>
        </header>

        <div className="grid gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <CardTitle>{translations.profile}</CardTitle>
                  <CardDescription>
                    {locale === 'id' ? "Identitas Anda di RuangPaham" : "Your identity on RuangPaham"}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-sm font-medium text-muted-foreground">Name</span>
                  <span className="text-sm font-semibold text-foreground">{user?.displayName || "N/A"}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center">
                  <Palette className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <CardTitle>{translations.theme}</CardTitle>
                  <CardDescription>
                    {translations.themeDesc}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex bg-muted p-1 rounded-xl items-center w-full max-w-sm">
                  {mounted && (
                    <>
                      <button
                        onClick={() => setTheme("light")}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all ${theme === "light" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        <Sun className="w-4 h-4" /> {translations.light}
                      </button>
                      <button
                        onClick={() => setTheme("dark")}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all ${theme === "dark" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        <Moon className="w-4 h-4" /> {translations.dark}
                      </button>
                      <button
                        onClick={() => setTheme("system")}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all ${theme === "system" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        <Monitor className="w-4 h-4" /> {translations.system}
                      </button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <CardTitle>{translations.language}</CardTitle>
                  <CardDescription>
                    {locale === 'id' ? "Bahasa aplikasi disesuaikan secara otomatis" : "App language is detected automatically"}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                  <span className="text-lg">🇮🇩</span>
                  <span className="text-sm font-medium text-foreground flex-1">
                    {locale === 'id' ? "Deteksi Otomatis (Indonesia)" : "Auto Detect (Indonesian)"}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center">
                    <LogOut className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle>{translations.signOut}</CardTitle>
                    <CardDescription>End your current session</CardDescription>
                  </div>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={() => auth.signOut()}
                  className="rounded-lg px-6 font-semibold"
                >
                  {translations.signOut}
                </Button>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
