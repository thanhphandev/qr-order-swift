import React, { memo } from "react";
import { Timer, CheckCircle2, CreditCard, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

// Moved outside component to prevent recreation on each render
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

interface StatusBadgeProps {
  variant: "pending" | "completed" | "paid" | "processing" | "deny";
}

// Moved outside component to prevent recreation on each render
const statusBadgeConfig = {
  pending: {
    text: "Chờ xử lý",
    gradient: "from-yellow-400/90 to-amber-500/90",
    Icon: Timer,
  },
  completed: {
    text: "Đã xác nhận",
    gradient: "from-green-400/90 to-emerald-600/90",
    Icon: CheckCircle2,
  },
  paid: {
    text: "Đã thanh toán",
    gradient: "from-blue-400/90 to-cyan-600/90",
    Icon: CreditCard,
  },
  processing: {
    text: "Đang xử lý",
    gradient: "from-indigo-400/90 to-purple-600/90",
    Icon: Clock,
  },
  deny: {
    text: "Đã hủy",
    gradient: "from-red-400/90 to-rose-600/90",
    Icon: AlertCircle,
  },
} as const;

// Pure component using memo
const StatusBadge = memo(function StatusBadge({ variant }: StatusBadgeProps) {
  const config = statusBadgeConfig[variant];
  
  if (!config) {
    return null;
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
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${gradient} backdrop-blur-md shadow-lg whitespace-nowrap`}
        >
          <motion.div variants={iconVariants} className="text-white">
            <Icon className="w-4 h-4 drop-shadow" />
          </motion.div>
          <span className="text-sm font-medium text-white tracking-wide inline-block">
            {text}
          </span>
        </div>
        <div className="absolute inset-0 rounded-full bg-white/20 blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
});

// Pure OrderStatus component using memo
const OrderStatus = memo(function OrderStatus({ status }: { status: string }) {
  return (
    <div className="flex items-center space-x-2">
      <StatusBadge 
        variant={
          status as "pending" | "completed" | "paid" | "processing" | "deny"
        } 
      />
    </div>
  );
});

// Type guard for status variants
const isValidStatus = (status: string): status is StatusBadgeProps['variant'] => {
  return status in statusBadgeConfig;
};

export { StatusBadge, OrderStatus, isValidStatus };