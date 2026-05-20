import ReactMarkdown from 'react-markdown';
import { Card } from '@/src/components/ui/card';
import { FileText } from 'lucide-react';
import { getLocale, translations } from '@/src/lib/i18n';

interface SummaryViewProps {
  summary: string;
}

export function SummaryView({ summary }: SummaryViewProps) {
  const locale = getLocale();
  const t = translations[locale].summary;

  const summaryText = Array.isArray(summary) ? summary.join('\n\n') : String(summary || '');

  return (
    <Card className="bg-card text-card-foreground rounded-[2rem] border-none shadow-sm dark:shadow-none p-8 overflow-hidden wrap-break-word" id="summary-card">
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <div className="w-10 h-10 bg-amber-50 text-amber-500 dark:text-amber-400 rounded-2xl flex items-center justify-center border border-amber-100 dark:border-amber-500/20 shadow-sm">
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-bold text-foreground tracking-tight">{t.title}</h3>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Wawasan Belajar</p>
        </div>
      </div>
      <div className="prose prose-slate prose-sm max-w-none prose-p:leading-relaxed prose-li:my-1 prose-ul:list-none prose-ul:pl-0 wrap-break-word">
        <ReactMarkdown
          components={{
            li: ({ children }) => (
              <li className="flex gap-3 text-sm text-foreground mb-3 last:mb-0">
                <span className="text-indigo-500 dark:text-indigo-400 font-bold shrink-0">•</span>
                <div className="flex-1 wrap-break-word">{children}</div>
              </li>
            ),
          }}
        >
          {summaryText}
        </ReactMarkdown>
      </div>
    </Card>
  );
}
