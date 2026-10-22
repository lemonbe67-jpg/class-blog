import React from 'react';
import { Heart, MessageSquare, Eye } from 'lucide-react';
import { BlogPost } from '../types/blog';

interface PostCardProps {
  post: BlogPost;
  onClick: () => void;
  onLikeToggle?: (e: React.MouseEvent) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onClick, onLikeToggle }) => {
  return (
    <article
      onClick={onClick}
      className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Thumbnail */}
      {post.thumbnailUrl ? (
        <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className="text-[11px] font-semibold text-stone-900 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs">
              {post.category}
            </span>
          </div>
        </div>
      ) : (
        <div className="aspect-16/10 w-full bg-linear-to-br from-stone-100 to-stone-200 flex items-center justify-center p-6 text-stone-400">
          <span className="text-xs font-medium text-stone-500">{post.category}</span>
        </div>
      )}

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata Header */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
            <span className="font-medium text-[#03C75A]">{post.category}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readTimeMinutes}분 분량</span>
          </div>

          {/* Title */}
          <h2 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-[#03C75A] transition-colors line-clamp-2 leading-snug mb-2">
            {post.title}
          </h2>

          {/* Summary */}
          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed mb-4">
            {post.summary}
          </p>
        </div>

        {/* Footer info: Author, date & stats */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3 text-xs text-stone-500">
          {/* Author */}
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={post.authorAvatar}
              alt={post.author}
              className="w-5 h-5 rounded-full object-cover bg-stone-100 shrink-0"
            />
            <span className="truncate font-medium text-stone-700">{post.author}</span>
            <span aria-hidden="true">·</span>
            <span className="whitespace-nowrap">{post.createdAt.split(' ')[0]}</span>
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-2.5 shrink-0 tabular-nums">
            <span className="flex items-center gap-1" title="조회수">
              <Eye className="w-3.5 h-3.5 text-stone-400" />
              <span>{post.views}</span>
            </span>

            <button
              onClick={onLikeToggle}
              className={`flex items-center gap-1 transition-colors ${
                post.isLiked ? 'text-rose-500 font-semibold' : 'hover:text-rose-500'
              }`}
              title="공감(좋아요)"
            >
              <Heart className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-current' : ''}`} />
              <span>{post.likes}</span>
            </button>

            <span className="flex items-center gap-1" title="댓글 수">
              <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
              <span>{post.comments.length}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
