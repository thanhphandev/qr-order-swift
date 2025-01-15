'use client'

import React from 'react';
import { FileX } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const NotFoundPage = () => {
    const router = useRouter();
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center"
        >
            {/* Icon Container with Animation */}
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
                    <FileX className="w-10 h-10 md:w-12 md:h-12 text-orange-500" />
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

            {/* Text Content */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="px-4 md:px-8"
            >
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    Không tìm thấy trang
                </h2>
                <p className="text-sm md:text-base text-gray-500 mb-2">
                    Trang bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại
                </p>
                <p className="text-sm md:text-base text-gray-500 max-w-sm md:max-w-lg mx-auto">
                    Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ
                </p>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
                className="absolute inset-0 pointer-events-none"
            >
                <div className="absolute top-10 left-10 w-2 h-2 md:w-3 md:h-3 bg-orange-200 rounded-full" />
                <div className="absolute top-20 right-20 w-2 h-2 md:w-3 md:h-3 bg-orange-300 rounded-full" />
                <div className="absolute bottom-10 left-1/4 w-2 h-2 md:w-3 md:h-3 bg-orange-200 rounded-full" />
                <div className="absolute top-1/3 right-10 w-3 h-3 md:w-4 md:h-4 bg-orange-100 rounded-full" />
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 space-x-4"
            >
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl shadow"
                >
                    Quay lại
                </button>
                <button
                    onClick={() => router.push('/')}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow"
                >
                    Về trang chủ
                </button>
            </motion.div>
        </motion.div>
    );
};

export default NotFoundPage;