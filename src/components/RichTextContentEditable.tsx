import React, { useEffect, useRef } from 'react';

interface RichTextContentEditableProps {
  initialHtml: string;
  placeholder?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  fontSize?: 'title1' | 'title2' | 'body1' | 'body2' | 'body3';
  onChange: (html: string) => void;
  onFocus?: () => void;
  onSelectionChange?: (hasSelection: boolean, rect: DOMRect | null) => void;
}

export const RichTextContentEditable: React.FC<RichTextContentEditableProps> = ({
  initialHtml,
  placeholder = '내용을 입력하세요...',
  align = 'left',
  fontSize = 'body1',
  onChange,
  onFocus,
  onSelectionChange,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  // Sync initial content once or when block changes
  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== initialHtml) {
        editorRef.current.innerHTML = initialHtml || '';
      }
    }
    isInternalChange.current = false;
  }, [initialHtml]);

  const handleInput = () => {
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  };

  const checkSelection = () => {
    if (!onSelectionChange) return;
    const sel = window.getSelection();
    if (
      sel &&
      !sel.isCollapsed &&
      editorRef.current &&
      editorRef.current.contains(sel.anchorNode)
    ) {
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      onSelectionChange(true, rect);
    } else {
      onSelectionChange(false, null);
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'title1':
        return 'text-2xl sm:text-3xl font-bold min-h-[44px]';
      case 'title2':
        return 'text-xl sm:text-2xl font-bold min-h-[38px]';
      case 'body1':
        return 'text-base sm:text-lg min-h-[32px]';
      case 'body2':
        return 'text-sm sm:text-base min-h-[28px]';
      case 'body3':
        return 'text-xs sm:text-sm min-h-[24px]';
      default:
        return 'text-base min-h-[32px]';
    }
  };

  return (
    <div className="relative w-full">
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={onFocus}
        onMouseUp={checkSelection}
        onKeyUp={checkSelection}
        data-placeholder={placeholder}
        style={{
          textAlign: align,
          outline: 'none',
        }}
        className={`w-full py-1 leading-relaxed text-stone-900 border-none focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-stone-300 empty:before:pointer-events-none ${getFontSizeClass()}`}
      />
    </div>
  );
};
