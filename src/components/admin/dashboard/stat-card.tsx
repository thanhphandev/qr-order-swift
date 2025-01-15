import React from 'react';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';


interface StatCardProps {
  title: string;
  value: string | number;
  trend: 'up' | 'down';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  trendValue: string;
  color?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  trendValue,
  color = '#f97316' // Default orange color
}: StatCardProps) => {

  const bgColor = `${color}15`; // 15 is hex for 10% opacity
  
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-gray-500 font-medium truncate">
            {title}
          </p>
          <h3 className="text-xl sm:text-2xl font-bold mt-2 font-mono tracking-tight truncate">
            {value}
          </h3>
          <div className="flex items-center mt-2 gap-1">
            <div 
              className={`flex items-center px-2 py-1 rounded-full text-sm
                ${trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
            >
              {trend === 'up' ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              <span className="ml-1 font-medium">
                {trendValue}
              </span>
            </div>
          </div>
        </div>
        
        <div 
          className="flex-shrink-0 p-2 sm:p-3 rounded-xl transition-transform duration-300 hover:scale-110"
          style={{ backgroundColor: bgColor }}
        >
          <Icon 
            className="h-5 w-5 sm:h-6 sm:w-6"
            style={{ color: color }}
          />
        </div>
      </div>
    </div>
  );
};

