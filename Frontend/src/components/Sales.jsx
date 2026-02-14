import { ShoppingCart, Tag, Eye } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { FloatingDecor } from "./FloatingDecor";
import { motion } from "framer-motion";

const saleProducts = [
  {
    id: '7',
    name: 'Classic Leather Sofa',
    price: 999,
    originalPrice: 1499,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1763565909003-46e9dfb68a00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzb2ZhJTIwZnVybml0dXJlfGVufDF8fHx8MTc2Nzk4ODMwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Living Room',
    description: 'Premium leather sofa with timeless design',
    dimensions: '90"W x 38"D x 34"H',
    seatingCapacity: '3-4 people',
    material: 'Top-grain leather with hardwood frame',
    weight: '165 lbs',
    warranty: '5-year warranty',
    inStock: true
  },
  {
    id: '8',
    name: 'Oak Dining Set',
    price: 699,
    originalPrice: 999,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1611633332753-d1e2f695aa3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjB0YWJsZSUyMGNoYWlyfGVufDF8fHx8MTc2Nzk4ODMwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Dining',
    description: 'Solid oak table with 4 matching chairs',
    dimensions: '60"L x 36"W x 30"H (Table)',
    seatingCapacity: '4 people',
    material: 'Solid oak with water-resistant finish',
    weight: '140 lbs (complete set)',
    warranty: '3-year warranty',
    inStock: true
  },
  {
    id: '9',
    name: 'Platform Bed Frame',
    price: 1199,
    originalPrice: 1699,
    discount: 29,
    image: 'https://images.unsplash.com/photo-1680503146454-04ac81a63550?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwZnVybml0dXJlJTIwYmVkfGVufDF8fHx8MTc2Nzk1NjM3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bedroom',
    description: 'Modern platform bed with storage drawers',
    dimensions: '64"W x 84"L x 40"H',
    seatingCapacity: 'Queen size (60" x 80" mattress)',
    material: 'Engineered wood with fabric upholstery',
    weight: '185 lbs',
    warranty: '4-year warranty',
    inStock: true
  },
  {
    id: '10',
    name: 'Ergonomic Desk Chair',
    price: 349,
    originalPrice: 549,
    discount: 36,
    image: 'https://images.unsplash.com/photo-1637762646936-29b68cd6670d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBkZXNrJTIwY2hhaXJ8ZW58MXx8fHwxNzY3OTg0MTkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Office',
    description: 'Comfortable mesh office chair with adjustable features',
    dimensions: '24"W x 26"D x 42-46"H (adjustable)',
    seatingCapacity: '1 person (weight capacity: 275 lbs)',
    material: 'Breathable mesh with adjustable lumbar support',
    weight: '48 lbs',
    warranty: '2-year warranty',
    inStock: true
  },
  {
    id: '11',
    name: 'Wooden Bookshelf',
    price: 449,
    originalPrice: 649,
    discount: 31,
    image: 'https://images.unsplash.com/photo-1764813128286-7062913e1dc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWJpbmV0JTIwc3RvcmFnZSUyMGZ1cm5pdHVyZXxlbnwxfHx8fDE3Njc5ODgzMDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Storage',
    description: 'Tall bookshelf with 5 adjustable shelves',
    dimensions: '30"W x 16"D x 70"H',
    material: 'Solid wood with anti-tip hardware included',
    weight: '95 lbs',
    warranty: '3-year warranty',
    inStock: true
  },
  {
    id: '12',
    name: 'Accent Chair',
    price: 399,
    originalPrice: 599,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1680773525486-3313809b1a14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcm1jaGFpcnxlbnwxfHx8fDE3Njc4NzU0MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Living Room',
    description: 'Stylish accent chair perfect for any room',
    dimensions: '28"W x 32"D x 33"H',
    seatingCapacity: '1 person',
    material: 'Velvet upholstery with gold-tone legs',
    weight: '38 lbs',
    warranty: '2-year warranty',
    inStock: true
  },
];

export function Sales({ onAddToCart, onProductClick = () => {} }) {
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
          <div className="flex items-center justify-center mb-4">
            <Tag className="w-8 h-8 md:w-12 md:h-12 text-amber-600" />
          </div>
          <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-slate-100">Special Sales & Offers</h1>
          <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-xl dark:text-white">
            Don't miss out on these incredible deals! Limited time offers on premium furniture.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {saleProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="relative overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl dark:border dark:border-blue-800 dark:bg-blue-900/80"
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
                delay: index * 0.08,
              }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{
                y: -8,
                scale: 1.02,
                boxShadow: "0px 18px 38px rgba(245, 158, 11, 0.24)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-red-500 text-white px-2 md:px-3 py-1 md:py-2 rounded-full font-bold z-10 shadow-lg text-sm md:text-base">
                -{product.discount}%
              </div>
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
                  className="absolute right-2 bottom-2 rounded-full bg-white p-2 shadow-md transition-all hover:bg-opacity-100 md:right-4 md:bottom-4 dark:bg-blue-800"
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
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div>
                    <span className="text-xl md:text-2xl font-bold text-red-600">${product.price}</span>
                    <span className="ml-2 text-sm text-gray-400 line-through md:text-base dark:text-white">${product.originalPrice}</span>
                  </div>
                </div>
                <button
                  onClick={() => onAddToCart(product)}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm md:text-base"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
