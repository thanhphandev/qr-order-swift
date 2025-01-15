"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { TestTube2, Sparkles } from 'lucide-react';

const DevelopmentNotice = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-100"
    >
      {/* Animated Icon */}
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative"
      >
        <TestTube2 className="h-4 w-4 text-blue-500" />
        <motion.div
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="h-3 w-3 text-indigo-400" />
        </motion.div>
      </motion.div>

      {/* Text */}
      <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
        Tính năng đang được phát triển
      </span>

      {/* Decorative dots */}
      <div className="flex items-center gap-1">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 0
          }}
          className="w-1.5 h-1.5 rounded-full bg-blue-400"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 0.3
          }}
          className="w-1.5 h-1.5 rounded-full bg-indigo-400"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 0.6
          }}
          className="w-1.5 h-1.5 rounded-full bg-blue-400"
        />
      </div>
    </motion.div>
  );
};

export default DevelopmentNotice;