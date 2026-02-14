import { ProductGrid } from "./ProductGrid";
import { FloatingDecor } from "./FloatingDecor";

export function Explore({ onAddToCart, onProductClick, searchQuery }) {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-blue-950 dark:via-blue-900 dark:to-blue-900">
      <FloatingDecor intensity="soft" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-12">
        <div className="relative z-10 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-slate-100">
            Explore Our Collection
          </h1>
          <p className="mt-2 text-gray-600 dark:text-white">
            Discover handpicked furniture crafted for comfort and style.
          </p>
        </div>

        <ProductGrid
          onAddToCart={onAddToCart}
          onProductClick={onProductClick}
          searchQuery={searchQuery}
        />
      </div>
    </section>
  );
}
