
export type Locale = 'en' | 'id';

export const translations = {
  en: {
    dashboard: {
      inputTitle: "Study Material",
      inputDesc: "Paste your lecture notes, or upload PDF/Images below...",
      generateBtn: "Generate Study Guide",
      analyzing: "Analyzing Material...",
      charCount: "characters",
      insights: "Generate Insights",
      uploadTitle: "Upload Files",
      uploadDesc: "PDF or Images (Max 10MB)",
      dragDrop: "Drag and drop or click to upload",
      supportedTypes: "Supports PDF and JPG/PNG",
    },
    auth: {
      title: "RuangPaham",
      desc: "Turn your teacher's materials into clear summaries and test your knowledge with quizzes. Built for independent students who want to truly master their subjects.",
      btn: "Get Started for Free",
      footer: "Securely synchronized with Google Cloud Infrastructure.",
    },
    summary: {
      title: "AI Summary",
    },
    quiz: {
      title: "Interactive Quiz",
      questionLabel: "Question",
      complete: "Quiz Completed!",
      finalScore: "Final Score",
      tryAgain: "Try Again",
      checkAnswer: "Check Answer",
      nextQuestion: "Next Question",
      finish: "Complete Quiz",
      explanation: "Explanation",
    }
  },
  id: {
    dashboard: {
      inputTitle: "Materi Pembelajaran",
      inputDesc: "Tempelkan catatan atau unggah file PDF/Gambar di bawah...",
      generateBtn: "Buat Panduan Belajar",
      analyzing: "Menganalisis Materi...",
      charCount: "karakter",
      insights: "Hasilkan Wawasan",
      uploadTitle: "Unggah File",
      uploadDesc: "PDF atau Gambar (Maks 10MB)",
      dragDrop: "Tarik dan lepas atau klik untuk unggah",
      supportedTypes: "Mendukung PDF dan JPG/PNG",
    },
    auth: {
      title: "RuangPaham",
      desc: "Ubah materi dari guru menjadi ringkasan yang jelas dan uji pemahamanmu dengan kuis. Dibuat untuk pelajar yang ingin menguasai materi secara mandiri.",
      btn: "Mulai Gratis Sekarang",
      footer: "Sinkronisasi aman dengan Infrastruktur Google Cloud.",
    },
    summary: {
      title: "Ringkasan AI",
    },
    quiz: {
      title: "Kuis Interaktif",
      questionLabel: "Pertanyaan",
      complete: "Kuis Selesai!",
      finalScore: "Skor Akhir",
      tryAgain: "Coba Lagi",
      checkAnswer: "Cek Jawaban",
      nextQuestion: "Pertanyaan Berikutnya",
      finish: "Selesaikan Kuis",
      explanation: "Penjelasan",
    }
  }
};

export function getLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  const lang = navigator.language.split('-')[0];
  return lang === 'id' ? 'id' : 'en';
}
