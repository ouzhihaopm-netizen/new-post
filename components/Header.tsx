
import React from 'react';
import { ImageIcon, Settings, Github } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <ImageIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">智绘视觉</span>
          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded uppercase tracking-wider">专业版</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600">控制面板</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600">历史记录</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600">API 文档</a>
        </nav>

        <div className="flex items-center space-x-3">
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <Github className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-sm cursor-pointer"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
