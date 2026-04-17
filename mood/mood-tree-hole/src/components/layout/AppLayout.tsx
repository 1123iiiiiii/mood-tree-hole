import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  HeartIcon,
  ClockIcon,
  SparklesIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { path: '/', label: '记录', icon: HeartIcon },
  { path: '/history', label: '历史', icon: ClockIcon },
  { path: '/happiness', label: '小确幸', icon: SparklesIcon },
  { path: '/analysis', label: '分析', icon: ChartBarIcon },
];

export const AppLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex-1 flex justify-center">
            <h1 className="text-xl font-bold text-primary">心情树洞</h1>
          </div>
          <span className="text-sm text-text-secondary whitespace-nowrap">
            {new Date().toLocaleString('zh-CN', {
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4 pb-20">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-text-secondary hover:text-primary'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-2' : ''}`} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
