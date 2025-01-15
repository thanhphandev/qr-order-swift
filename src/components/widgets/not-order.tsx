import React from 'react';
import { PackageX } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface NoOrdersFoundProps {
    showActions?: boolean;
}

const NoOrdersFound = ({
    showActions = false,
}: NoOrdersFoundProps) => {
    const router = useRouter();

    // Animation cho các chấm trang trí
    const floatingAnimation = {
        initial: { y: 0 },
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    // Thời gian delay cho từng chấm
    const dotDelays = {
        dot1: 0,
        dot2: 0.5,
        dot3: 1,
        dot4: 1.5
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center relative"
        >
            {/* Icon Container với Animation */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1,
                }}
                className="relative mb-6"
            >
                <div className="w-20 h-20 md:w-24 md:h-24 bg-orange-100 rounded-full flex items-center justify-center">
                    <PackageX className="w-10 h-10 md:w-12 md:h-12 text-orange-500" />
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -top-2 -right-2"
                >
                    <div className="w-4 h-4 md:w-6 md:h-6 bg-orange-500 rounded-full" />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="absolute -bottom-1 -left-1"
                >
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-orange-300 rounded-full" />
                </motion.div>
            </motion.div>

            {/* Nội dung */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="px-4 md:px-8"
            >
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    Chưa có đơn hàng nào
                </h2>
                <p className="text-sm md:text-base text-gray-500 max-w-sm md:max-w-lg mx-auto">
                    Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm của chúng tôi và đặt hàng ngay!
                </p>
            </motion.div>

            {/* Phần tử trang trí với animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    variants={floatingAnimation}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: dotDelays.dot1 }}
                    className="absolute top-10 left-10"
                >
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-orange-200 rounded-full" />
                </motion.div>
                
                <motion.div
                    variants={floatingAnimation}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: dotDelays.dot2 }}
                    className="absolute top-20 right-20"
                >
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-orange-300 rounded-full" />
                </motion.div>
                
                <motion.div
                    variants={floatingAnimation}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: dotDelays.dot3 }}
                    className="absolute bottom-7 left-1/4"
                >
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-orange-200 rounded-full" />
                </motion.div>
                
                <motion.div
                    variants={floatingAnimation}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: dotDelays.dot4 }}
                    className="absolute top-1/3 right-10"
                >
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-orange-100 rounded-full" />
                </motion.div>
            </div>

            {/* Các nút thao tác tùy chọn */}
            {showActions && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 space-x-4"
                >
                    <button
                        onClick={() => router.push('/products')}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow"
                    >
                        Mua sắm ngay
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
};

export default NoOrdersFound;