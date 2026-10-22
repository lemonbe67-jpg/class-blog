import React from 'react';
import { Heart, MessageSquare } from 'lucide-react';
import { BlogPost } from '../types/blog';

interface PostAlbumItemProps {
  post: BlogPost;
  onClick: () => void;
  onLikeToggle?: (e: React.MouseEvent) => void;
}

export const PostAlbumItem: React.FC<PostAlbumItemProps> = ({ post, onClick, onLikeToggle }) => {
  return (
    <article
      onClick={onClick}
      className="group relative aspect-4/3 rounded-xl overflow-hidden bg-stone-900 shadow-xs cursor-pointer"
    >
      {/* Background Image or Gradient */}
      {post.thumbnailUrl ? (
        <img
          src={post.thumbnailUrl}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
        />
      ) : (
        <div className="w-full h-full bg-linear-to-tr from-stone-800 to-stone-700 flex items-center justify-center text-stone-300 font-medium p-4 text-center">
          {post.category}
        </div>
      )}

      {/* Scrim Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-between p-4 text-white">
        {/* Top category badge */}
        <div>
          <span className="text-[11px] font-medium bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded text-stone-200">
            {post.category}
          </span>
        </div>

        {/* Bottom Title & Author */}
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug mb-1.5 group-hover:text-[#03C75A] transition-colors">
            {post.title}
          </h2>
          <div className="flex items-center justify-between text-[11px] text-stone-300">
            <div className="flex items-center gap-1.5 truncate">
              <img
                src={post.authorAvatar}
                alt={post.author}
                className="w-4 h-4 rounded-full object-cover shrink-0"
              />
              <span className="truncate">{post.author}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0 tabular-nums">
              <button
                onClick={onLikeToggle}
                className={`flex items-center gap-1 ${post.isLiked ? 'text-rose-400' : 'hover:text-rose-300'}`}
              >
                <Heart className={`w-3 h-3 ${post.isLiked ? 'fill-current' : ''}`} />
                <span>{post.likes}</span>
              </button>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                <span>{post.comments.length}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
