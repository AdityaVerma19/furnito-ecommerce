import { Award, Users, Truck, Shield } from 'lucide-react';
import { FloatingDecor } from "./FloatingDecor";
import { motion } from "framer-motion";

export function About() {
  return (
    <motion.section
      className="relative  w-full overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-blue-950 dark:via-blue-900 dark:to-blue-900"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <FloatingDecor intensity="soft" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-16">
        <div className="relative z-10 text-center mb-8 md:mb-12">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-slate-100">About Furnito</h1>
          <p className="mx-auto max-w-3xl text-base text-gray-600 md:text-xl dark:text-white">
            We're passionate about creating beautiful, functional furniture that enhances your living spaces. 
            With over 20 years of experience, we've helped thousands of customers find their perfect pieces.
          </p>
        </div>

        <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <h2 className="mb-4 text-xl font-bold text-gray-900 md:text-2xl dark:text-slate-100">Our Story</h2>
            <p className="mb-4 text-sm text-gray-600 md:text-base dark:text-white">
              Founded in 2004, Furnito began as a small family business with a simple mission: 
              to provide high-quality furniture at affordable prices. What started in a modest workshop 
              has grown into a trusted name in home furnishings.
            </p>
            <p className="text-sm text-gray-600 md:text-base dark:text-white">
              Today, we work with skilled craftsmen and designers worldwide to bring you furniture 
              that combines timeless design with modern functionality. Every piece is carefully selected 
              and tested to ensure it meets our high standards of quality and durability.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <h2 className="mb-4 text-xl font-bold text-gray-900 md:text-2xl dark:text-slate-100">Our Values</h2>
            <p className="mb-4 text-sm text-gray-600 md:text-base dark:text-white">
              Quality is at the heart of everything we do. We believe that furniture should be 
              built to last, which is why we use only premium materials and work with experienced 
              craftsmen who take pride in their work.
            </p>
            <p className="text-sm text-gray-600 md:text-base dark:text-white">
              We're also committed to sustainability. Many of our pieces are made from responsibly 
              sourced materials, and we're constantly working to reduce our environmental impact 
              while maintaining the quality our customers expect.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 55 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true, amount: 0.25 }}
            whileHover={{ y: -8, scale: 1.04 }}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 md:mb-4 md:h-16 md:w-16 dark:bg-blue-800/70">
              <Award className="h-6 w-6 text-amber-700 md:h-8 md:w-8 dark:text-amber-300" />
            </div>
            <h3 className="mb-2 text-sm font-semibold text-gray-900 md:text-base dark:text-slate-100">Premium Quality</h3>
            <p className="text-xs text-gray-600 md:text-sm dark:text-white">Handcrafted furniture built to last</p>
          </motion.div>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 55 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.18 }}
            viewport={{ once: true, amount: 0.25 }}
            whileHover={{ y: -8, scale: 1.04 }}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 md:mb-4 md:h-16 md:w-16 dark:bg-blue-800/70">
              <Users className="h-6 w-6 text-amber-700 md:h-8 md:w-8 dark:text-amber-300" />
            </div>
            <h3 className="mb-2 text-sm font-semibold text-gray-900 md:text-base dark:text-slate-100">Expert Team</h3>
            <p className="text-xs text-gray-600 md:text-sm dark:text-white">Dedicated professionals at your service</p>
          </motion.div>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 55 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.26 }}
            viewport={{ once: true, amount: 0.25 }}
            whileHover={{ y: -8, scale: 1.04 }}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 md:mb-4 md:h-16 md:w-16 dark:bg-blue-800/70">
              <Truck className="h-6 w-6 text-amber-700 md:h-8 md:w-8 dark:text-amber-300" />
            </div>
            <h3 className="mb-2 text-sm font-semibold text-gray-900 md:text-base dark:text-slate-100">Free Delivery</h3>
            <p className="text-xs text-gray-600 md:text-sm dark:text-white">Fast and safe delivery to your door</p>
          </motion.div>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 55 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.34 }}
            viewport={{ once: true, amount: 0.25 }}
            whileHover={{ y: -8, scale: 1.04 }}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 md:mb-4 md:h-16 md:w-16 dark:bg-blue-800/70">
              <Shield className="h-6 w-6 text-amber-700 md:h-8 md:w-8 dark:text-amber-300" />
            </div>
            <h3 className="mb-2 text-sm font-semibold text-gray-900 md:text-base dark:text-slate-100">Warranty</h3>
            <p className="text-xs text-gray-600 md:text-sm dark:text-white">5-year warranty on all products</p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
