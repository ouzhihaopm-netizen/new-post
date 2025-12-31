
import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  ArrowLeft,
  Info,
  Sparkles,
  Layers,
  UploadCloud,
  X,
  Heart,
  MessageCircle,
  Share2,
  Bookmark
} from 'lucide-react';
import { analyzeGallery } from './geminiService';
import { ImageItem, GalleryAnalysis, Connection } from './types';
import LoadingScreen from './components/LoadingScreen';

const App: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>(Array.from({ length: 9 }, (_, i) => ({
    id: `slot-${i}`,
    file: null,
    previewUrl: null,
    base64: null,
  })));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<GalleryAnalysis | null>(null);
  const [selectedConn, setSelectedConn] = useState<Connection | null>(null);
  const bulkInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File): Promise<{base64: string, previewUrl: string}> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          base64: (reader.result as string).split(',')[1],
          previewUrl: URL.createObjectURL(file)
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileList = Array.from(files).slice(0, 9);
    const updatedImages = [...images];

    for (let i = 0; i < fileList.length; i++) {
      const { base64, previewUrl } = await processFile(fileList[i]);
      updatedImages[i] = {
        ...updatedImages[i],
        file: fileList[i],
        previewUrl,
        base64,
      };
    }
    setImages(updatedImages);
    if (bulkInputRef.current) bulkInputRef.current.value = '';
  };

  const handleSingleFileChange = async (index: number, file: File) => {
    const { base64, previewUrl } = await processFile(file);
    const newImages = [...images];
    newImages[index] = {
      ...newImages[index],
      file,
      previewUrl,
      base64,
    };
    setImages(newImages);
  };

  const clearSlot = (index: number) => {
    const newImages = [...images];
    newImages[index] = { id: `slot-${index}`, file: null, previewUrl: null, base64: null };
    setImages(newImages);
  };

  const clearAll = () => {
    setImages(Array.from({ length: 9 }, (_, i) => ({
      id: `slot-${i}`,
      file: null,
      previewUrl: null,
      base64: null,
    })));
  };

  const runAnalysis = async () => {
    const uploaded = images.filter(img => img.base64);
    if (uploaded.length < 2) {
      alert("亲，至少上传两张照片才能开启奇妙关联之旅哦！✨");
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await analyzeGallery(uploaded);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      alert("哎呀，服务器走丢了，请重新尝试一下吧～");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setAnalysis(null);
    setSelectedConn(null);
  };

  if (isAnalyzing) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-rose-500/30">
      {/* Header */}
      <header className="p-5 flex items-center justify-between border-b border-white/5 sticky top-0 bg-[#050505]/90 backdrop-blur-xl z-40">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-rose-500 to-orange-400 p-2 rounded-2xl shadow-lg shadow-rose-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight italic">LensLink <span className="text-rose-500 not-italic font-medium ml-1">影迹联动</span></h1>
        </div>
        {analysis && (
          <button onClick={reset} className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-90">
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {!analysis ? (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-500">
                定格瞬间，串联美好
              </h2>
              <p className="text-slate-400 font-medium">✨ 姐妹们，快来上传你的 9 宫格，开启 AI 电影级叙事分析 ✨</p>
            </div>

            {/* Batch Upload Area */}
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={() => bulkInputRef.current?.click()}
                className="group relative flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-rose-600 to-rose-500 rounded-[2rem] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-rose-600/30 overflow-hidden"
              >
                <UploadCloud className="w-6 h-6 text-white" />
                <span className="font-bold text-lg">一键导入 9 宫格素材</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  ref={bulkInputRef}
                  onChange={handleBatchUpload}
                />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </button>
              
              {images.some(i => i.base64) && (
                <button 
                  onClick={clearAll}
                  className="px-6 py-2 text-slate-500 hover:text-white transition-colors text-sm font-bold flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>重置所有格子</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-4 aspect-square max-w-xl mx-auto bg-white/5 p-4 rounded-[2.5rem] border border-white/5">
              {images.map((img, idx) => (
                <div key={img.id} className="relative group aspect-square">
                  {img.previewUrl ? (
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl transition-all group-hover:ring-4 ring-rose-500/50">
                      <img src={img.previewUrl} className="w-full h-full object-cover" alt="Upload Preview" />
                      <button 
                        onClick={() => clearSlot(idx)}
                        className="absolute top-1 right-1 p-1 bg-black/60 backdrop-blur-sm rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-white/10 rounded-2xl hover:border-rose-500/50 hover:bg-rose-500/5 cursor-pointer transition-all bg-white/[0.02]">
                      <Plus className="w-5 h-5 text-slate-600" />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => e.target.files?.[0] && handleSingleFileChange(idx, e.target.files[0])} 
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={runAnalysis}
              disabled={images.filter(i => i.base64).length < 2}
              className="w-full py-6 bg-white text-black hover:bg-slate-100 disabled:bg-slate-800 disabled:text-slate-500 rounded-3xl font-black text-xl shadow-2xl transition-all flex items-center justify-center space-x-3 active:scale-[0.98]"
            >
              <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
              <span>开始氛围感分析 ✨</span>
            </button>
          </div>
        ) : (
          <div className="relative space-y-6 animate-in zoom-in-95 duration-700">
            {/* Main Image View */}
            <div className="space-y-6">
              <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10">
                <img 
                  src={images[analysis.mainPhotoIndex].previewUrl!} 
                  className="w-full h-auto max-h-[75vh] object-contain mx-auto" 
                  alt="Main Post" 
                />
                
                {/* Red Hotspots */}
                {analysis.connections.map((conn, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedConn(conn)}
                    style={{ top: `${conn.y}%`, left: `${conn.x}%` }}
                    className={`absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group/dot z-10 transition-transform active:scale-75`}
                  >
                    <span className="absolute inset-0 bg-red-600/40 rounded-full animate-ping"></span>
                    <span className="relative w-4 h-4 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.9)] border-2 border-white transition-transform group-hover/dot:scale-150"></span>
                  </button>
                ))}
              </div>

              {/* XiaoHongShu Style Post Body */}
              <div className="bg-white text-black p-8 rounded-[2.5rem] shadow-2xl space-y-6 transform translate-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 border-2 border-white"></div>
                    <div>
                      <h4 className="font-black text-sm">LensLink AI 博主</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Pro Analyzer</p>
                    </div>
                  </div>
                  <button className="px-5 py-1.5 bg-rose-500 text-white rounded-full text-xs font-black">关注</button>
                </div>
                
                <div className="space-y-4">
                  <p className="text-lg md:text-xl font-medium leading-relaxed whitespace-pre-wrap">
                    {analysis.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-slate-400">
                  <div className="flex items-center space-x-6">
                    <div className="flex flex-col items-center space-y-1 cursor-pointer hover:text-rose-500">
                      <Heart className="w-6 h-6" />
                      <span className="text-[10px] font-bold">12k</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1 cursor-pointer hover:text-indigo-500">
                      <MessageCircle className="w-6 h-6" />
                      <span className="text-[10px] font-bold">856</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1 cursor-pointer hover:text-orange-500">
                      <Bookmark className="w-6 h-6" />
                      <span className="text-[10px] font-bold">4k</span>
                    </div>
                  </div>
                  <Share2 className="w-6 h-6 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Connection Detail Drawer (Subject-Focused) */}
            {selectedConn && (
              <div className="fixed inset-x-0 bottom-0 z-50 p-4 animate-in slide-in-from-bottom-full duration-500">
                <div className="max-w-3xl mx-auto bg-white rounded-[3rem] shadow-[0_20px_100px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-black/5">
                  <div className="flex flex-col md:flex-row">
                    {/* Focal-point centering logic: use object-position based on AI focusX/focusY */}
                    <div className="w-full md:w-1/2 h-80 md:h-[450px] overflow-hidden bg-slate-100 relative">
                      <img 
                        src={images[selectedConn.targetIndex].previewUrl!} 
                        className="w-full h-full object-cover transition-all duration-1000 ease-out" 
                        style={{ objectPosition: `${selectedConn.focusX}% ${selectedConn.focusY}%` }}
                        alt="Subject Focus"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black text-white flex items-center space-x-2">
                         <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                         <span>{selectedConn.relationship}</span>
                      </div>
                    </div>
                    
                    <div className="p-10 md:w-1/2 space-y-6 flex flex-col justify-center text-black">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-rose-500">
                           <Heart className="w-5 h-5 fill-rose-500" />
                           <span className="font-black text-sm uppercase tracking-widest">Detail Insight</span>
                        </div>
                        <button 
                          onClick={() => setSelectedConn(null)} 
                          className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-black transition-colors"
                        >
                          <Plus className="w-6 h-6 rotate-45" />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-2xl font-black italic tracking-tighter text-slate-900 leading-none">
                          氛围感笔记 ✨
                        </h3>
                        <p className="text-slate-600 text-lg leading-relaxed font-medium">
                          {selectedConn.interpretation}
                        </p>
                      </div>

                      <button 
                        onClick={() => setSelectedConn(null)}
                        className="w-full py-4 bg-slate-950 text-white rounded-2xl font-bold hover:bg-rose-600 transition-colors mt-4"
                      >
                        知道啦，绝绝子！
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center text-slate-600 text-xs py-8 flex flex-col items-center gap-2">
              <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                 <span className="font-bold">点击主图上的【红色红点】探索更多氛围感细节</span>
              </div>
              <p className="opacity-50">LensLink v2.0 • 记录生活中的每一份热爱</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
