import { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { Button } from '@/src/components/ui/button';
import { Textarea } from '@/src/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/src/components/ui/tabs';
import { Loader2, Sparkles, FileText, BrainCircuit, History, Upload, X, File, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { QuizData, UserQuiz } from '@/src/types';
import { Quiz } from './Quiz';
import { SummaryView } from './SummaryView';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/src/lib/utils';
import { getLocale, translations } from '@/src/lib/i18n';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardProps {
  user: User;
  initialData?: UserQuiz | null;
  onReset?: () => void;
}

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  base64: string;
}

export function Dashboard({ user, initialData, onReset }: DashboardProps) {
  const [input, setInput] = useState(initialData?.material || '');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuizData | null>(initialData ? { summary: initialData.summary, quiz: initialData.quiz } : null);
  const [activeTab, setActiveTab] = useState('input');
  const [currentDocId, setCurrentDocId] = useState<string | null>(initialData?.id || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const locale = getLocale();
  const t = translations[locale].dashboard;

  useEffect(() => {
    if (initialData) {
      setInput(initialData.material || '');
      setFiles([]);
      setResult({ summary: initialData.summary, quiz: initialData.quiz });
      setCurrentDocId(initialData.id || null);
    }
  }, [initialData]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let fileList: File[] = [];

    if ('files' in e.target && e.target.files) {
      fileList = Array.from(e.target.files);
    } else if ('dataTransfer' in e && e.dataTransfer.files) {
      e.preventDefault();
      fileList = Array.from(e.dataTransfer.files);
    }

    if (fileList.length === 0) return;

    const newFiles: UploadedFile[] = [];

    for (const file of fileList) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} melebihi batas ukuran (maks 10MB)`);
        continue;
      }

      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });

      const base64 = await base64Promise;
      newFiles.push({
        name: file.name,
        type: file.type,
        size: file.size,
        base64,
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (!input.trim() && files.length === 0) {
      toast.error(locale === 'id' ? 'Silakan tempelkan materi atau unggah file terlebih dahulu.' : 'Please paste material or upload files first.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: input,
          files: files.map((f) => ({ data: f.base64, mimeType: f.type })),
          locale,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate content. Please try again.');
      }

      const data: QuizData = await response.json();

      if (!data || !data.summary || !Array.isArray(data.quiz)) {
        throw new Error('RuangPaham failed to generate proper content structure. Please try again.');
      }

      setResult(data);
      setActiveTab('result');

      const path = 'user_quizzes';
      const quizToSave: Partial<UserQuiz> = {
        userId: user.uid,
        material: input ? input.substring(0, 790000) : 'Uploaded PDF/Image Material',
        summary: Array.isArray(data.summary) ? data.summary.join('\n\n') : data.summary,
        quiz: data.quiz,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, path), quizToSave);
      setCurrentDocId(docRef.id);

      toast.success(locale === 'id' ? 'Berhasil! Ringkasan & Kuis telah dibuat.' : 'Success! Summary & Quiz generated.');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResult = async (score: number) => {
    if (!currentDocId) return;

    const path = 'user_quizzes';
    try {
      const { updateDoc, doc } = await import('firebase/firestore');
      await updateDoc(doc(db, path, currentDocId), {
        score,
        updatedAt: serverTimestamp(),
      });
      toast.success(locale === 'id' ? `Skor Anda: ${score}% tersimpan!` : `Your Score: ${score}% saved!`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const resetDashboard = () => {
    setInput('');
    setFiles([]);
    setResult(null);
    if (onReset) onReset();
  };

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden p-4 lg:p-8 pb-24 lg:pb-8 gap-6 lg:gap-8 bg-background" id="dashboard-container">
      <section className={cn('flex flex-col transition-all duration-500', result ? 'w-full lg:w-5/12 shrink-0 mb-6 lg:mb-0 lg:h-full lg:min-h-0' : 'w-full max-w-4xl mx-auto h-full')}>
        <motion.div layout className={cn('bg-card text-card-foreground rounded-[2rem] border border-border shadow-sm p-4 lg:p-8 flex flex-col', result ? 'lg:h-full lg:overflow-hidden' : 'h-full overflow-hidden')}>
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-sm font-bold text-foreground tracking-tight">{t.inputTitle}</h2>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Workspace Pelajar</p>
              </div>
            </div>
            {initialData && (
              <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-500/20 animate-pulse">
                <History className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Perpustakaan</span>
              </div>
            )}
            {initialData ? (
              <Button variant="outline" size="sm" onClick={resetDashboard} className="text-xs bg-muted border-border text-foreground hover:bg-muted/80 rounded-xl px-4">
                Reset
              </Button>
            ) : (
              <span className="text-[10px] bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-full font-mono border border-border">
                {input.length} {t.charCount}
              </span>
            )}
          </div>

          <div className={cn('flex-1 custom-scrollbar pr-2 min-h-0 space-y-6', result ? 'lg:overflow-y-auto' : 'overflow-y-auto')}>
            <div className="relative group min-h-50 flex flex-col">
              <Textarea
                placeholder={t.inputDesc}
                className="w-full flex-1 p-6 bg-muted/30 rounded-2xl border-none text-base leading-relaxed resize-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-background transition-all wrap-break-word text-foreground placeholder-muted-foreground shadow-inner"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            {!initialData && (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileUpload}
                className="border-2 border-dashed border-muted-foreground/30 dark:border-muted-foreground/20 bg-muted/10 rounded-xl p-3 md:p-4 transition-all hover:bg-muted/50 hover:border-primary/50 group cursor-pointer relative shrink-0 flex items-center justify-center sm:justify-start"
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} className="hidden" multiple accept=".pdf,image/*" onChange={handleFileUpload} />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-background shadow-md shadow-black/5 dark:shadow-black/20 text-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 border border-border">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground tracking-tight">{t.uploadTitle}</p>
                    <p className="text-[10px] text-muted-foreground truncate w-full">{t.uploadDesc}</p>
                  </div>
                </div>
              </div>
            )}

            <AnimatePresence>
              {files.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {files.map((file, idx) => (
                    <motion.div
                      key={`${file.name}-${idx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-card text-card-foreground border border-border rounded-lg p-2.5 flex items-center gap-3 relative group/file shadow-sm"
                    >
                      <div className={cn('p-2 rounded-md', file.type.includes('image') ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400')}>
                        {file.type.includes('image') ? <ImageIcon className="w-4 h-4" /> : <File className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate pr-4">{file.name}</p>
                        <p className="text-[10px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(idx);
                        }}
                        className="absolute top-1 right-1 p-1 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover/file:opacity-100"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-primary-foreground font-bold py-7 rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm dark:shadow-none shadow-indigo-500/20 shrink-0"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
            <span className="text-base">{loading ? t.analyzing : t.generateBtn}</span>
          </Button>
        </motion.div>
      </section>

      <AnimatePresence>
        {result && (
          <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-7/12 flex flex-col gap-6 lg:overflow-y-auto custom-scrollbar pr-1">
            <div className="shrink-0">
              <SummaryView summary={result.summary} />
            </div>
            <div>
              <Quiz key={currentDocId || 'new-quiz'} questions={result.quiz} onComplete={handleSaveResult} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
