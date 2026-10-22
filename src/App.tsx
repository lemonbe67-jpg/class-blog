/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { BlogPost, BlogCategory, ViewMode, SortOption, Comment } from './types/blog';
import {
  getStoredPosts,
  saveStoredPosts,
  resetToInitialPosts,
  getActiveUser,
  saveActiveUser,
  CurrentUser,
  PRESET_USERS,
} from './utils/storage';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { PostCard } from './components/PostCard';
import { PostListItem } from './components/PostListItem';
import { PostAlbumItem } from './components/PostAlbumItem';
import { PostDetail } from './components/PostDetail';
import { PostEditor } from './components/PostEditor';
import { Toast, ToastMessage } from './components/Toast';
import { PenSquare, RotateCcw, Sparkles } from 'lucide-react';

const CATEGORIES: BlogCategory[] = [
  '전체',
  '일상',
  '독서',
  '국어',
  '사회/도덕',
  '미술/음악',
  '과학/실과',
];

export default function App() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser>(getActiveUser());
  const [activeCategory, setActiveCategory] = useState<BlogCategory>('전체');
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Track posts viewed in this session to prevent duplicate count increment
  const [viewedPostIds, setViewedPostIds] = useState<Set<string>>(new Set());

  // Load posts on initial mount
  useEffect(() => {
    const loaded = getStoredPosts();
    setPosts(loaded);
  }, []);

  // Sync posts to localStorage
  const updatePosts = (newPosts: BlogPost[]) => {
    setPosts(newPosts);
    saveStoredPosts(newPosts);
  };

  // Toast dispatch
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // User Switch
  const handleSelectUser = (user: CurrentUser) => {
    setCurrentUser(user);
    saveActiveUser(user);
    showToast(`작성자가 '${user.name}'(으)로 변경되었습니다.`, 'info');
  };

  // Open Post Detail
  const handleOpenPost = (post: BlogPost) => {
    setSelectedPostId(post.id);

    // Increment view count if not yet viewed in this session
    if (!viewedPostIds.has(post.id)) {
      const updated = posts.map((p) =>
        p.id === post.id ? { ...p, views: p.views + 1 } : p
      );
      updatePosts(updated);
      setViewedPostIds((prev) => new Set(prev).add(post.id));
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Like Toggle
  const handleLikeToggle = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const updated = posts.map((p) => {
      if (p.id === postId) {
        const nextLiked = !p.isLiked;
        return {
          ...p,
          isLiked: nextLiked,
          likes: nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
        };
      }
      return p;
    });

    updatePosts(updated);
    const target = updated.find((p) => p.id === postId);
    if (target?.isLiked) {
      showToast('이 글에 공감(좋아요)을 남겼습니다.', 'success');
    }
  };

  // Save new or edited post
  const handleSavePost = (savedPost: BlogPost) => {
    const exists = posts.some((p) => p.id === savedPost.id);
    let updated: BlogPost[];
    if (exists) {
      updated = posts.map((p) => (p.id === savedPost.id ? savedPost : p));
      showToast('글이 성공적으로 수정되었습니다.', 'success');
    } else {
      updated = [savedPost, ...posts];
      showToast('새 글이 성공적으로 등록되었습니다!', 'success');
    }

    updatePosts(updated);
    setIsEditorOpen(false);
    setEditingPost(null);
    setSelectedPostId(savedPost.id);
  };

  // Delete Post
  const handleDeletePost = (postId: string) => {
    const updated = posts.filter((p) => p.id !== postId);
    updatePosts(updated);
    if (selectedPostId === postId) {
      setSelectedPostId(null);
    }
    showToast('글이 삭제되었습니다.', 'info');
  };

  // Edit Post Trigger
  const handleStartEdit = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditorOpen(true);
  };

  // Comments
  const handleAddComment = (
    postId: string,
    commentData: Omit<Comment, 'id' | 'createdAt'>
  ) => {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      createdAt: formatted,
      ...commentData,
    };

    const updated = posts.map((p) =>
      p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
    );
    updatePosts(updated);
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    const updated = posts.map((p) =>
      p.id === postId
        ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) }
        : p
    );
    updatePosts(updated);
    showToast('댓글을 삭제했습니다.', 'info');
  };

  // Reset to initial demo posts
  const handleResetData = () => {
    if (confirm('모든 글을 네이버 블로그 초기 데모 글 세트로 복원하시겠습니까?')) {
      const reset = resetToInitialPosts();
      setPosts(reset);
      setSelectedPostId(null);
      showToast('데모 데이터가 초기화되었습니다.', 'success');
    }
  };

  // Filtering & Sorting
  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        // Category filter
        if (activeCategory !== '전체' && post.category !== activeCategory) {
          return false;
        }

        // Tab filter
        if (activeTab === 'popular' && post.likes < 90 && post.views < 500) {
          return false;
        }
        if (activeTab === 'my' && post.author !== currentUser.name) {
          return false;
        }

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = post.title.toLowerCase().includes(q);
          const matchAuthor = post.author.toLowerCase().includes(q);
          const matchSummary = post.summary.toLowerCase().includes(q);
          const matchTags = post.tags.some((t) => t.toLowerCase().includes(q));
          return matchTitle || matchAuthor || matchSummary || matchTags;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'views') return b.views - a.views;
        if (sortOption === 'likes') return b.likes - a.likes;
        if (sortOption === 'comments') return b.comments.length - a.comments.length;
        // default latest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [posts, activeCategory, activeTab, searchQuery, sortOption, currentUser.name]);

  const selectedPost = posts.find((p) => p.id === selectedPostId);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-stone-900">
      {/* Top Navigation */}
      <Header
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        onOpenEditor={() => {
          setEditingPost(null);
          setIsEditorOpen(true);
        }}
        onGoHome={() => setSelectedPostId(null)}
        onResetData={handleResetData}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Area */}
      {selectedPost ? (
        /* DETAIL VIEW */
        <main className="flex-1">
          <PostDetail
            post={selectedPost}
            currentUser={currentUser}
            allPosts={posts}
            onBack={() => setSelectedPostId(null)}
            onEdit={handleStartEdit}
            onDelete={handleDeletePost}
            onLikeToggle={handleLikeToggle}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            onNavigatePost={handleOpenPost}
            onShowToast={showToast}
          />
        </main>
      ) : (
        /* LIST / GRID VIEW */
        <main className="flex-1">
          {/* Blog Banner Marquee */}
          <section className="bg-white border-b border-stone-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[#03C75A] tracking-wider uppercase">
                    NAVER BLOG COMMUNITY
                  </span>
                  <span className="text-stone-300">·</span>
                  <span className="text-xs text-stone-500">다중 사용자 게시판</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                  생각과 일상이 머무는 공간
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 mt-1.5 max-w-xl">
                  누구나 자유롭게 글과 사진, 영상을 기록하고 공감과 댓글로 이웃들과 소통할 수 있는 열린 블로그 플랫폼입니다.
                </p>
              </div>

              {/* Quick Author Profile Widget */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex items-center gap-3 w-full md:w-auto shrink-0 shadow-xs">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full object-cover bg-white ring-2 ring-stone-200"
                />
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-stone-800 truncate">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] bg-[#03C75A]/15 text-[#03C75A] font-semibold px-1.5 py-0.2 rounded">
                      접속중
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 truncate max-w-[180px]">
                    {currentUser.bio}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingPost(null);
                    setIsEditorOpen(true);
                  }}
                  className="ml-auto p-2 bg-[#03C75A] hover:bg-[#02b350] text-white rounded-lg transition-transform active:scale-95 shrink-0"
                  title="새 글 작성"
                >
                  <PenSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Category Bar & Filter Controls */}
          <CategoryNav
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            viewMode={viewMode}
            onSelectViewMode={setViewMode}
            sortOption={sortOption}
            onSelectSort={setSortOption}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalCount={filteredPosts.length}
          />

          {/* Posts Container */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {filteredPosts.length === 0 ? (
              /* Empty state */
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
                  <Sparkles className="w-6 h-6 text-stone-400" />
                </div>
                <h3 className="font-bold text-stone-900 text-base mb-1">
                  조건에 맞는 글이 없습니다.
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 mb-6">
                  {searchQuery
                    ? `'${searchQuery}' 검색 결과가 없습니다. 다른 검색어를 입력해보세요.`
                    : '등록된 게시글이 없거나 필터 조건에 부합하는 글이 없습니다.'}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('전체');
                      setActiveTab('all');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                  >
                    필터 초기화
                  </button>
                  <button
                    onClick={() => {
                      setEditingPost(null);
                      setIsEditorOpen(true);
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#03C75A] hover:bg-[#02b350] rounded-lg transition-colors cursor-pointer"
                  >
                    첫 글 작성하기
                  </button>
                </div>
              </div>
            ) : viewMode === 'card' ? (
              /* Card Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onClick={() => handleOpenPost(post)}
                    onLikeToggle={(e) => handleLikeToggle(post.id, e)}
                  />
                ))}
              </div>
            ) : viewMode === 'list' ? (
              /* Compact List */
              <div className="flex flex-col gap-4">
                {filteredPosts.map((post) => (
                  <PostListItem
                    key={post.id}
                    post={post}
                    onClick={() => handleOpenPost(post)}
                    onLikeToggle={(e) => handleLikeToggle(post.id, e)}
                  />
                ))}
              </div>
            ) : (
              /* Album / Photo Grid */
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredPosts.map((post) => (
                  <PostAlbumItem
                    key={post.id}
                    post={post}
                    onClick={() => handleOpenPost(post)}
                    onLikeToggle={(e) => handleLikeToggle(post.id, e)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {/* Editor Modal */}
      {isEditorOpen && (
        <PostEditor
          initialPost={editingPost}
          currentUser={currentUser}
          onSave={handleSavePost}
          onCancel={() => {
            setIsEditorOpen(false);
            setEditingPost(null);
          }}
        />
      )}

      {/* Toast notifications */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 text-xs text-stone-500 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">우리 반 블로그</span>
            <span className="text-stone-300">·</span>
            <span>다중 사용자 게시판</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <span>로컬 스토리지 자동 저장</span>
            <span>·</span>
            <button
              onClick={handleResetData}
              className="hover:text-stone-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>데모 데이터 복원</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
