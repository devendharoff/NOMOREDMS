
import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const GlassLoading: React.FC = () => {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-24 w-24 rounded-3xl border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 backdrop-blur-xl"
        />
        <Zap className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-zinc-950 dark:text-white fill-current" />
      </div>
    </div>
  );
};

export default GlassLoading;
