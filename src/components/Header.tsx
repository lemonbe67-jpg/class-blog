import React, { useState } from 'react';
import { PenSquare, User, RotateCcw, ChevronDown } from 'lucide-react';
import { CurrentUser, PRESET_USERS } from '../utils/storage';

interface HeaderProps {
  currentUser: CurrentUser;
  onSelectUser: (user: CurrentUser) => void;
  onOpenEditor: () => void;
  onGoHome: () => void;
  onResetData: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSelectUser,
  onOpenEditor,
  onGoHome,
  onResetData,
  activeTab,
  onSelectTab,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

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
            className={`whitespace-nowrap transition-colors hover:text-stone-900 ${
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
            className={`whitespace-nowrap transition-colors hover:text-stone-900 ${
              activeTab === 'popular' ? 'text-stone-900 font-semibold border-b-2 border-[#03C75A] pb-0.5' : ''
            }`}
          >
            인기글
          </button>
          <button
            onClick={() => {
              onGoHome();
              onSelectTab('my');
            }}
            className={`whitespace-nowrap transition-colors hover:text-stone-900 ${
              activeTab === 'my' ? 'text-stone-900 font-semibold border-b-2 border-[#03C75A] pb-0.5' : ''
            }`}
          >
            내 글 모아보기
          </button>
          <button
            onClick={onResetData}
            title="초기 데모 글 데이터로 리셋"
            className="whitespace-nowrap text-xs text-stone-400 hover:text-stone-700 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>데모 초기화</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Multi-User Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          {/* User selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 py-1 px-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors text-xs font-medium text-stone-700 cursor-pointer"
              title="작성자 계정 변경"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover bg-stone-100"
              />
              <span className="hidden sm:inline max-w-[90px] truncate">{currentUser.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-stone-100">
                  <p className="text-xs text-stone-400 font-medium">현재 작성자 프로필</p>
                  <p className="text-sm font-semibold text-stone-900 truncate">{currentUser.name}</p>
                  <p className="text-xs text-stone-500 truncate">{currentUser.bio}</p>
                </div>
                <div className="py-1">
                  <p className="px-3 py-1 text-[11px] font-semibold text-stone-400">작성자 전환 (다중 사용자)</p>
                  {PRESET_USERS.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        onSelectUser(user);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-stone-50 transition-colors ${
                        user.id === currentUser.id ? 'bg-[#03C75A]/10 text-[#03C75A] font-semibold' : 'text-stone-700'
                      }`}
                    >
                      <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{user.name}</p>
                        <p className="text-[10px] text-stone-400 truncate">{user.bio}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

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
