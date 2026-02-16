import { useEffect, useState } from "react";
import { TrendingUp} from "lucide-react";

const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());
useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
     <header className="w-full border-b border-slate-200 bg-slate-950 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg">
            <TrendingUp size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white">
              Auto-Moving Stock Market
            </h1>
            <p className="text-xs text-slate-100">
              Trading Simulator
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm">

          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-white font-medium">
              Market Open
            </span>
          </div>
          <div className="text-white font-mono">
            {time.toLocaleTimeString()}
          </div>
        </div>
        </div>
    </header>
  );
};

export default Header;
