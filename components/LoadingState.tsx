// components/Loading.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'

const LoadingState = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-white space-y-6">
      {/* Spinner */}
      <motion.div
        className="w-16 h-16 border-4 border-t-transparent border-brand-100 rounded-full animate-spin"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
      />

      {/* Message */}
      <motion.p
        className="text-lg font-medium text-center text-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.3 }}
      >
        Authenticating user, please wait...
      </motion.p>
    </div>
  )
}

export default LoadingState
