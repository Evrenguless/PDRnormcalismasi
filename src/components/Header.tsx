import React from 'react';
import { FileText, Sliders, MapPin, Sparkles, School, Code2 } from 'lucide-react';

export type NavTab = 'overview' | 'map' | 'rural' | 'simulator' | 'code' | 'schools' | 'report';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenReport }) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('overview');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap"
          >
            MEB PDR Norm & İhtiyaç Analitik Platformu
          </a>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Genel Bakış
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'map'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            81 İl & Harita
          </button>
          <button
            onClick={() => setActiveTab('rural')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'rural'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Köy Okulları
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ağırlıklı Simülasyon
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'code'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            R & Python Modelleri
          </button>
          <button
            onClick={() => setActiveTab('schools')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'schools'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Okul Veri Bankası
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`transition-colors whitespace-nowrap px-2.5 py-1 rounded-md text-xs font-bold ${
              activeTab === 'report'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            Resmî Sunum Raporu
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('report')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Rapor Çıktısı Al (PDF)</span>
          </button>
        </div>
      </div>
      
      {/* Mobile subnavigation bar */}
      <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 bg-slate-50 border-t border-slate-200 gap-4 text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('overview')}
          className={activeTab === 'overview' ? 'text-indigo-600 font-semibold whitespace-nowrap' : 'whitespace-nowrap'}
        >
          Genel Bakış
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={activeTab === 'map' ? 'text-indigo-600 font-semibold whitespace-nowrap' : 'whitespace-nowrap'}
        >
          81 İl & Harita
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={activeTab === 'report' ? 'text-indigo-600 font-bold whitespace-nowrap' : 'text-indigo-700 whitespace-nowrap'}
        >
          Resmî Rapor
        </button>
        <button
          onClick={() => setActiveTab('rural')}
          className={activeTab === 'rural' ? 'text-indigo-600 font-semibold whitespace-nowrap' : 'whitespace-nowrap'}
        >
          Köy Okulları
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={activeTab === 'simulator' ? 'text-indigo-600 font-semibold whitespace-nowrap' : 'whitespace-nowrap'}
        >
          Simülasyon
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={activeTab === 'code' ? 'text-indigo-600 font-semibold whitespace-nowrap' : 'whitespace-nowrap'}
        >
          R & Python
        </button>
        <button
          onClick={() => setActiveTab('schools')}
          className={activeTab === 'schools' ? 'text-indigo-600 font-semibold whitespace-nowrap' : 'whitespace-nowrap'}
        >
          Okul Listesi
        </button>
      </div>
    </header>
  );
};
