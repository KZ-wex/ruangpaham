/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { auth } from '@/src/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { Auth } from '@/src/components/features/Auth';
import { Dashboard } from '@/src/components/features/Dashboard';
import { Library } from '@/src/components/features/Library';
import { Settings } from '@/src/components/features/Settings';
import { Toaster } from '@/src/components/ui/sonner';
import { Loader2, LogOut, Sparkles, LayoutDashboard, BookOpen, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';

type View = 'dashboard' | 'library' | 'settings';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setCurrentView('dashboard');
    setSelectedQuiz(null);
  };

  const handleViewQuizFromLibrary = (quiz: any) => {
    setSelectedQuiz(quiz);
    setCurrentView('dashboard');
  };

  const renderView = () => {
    if (!user) return <Auth />;

    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} initialData={selectedQuiz} onReset={() => setSelectedQuiz(null)} />;
      case 'library':
        return <Library onViewItem={handleViewQuizFromLibrary} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard user={user} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted" id="app-loading">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background font-sans text-foreground overflow-hidden" id="app-root">
      <header className="flex items-center justify-between px-4 md:px-8 h-16 md:h-20 bg-card/80 backdrop-blur-md border-b border-border shrink-0" id="main-header">
        <div
          className="flex items-center gap-2 md:gap-3 cursor-pointer group"
          onClick={() => {
            setSelectedQuiz(null);
            setCurrentView('dashboard');
          }}
        >
          <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-primary-foreground font-bold dark:shadow-none shadow-indigo-100 shadow-lg group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl md:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-indigo-600 dark:from-indigo-400 to-purple-600 dark:to-purple-400">RuangPaham</span>
        </div>

        {user ? (
          <div className="flex items-center gap-4 md:gap-8">
            <nav className="hidden md:flex gap-1 bg-muted/50/50 p-1 rounded-2xl">
              <button
                onClick={() => {
                  setSelectedQuiz(null);
                  setCurrentView('dashboard');
                }}
                className={cn('px-6 py-2 rounded-xl text-sm font-bold transition-all', currentView === 'dashboard' && !selectedQuiz ? 'bg-card text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-muted-foreground hover:text-foreground')}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('library')}
                className={cn('px-6 py-2 rounded-xl text-sm font-bold transition-all', currentView === 'library' ? 'bg-card text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-muted-foreground hover:text-foreground')}
              >
                Library
              </button>
              <button
                onClick={() => setCurrentView('settings')}
                className={cn('px-6 py-2 rounded-xl text-sm font-bold transition-all', currentView === 'settings' ? 'bg-card text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-muted-foreground hover:text-foreground')}
              >
                Settings
              </button>
            </nav>
            <div className="flex items-center gap-3 md:gap-3 pl-0 md:pl-6 border-l-0 md:border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-bold text-foreground leading-none">{user.displayName}</p>
              </div>
              <div className="group relative">
                <div
                  className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-border flex items-center justify-center overflow-hidden cursor-pointer dark:shadow-none shadow-indigo-100 shadow-sm"
                  onClick={() => setCurrentView('settings')}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-sm font-bold text-indigo-400">{user.displayName?.charAt(0)}</span>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={handleSignOut} className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-card shadow-md border border-border hidden group-hover:flex items-center justify-center">
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">Not Authenticated</div>
        )}
      </header>

      <main className="flex-1 overflow-hidden">{renderView()}</main>

      {user && (
        <nav className="md:hidden sticky py-2 px-6 bottom-0 z-50 bg-card/95 backdrop-blur-md border-t border-border flex justify-between items-center w-full shadow-lg dark:shadow-none shrink-0">
          <button
            onClick={() => {
              setSelectedQuiz(null);
              setCurrentView('dashboard');
            }}
            className={cn('flex flex-col items-center gap-1 p-2 rounded-xl transition-all', currentView === 'dashboard' && !selectedQuiz ? 'text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground hover:text-foreground')}
          >
            <div className={cn('p-1.5 rounded-lg transition-all', currentView === 'dashboard' && !selectedQuiz ? 'bg-indigo-50 dark:bg-indigo-500/10' : '')}>
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">Beranda</span>
          </button>

          <button
            onClick={() => setCurrentView('library')}
            className={cn('flex flex-col items-center gap-1 p-2 rounded-xl transition-all', currentView === 'library' ? 'text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground hover:text-foreground')}
          >
            <div className={cn('p-1.5 rounded-lg transition-all', currentView === 'library' ? 'bg-indigo-50 dark:bg-indigo-500/10' : '')}>
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">Library</span>
          </button>

          <button
            onClick={() => setCurrentView('settings')}
            className={cn('flex flex-col items-center gap-1 p-2 rounded-xl transition-all', currentView === 'settings' ? 'text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground hover:text-foreground')}
          >
            <div className={cn('p-1.5 rounded-lg transition-all', currentView === 'settings' ? 'bg-indigo-50 dark:bg-indigo-500/10' : '')}>
              <SettingsIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">Pengaturan</span>
          </button>
        </nav>
      )}

      <footer className="hidden md:flex px-8 py-4 bg-card/50 backdrop-blur-sm border-t border-border justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-500 shadow-sm flex items-center justify-center text-[10px] text-primary-foreground font-bold">AI</div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-pink-400 shadow-sm flex items-center justify-center text-[10px] text-primary-foreground font-bold">SM</div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-amber-300 shadow-sm flex items-center justify-center text-[10px] text-primary-foreground font-bold">QL</div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground font-bold tracking-wide uppercase">Dibuat untuk Pelajar</span>
            <span className="text-[9px] text-indigo-400 font-medium">Smart Learning Engine Active</span>
          </div>
        </div>
        <div className="text-[10px] text-muted-foreground font-medium italic">Mari belajar lebih cerdas, bukan lebih keras ✨</div>
      </footer>

      <Toaster position="top-center" expand={false} richColors />
    </div>
  );
}
