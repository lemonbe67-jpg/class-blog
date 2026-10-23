export type BlogCategory = 
  | '전체'
  | '일상'
  | '독서'
  | '국어'
  | '사회/도덕'
  | '미술/음악'
  | '과학/실과';

export interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  isSecret?: boolean;
}

export type QuoteStyle = 'quote' | 'line' | 'memo' | 'card';

export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'video' | 'quote' | 'divider' | 'callout';
  text?: string;
  fontSize?: 'title1' | 'title2' | 'body1' | 'body2' | 'body3';
  align?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  bgColor?: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isStrikethrough?: boolean;
  imageUrl?: string;
  imageCaption?: string;
  imageSize?: 'regular' | 'wide' | 'full';
  videoUrl?: string;
  videoTitle?: string;
  quoteText?: string;
  quoteAuthor?: string;
  quoteStyle?: QuoteStyle;
  dividerStyle?: 'solid' | 'dashed' | 'dotted' | 'icon';
  calloutTitle?: string;
  calloutText?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: Exclude<BlogCategory, '전체'>;
  author: string;
  authorAvatar: string;
  authorBio?: string;
  createdAt: string;
  updatedAt?: string;
  thumbnailUrl?: string;
  summary: string;
  contentHtml?: string; // fallback or raw HTML
  blocks: ContentBlock[];
  tags: string[];
  views: number;
  likes: number;
  isLiked?: boolean;
  comments: Comment[];
  readTimeMinutes: number;
  password?: string;
}

export type ViewMode = 'card' | 'list' | 'album';
export type SortOption = 'latest' | 'views' | 'likes' | 'comments';
