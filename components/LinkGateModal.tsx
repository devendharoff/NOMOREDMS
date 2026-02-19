
import React, { useEffect, useRef } from 'react';
import { X, Rocket, ShieldCheck, Flag, AlertTriangle, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface LinkGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'limit' | 'report' | 'trending';
  onLogin?: () => void;
}

const LinkGateModal: React.FC<LinkGateModalProps> = ({
  isOpen,
  onClose,
  mode = 'limit',
  onLogin
}) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the close button when the modal opens
      setTimeout(() => closeBtnRef.current?.focus(), 100);

      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isReport = mode === 'report';
  const isTrending = mode === 'trending';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md scale-100 transform overflow-hidden rounded-[2rem] border border-white/20 bg-neutral-900 p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 rounded-full p-2 text-neutral-500 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="mb-6 flex justify-center" aria-hidden="true">
          <div className="relative">
            <div className={`absolute inset-0 animate-ping rounded-full opacity-20 ${isTrending ? 'bg-orange-500' : 'bg-white'}`}></div>
            <div className={`relative flex h-16 w-16 items-center justify-center rounded-full ${isReport ? 'bg-neutral-800 text-white border border-white/10' :
              isTrending ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.5)]' :
                'bg-white text-black'
              }`}>
              {isReport ? <Flag className="h-8 w-8" /> :
                isTrending ? <Lock className="h-8 w-8" /> :
                  <Rocket className="h-8 w-8" />}
            </div>
          </div>
        </div>

        <h2 id="modal-title" className="mb-2 text-2xl font-black tracking-tighter text-white uppercase">
          {isReport ? 'Report Content' :
            isTrending ? 'Members Only Access' :
              'Daily Limit Reached! 🚀'}
        </h2>
        <p id="modal-description" className="mb-8 text-sm leading-relaxed text-zinc-500">
          {isReport
            ? 'Help us keep the community safe. Please select a reason for reporting this resource.' :
            isTrending
              ? 'The Trending Vault contains high-value prompts and viral assets. Create a free account to unlock.'
              : 'Join 5,000+ creators accessing premium tools, exclusive templates, and private coding guides.'}
        </p>

        {isReport ? (
          <div className="space-y-2 text-left mb-8">
            {['Inappropriate Content', 'Copyright Infringement', 'Broken/Spam Link', 'Misleading Information'].map((reason) => (
              <button
                key={reason}
                onClick={onClose}
                className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-xs font-bold text-neutral-300 transition-all hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                {reason}
                <AlertTriangle className="h-3.5 w-3.5 text-zinc-600" aria-hidden="true" />
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <Link
              href="/login"
              onClick={onLogin}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-white py-4 text-sm font-bold text-black transition-transform hover:bg-neutral-200 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-green-500/50"
            >
              <img src="https://www.google.com/favicon.ico" alt="" className="h-4 w-4" aria-hidden="true" />
              Login / Sign Up
            </Link>


          </div>
        )}

        {isTrending && (
          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">
            <Sparkles className="h-3 w-3 text-orange-400" aria-hidden="true" />
            Join 12k+ creators today
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
          <ShieldCheck className="h-3 w-3" aria-hidden="true" />
          Secured by NOMOREDMS Identity
        </div>
      </div>
    </div>
  );
};

export default LinkGateModal;
