import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card';
import { Skeleton } from '@/src/components/ui/skeleton';
import { FileText, Calendar, Trash2, ChevronRight } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { toast } from 'sonner';
import { getLocale, translations } from '@/src/lib/i18n';
import { motion } from 'motion/react';

interface LibraryItem {
  id: string;
  material: string;
  summary: string;
  quiz: any[];
  score?: number;
  createdAt: any;
}

interface LibraryProps {
  onViewItem: (item: LibraryItem) => void;
}

export function Library({ onViewItem }: LibraryProps) {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = getLocale();
  const t =
    locale === 'id'
      ? {
          title: 'Perpustakaan Saya',
          desc: 'Kumpulan materi belajar yang telah Anda buat.',
          empty: 'Belum ada materi belajar.',
          date: 'Dibuat pada',
          view: 'Lihat',
        }
      : {
          title: 'My Library',
          desc: "A collection of study materials you've generated.",
          empty: 'No study materials found.',
          date: 'Created on',
          view: 'View',
        };

  useEffect(() => {
    async function fetchLibrary() {
      if (!auth.currentUser) return;
      try {
        const q = query(collection(db, 'user_quizzes'), where('userId', '==', auth.currentUser.uid), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as LibraryItem);
        setItems(data);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'user_quizzes');
      } finally {
        setLoading(false);
      }
    }
    fetchLibrary();
  }, [auth.currentUser]);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto custom-scrollbar bg-background">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-foreground tracking-tight">{t.title}</h1>
          <p className="text-muted-foreground font-medium">{t.desc}</p>
        </header>

        {items.length === 0 ? (
          <div className="text-center py-24 bg-card text-card-foreground rounded-[2.5rem] border border-dashed border-border shadow-sm">
            <div className="w-20 h-20 bg-muted rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <p className="text-muted-foreground font-bold text-lg">{t.empty}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item, idx) => (
              <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} onClick={() => onViewItem(item)}>
                <Card className="hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:hover:shadow-none transition-all duration-300 rounded-[2rem] h-full flex flex-col group bg-card text-card-foreground shadow-sm dark:shadow-none overflow-hidden border border-border cursor-pointer">
                  <div className="h-2 w-full bg-indigo-500/10 group-hover:bg-indigo-500 transition-colors" />
                  <CardHeader className="p-6 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded-2xl flex items-center justify-center border border-border shadow-sm">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.createdAt?.toDate?.() ? item.createdAt.toDate().toLocaleDateString() : 'Baru'}
                      </span>
                    </div>
                    <CardTitle className="text-base font-bold text-foreground line-clamp-2 leading-relaxed">{item.summary.replace(/[*#]/g, '').slice(0, 80)}...</CardTitle>
                    {item.score !== undefined && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="text-[10px] bg-green-50 text-green-500 dark:text-green-400 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-green-100 dark:border-green-500/20">Skor: {item.score}%</div>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="p-6 pt-0 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewItem(item);
                        }}
                        className="w-full text-indigo-500 dark:text-indigo-400 hover:text-primary-foreground hover:bg-indigo-500 gap-2 font-black text-xs uppercase tracking-widest rounded-xl transition-all"
                      >
                        {t.view}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
