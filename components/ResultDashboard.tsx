
import React from 'react';
import { 
  CheckCircle2, 
  Tag, 
  Palette, 
  Maximize2, 
  Layers 
} from 'lucide-react';
import { AnalysisResult } from '../types';

interface Props {
  result: AnalysisResult;
}

const ResultDashboard: React.FC<Props> = ({ result }) => {
  const sceneTypeMap: Record<string, string> = {
    indoor: '室内',
    outdoor: '室外',
    studio: '影棚',
    abstract: '抽象',
    unknown: '未知'
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Overview Section */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>AI 分析总结</span>
          </h2>
          <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">
            {Math.round(result.estimatedConfidence * 100)}% 匹配度
          </div>
        </div>
        <p className="text-lg font-medium text-slate-700 mb-2 leading-tight">
          “{result.summary}”
        </p>
        <p className="text-slate-500 leading-relaxed italic">
          {result.detailedDescription}
        </p>
      </section>

      {/* Grid: Context & Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Context Info */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
            <Layers className="w-4 h-4 mr-2 text-indigo-400" />
            环境数据
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">场景类型</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold">
                {sceneTypeMap[result.sceneType] || result.sceneType}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">色彩氛围</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold capitalize">
                {result.mood}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">识别物体总数</span>
              <span className="font-bold text-indigo-600">{result.objects.length}</span>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
            <Palette className="w-4 h-4 mr-2 text-pink-400" />
            主导调色板
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.colors.map((color, idx) => (
              <div key={idx} className="flex items-center space-x-2 group">
                <div 
                  className="w-10 h-10 rounded-lg shadow-inner ring-1 ring-black/5" 
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs font-mono text-slate-400 group-hover:text-slate-600 uppercase">{color}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Objects Detected */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
          <Maximize2 className="w-4 h-4 mr-2 text-emerald-400" />
          物体目录
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.objects.map((obj, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-indigo-600 shadow-sm shrink-0">
                {obj.count}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 capitalize leading-none mb-1">{obj.name}</h4>
                <p className="text-sm text-slate-500 leading-tight">{obj.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tags Section */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
          <Tag className="w-4 h-4 mr-2 text-amber-400" />
          概念标签
        </h3>
        <div className="flex flex-wrap gap-2">
          {result.tags.map((tag, idx) => (
            <span 
              key={idx} 
              className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-colors cursor-default"
            >
              #{tag}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResultDashboard;
