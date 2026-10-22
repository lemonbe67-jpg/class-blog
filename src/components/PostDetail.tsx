import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  Share2,
  Edit3,
  Trash2,
  Eye,
  UserPlus,
  UserCheck,
  Lock,
  Send,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  Maximize2,
} from 'lucide-react';
import { BlogPost, Comment } from '../types/blog';
import { CurrentUser } from '../utils/storage';

interface PostDetailProps {
  post: BlogPost;
  currentUser: CurrentUser;
  allPosts: BlogPost[];
  onBack: () => void;
  onEdit: (post: BlogPost) => void;
  onDelete: (postId: string) => void;
  onLikeToggle: (postId: string) => void;
  onAddComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onNavigatePost: (post: BlogPost) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const PostDetail: React.FC<PostDetailProps> = ({
  post,
  currentUser,
  allPosts,
  onBack,
  onEdit,
  onDelete,
  onLikeToggle,
  onAddComment,
  onDeleteComment,
  onNavigatePost,
  onShowToast,
}) => {
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState(currentUser.name);
  const [isSecret, setIsSecret] = useState(false);
  const [isNeighbor, setIsNeighbor] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Find previous & next posts in allPosts
  const currentIndex = allPosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onShowToast('게시글 링크가 클립보드에 복사되었습니다!', 'success');
    } else {
      onShowToast('링크를 복사했습니다.', 'info');
    }
  };

  const handleNeighborToggle = () => {
    setIsNeighbor(!isNeighbor);
    onShowToast(
      !isNeighbor
        ? `'${post.author}'님을 이웃으로 추가했습니다.`
        : `'${post.author}'님 이웃을 취소했습니다.`,
      'info'
    );
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onAddComment(post.id, {
      author: commentAuthor.trim() || currentUser.name,
      authorAvatar: currentUser.avatar,
      content: commentText.trim(),
      isSecret,
    });

    setCommentText('');
    onShowToast('댓글이 등록되었습니다.', 'success');
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>목록으로 돌아가기</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            title="공유하기"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(post)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>수정</span>
          </button>
          <button
            onClick={() => {
              if (confirm('정말로 이 글을 삭제하시겠습니까?')) {
                onDelete(post.id);
              }
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>삭제</span>
          </button>
        </div>
      </div>

      {/* Post Article Container */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 sm:p-10 lg:p-14 mb-8">
        {/* Article Header */}
        <header className="border-b border-stone-100 pb-8 mb-8 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
            <span className="text-xs font-bold text-[#03C75A] tracking-wide">
              {post.category}
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-400">{post.readTimeMinutes}분 분량</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 leading-snug mb-6">
            {post.title}
          </h1>

          {/* Author Card Info */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-50">
            <div className="flex items-center gap-3">
              <img
                src={post.authorAvatar}
                alt={post.author}
                className="w-10 h-10 rounded-full object-cover bg-stone-100 ring-2 ring-stone-100"
              />
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 text-sm">{post.author}</span>
                  <button
                    onClick={handleNeighborToggle}
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 transition-all cursor-pointer ${
                      isNeighbor
                        ? 'bg-stone-100 text-stone-600'
                        : 'bg-[#03C75A]/10 text-[#03C75A] hover:bg-[#03C75A]/20'
                    }`}
                  >
                    {isNeighbor ? (
                      <>
                        <UserCheck className="w-3 h-3" />
                        <span>이웃</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3 h-3" />
                        <span>+ 이웃추가</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-0.5">
                  <span>{post.createdAt}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>조회 {post.views}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* URL copy indicator */}
            <button
              onClick={handleShare}
              className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 bg-stone-50 hover:bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors"
            >
              <span>URL 복사</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="space-y-8 leading-loose text-stone-800 text-base sm:text-lg">
          {post.blocks.map((block) => (
            <div key={block.id}>
              {/* TEXT BLOCK */}
              {block.type === 'text' && (
                <p
                  style={{
                    textAlign: block.align || 'left',
                    color: block.color || '#1C1917',
                    backgroundColor: block.bgColor === 'transparent' ? 'transparent' : block.bgColor,
                    fontWeight: block.isBold ? 700 : 400,
                    fontStyle: block.isItalic ? 'italic' : 'normal',
                    textDecoration: `${block.isUnderline ? 'underline' : ''} ${
                      block.isStrikethrough ? 'line-through' : ''
                    }`.trim(),
                  }}
                  className={`whitespace-pre-line leading-relaxed ${
                    block.fontSize === 'title1'
                      ? 'text-2xl sm:text-3xl font-bold my-6 text-stone-900'
                      : block.fontSize === 'title2'
                      ? 'text-xl sm:text-2xl font-bold my-4 text-stone-900'
                      : block.fontSize === 'body1'
                      ? 'text-base sm:text-lg my-3'
                      : block.fontSize === 'body2'
                      ? 'text-sm sm:text-base my-2'
                      : 'text-xs sm:text-sm my-2'
                  }`}
                >
                  {block.text}
                </p>
              )}

              {/* IMAGE BLOCK */}
              {block.type === 'image' && (
                <figure className="my-8 text-center group relative">
                  <div className="relative inline-block overflow-hidden rounded-xl border border-stone-200 shadow-xs max-h-[600px] w-full">
                    <img
                      src={block.imageUrl}
                      alt={block.imageCaption || '본문 이미지'}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-cover max-h-[600px] cursor-zoom-in"
                      onClick={() => setZoomedImage(block.imageUrl || null)}
                    />
                    <button
                      onClick={() => setZoomedImage(block.imageUrl || null)}
                      className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>크게보기</span>
                    </button>
                  </div>
                  {block.imageCaption && (
                    <figcaption className="text-xs sm:text-sm text-stone-500 mt-2.5 font-medium">
                      {block.imageCaption}
                    </figcaption>
                  )}
                </figure>
              )}

              {/* VIDEO BLOCK */}
              {block.type === 'video' && (
                <div className="my-8">
                  <div className="aspect-16/9 w-full rounded-xl overflow-hidden border border-stone-200 bg-black shadow-xs">
                    {block.videoUrl?.includes('youtube.com') ||
                    block.videoUrl?.includes('youtu.be') ? (
                      <iframe
                        src={
                          block.videoUrl.includes('watch?v=')
                            ? block.videoUrl.replace('watch?v=', 'embed/')
                            : block.videoUrl.replace('youtu.be/', 'www.youtube.com/embed/')
                        }
                        title={block.videoTitle || 'YouTube Video'}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white text-sm p-4">
                        <p className="font-semibold">{block.videoTitle || '동영상'}</p>
                        <a
                          href={block.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#03C75A] underline text-xs mt-2"
                        >
                          영상 링크 열기
                        </a>
                      </div>
                    )}
                  </div>
                  {block.videoTitle && (
                    <p className="text-xs sm:text-sm text-stone-500 text-center mt-2 font-medium">
                      {block.videoTitle}
                    </p>
                  )}
                </div>
              )}

              {/* QUOTE BLOCK */}
              {block.type === 'quote' && (
                <div className="my-8">
                  {block.quoteStyle === 'quote' && (
                    <blockquote className="text-center py-6 px-4">
                      <span className="text-4xl text-stone-300 font-serif block leading-none mb-2">
                        “
                      </span>
                      <p className="italic font-medium text-stone-800 text-lg sm:text-xl leading-relaxed">
                        {block.quoteText}
                      </p>
                      <span className="text-4xl text-stone-300 font-serif block leading-none mt-2">
                        ”
                      </span>
                      {block.quoteAuthor && (
                        <cite className="block text-xs sm:text-sm text-stone-500 mt-2 not-italic font-normal">
                          - {block.quoteAuthor}
                        </cite>
                      )}
                    </blockquote>
                  )}

                  {block.quoteStyle === 'line' && (
                    <blockquote className="border-l-4 border-[#03C75A] pl-5 py-3 my-4 bg-stone-50/50 rounded-r-lg">
                      <p className="italic text-stone-800 text-base sm:text-lg leading-relaxed">
                        {block.quoteText}
                      </p>
                      {block.quoteAuthor && (
                        <cite className="block text-xs text-stone-400 mt-2 not-italic">
                          {block.quoteAuthor}
                        </cite>
                      )}
                    </blockquote>
                  )}

                  {block.quoteStyle === 'memo' && (
                    <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-5 shadow-xs">
                      <p className="whitespace-pre-line text-amber-950 text-base leading-relaxed">
                        {block.quoteText}
                      </p>
                      {block.quoteAuthor && (
                        <p className="text-xs text-amber-800/80 mt-3 font-semibold">
                          {block.quoteAuthor}
                        </p>
                      )}
                    </div>
                  )}

                  {block.quoteStyle === 'card' && (
                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm sm:text-base text-stone-800 whitespace-pre-line leading-relaxed">
                      {block.quoteText}
                    </div>
                  )}
                </div>
              )}

              {/* DIVIDER BLOCK */}
              {block.type === 'divider' && (
                <div className="py-6 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-stone-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                  </div>
                </div>
              )}

              {/* CALLOUT BLOCK */}
              {block.type === 'callout' && (
                <div className="my-8 bg-emerald-50/80 border border-emerald-200 rounded-xl p-5 shadow-xs">
                  <h4 className="font-bold text-base text-emerald-900 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#03C75A]" />
                    {block.calloutTitle || '꿀팁'}
                  </h4>
                  <p className="text-sm sm:text-base text-emerald-800 leading-relaxed whitespace-pre-line">
                    {block.calloutText}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-8 mt-8 border-t border-stone-100 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-stone-600 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Naver Blog Sympathy (공감 / 좋아요) Box */}
        <div className="pt-10 mt-10 border-t border-stone-100 flex flex-col items-center justify-center gap-3">
          <button
            onClick={() => onLikeToggle(post.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold border transition-all active:scale-95 cursor-pointer ${
              post.isLiked
                ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-sm'
                : 'bg-white border-stone-300 text-stone-700 hover:border-rose-300 hover:text-rose-600'
            }`}
          >
            <Heart
              className={`w-5 h-5 transition-transform ${
                post.isLiked ? 'fill-current text-rose-500 scale-110' : ''
              }`}
            />
            <span>공감</span>
            <span className="font-extrabold tabular-nums ml-1">{post.likes}</span>
          </button>
          <p className="text-xs text-stone-400">
            {post.isLiked
              ? '이 글에 공감하셨습니다.'
              : '마음에 드셨다면 공감 하트를 눌러주세요!'}
          </p>
        </div>

        {/* Author Footer Profile Card */}
        <div className="mt-12 bg-stone-50 rounded-xl p-6 border border-stone-200 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img
              src={post.authorAvatar}
              alt={post.author}
              className="w-14 h-14 rounded-full object-cover bg-white ring-2 ring-stone-200"
            />
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="font-bold text-stone-900 text-base">{post.author}</h3>
                <span className="text-[11px] font-medium bg-[#03C75A]/10 text-[#03C75A] px-2 py-0.5 rounded">
                  작성자
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md">
                {post.authorBio || '네이버 블로그에서 다양한 일상과 리뷰를 나눕니다.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleNeighborToggle}
            className={`px-4 py-2 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
              isNeighbor
                ? 'bg-stone-200 text-stone-700'
                : 'bg-[#03C75A] text-white hover:bg-[#02b350]'
            }`}
          >
            {isNeighbor ? '이웃 맺음 완료' : '+ 이웃추가'}
          </button>
        </div>
      </div>

      {/* Previous / Next Post Navigator */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {prevPost ? (
          <button
            onClick={() => onNavigatePost(prevPost)}
            className="p-4 bg-white rounded-xl border border-stone-200 hover:border-stone-300 text-left transition-colors flex items-center gap-3 cursor-pointer group"
          >
            <ChevronLeft className="w-5 h-5 text-stone-400 group-hover:text-stone-900 shrink-0" />
            <div className="min-w-0">
              <span className="text-[11px] text-stone-400 block font-medium">이전 글</span>
              <p className="text-xs sm:text-sm font-bold text-stone-800 truncate group-hover:text-[#03C75A]">
                {prevPost.title}
              </p>
            </div>
          </button>
        ) : (
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-stone-400 text-xs flex items-center justify-center">
            이전 글이 없습니다.
          </div>
        )}

        {nextPost ? (
          <button
            onClick={() => onNavigatePost(nextPost)}
            className="p-4 bg-white rounded-xl border border-stone-200 hover:border-stone-300 text-right transition-colors flex items-center justify-end gap-3 cursor-pointer group"
          >
            <div className="min-w-0">
              <span className="text-[11px] text-stone-400 block font-medium">다음 글</span>
              <p className="text-xs sm:text-sm font-bold text-stone-800 truncate group-hover:text-[#03C75A]">
                {nextPost.title}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-900 shrink-0" />
          </button>
        ) : (
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-stone-400 text-xs flex items-center justify-center">
            다음 글이 없습니다.
          </div>
        )}
      </div>

      {/* Comments Section */}
      <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-stone-100">
          <MessageSquare className="w-5 h-5 text-stone-700" />
          <h3 className="font-bold text-stone-900 text-base">
            댓글 <span className="text-[#03C75A] tabular-nums">{post.comments.length}</span>
          </h3>
        </div>

        {/* Existing Comments List */}
        <div className="space-y-4 mb-8">
          {post.comments.length === 0 ? (
            <p className="text-xs sm:text-sm text-stone-400 py-6 text-center">
              아직 작성된 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
            </p>
          ) : (
            post.comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 rounded-xl bg-stone-50 border border-stone-100 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <img
                    src={comment.authorAvatar || currentUser.avatar}
                    alt={comment.author}
                    className="w-8 h-8 rounded-full object-cover bg-stone-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-stone-900">
                        {comment.author}
                      </span>
                      {comment.isSecret && (
                        <span className="text-[10px] text-stone-400 flex items-center gap-0.5">
                          <Lock className="w-3 h-3 text-stone-400" />
                          비밀글
                        </span>
                      )}
                      <span className="text-[11px] text-stone-400">{comment.createdAt}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 mt-1 leading-relaxed whitespace-pre-line">
                      {comment.content}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteComment(post.id, comment.id)}
                  className="text-stone-400 hover:text-rose-500 p-1 text-xs transition-colors shrink-0"
                  title="댓글 삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-600">작성자:</span>
              <input
                type="text"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                placeholder="닉네임"
                className="text-xs bg-stone-50 border border-stone-200 rounded px-2.5 py-1 text-stone-800 focus:bg-white focus:outline-none focus:border-[#03C75A]"
              />
            </div>

            <label className="flex items-center gap-1.5 text-xs text-stone-500 cursor-pointer">
              <input
                type="checkbox"
                checked={isSecret}
                onChange={(e) => setIsSecret(e.target.checked)}
                className="rounded border-stone-300 text-[#03C75A] focus:ring-[#03C75A]"
              />
              <span>비밀 댓글</span>
            </label>
          </div>

          <div className="relative">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="따뜻한 댓글을 남겨주세요."
              rows={3}
              className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-800 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#03C75A] focus:ring-1 focus:ring-[#03C75A] resize-none leading-relaxed"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="absolute right-3 bottom-3 px-4 py-1.5 bg-[#03C75A] hover:bg-[#02b350] disabled:opacity-40 text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>등록</span>
            </button>
          </div>
        </form>
      </section>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-70 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-150"
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img
              src={zoomedImage}
              alt="확대 사진"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </article>
  );
};
