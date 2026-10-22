import React from 'react';
import { LayoutGrid, List, Image as ImageIcon, Search, X } from 'lucide-react';
import { BlogCategory, ViewMode, SortOption } from '../types/blog';

interface CategoryNavProps {
  categories: BlogCategory[];
  activeCategory: BlogCategory;
  onSelectCategory: (cat: BlogCategory) => void;
  viewMode: ViewMode;
  onSelectViewMode: (mode: ViewMode) => void;
  sortOption: SortOption;
  onSelectSort: (sort: SortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  viewMode,
  onSelectViewMode,
  sortOption,
  onSelectSort,
  searchQuery,
  onSearchChange,
  totalCount,
}) => {
  return (
    <div className="bg-white border-b border-stone-200 py-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-4">
        {/* Category Horizontal Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search, Count, View Mode & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-stone-100">
          {/* Post count & Search input */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <span className="text-xs text-stone-500 font-medium whitespace-nowrap">
              총 <span className="font-bold text-stone-900 tabular-nums">{totalCount}</span>개의 포스트
            </span>

            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="제목, 작성자, 태그 검색..."
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#03C75A] focus:ring-1 focus:ring-[#03C75A]"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* View Mode & Sort Switcher */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Sort Dropdown / Segmented */}
            <div className="flex items-center gap-1 text-xs text-stone-500">
              <button
                onClick={() => onSelectSort('latest')}
                className={`px-2 py-1 transition-colors ${
                  sortOption === 'latest' ? 'text-stone-900 font-bold' : 'hover:text-stone-800'
                }`}
              >
                최신순
              </button>
              <span className="text-stone-300">·</span>
              <button
                onClick={() => onSelectSort('views')}
                className={`px-2 py-1 transition-colors ${
                  sortOption === 'views' ? 'text-stone-900 font-bold' : 'hover:text-stone-800'
                }`}
              >
                조회순
              </button>
              <span className="text-stone-300">·</span>
              <button
                onClick={() => onSelectSort('likes')}
                className={`px-2 py-1 transition-colors ${
                  sortOption === 'likes' ? 'text-stone-900 font-bold' : 'hover:text-stone-800'
                }`}
              >
                공감순
              </button>
            </div>

            {/* View Mode Icons */}
            <div className="flex items-center p-0.5 bg-stone-100 rounded-lg border border-stone-200">
              <button
                onClick={() => onSelectViewMode('card')}
                title="카드형 뷰"
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'card' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onSelectViewMode('list')}
                title="리스트형 뷰"
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onSelectViewMode('album')}
                title="앨범(포토)형 뷰"
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'album' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
