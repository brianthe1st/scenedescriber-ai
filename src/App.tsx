import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, PlayCircle, History, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { VideoUploader } from './components/VideoUploader';
import { describeVideo } from './services/gemini';

export default function App() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVideoSelect = (file: File) => {
    setVideoFile(file);
    setDescription(null);
    setError(null);
  };

  const handleClear = () => {
    setVideoFile(null);
    setDescription(null);
    setError(null);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyze = async () => {
    if (!videoFile) return;

    setIsAnalyzing(true);
    setError(null);
    setDescription(null);

    try {
      const base64 = await fileToBase64(videoFile);
      const result = await describeVideo(base64, videoFile.type);
      setDescription(result || "No description generated.");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze video. Please try a smaller file or different format.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-1.5 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">SceneDescriber AI</h1>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-zinc-500">
            <a href="#" className="hover:text-zinc-900 transition-colors">How it works</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:py-12">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight mb-4"
          >
            Understand every <span className="text-brand-600">scene</span>.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 max-w-2xl mx-auto"
          >
            Upload your video and let our AI provide a clear, detailed, scene-by-scene description of everything that happens.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Upload & Controls */}
          <div className="lg:col-span-7 space-y-6">
            <VideoUploader 
              onVideoSelect={handleVideoSelect} 
              onClear={handleClear}
              selectedFile={videoFile}
            />

            {videoFile && !description && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <button
                  onClick={handleAnalyze}
                  className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3"
                >
                  <PlayCircle className="w-6 h-6" />
                  Describe Video
                </button>
              </motion.div>
            )}

            {isAnalyzing && (
              <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center space-y-4">
                <div className="flex justify-center">
                  <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">Analyzing your video...</h3>
                  <p className="text-zinc-500 text-sm max-w-xs mx-auto mt-1">
                    This may take a minute depending on the video length. We're processing each scene carefully.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-700"
              >
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Analysis failed</p>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm min-h-[400px] flex flex-col">
              <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-semibold text-zinc-700 uppercase tracking-wider">Description</span>
                </div>
                {description && (
                  <span className="text-[10px] bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-bold">AI GENERATED</span>
                )}
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {description ? (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="markdown-body"
                    >
                      <ReactMarkdown>{description}</ReactMarkdown>
                    </motion.div>
                  ) : !isAnalyzing ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12"
                    >
                      <div className="bg-zinc-100 p-4 rounded-full">
                        <Info className="w-8 h-8 text-zinc-300" />
                      </div>
                      <div>
                        <p className="text-zinc-400 font-medium">No analysis yet</p>
                        <p className="text-zinc-400 text-sm max-w-[200px] mx-auto">
                          Upload a video and click "Describe Video" to see the results here.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-4 bg-zinc-100 rounded w-3/4"></div>
                      <div className="h-4 bg-zinc-100 rounded w-full"></div>
                      <div className="h-4 bg-zinc-100 rounded w-5/6"></div>
                      <div className="h-24 bg-zinc-50 rounded w-full mt-8"></div>
                      <div className="h-4 bg-zinc-100 rounded w-2/3"></div>
                      <div className="h-4 bg-zinc-100 rounded w-full"></div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-zinc-200 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-zinc-400 text-sm">
            Powered by Gemini 3.1 Flash. Designed for clear video understanding.
          </p>
        </div>
      </footer>
    </div>
  );
}

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
