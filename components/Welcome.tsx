import React, { useRef, useState } from 'react';
import { ArrowRight, Feather, Paperclip, Loader2 } from 'lucide-react';

interface Props {
  onStart: () => void;
  onFileUpload: (file: File) => void;
  isProcessing?: boolean;
}

export const Welcome: React.FC<Props> = ({ onStart, onFileUpload, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="h-[100svh] flex flex-col items-center justify-center px-6 py-4 bg-[#fdfbf7] text-stone-800 fade-in relative overflow-hidden">

      {/* Warm Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-amber-100/40 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="relative z-10 max-w-lg w-full text-center space-y-7 py-8">

        <div className="space-y-5">
          <div className="mx-auto w-16 h-16 bg-stone-900 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-stone-100 overflow-hidden">
            <img src="/logo.svg" alt="40 Questions Logo" className="w-10 h-10" />
          </div>

          <h1 className="text-4xl md:text-5xl font-retro text-stone-900 tracking-wide leading-tight">
            2025<br />年度四十问
          </h1>

          <div className="flex items-center justify-center gap-4 text-stone-400 text-sm tracking-widest uppercase font-typewriter">
            <span>Review</span>
            <span>•</span>
            <span>Reflect</span>
            <span>•</span>
            <span>Restart</span>
          </div>
        </div>

        <div className="space-y-2 font-serif text-base text-stone-600 leading-relaxed max-w-sm mx-auto">
          <p>这一年，如白驹过隙。</p>
          <p>在按下“重启”键之前，</p>
          <p>不妨泡一杯热茶，</p>
          <p>用一点时间，与自己对话。</p>
        </div>

        <div className="pt-5 flex flex-col items-center gap-4">
          {isProcessing ? (
            <div className="flex items-center gap-3 px-6 py-2.5 bg-stone-100 text-stone-500 rounded-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="font-serif text-sm">正在读取记忆...</span>
            </div>
          ) : (
            <>
              <button
                onClick={onStart}
                className="group relative inline-flex items-center justify-center px-10 py-3 text-base font-serif text-white transition-all duration-300 bg-stone-900 rounded-sm hover:bg-stone-800 hover:shadow-2xl hover:-translate-y-1 w-56"
              >
                <span>开启旅程</span>
                <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="relative group">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-2 text-stone-400 hover:text-stone-600 font-serif text-xs transition-colors py-1"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>上传已填文件 (PDF/Text)</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.txt,.md,.json,image/*"
                  onChange={handleFileChange}
                />
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
};
