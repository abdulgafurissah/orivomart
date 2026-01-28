'use client';

import { motion } from 'framer-motion';

export const FadeIn = ({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className={className}
    >
        {children}
    </motion.div>
);

export const ScaleIn = ({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay }}
        className={className}
    >
        {children}
    </motion.div>
);

export const SlideIn = ({ children, direction = 'left', delay = 0 }: { children: React.ReactNode, direction?: 'left' | 'right', delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, x: direction === 'left' ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay }}
    >
        {children}
    </motion.div>
);

export const StaggerContainer = ({ children, className = '', style = {} }: { children: React.ReactNode, className?: string, style?: any }) => (
    <motion.div
        initial="hidden"
        animate="show"
        variants={{
            hidden: { opacity: 0 },
            show: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.1
                }
            }
        }}
        className={className}
        style={style}
    >
        {children}
    </motion.div>
);

export const StaggerItem = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
        }}
        className={className}
    >
        {children}
    </motion.div>
);
