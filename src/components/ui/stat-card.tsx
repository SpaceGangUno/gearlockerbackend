import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  link?: string;
  className?: string;
}

export const StatCard = ({ title, value, icon: Icon, description, link, className }: StatCardProps) => {
  const content = (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "bg-white overflow-hidden shadow-sm rounded-lg transition-all duration-200 hover:shadow-md",
        className
      )}
    >
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="rounded-md bg-indigo-100 p-3">
              <Icon className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3">
        <div className="text-sm text-gray-500">
          {description}
        </div>
      </div>
    </motion.div>
  );

  if (link) {
    return (
      <Link to={link} className="block">
        {content}
      </Link>
    );
  }

  return content;
};