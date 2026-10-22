import React from 'react';
import { Heart, MessageSquare, Eye } from 'lucide-react';
import { BlogPost } from '../types/blog';

interface PostListItemProps {
  post: BlogPost;
  onClick: () => void;
  onLikeToggle?: (e: React.MouseEvent) => void;
}

export const PostListItem: React.FC<PostListItemProps> = ({ post, onClick, onLikeToggle }) => {
  return (
    <article
      onClick={onClick}
      className="group bg-white p-4 sm:p-5 rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-xs transition-all flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4 cursor-pointer"
    >
      {/* Left text column */}
      <div className="flex-1 min-w-0">
        {/* Category & read time */}
        <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
          <span className="font-semibold text-[#03C75A]">{post.category}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readTimeMinutes}분 분량</span>
        </div>

        {/* Title */}
        <h2 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-[#03C75A] transition-colors line-clamp-1 mb-1.5">
          {post.title}
        </h2>

        {/* Snippet */}
        <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed mb-3">
          {post.summary}
        </p>

        {/* Author & Stats */}
        <div className="flex items-center gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <img
              src={post.authorAvatar}
              alt={post.author}
              className="w-4 h-4 rounded-full object-cover shrink-0"
            />
            <span className="font-medium text-stone-700">{post.author}</span>
          </div>
          <span aria-hidden="true">·</span>
          <span>{post.createdAt}</span>

          <span aria-hidden="true">·</span>
          <div className="flex items-center gap-2.5 tabular-nums">
            <span className="flex items-center gap-1" title="조회수">
              <Eye className="w-3.5 h-3.5 text-stone-400" />
              <span>{post.views}</span>
            </span>

            <button
              onClick={onLikeToggle}
              className={`flex items-center gap-1 transition-colors ${
                post.isLiked ? 'text-rose-500 font-semibold' : 'hover:text-rose-500'
              }`}
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

      {/* Right Thumbnail if present */}
      {post.thumbnailUrl && (
        <div className="w-full sm:w-36 h-28 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-stone-100">
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
    </article>
  );
};
