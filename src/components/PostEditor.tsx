import React, { useState, useRef } from 'react';
import {
  X,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Image as ImageIcon,
  Video,
  Quote,
  Minus,
  Sparkles,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Link,
  Eye,
  Check,
  HelpCircle,
} from 'lucide-react';
import { BlogPost, ContentBlock, QuoteStyle, BlogCategory } from '../types/blog';
import { CurrentUser, PRESET_USERS } from '../utils/storage';
import cafeImg from '../assets/images/cafe_interior_seongsu_1792668836668.jpg';
import jejuImg from '../assets/images/jeju_ocean_sunset_1792668835781.jpg';
import techImg from '../assets/images/tech_minimal_workspace_1792668837110.jpg';
import foodImg from '../assets/images/korean_gourmet_cuisine_1792668839209.jpg';

interface PostEditorProps {
  initialPost?: BlogPost | null;
  currentUser: CurrentUser;
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
}

const CATEGORIES: Exclude<BlogCategory, '전체'>[] = [
  '일상',
  '독서',
  '국어',
  '사회/도덕',
  '미술/음악',
  '과학/실과',
];

const PRESET_IMAGES = [
  { label: '성수 카페', url: cafeImg },
  { label: '제주 노을', url: jejuImg },
  { label: '데스크셋업', url: techImg },
  { label: '정갈한 밥상', url: foodImg },
];

const TEXT_COLORS = [
  { name: '기본', value: '#1C1917' },
  { name: '진회색', value: '#57534E' },
  { name: '네이버그린', value: '#03C75A' },
  { name: '레드', value: '#E11D48' },
  { name: '블루', value: '#2563EB' },
  { name: '오렌지', value: '#EA580C' },
  { name: '퍼플', value: '#7C3AED' },
];

const BG_COLORS = [
  { name: '없음', value: 'transparent' },
  { name: '형광노랑', value: '#FEF08A' },
  { name: '연두', value: '#DCFCE7' },
  { name: '소프트핑크', value: '#FCE7F3' },
  { name: '하늘', value: '#E0F2FE' },
];

export const PostEditor: React.FC<PostEditorProps> = ({
  initialPost,
  currentUser,
  onSave,
  onCancel,
}) => {
  // Post meta state
  const [author, setAuthor] = useState(initialPost?.author || currentUser.name);
  const [authorAvatar, setAuthorAvatar] = useState(
    initialPost?.authorAvatar || currentUser.avatar
  );
  const [category, setCategory] = useState<Exclude<BlogCategory, '전체'>>(
    initialPost?.category || '일상'
  );
  const [title, setTitle] = useState(initialPost?.title || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(
    initialPost?.tags || ['네이버블로그', '일상']
  );
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(
    initialPost?.thumbnailUrl || ''
  );

  // Content blocks
  const [blocks, setBlocks] = useState<ContentBlock[]>(
    initialPost?.blocks || [
      {
        id: 'init-text-1',
        type: 'text',
        fontSize: 'title2',
        align: 'center',
        text: '',
        isBold: true,
      },
      {
        id: 'init-text-2',
        type: 'text',
        fontSize: 'body1',
        align: 'center',
        text: '',
      },
    ]
  );

  const [activeBlockId, setActiveBlockId] = useState<string>(blocks[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoTitleInput, setVideoTitleInput] = useState('');
  const [errors, setErrors] = useState<{ author?: string; title?: string }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to update specific block
  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  // Add block
  const addBlock = (type: ContentBlock['type']) => {
    const newId = `block-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    let newBlock: ContentBlock;

    switch (type) {
      case 'text':
        newBlock = {
          id: newId,
          type: 'text',
          fontSize: 'body1',
          align: 'center',
          text: '',
        };
        break;
      case 'quote':
        newBlock = {
          id: newId,
          type: 'quote',
          quoteStyle: 'quote',
          quoteText: '',
          quoteAuthor: '',
        };
        break;
      case 'divider':
        newBlock = {
          id: newId,
          type: 'divider',
          dividerStyle: 'dotted',
        };
        break;
      case 'callout':
        newBlock = {
          id: newId,
          type: 'callout',
          calloutTitle: '💡 유용한 꿀팁',
          calloutText: '',
        };
        break;
      default:
        newBlock = {
          id: newId,
          type: 'text',
          fontSize: 'body1',
          align: 'left',
          text: '',
        };
    }

    setBlocks((prev) => [...prev, newBlock]);
    setActiveBlockId(newId);
  };

  // Move block up/down
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIdx];
    newBlocks[targetIdx] = temp;
    setBlocks(newBlocks);
  };

  // Remove block
  const removeBlock = (id: string) => {
    if (blocks.length <= 1) return;
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  // Add tag
  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const newId = `block-${Date.now()}`;
      const newBlock: ContentBlock = {
        id: newId,
        type: 'image',
        imageUrl: result,
        imageCaption: file.name.replace(/\.[^/.]+$/, ''),
        imageSize: 'wide',
      };
      setBlocks((prev) => [...prev, newBlock]);
      if (!thumbnailUrl) setThumbnailUrl(result);
      setShowImageModal(false);
    };
    reader.readAsDataURL(file);
  };

  // Add image from URL or preset
  const handleAddImageUrl = (url: string) => {
    if (!url) return;
    const newId = `block-${Date.now()}`;
    const newBlock: ContentBlock = {
      id: newId,
      type: 'image',
      imageUrl: url,
      imageCaption: '사진 설명',
      imageSize: 'wide',
    };
    setBlocks((prev) => [...prev, newBlock]);
    if (!thumbnailUrl) setThumbnailUrl(url);
    setImageUrlInput('');
    setShowImageModal(false);
  };

  // Add Video
  const handleAddVideo = () => {
    if (!videoUrlInput) return;
    const newId = `block-${Date.now()}`;
    const newBlock: ContentBlock = {
      id: newId,
      type: 'video',
      videoUrl: videoUrlInput,
      videoTitle: videoTitleInput || '동영상',
    };
    setBlocks((prev) => [...prev, newBlock]);
    setVideoUrlInput('');
    setVideoTitleInput('');
    setShowVideoModal(false);
  };

  // Validation & Save
  const handlePublish = () => {
    const errs: { author?: string; title?: string } = {};
    if (!author.trim()) errs.author = '작성자 이름을 반드시 입력해주세요.';
    if (!title.trim()) errs.title = '제목을 입력해주세요.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Generate summary from text blocks
    const textSnippet = blocks
      .filter((b) => b.type === 'text' && b.text)
      .map((b) => b.text)
      .join(' ')
      .slice(0, 150);

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    // Auto pick thumbnail from first image block if not explicitly set
    let finalThumbnail = thumbnailUrl;
    if (!finalThumbnail) {
      const firstImg = blocks.find((b) => b.type === 'image' && b.imageUrl);
      if (firstImg) finalThumbnail = firstImg.imageUrl || '';
    }

    const newPost: BlogPost = {
      id: initialPost?.id || `post-${Date.now()}`,
      title: title.trim(),
      category,
      author: author.trim(),
      authorAvatar: authorAvatar || currentUser.avatar,
      authorBio: currentUser.bio || '네이버 블로그 에디터',
      createdAt: initialPost?.createdAt || formattedDate,
      updatedAt: initialPost ? formattedDate : undefined,
      thumbnailUrl: finalThumbnail || undefined,
      summary: textSnippet || '새로운 블로그 포스트가 등록되었습니다.',
      blocks,
      tags,
      views: initialPost?.views || 1,
      likes: initialPost?.likes || 0,
      isLiked: initialPost?.isLiked || false,
      comments: initialPost?.comments || [],
      readTimeMinutes: Math.max(1, Math.ceil(textSnippet.length / 200)),
    };

    onSave(newPost);
  };

  const activeBlock = blocks.find((b) => b.id === activeBlockId);

  return (
    <div className="fixed inset-0 z-50 bg-stone-100/90 backdrop-blur-xs flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Top SmartEditor Bar */}
      <header className="h-14 bg-white border-b border-stone-200 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <span className="bg-[#03C75A] text-white font-extrabold text-xs px-2 py-0.5 rounded">
            SmartEditor ONE
          </span>
          <span className="text-sm font-semibold text-stone-800">
            {initialPost ? '글 수정' : '새 글 작성'}
          </span>
        </div>

        {/* Center Mode switch: Editor vs Preview */}
        <div className="flex items-center p-1 bg-stone-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            편집기
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>미리보기</span>
          </button>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={handlePublish}
            className="px-4 py-1.5 text-xs font-bold text-white bg-[#03C75A] hover:bg-[#02b350] rounded-lg shadow-xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>발행</span>
          </button>
        </div>
      </header>

      {/* Formatting Ribbon (Only active in editor mode) */}
      {activeTab === 'editor' && (
        <div className="bg-white border-b border-stone-200 px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0 shadow-xs">
          {/* Add block quick triggers */}
          <div className="flex items-center gap-1 pr-3 border-r border-stone-200">
            <button
              onClick={() => addBlock('text')}
              className="p-1.5 rounded hover:bg-stone-100 text-stone-700 flex items-center gap-1 text-xs cursor-pointer"
              title="텍스트 문단 추가"
            >
              <Type className="w-4 h-4 text-stone-600" />
              <span className="hidden sm:inline">본문</span>
            </button>
            <button
              onClick={() => setShowImageModal(true)}
              className="p-1.5 rounded hover:bg-stone-100 text-stone-700 flex items-center gap-1 text-xs cursor-pointer"
              title="사진 삽입"
            >
              <ImageIcon className="w-4 h-4 text-[#03C75A]" />
              <span className="hidden sm:inline">사진</span>
            </button>
            <button
              onClick={() => setShowVideoModal(true)}
              className="p-1.5 rounded hover:bg-stone-100 text-stone-700 flex items-center gap-1 text-xs cursor-pointer"
              title="동영상 삽입"
            >
              <Video className="w-4 h-4 text-red-500" />
              <span className="hidden sm:inline">동영상</span>
            </button>
            <button
              onClick={() => addBlock('quote')}
              className="p-1.5 rounded hover:bg-stone-100 text-stone-700 flex items-center gap-1 text-xs cursor-pointer"
              title="인용구 박스 삽입"
            >
              <Quote className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">인용구</span>
            </button>
            <button
              onClick={() => addBlock('divider')}
              className="p-1.5 rounded hover:bg-stone-100 text-stone-700 flex items-center gap-1 text-xs cursor-pointer"
              title="구분선 삽입"
            >
              <Minus className="w-4 h-4 text-stone-500" />
              <span className="hidden sm:inline">구분선</span>
            </button>
            <button
              onClick={() => addBlock('callout')}
              className="p-1.5 rounded hover:bg-stone-100 text-stone-700 flex items-center gap-1 text-xs cursor-pointer"
              title="꿀팁/콜아웃 박스 삽입"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">스티커·팁</span>
            </button>
          </div>

          {/* Active text block format tools */}
          {activeBlock?.type === 'text' && (
            <div className="flex items-center gap-2">
              {/* Font Size Hierarchy */}
              <select
                value={activeBlock.fontSize || 'body1'}
                onChange={(e) =>
                  updateBlock(activeBlock.id, {
                    fontSize: e.target.value as any,
                  })
                }
                className="text-xs bg-stone-50 border border-stone-200 rounded px-2 py-1 text-stone-700 cursor-pointer"
              >
                <option value="title1">제목1 (28px)</option>
                <option value="title2">제목2 (22px)</option>
                <option value="body1">본문1 (17px)</option>
                <option value="body2">본문2 (15px)</option>
                <option value="body3">본문3 (13px)</option>
              </select>

              {/* Text Alignments */}
              <div className="flex items-center gap-0.5 bg-stone-50 p-0.5 rounded border border-stone-200">
                <button
                  onClick={() => updateBlock(activeBlock.id, { align: 'left' })}
                  className={`p-1 rounded cursor-pointer ${
                    activeBlock.align === 'left' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
                  }`}
                  title="왼쪽 정렬"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateBlock(activeBlock.id, { align: 'center' })}
                  className={`p-1 rounded cursor-pointer ${
                    activeBlock.align === 'center' ? 'bg-white shadow-xs text-[#03C75A] font-bold' : 'text-stone-500'
                  }`}
                  title="가운데 정렬 (네이버 감성)"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateBlock(activeBlock.id, { align: 'right' })}
                  className={`p-1 rounded cursor-pointer ${
                    activeBlock.align === 'right' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
                  }`}
                  title="오른쪽 정렬"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateBlock(activeBlock.id, { align: 'justify' })}
                  className={`p-1 rounded cursor-pointer ${
                    activeBlock.align === 'justify' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
                  }`}
                  title="양쪽 맞춤"
                >
                  <AlignJustify className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bold, Italic, Underline */}
              <div className="flex items-center gap-0.5 bg-stone-50 p-0.5 rounded border border-stone-200">
                <button
                  onClick={() =>
                    updateBlock(activeBlock.id, {
                      isBold: !activeBlock.isBold,
                    })
                  }
                  className={`p-1 rounded cursor-pointer ${
                    activeBlock.isBold ? 'bg-white shadow-xs text-[#03C75A] font-bold' : 'text-stone-600'
                  }`}
                  title="굵게"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() =>
                    updateBlock(activeBlock.id, {
                      isItalic: !activeBlock.isItalic,
                    })
                  }
                  className={`p-1 rounded cursor-pointer ${
                    activeBlock.isItalic ? 'bg-white shadow-xs text-[#03C75A]' : 'text-stone-600'
                  }`}
                  title="기울임"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() =>
                    updateBlock(activeBlock.id, {
                      isUnderline: !activeBlock.isUnderline,
                    })
                  }
                  className={`p-1 rounded cursor-pointer ${
                    activeBlock.isUnderline ? 'bg-white shadow-xs text-[#03C75A]' : 'text-stone-600'
                  }`}
                  title="밑줄"
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() =>
                    updateBlock(activeBlock.id, {
                      isStrikethrough: !activeBlock.isStrikethrough,
                    })
                  }
                  className={`p-1 rounded cursor-pointer ${
                    activeBlock.isStrikethrough ? 'bg-white shadow-xs text-[#03C75A]' : 'text-stone-600'
                  }`}
                  title="취소선"
                >
                  <Strikethrough className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Color picker */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-stone-400">글자색:</span>
                <div className="flex items-center gap-0.5">
                  {TEXT_COLORS.map((col) => (
                    <button
                      key={col.value}
                      onClick={() => updateBlock(activeBlock.id, { color: col.value })}
                      title={col.name}
                      style={{ backgroundColor: col.value }}
                      className={`w-4 h-4 rounded-full border ${
                        activeBlock.color === col.value ? 'ring-2 ring-stone-900 ring-offset-1' : 'border-stone-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Highlight picker */}
              <div className="flex items-center gap-1 pl-2 border-l border-stone-200">
                <span className="text-[11px] text-stone-400">형광펜:</span>
                <div className="flex items-center gap-0.5">
                  {BG_COLORS.map((bg) => (
                    <button
                      key={bg.value}
                      onClick={() => updateBlock(activeBlock.id, { bgColor: bg.value })}
                      title={bg.name}
                      style={{ backgroundColor: bg.value === 'transparent' ? '#fff' : bg.value }}
                      className={`w-4 h-4 rounded-full border ${
                        activeBlock.bgColor === bg.value ? 'ring-2 ring-stone-900 ring-offset-1' : 'border-stone-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quote block style selector */}
          {activeBlock?.type === 'quote' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-400">인용구 스타일:</span>
              {(['quote', 'line', 'memo', 'card'] as QuoteStyle[]).map((style) => (
                <button
                  key={style}
                  onClick={() => updateBlock(activeBlock.id, { quoteStyle: style })}
                  className={`px-2 py-1 rounded border text-xs cursor-pointer ${
                    activeBlock.quoteStyle === style
                      ? 'border-[#03C75A] bg-[#03C75A]/10 text-[#03C75A] font-semibold'
                      : 'border-stone-200 bg-stone-50 text-stone-600'
                  }`}
                >
                  {style === 'quote' && '따옴표형'}
                  {style === 'line' && '라인형'}
                  {style === 'memo' && '메모형'}
                  {style === 'card' && '카드형'}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xs border border-stone-200 p-6 sm:p-10">
          {activeTab === 'editor' ? (
            /* ================= EDITOR VIEW ================= */
            <div className="space-y-6">
              {/* Metadata Inputs (Mandatory Author, Category) */}
              <div className="space-y-4 pb-6 border-b border-stone-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                      카테고리 선택
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:bg-white focus:outline-none focus:border-[#03C75A]"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mandatory Author Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-stone-600">
                        작성자 이름 <span className="text-rose-500">*필수</span>
                      </label>
                      <span className="text-[11px] text-stone-400">
                        다중 사용자 지원
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => {
                          setAuthor(e.target.value);
                          if (errors.author) setErrors({ ...errors, author: undefined });
                        }}
                        placeholder="작성자 닉네임 입력 (필수)"
                        className={`flex-1 text-xs sm:text-sm bg-stone-50 border rounded-lg px-3 py-2 text-stone-800 focus:bg-white focus:outline-none focus:border-[#03C75A] ${
                          errors.author ? 'border-rose-400 bg-rose-50/50' : 'border-stone-200'
                        }`}
                      />
                    </div>
                    {errors.author && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.author}</p>
                    )}
                  </div>
                </div>

                {/* Preset author quick buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs text-stone-500 pt-1">
                  <span className="text-[11px] text-stone-400 whitespace-nowrap">추천 닉네임:</span>
                  {PRESET_USERS.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setAuthor(u.name);
                        setAuthorAvatar(u.avatar);
                      }}
                      className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {u.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div className="pb-4 border-b border-stone-100">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors({ ...errors, title: undefined });
                  }}
                  placeholder="제목을 입력하세요"
                  className={`w-full text-xl sm:text-2xl lg:text-3xl font-bold placeholder-stone-300 text-stone-900 border-none outline-none focus:ring-0 ${
                    errors.title ? 'placeholder-rose-300' : ''
                  }`}
                />
                {errors.title && (
                  <p className="text-xs text-rose-500 mt-1">{errors.title}</p>
                )}
              </div>

              {/* Content Blocks List */}
              <div className="space-y-4">
                {blocks.map((block, index) => {
                  const isActive = block.id === activeBlockId;
                  return (
                    <div
                      key={block.id}
                      onClick={() => setActiveBlockId(block.id)}
                      className={`relative group rounded-lg p-3 transition-all border ${
                        isActive
                          ? 'border-[#03C75A] bg-[#03C75A]/2 shadow-xs'
                          : 'border-transparent hover:border-stone-200'
                      }`}
                    >
                      {/* Block Hover Operations (Move up/down, Delete) */}
                      <div className="absolute right-2 top-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 border border-stone-200 rounded px-1.5 py-0.5 shadow-xs">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveBlock(index, 'up');
                          }}
                          disabled={index === 0}
                          className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30 cursor-pointer"
                          title="위로 이동"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveBlock(index, 'down');
                          }}
                          disabled={index === blocks.length - 1}
                          className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30 cursor-pointer"
                          title="아래로 이동"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBlock(block.id);
                          }}
                          className="p-1 text-stone-400 hover:text-rose-600 cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* BLOCK: TEXT */}
                      {block.type === 'text' && (
                        <textarea
                          value={block.text || ''}
                          onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                          placeholder="내용을 입력하세요..."
                          rows={Math.max(2, (block.text || '').split('\n').length)}
                          style={{
                            textAlign: block.align || 'center',
                            color: block.color || '#1C1917',
                            backgroundColor: block.bgColor === 'transparent' ? 'transparent' : block.bgColor,
                            fontWeight: block.isBold ? 700 : 400,
                            fontStyle: block.isItalic ? 'italic' : 'normal',
                            textDecoration: `${block.isUnderline ? 'underline' : ''} ${
                              block.isStrikethrough ? 'line-through' : ''
                            }`.trim(),
                          }}
                          className={`w-full resize-none border-none outline-none leading-relaxed focus:ring-0 ${
                            block.fontSize === 'title1'
                              ? 'text-2xl font-bold'
                              : block.fontSize === 'title2'
                              ? 'text-xl font-bold'
                              : block.fontSize === 'body1'
                              ? 'text-base sm:text-lg'
                              : block.fontSize === 'body2'
                              ? 'text-sm sm:text-base'
                              : 'text-xs sm:text-sm'
                          }`}
                        />
                      )}

                      {/* BLOCK: IMAGE */}
                      {block.type === 'image' && (
                        <div className="space-y-2 text-center">
                          <div className="relative rounded-lg overflow-hidden border border-stone-200 bg-stone-100 max-h-96 flex items-center justify-center">
                            <img
                              src={block.imageUrl}
                              alt={block.imageCaption || '삽입된 사진'}
                              className="w-full h-auto max-h-96 object-contain"
                            />
                            {thumbnailUrl === block.imageUrl && (
                              <span className="absolute top-2 left-2 bg-[#03C75A] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                                대표 썸네일
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between gap-3 text-xs">
                            <input
                              type="text"
                              value={block.imageCaption || ''}
                              onChange={(e) =>
                                updateBlock(block.id, { imageCaption: e.target.value })
                              }
                              placeholder="사진 설명을 입력하세요 (캡션)"
                              className="flex-1 text-center text-xs text-stone-500 bg-stone-50 border border-stone-200 rounded px-2 py-1"
                            />
                            <button
                              type="button"
                              onClick={() => setThumbnailUrl(block.imageUrl || '')}
                              className={`text-[11px] px-2 py-1 rounded transition-colors ${
                                thumbnailUrl === block.imageUrl
                                  ? 'bg-[#03C75A] text-white font-semibold'
                                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                              }`}
                            >
                              대표 지정
                            </button>
                          </div>
                        </div>
                      )}

                      {/* BLOCK: VIDEO */}
                      {block.type === 'video' && (
                        <div className="space-y-2">
                          <div className="aspect-16/9 w-full rounded-lg overflow-hidden border border-stone-200 bg-black flex items-center justify-center">
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
                              <div className="text-white text-xs text-center p-4">
                                <Video className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                                <p className="font-semibold">{block.videoTitle || '동영상'}</p>
                                <p className="text-stone-400 text-[11px] truncate">{block.videoUrl}</p>
                              </div>
                            )}
                          </div>
                          <input
                            type="text"
                            value={block.videoTitle || ''}
                            onChange={(e) => updateBlock(block.id, { videoTitle: e.target.value })}
                            placeholder="동영상 제목/설명 입력"
                            className="w-full text-center text-xs text-stone-600 bg-stone-50 border border-stone-200 rounded px-2 py-1"
                          />
                        </div>
                      )}

                      {/* BLOCK: QUOTE */}
                      {block.type === 'quote' && (
                        <div className="space-y-2">
                          {block.quoteStyle === 'quote' && (
                            <div className="py-4 text-center">
                              <span className="text-3xl text-stone-300 font-serif leading-none block">“</span>
                              <textarea
                                value={block.quoteText || ''}
                                onChange={(e) => updateBlock(block.id, { quoteText: e.target.value })}
                                placeholder="인용구 내용을 입력하세요"
                                rows={2}
                                className="w-full text-center font-medium text-stone-800 italic text-base border-none outline-none resize-none focus:ring-0"
                              />
                              <span className="text-3xl text-stone-300 font-serif leading-none block">”</span>
                              <input
                                type="text"
                                value={block.quoteAuthor || ''}
                                onChange={(e) => updateBlock(block.id, { quoteAuthor: e.target.value })}
                                placeholder="- 출처 또는 화자 -"
                                className="w-full text-center text-xs text-stone-400 border-none outline-none focus:ring-0 mt-1"
                              />
                            </div>
                          )}

                          {block.quoteStyle === 'line' && (
                            <div className="border-l-4 border-[#03C75A] pl-4 py-2">
                              <textarea
                                value={block.quoteText || ''}
                                onChange={(e) => updateBlock(block.id, { quoteText: e.target.value })}
                                placeholder="인용구 내용을 입력하세요"
                                rows={2}
                                className="w-full text-stone-700 text-sm border-none outline-none resize-none focus:ring-0"
                              />
                              <input
                                type="text"
                                value={block.quoteAuthor || ''}
                                onChange={(e) => updateBlock(block.id, { quoteAuthor: e.target.value })}
                                placeholder="- 출처 -"
                                className="w-full text-xs text-stone-400 border-none outline-none focus:ring-0"
                              />
                            </div>
                          )}

                          {block.quoteStyle === 'memo' && (
                            <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-4 shadow-xs">
                              <textarea
                                value={block.quoteText || ''}
                                onChange={(e) => updateBlock(block.id, { quoteText: e.target.value })}
                                placeholder="메모할 중요한 문장이나 인용구를 적어보세요"
                                rows={2}
                                className="w-full bg-transparent text-amber-950 text-sm border-none outline-none resize-none focus:ring-0 leading-relaxed"
                              />
                              <input
                                type="text"
                                value={block.quoteAuthor || ''}
                                onChange={(e) => updateBlock(block.id, { quoteAuthor: e.target.value })}
                                placeholder="- 메모 출처 -"
                                className="w-full bg-transparent text-xs text-amber-700/70 border-none outline-none focus:ring-0"
                              />
                            </div>
                          )}

                          {block.quoteStyle === 'card' && (
                            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
                              <textarea
                                value={block.quoteText || ''}
                                onChange={(e) => updateBlock(block.id, { quoteText: e.target.value })}
                                placeholder="카드형 인용구 (영업시간, 위치, 체크포인트 등)"
                                rows={3}
                                className="w-full bg-transparent text-stone-800 text-xs sm:text-sm border-none outline-none resize-none focus:ring-0 leading-relaxed"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* BLOCK: DIVIDER */}
                      {block.type === 'divider' && (
                        <div className="py-3 flex items-center justify-center">
                          {block.dividerStyle === 'dotted' ? (
                            <div className="flex items-center gap-1.5 text-stone-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                              <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                              <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                            </div>
                          ) : (
                            <hr className="w-full border-t border-stone-200" />
                          )}
                        </div>
                      )}

                      {/* BLOCK: CALLOUT / STICKER TIP */}
                      {block.type === 'callout' && (
                        <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-4 text-emerald-950">
                          <input
                            type="text"
                            value={block.calloutTitle || ''}
                            onChange={(e) => updateBlock(block.id, { calloutTitle: e.target.value })}
                            placeholder="💡 꿀팁 제목"
                            className="w-full font-bold text-sm bg-transparent border-none outline-none focus:ring-0 text-emerald-900 mb-1"
                          />
                          <textarea
                            value={block.calloutText || ''}
                            onChange={(e) => updateBlock(block.id, { calloutText: e.target.value })}
                            placeholder="블로그 독자들에게 전하고 싶은 핵심 정보나 꿀팁을 적어주세요."
                            rows={2}
                            className="w-full text-xs sm:text-sm bg-transparent border-none outline-none resize-none focus:ring-0 leading-relaxed text-emerald-800"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Add Block Bar */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => addBlock('text')}
                  className="px-3 py-1.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>본문 문단 추가</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowImageModal(true)}
                  className="px-3 py-1.5 text-xs font-medium text-[#03C75A] bg-[#03C75A]/10 hover:bg-[#03C75A]/20 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>사진 추가</span>
                </button>
              </div>

              {/* Tags Section */}
              <div className="pt-6 border-t border-stone-100">
                <label className="block text-xs font-semibold text-stone-600 mb-2">
                  태그 입력 (최대 10개)
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-stone-400 hover:text-stone-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="태그 입력 후 Enter 또는 추가 버튼 클릭"
                    className="flex-1 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:bg-white focus:outline-none focus:border-[#03C75A]"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                  >
                    태그 추가
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ================= LIVE PREVIEW VIEW ================= */
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-4">
                <span className="text-xs font-semibold text-[#03C75A]">{category}</span>
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 mb-3">
                  {title || '제목 없음'}
                </h1>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <img src={authorAvatar} alt={author} className="w-5 h-5 rounded-full object-cover" />
                  <span className="font-semibold text-stone-800">{author || '작성자 미입력'}</span>
                  <span>·</span>
                  <span>방금 전</span>
                </div>
              </div>

              {/* Render Blocks */}
              <div className="space-y-6 leading-relaxed">
                {blocks.map((block) => (
                  <div key={block.id}>
                    {block.type === 'text' && (
                      <p
                        style={{
                          textAlign: block.align || 'center',
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
                            ? 'text-2xl font-bold my-4'
                            : block.fontSize === 'title2'
                            ? 'text-xl font-bold my-3'
                            : block.fontSize === 'body1'
                            ? 'text-base sm:text-lg my-2'
                            : 'text-sm sm:text-base my-2'
                        }`}
                      >
                        {block.text}
                      </p>
                    )}

                    {block.type === 'image' && (
                      <figure className="my-6 text-center">
                        <img
                          src={block.imageUrl}
                          alt={block.imageCaption || '사진'}
                          className="w-full max-h-[500px] object-cover rounded-lg mx-auto"
                        />
                        {block.imageCaption && (
                          <figcaption className="text-xs text-stone-500 mt-2">
                            {block.imageCaption}
                          </figcaption>
                        )}
                      </figure>
                    )}

                    {block.type === 'video' && (
                      <div className="my-6">
                        <div className="aspect-16/9 w-full rounded-lg overflow-hidden border border-stone-200 bg-black">
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
                            <div className="w-full h-full flex items-center justify-center text-white text-xs">
                              동영상 링크: {block.videoUrl}
                            </div>
                          )}
                        </div>
                        {block.videoTitle && (
                          <p className="text-xs text-stone-500 text-center mt-1.5">{block.videoTitle}</p>
                        )}
                      </div>
                    )}

                    {block.type === 'quote' && (
                      <div className="my-6">
                        {block.quoteStyle === 'quote' && (
                          <blockquote className="text-center py-4">
                            <span className="text-3xl text-stone-300 font-serif">“</span>
                            <p className="italic font-medium text-stone-800 text-lg">
                              {block.quoteText}
                            </p>
                            <span className="text-3xl text-stone-300 font-serif">”</span>
                            {block.quoteAuthor && (
                              <cite className="block text-xs text-stone-500 mt-1 not-italic">
                                - {block.quoteAuthor}
                              </cite>
                            )}
                          </blockquote>
                        )}
                        {block.quoteStyle === 'line' && (
                          <blockquote className="border-l-4 border-[#03C75A] pl-4 py-2 italic text-stone-700">
                            <p>{block.quoteText}</p>
                            {block.quoteAuthor && (
                              <cite className="block text-xs text-stone-400 mt-1 not-italic">
                                {block.quoteAuthor}
                              </cite>
                            )}
                          </blockquote>
                        )}
                        {block.quoteStyle === 'memo' && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-950 text-sm">
                            <p className="whitespace-pre-line">{block.quoteText}</p>
                            {block.quoteAuthor && (
                              <p className="text-xs text-amber-700/70 mt-2 font-medium">
                                {block.quoteAuthor}
                              </p>
                            )}
                          </div>
                        )}
                        {block.quoteStyle === 'card' && (
                          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-xs sm:text-sm text-stone-800 whitespace-pre-line">
                            {block.quoteText}
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === 'divider' && (
                      <div className="py-4 flex items-center justify-center">
                        <div className="flex items-center gap-1.5 text-stone-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                        </div>
                      </div>
                    )}

                    {block.type === 'callout' && (
                      <div className="my-6 bg-emerald-50/70 border border-emerald-200 rounded-lg p-4 text-emerald-950">
                        <h4 className="font-bold text-sm text-emerald-900 mb-1">{block.calloutTitle}</h4>
                        <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                          {block.calloutText}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-stone-100">
                {tags.map((t) => (
                  <span key={t} className="text-xs text-stone-500">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Image Insertion Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#03C75A]" />
                사진 삽입하기
              </h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Option 1: File Upload */}
              <div>
                <p className="text-xs font-semibold text-stone-700 mb-1.5">1. 내 PC에서 파일 업로드</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-stone-300 hover:border-[#03C75A] rounded-lg p-4 flex flex-col items-center justify-center gap-1.5 text-stone-600 hover:text-[#03C75A] transition-colors cursor-pointer"
                >
                  <Upload className="w-5 h-5 text-stone-400" />
                  <span className="text-xs font-medium">컴퓨터 사진 파일 선택</span>
                  <span className="text-[10px] text-stone-400">JPG, PNG, GIF 등 지원</span>
                </button>
              </div>

              {/* Option 2: Image URL */}
              <div>
                <p className="text-xs font-semibold text-stone-700 mb-1.5">2. 이미지 웹 URL 직접 입력</p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="flex-1 text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:border-[#03C75A]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddImageUrl(imageUrlInput)}
                    className="px-3 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    추가
                  </button>
                </div>
              </div>

              {/* Option 3: High quality presets */}
              <div>
                <p className="text-xs font-semibold text-stone-700 mb-1.5">3. 고화질 추천 사진 프리셋</p>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleAddImageUrl(preset.url)}
                      className="group relative aspect-16/10 rounded-lg overflow-hidden border border-stone-200 text-left cursor-pointer"
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Insertion Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Video className="w-4 h-4 text-red-500" />
                동영상 삽입하기
              </h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  YouTube 또는 동영상 링크
                </label>
                <input
                  type="url"
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:border-[#03C75A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  동영상 설명/제목 (선택)
                </label>
                <input
                  type="text"
                  value={videoTitleInput}
                  onChange={(e) => setVideoTitleInput(e.target.value)}
                  placeholder="영상 제목을 입력하세요"
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:border-[#03C75A]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleAddVideo}
                  disabled={!videoUrlInput}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 rounded-lg"
                >
                  동영상 삽입
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
