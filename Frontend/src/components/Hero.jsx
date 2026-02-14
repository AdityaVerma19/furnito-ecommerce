import { FloatingDecor } from "./FloatingDecor";
import { motion } from "framer-motion";

const scrollToProducts = () => {
  document.getElementById("featuredProducts")?.scrollIntoView({
    behavior: "smooth",
  });
};

export function Hero({ onShopNow }) {
  return (
    <motion.section
      className="relative min-h-[500px] bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 md:h-[600px] dark:from-blue-950 dark:via-blue-900 dark:to-blue-900"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <FloatingDecor intensity="soft" />
      <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 grid h-full items-center gap-6 py-8 md:grid-cols-2 md:gap-8 md:py-12">
          <div className="space-y-4 md:space-y-6 dark:rounded-2xl dark:bg-blue-950/70 dark:p-4 dark:ring-1 dark:ring-blue-700/70 dark:backdrop-blur-sm md:dark:p-6">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl dark:text-slate-100">
              Welcome to <span className="text-amber-700">Furnito</span>
            </h1>

            <p className="font-poppins italic leading-relaxed text-gray-700 sm:text-lg md:text-xl dark:!text-white dark:[text-shadow:0_1px_2px_rgba(2,6,23,0.7)]">
              "Experience true royalty with our elite handcrafted furniture,
              where timeless design meets superior craftsmanship. Each piece
              brings sophistication, luxury, and unmatched comfort,
              transforming your home into a statement of class and refinement.
              Created to be admired as much as used, our furniture reflects a
              legacy of excellence and exquisite taste."
            </p>

            <p className="flex justify-end font-bold text-black dark:!text-white dark:[text-shadow:0_1px_2px_rgba(2,6,23,0.8)]">
              ~ Verma&apos;s
            </p>

            <button
              onClick={scrollToProducts}
              className="group relative overflow-hidden rounded-lg bg-amber-600 px-6 py-2 text-sm text-white transition-colors hover:bg-amber-700 md:px-8 md:py-3 md:text-base"
            >
              <span className="absolute inset-0 origin-left scale-x-0 transform bg-amber-700 transition-transform duration-300 group-hover:scale-x-100"></span>
              <span className="relative flex items-center gap-2">
                Shop Now
                <svg
                  className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
            </button>
          </div>

          <div className="grid h-full min-h-[400px] grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-3 md:space-y-4">
              <motion.div
                className="group relative h-48 cursor-pointer overflow-hidden rounded-lg md:h-64"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
                viewport={{ once: true, amount: 0.25 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1763565909003-46e9dfb68a00?auto=format&fit=crop&w=1080&q=80"
                  alt="Modern Sofa"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-active:scale-125"
                />
                <div className="absolute inset-0 bg-amber-400 opacity-0 transition duration-500 group-hover:opacity-20"></div>
                <div className="absolute inset-0 ring-2 ring-amber-500 opacity-0 transition duration-500 group-hover:opacity-50"></div>
              </motion.div>

              <motion.div
                className="group relative h-36 cursor-pointer overflow-hidden rounded-lg md:h-48"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                viewport={{ once: true, amount: 0.25 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1680503146454-04ac81a63550?auto=format&fit=crop&w=1080&q=80"
                  alt="Bedroom Furniture"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-active:scale-125"
                />
                <div className="absolute inset-0 bg-amber-400 opacity-0 transition duration-500 group-hover:opacity-20"></div>
                <div className="absolute inset-0 ring-2 ring-amber-500 opacity-0 transition duration-500 group-hover:opacity-50"></div>
              </motion.div>
            </div>

            <div className="mt-6 space-y-3 md:mt-8 md:space-y-4">
              <motion.div
                className="group relative h-36 cursor-pointer overflow-hidden rounded-lg md:h-48"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.28 }}
                viewport={{ once: true, amount: 0.25 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1611633332753-d1e2f695aa3c?auto=format&fit=crop&w=1080&q=80"
                  alt="Dining Set"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-active:scale-125"
                />
                <div className="absolute inset-0 bg-amber-400 opacity-0 transition duration-500 group-hover:opacity-20"></div>
                <div className="absolute inset-0 ring-2 ring-amber-500 opacity-0 transition duration-500 group-hover:opacity-50"></div>
              </motion.div>

              <motion.div
                className="group relative h-48 cursor-pointer overflow-hidden rounded-lg md:h-64"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.36 }}
                viewport={{ once: true, amount: 0.25 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1680773525486-3313809b1a14?auto=format&fit=crop&w=1080&q=80"
                  alt="Luxury Armchair"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-active:scale-125"
                />
                <div className="absolute inset-0 bg-amber-400 opacity-0 transition duration-500 group-hover:opacity-20"></div>
                <div className="absolute inset-0 ring-2 ring-amber-500 opacity-0 transition duration-500 group-hover:opacity-50"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
