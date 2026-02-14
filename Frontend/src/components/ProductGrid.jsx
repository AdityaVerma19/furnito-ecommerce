import { ShoppingCart, Eye } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from "framer-motion";

const products = [
  {
    id: '1',
    name: 'Modern Velvet Sofa',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1763565909003-46e9dfb68a00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzb2ZhJTIwZnVybml0dXJlfGVufDF8fHx8MTc2Nzk4ODMwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Living Room',
    description: 'Elegant modern sofa with plush velvet upholstery',
    dimensions: '84"W x 36"D x 32"H',
    seatingCapacity: '3-4 people comfortably',
    material: 'Premium velvet upholstery with solid wood frame',
    weight: '150 lbs',
    warranty: '5-year structural warranty',
    inStock: true
  },
  {
    id: '2',
    name: 'Dining Table Set',
    price: 899,
    image: 'https://images.unsplash.com/photo-1611633332753-d1e2f695aa3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjB0YWJsZSUyMGNoYWlyfGVufDF8fHx8MTc2Nzk4ODMwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Dining',
    description: 'Contemporary dining set with 6 chairs',
    dimensions: '72"L x 40"W x 30"H (Table)',
    seatingCapacity: '6 people',
    material: 'Solid oak wood with natural finish',
    weight: '180 lbs (complete set)',
    warranty: '3-year warranty',
    inStock: true
  },
  {
    id: '3',
    name: 'Luxury King Bed',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1680503146454-04ac81a63550?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwZnVybml0dXJlJTIwYmVkfGVufDF8fHx8MTc2Nzk1NjM3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bedroom',
    description: 'Premium upholstered king-size bed frame',
    dimensions: '80"W x 86"L x 54"H',
    seatingCapacity: 'King size (76" x 80" mattress)',
    material: 'Linen upholstery with padded headboard',
    weight: '200 lbs',
    warranty: '5-year warranty',
    inStock: true
  },
  {
    id: '4',
    name: 'Executive Office Chair',
    price: 499,
    image: 'https://images.unsplash.com/photo-1637762646936-29b68cd6670d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBkZXNrJTIwY2hhaXJ8ZW58MXx8fHwxNzY3OTg0MTkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Office',
    description: 'Ergonomic leather office chair with lumbar support',
    dimensions: '26"W x 28"D x 45-49"H (adjustable)',
    seatingCapacity: '1 person (weight capacity: 300 lbs)',
    material: 'Genuine leather with memory foam padding',
    weight: '55 lbs',
    warranty: '2-year warranty',
    inStock: true
  },
  {
    id: '5',
    name: 'Storage Cabinet',
    price: 649,
    image: 'https://images.unsplash.com/photo-1764813128286-7062913e1dc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWJpbmV0JTIwc3RvcmFnZSUyMGZ1cm5pdHVyZXxlbnwxfHx8fDE3Njc5ODgzMDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Storage',
    description: 'Modern wooden storage cabinet with shelves',
    dimensions: '36"W x 18"D x 72"H',
    material: 'Solid pine wood with tempered glass doors',
    weight: '120 lbs',
    warranty: '3-year warranty',
    inStock: true
  },
  {
    id: '6',
    name: 'Velvet Armchair',
    price: 599,
    image: 'https://images.unsplash.com/photo-1680773525486-3313809b1a14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcm1jaGFpcnxlbnwxfHx8fDE3Njc4NzU0MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Living Room',
    description: 'Luxurious armchair with golden metal legs',
    dimensions: '32"W x 34"D x 35"H',
    seatingCapacity: '1 person comfortably',
    material: 'Velvet fabric with brass-finished metal legs',
    weight: '45 lbs',
    warranty: '3-year warranty',
    inStock: true
  },
];

export function ProductGrid({ onAddToCart, searchQuery, onProductClick }) {
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.section
    className="w-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-blue-950 dark:via-blue-900 dark:to-blue-900"
    id="featuredProducts"
    initial={{ opacity: 0, y: 80 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    viewport={{ once: true }}
  >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-16">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 md:mb-8 md:text-3xl dark:text-slate-100"  >Featured Products</h2>
      
      {filteredProducts.length === 0 ? (
        <p className="py-12 text-center text-gray-500 dark:text-white">No products found matching "{searchQuery}"</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {filteredProducts.map(product => (
          <motion.div
          key={product.id}
          whileHover={{ scale: 1.05, boxShadow: "0px 20px 40px rgba(255, 171, 0, 0.35)" }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-md dark:border dark:border-blue-800 dark:bg-blue-900/80"
        >
        
              <div className="relative h-48 md:h-64">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 md:top-4 left-2 md:left-4 bg-amber-600 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                  {product.category}
                </span>
                <button
                  onClick={() => onProductClick(product)}
                  className="absolute top-2 right-2 rounded-full bg-white bg-opacity-90 p-2 shadow-md transition-all hover:bg-opacity-100 md:top-4 md:right-4 dark:bg-blue-800"
                  aria-label="View details"
                >
                  <Eye className="h-4 w-4 text-amber-700 md:h-5 md:w-5 dark:text-amber-300" />
                </button>
              </div>
              <div className="p-4 md:p-6">
                <h3 
                  className="mb-2 cursor-pointer text-lg font-semibold text-gray-900 transition-colors hover:text-amber-700 md:text-xl dark:text-slate-100 dark:hover:text-amber-300"
                  onClick={() => onProductClick(product)}
                >
                  {product.name}
                </h3>
                <p className="mb-3 line-clamp-2 text-sm text-gray-600 md:mb-4 md:text-base dark:text-white">{product.description}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-xl md:text-2xl font-bold text-amber-700">${product.price}</span>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white px-3 md:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm md:text-base"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      </div>
    </motion.section>
  );
}
