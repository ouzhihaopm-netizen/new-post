
import React, { useState, useEffect } from 'react';
import { Network, Sparkles, Binary } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "解析多维影像矩阵...",
    "对比特征提取点...",
    "建立视觉突触连接...",
    "计算空间映射坐标...",
    "编撰影像叙事文本...",
    "即将揭示核心关联..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-8 text-center space-y-12">
      <div className="relative">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute top-0 -left-10 w-40 h-40 bg-purple-600/10 rounded-full blur-[80px] animate-bounce"></div>
        
        {/* Central Animation */}
        <div className="relative flex items-center justify-center">
          <div className="w-32 h-32 bg-slate-900 rounded-[2.5rem] shadow-2xl flex items-center justify-center border border-white/10 relative overflow-hidden">
            <Network className="w-16 h-16 text-indigo-400 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-shimmer"></div>
          </div>
          
          {/* Orbiting Elements */}
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i}
              className="absolute w-4 h-4 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.8)]"
              style={{
                animation: `orbit 4s linear infinite`,
                animationDelay: `${i * -1}s`,
                transformOrigin: '100px'
              }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-6 max-w-sm">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            影迹神经网络生成中
          </h3>
          <p className="text-indigo-400 font-medium tracking-wide h-6">
            {steps[step]}
          </p>
        </div>
        
        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center px-2">
          <div className="flex items-center space-x-2 text-slate-500">
            <Binary className="w-4 h-4" />
            <span className="text-[10px] font-mono">NEURAL_SYNC_ACTIVE</span>
          </div>
          <Sparkles className="w-4 h-4 text-slate-700 animate-spin-slow" />
        </div>
      </div>

      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(200%) rotate(45deg); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
