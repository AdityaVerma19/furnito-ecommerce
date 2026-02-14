import { Armchair } from 'lucide-react';

export function Logo({ className = "", onClick }) {
  return (
    <div 
      className={`flex items-center space-x-2 cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="bg-amber-700 p-2 rounded-lg">
        <Armchair className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-bold text-amber-700">Furnito</span>
    </div>
  );
}
