import React from 'react';
import { PenSquare, RotateCcw } from 'lucide-react';
import { CurrentUser } from '../utils/storage';

interface HeaderProps {
  currentUser?: CurrentUser;
  onSelectUser?: (user: CurrentUser) => void;
  onOpenEditor: () => void;
  onGoHome: () => void;
  onResetData: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenEditor,
  onGoHome,
  onResetData,
  activeTab,
  onSelectTab,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onGoHome}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
          >
            <span className="bg-[#03C75A] text-white font-extrabold text-sm px-2 py-0.5 rounded tracking-tighter">
              BLOG
            </span>
            <span className="font-bold text-lg text-stone-900 group-hover:text-[#03C75A] transition-colors whitespace-nowrap">
              우리 반 블로그
            </span>
          </button>
        </div>

        {/* Zone 2: Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => {
              onGoHome();
              onSelectTab('all');
            }}
            className={`whitespace-nowrap transition-colors hover:text-stone-900 cursor-pointer ${
              activeTab === 'all' ? 'text-stone-900 font-semibold border-b-2 border-[#03C75A] pb-0.5' : ''
            }`}
          >
            전체글
          </button>
          <button
            onClick={() => {
              onGoHome();
              onSelectTab('popular');
            }}
            className={`whitespace-nowrap transition-colors hover:text-stone-900 cursor-pointer ${
              activeTab === 'popular' ? 'text-stone-900 font-semibold border-b-2 border-[#03C75A] pb-0.5' : ''
            }`}
          >
            인기글
          </button>
          <button
            onClick={onResetData}
            title="초기 데모 글 데이터로 리셋"
            className="whitespace-nowrap text-xs text-stone-400 hover:text-stone-700 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>데모 초기화</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Primary Action Button */}
          <button
            onClick={onOpenEditor}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#03C75A] hover:bg-[#02b350] rounded-lg shadow-sm transition-all active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <PenSquare className="w-4 h-4" />
            <span>글쓰기</span>
          </button>
        </div>
      </div>
    </header>
  );
};

