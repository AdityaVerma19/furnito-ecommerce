import { X, ShoppingCart, Ruler, Users, Package, Shield } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ProductDetail({ product, isOpen, onClose, onAddToCart }) {
  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    onAddToCart(product);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed inset-4 z-50 flex max-h-[95vh] flex-col overflow-hidden rounded-lg bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 shadow-2xl md:inset-auto md:top-1/2 md:left-1/2 md:w-full md:max-w-4xl md:-translate-x-1/2 md:-translate-y-1/2 dark:from-blue-950 dark:via-blue-900 dark:to-blue-900">
        <div className="flex items-center justify-between border-b border-amber-200 p-4 md:p-6 dark:border-blue-800">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-slate-100">{product.name}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:text-slate-100 dark:hover:bg-blue-800/80"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md"
              />
              <div className="mt-4 flex items-center justify-between">
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium dark:bg-amber-500/20 dark:text-amber-200">
                  {product.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.inStock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div>
                <p className="mb-4 text-base text-gray-600 md:text-lg dark:text-white">{product.description}</p>
                <div className="text-3xl md:text-4xl font-bold text-amber-700 mb-6">
                  ${product.price}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-slate-100">Product Details</h3>
                 
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start space-x-3 rounded-lg bg-gray-50 p-3 dark:border dark:border-blue-800 dark:bg-blue-900/70">
                    <Ruler className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 md:text-base dark:text-slate-100">Dimensions</p>
                      <p className="text-sm text-gray-600 md:text-base dark:text-white">{product.dimensions}</p>
                    </div>
                  </div>

                  {product.seatingCapacity && (
                    <div className="flex items-start space-x-3 rounded-lg bg-gray-50 p-3 dark:border dark:border-blue-800 dark:bg-blue-900/70">
                      <Users className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 md:text-base dark:text-slate-100">Seating Capacity</p>
                        <p className="text-sm text-gray-600 md:text-base dark:text-white">{product.seatingCapacity}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3 rounded-lg bg-gray-50 p-3 dark:border dark:border-blue-800 dark:bg-blue-900/70">
                    <Package className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 md:text-base dark:text-slate-100">Material & Weight</p>
                      <p className="text-sm text-gray-600 md:text-base dark:text-white">{product.material}</p>
                      <p className="text-sm text-gray-600 md:text-base dark:text-white">Weight: {product.weight}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 rounded-lg bg-gray-50 p-3 dark:border dark:border-blue-800 dark:bg-blue-900/70">
                    <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 md:text-base dark:text-slate-100">Warranty</p>
                      <p className="text-sm text-gray-600 md:text-base dark:text-white">{product.warranty}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full rounded-lg bg-amber-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-gray-300 md:py-4 md:text-lg dark:disabled:bg-blue-800/50"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
