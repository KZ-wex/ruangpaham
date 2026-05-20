import { useState } from 'react';
import { QuizQuestion } from '@/src/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Progress } from '@/src/components/ui/progress';
import { BrainCircuit, CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { getLocale, translations } from '@/src/lib/i18n';

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export function Quiz({ questions, onComplete }: QuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const locale = getLocale();
  const t = translations[locale].quiz;

  const currentQuestion = questions[currentIdx];
  const progress = (currentIdx / questions.length) * 100;

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore((s) => s + 1);
    }
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
      onComplete(Math.round(((score + (selectedOption === currentQuestion.correctAnswer && !isAnswered ? 1 : 0)) / questions.length) * 100));
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} id="quiz-results">
        <Card className="rounded-[2.5rem] border-none shadow-[0_15px_50px_rgba(0,0,0,0.1)] text-center py-16 px-8 bg-card text-card-foreground overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-indigo-500 via-purple-500 to-amber-500" />
          <CardContent className="space-y-8">
            <div className="flex justify-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-24 h-24 bg-amber-50 rounded-[2rem] flex items-center justify-center text-amber-500 dark:text-amber-400 shadow-sm border border-amber-100 dark:border-amber-500/20"
              >
                <Trophy className="w-12 h-12" />
              </motion.div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-foreground tracking-tight">{t.complete}</h2>
              <p className="text-muted-foreground font-medium">{locale === 'id' ? 'Yeay! Kamu berhasil menyelesaikan tantangan kuis.' : "Yay! You've successfully finished the quiz challenge."}</p>
            </div>

            <div className="py-6">
              <div className="text-7xl font-black text-indigo-600 dark:text-indigo-400 mb-2">{percentage}%</div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{t.finalScore}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={handleRestart}
                className="rounded-2xl px-10 py-7 bg-indigo-600 hover:bg-indigo-700 text-primary-foreground font-bold shadow-lg shadow-indigo-100 dark:shadow-none transition-all hover:scale-105 active:scale-95"
              >
                <RotateCcw className="w-5 h-5 mr-3" />
                {t.tryAgain}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="bg-card text-card-foreground rounded-[2rem] border-none shadow-sm dark:shadow-none p-8 flex flex-col wrap-break-word" id="quiz-card">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-green-50 text-green-500 dark:text-green-400 rounded-2xl flex items-center justify-center border border-green-100 dark:border-green-500/20 shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-foreground tracking-tight">{t.title}</h3>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Uji Pemahaman</p>
          </div>
        </div>
        <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-full border border-border">
          {t.questionLabel} {currentIdx + 1} / {questions.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        <p className="text-base font-semibold text-foreground mb-6 leading-relaxed wrap-break-word">{String(currentQuestion.question || '')}</p>

        <div className="grid grid-cols-1 gap-3">
          <AnimatePresence mode="popLayout">
            {currentQuestion.options.map((option, idx) => {
              const safeOption = String(option || '');
              const isCorrect = safeOption === currentQuestion.correctAnswer;
              const isSelected = safeOption === selectedOption;
              const label = String.fromCharCode(65 + idx);

              let stateClasses = 'border-border hover:border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-50/50 dark:bg-indigo-500/10';
              let radioClasses = 'border-border';

              if (isAnswered) {
                if (isCorrect) {
                  stateClasses = 'border-green-600 bg-green-50 text-green-700 dark:text-green-400 shadow-[0_0_0_1px_rgba(22,163,74,1)]';
                  radioClasses = 'border-green-600 bg-green-600';
                } else if (isSelected) {
                  stateClasses = 'border-red-500 bg-red-50 text-red-700 dark:text-red-400';
                  radioClasses = 'border-red-500 bg-red-500';
                } else {
                  stateClasses = 'border-border opacity-50 grayscale-[0.5]';
                }
              } else if (isSelected) {
                stateClasses = 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-500/20 shadow-[0_0_0_1px_rgba(79,70,229,1)]';
                radioClasses = 'border-indigo-600 bg-indigo-600';
              }

              return (
                <motion.button
                  key={safeOption}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleOptionSelect(safeOption)}
                  disabled={isAnswered}
                  className={cn('flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left text-sm group wrap-break-word', stateClasses, !isAnswered && isSelected ? 'font-semibold' : '')}
                >
                  <div className="flex gap-3 items-center flex-1">
                    <span className={cn('font-bold shrink-0', isSelected || (isAnswered && isCorrect) ? 'text-inherit' : 'text-muted-foreground')}>{label})</span>
                    <span className="flex-1 wrap-break-word">{safeOption}</span>
                  </div>
                  <div className={cn('w-4 h-4 rounded-full border-2 transition-all shrink-0 ml-3', radioClasses, isAnswered && (isCorrect || isSelected) ? 'border-4 bg-card text-card-foreground' : 'group-hover:border-indigo-400')} />
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 p-4 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-xl border border-border/50 wrap-break-word">
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">{t.explanation}</p>
              <p className="text-xs text-foreground leading-relaxed wrap-break-word">{String(currentQuestion.explanation || '')}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex justify-end items-center gap-4 pt-4 border-t border-border shrink-0">
        {!isAnswered ? (
          <Button onClick={handleCheckAnswer} disabled={!selectedOption} className="bg-primary text-primary-foreground px-8 py-2.5 h-11 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all active:scale-[0.98]">
            {t.checkAnswer}
          </Button>
        ) : (
          <Button onClick={handleNext} className="bg-indigo-600 text-primary-foreground px-8 py-2.5 h-11 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all active:scale-[0.98] group">
            {currentIdx === questions.length - 1 ? t.finish : t.nextQuestion}
            <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
          </Button>
        )}
      </div>
    </Card>
  );
}
