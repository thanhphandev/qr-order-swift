import React from "react";
import { FlameIcon, Star, Trophy, TrendingUp, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 300,
    },
  },
};

const iconVariants = {
  initial: { rotate: -30, scale: 0.7 },
  animate: {
    rotate: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

interface BadgeProps {
  variant: "best-seller" | "trending" | "on-top" | "featured" | "out-of-stock";
}

const badgeConfig = {
  "best-seller": {
    text: "Bán chạy",
    gradient: "from-purple-500/90 to-pink-500/90",
    Icon: FlameIcon,
  },
  trending: {
    text: "Trending",
    gradient: "from-blue-500/90 to-indigo-500/90",
    Icon: TrendingUp,
  },
  "on-top": {
    text: "On Top",
    gradient: "from-yellow-500/90 to-amber-600/90",
    Icon: Trophy,
  },
  featured: {
    text: "Featured",
    gradient: "from-amber-500/90 to-orange-500/90",
    Icon: Star,
  },
  "out-of-stock": {
    text: "Hết hàng",
    gradient: "from-red-500/90 to-red-700/90",
    Icon: XCircle,
  },
};

const Badge: React.FC<BadgeProps> = ({ variant }) => {
  const config = badgeConfig[variant];

  if (!config) {
    return null; // Fallback: If `variants` is invalid, render nothing.
  }

  const { text, gradient, Icon } = config;

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="z-20"
    >
      <div className="relative group">
        {/* Badge container */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${gradient} backdrop-blur-md shadow-lg whitespace-nowrap`}
        >
          {/* Animated Icon */}
          <motion.div variants={iconVariants} className="text-white">
            <Icon className="w-4 h-4 drop-shadow" />
          </motion.div>

          {/* Text */}
          <span className="text-sm font-medium text-white tracking-wide inline-block">
            {text}
          </span>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
};

export default Badge;
