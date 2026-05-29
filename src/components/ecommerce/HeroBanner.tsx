import { motion } from 'framer-motion';
import { ArrowRight, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

import { GradientButton } from './GradientButton';

export function HeroBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-4xl bg-vt-gradient p-6 text-white shadow-elevated"
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-4 right-12 h-20 w-20 rounded-full bg-white/10" />
      <div className="relative z-10">
        <div className="mb-2 flex items-center gap-2">
          <Sun className="h-5 w-5" />
          <span className="text-sm font-medium opacity-90">Summer Collection</span>
        </div>
        <h2 className="text-2xl font-bold leading-tight">
          Plasticware Offers
          <br />
          <span className="text-white/90">Up to 40% Off</span>
        </h2>
        <p className="mt-2 max-w-xs text-sm text-white/80">
          New arrivals, wholesale deals & household essentials
        </p>
        <Link to="/categories" className="mt-4 inline-block">
          <GradientButton className="!bg-white !text-vt-blue shadow-lg">
            Shop Now <ArrowRight className="ml-1 inline h-4 w-4" />
          </GradientButton>
        </Link>
      </div>
    </motion.div>
  );
}
