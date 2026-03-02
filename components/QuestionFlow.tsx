import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Question, Answers } from '../types';
import { QUESTIONS } from '../constants';

interface Props {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  onComplete: () => void;
}

export const QuestionFlow: React.FC<Props> = ({ answers, setAnswers, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewIndex, setViewIndex] = useState<number | null>(null);
  const [currentInput, setCurrentInput] = useState('');
  const [animating, setAnimating] = useState(false);
  const lastPartRef = useRef<number | null>(null);

  // Interstitial State
  const [showPartTransition, setShowPartTransition] = useState(false);
  const [transitionPartNumber, setTransitionPartNumber] = useState(1);
  const [transitionPartTitle, setTransitionPartTitle] = useState("");
  const [isLeaving, setIsLeaving] = useState(false);
  const transitionDurationMs = 3000;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressDraggingRef = useRef(false);
  const progressPointerIdRef = useRef<number | null>(null);

  const currentQuestion = viewIndex !== null ? QUESTIONS[viewIndex] : null;

  // Calculate progress based on logic index
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  // Synchronization Logic: Decouple viewIndex from currentIndex for cinematic transitions
  useEffect(() => {
    const targetQ = QUESTIONS[currentIndex];
    const newPart = targetQ.part;

    if (lastPartRef.current === null || newPart !== lastPartRef.current) {
      // CROSSING PARTS or INITIAL LOAD
      lastPartRef.current = newPart;
      triggerPartTransition(newPart, () => {
        setViewIndex(currentIndex);
      });
    } else {
      // SAME PART: Update UI view immediately
      setViewIndex(currentIndex);
    }
  }, [currentIndex]);

  const triggerPartTransition = (part: number, onOpaque?: () => void) => {
    let title = "";
    switch (part) {
      case 1: title = "探索 · 启程"; break;
      case 2: title = "得失 · 感悟"; break;
      case 3: title = "生活 · 喜好"; break;
      case 4: title = "自我 · 未来"; break;
      default: title = "";
    }
    setTransitionPartNumber(part);
    setTransitionPartTitle(title);
    setShowPartTransition(true);
    setIsLeaving(false);

    // Reset dragging state as the progress bar will unmount during transition
    progressDraggingRef.current = false;
    progressPointerIdRef.current = null;

    // Sync the viewIndex when screen is opaque (approx 800ms into 1.2s fade-in)
    if (onOpaque) {
      setTimeout(onOpaque, 800);
    }

    // Start leaving animation before the end
    setTimeout(() => {
      setIsLeaving(true);
    }, 2200);

    // Auto hide after transition duration
    setTimeout(() => {
      setShowPartTransition(false);
      setIsLeaving(false);
    }, transitionDurationMs);
  };

  useEffect(() => {
    if (viewIndex === null) return;
    setCurrentInput(answers[QUESTIONS[viewIndex].id] || '');
    if (textareaRef.current && !showPartTransition) {
      // Small delay to ensure render
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [viewIndex, answers, showPartTransition]);

  const handleNext = () => {
    setAnimating(true);
    setTimeout(() => {
      const trimmed = currentInput.trim();
      setAnswers(prev => ({
        ...prev,
        [QUESTIONS[viewIndex as number].id]: trimmed ? currentInput : ""
      }));
      if (currentIndex < QUESTIONS.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        onComplete();
      }
      setAnimating(false);
    }, 300);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setAnimating(false);
      }, 300);
    }
  };

  const persistCurrentInput = () => {
    if (currentInput.trim() && viewIndex !== null) {
      setAnswers(prev => ({ ...prev, [QUESTIONS[viewIndex].id]: currentInput }));
    }
  };

  const updateIndexFromClientX = (clientX: number) => {
    const rect = progressBarRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const targetIndex = Math.round(ratio * (QUESTIONS.length - 1));
    if (targetIndex !== currentIndex) {
      persistCurrentInput();
      setCurrentIndex(targetIndex);
    }
  };

  const handleProgressPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    progressDraggingRef.current = true;
    progressPointerIdRef.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateIndexFromClientX(e.clientX);
  };

  const handleProgressPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!progressDraggingRef.current || progressPointerIdRef.current !== e.pointerId) return;
    updateIndexFromClientX(e.clientX);
  };

  const handleProgressPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    progressDraggingRef.current = false;
    progressPointerIdRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleProgressPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    progressDraggingRef.current = false;
    progressPointerIdRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.isComposing) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-stone-800 transition-colors duration-500 relative">

      {/* Chapter Transition Overlay - Render as higher z-index overlay to avoid flicker */}
      {showPartTransition && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#1a1918] text-[#f4f0e6] overflow-hidden ${isLeaving ? 'fade-out' : 'fade-in'}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none z-10"></div>
          <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }}></div>

          <div className="text-center space-y-12 relative z-10 px-8">
            <div className="font-typewriter text-xs tracking-[0.5em] opacity-40 uppercase scale-up-fade-in" style={{ animationDelay: '200ms' }}>
              Chapter 0{transitionPartNumber}
            </div>

            <div className="flex flex-col items-center">
              <div className="h-[1px] bg-stone-500/30 expand-width mb-8 w-32 md:w-48"></div>

              <h2 className="text-4xl md:text-6xl font-serif tracking-[0.3em] font-medium py-2 scale-up-fade-in" style={{ animationDelay: '400ms' }}>
                {transitionPartTitle}
              </h2>

              <div className="h-[1px] bg-stone-500/30 expand-width mt-8 w-32 md:w-48" style={{ animationDelay: '600ms' }}></div>
            </div>

            <div className="font-serif italic text-stone-500/60 text-sm tracking-[0.2em] scale-up-fade-in" style={{ animationDelay: '1000ms' }}>
              2025 · 回望
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className={`flex justify-between items-center px-6 py-6 z-10 transition-opacity duration-700 ${currentQuestion ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-3 py-2 text-stone-500 hover:text-stone-800 transition-all ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-serif text-lg">上一题</span>
        </button>

        <div className="flex flex-col items-end">
          <span className="font-typewriter text-xs text-stone-400 tracking-widest">No. {currentQuestion?.id.toString().padStart(2, '0') || '00'} / 40</span>
          <span className="font-hand text-2xl text-stone-600 mt-1">{currentQuestion?.category || ''}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-6 py-2 relative">

        {/* Question Content */}
        <div className={`flex-1 flex flex-col justify-start space-y-8 ${animating || !currentQuestion ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'} transition-all duration-700 ease-out`}>

          <div className="mt-2 text-left">
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-stone-900 leading-normal tracking-wide">
              {currentQuestion?.text || ''}
            </h2>
          </div>

          <div className="relative group flex-1 flex flex-col min-h-[40vh] bg-transparent">
            {/* The Notebook Input */}
            <textarea
              ref={textareaRef}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              placeholder="在此书写..."
              spellCheck={false}
              className="w-full flex-1 p-0 font-chinese-hand notebook-input text-stone-800 placeholder:text-stone-300/50"
            />
          </div>

          <div className="pt-4 pb-12"></div>
        </div>
      </div>

      {/* Hand-drawn Timeline Progress */}
      <div className="h-12 w-full bg-[#f4f0e6] border-t border-stone-200 flex items-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')" }}></div>
        <div
          ref={progressBarRef}
          onPointerDown={handleProgressPointerDown}
          onPointerMove={handleProgressPointerMove}
          onPointerUp={handleProgressPointerUp}
          onPointerCancel={handleProgressPointerCancel}
          className="w-full h-[2px] bg-stone-300 relative cursor-pointer"
        >
          <div
            className="absolute top-0 left-0 h-full bg-stone-800 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          >
            {/* Pen tip / Indicator */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-stone-800 rounded-full border-[3px] border-[#f4f0e6] shadow-sm"></div>
          </div>
        </div>
        <div className="ml-6 font-hand text-xl text-stone-500 w-16 text-right">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
};
