import React from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  link?: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, description, link }) => {
  const content = (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="rounded-md bg-indigo-500 p-3">
              {React.cloneElement(icon as React.ReactElement, {
                className: 'h-6 w-6 text-white'
              })}
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
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm text-gray-500">
          {description}
        </div>
      </div>
    </div>
  );

  if (link) {
    return <Link to={link}>{content}</Link>;
  }

  return content;
};

export default Card;