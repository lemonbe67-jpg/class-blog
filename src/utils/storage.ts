import { BlogPost, Comment } from '../types/blog';
import { INITIAL_POSTS } from '../data/initialPosts';

const STORAGE_KEY = 'our_class_blog_posts_v1';
const ACTIVE_USER_KEY = 'our_class_blog_active_user_v1';

const CATEGORY_MAP: Record<string, any> = {
  '일상·생각': '일상',
  '국내여행': '사회/도덕',
  '맛집·카페': '일상',
  'IT·컴퓨터': '과학/실과',
  '정보·꿀팁': '미술/음악',
  '문화·예술': '미술/음악',
};

export interface CurrentUser {
  id: string;
  name: string;
  avatar: string;
  bio: string;
}

export const PRESET_USERS: CurrentUser[] = [
  {
    id: 'user-1',
    name: '민지',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Minji&backgroundColor=c0aede,d1d4f9',
    bio: '우리 반 독서 부장 / 일상 기록가',
  },
  {
    id: 'user-2',
    name: '준호',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=JejuTraveler&backgroundColor=c0aede',
    bio: '과학 탐구와 실험을 좋아하는 반장',
  },
  {
    id: 'user-3',
    name: '서연',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=CodeCraft&backgroundColor=ffdfbf',
    bio: '미술과 만들기 좋아하는 친구',
  },
  {
    id: 'user-4',
    name: '선생님',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Teacher&backgroundColor=ffd5dc',
    bio: '우리 반 담임 선생님',
  },
];

export function getStoredPosts(): BlogPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
      return INITIAL_POSTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure categories conform to valid new categories
      const normalized = parsed.map((p) => ({
        ...p,
        category: CATEGORY_MAP[p.category] || p.category || '일상',
      }));
      return normalized;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
    return INITIAL_POSTS;
  } catch (err) {
    console.error('Failed to load posts from localStorage:', err);
    return INITIAL_POSTS;
  }
}

export function saveStoredPosts(posts: BlogPost[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (err) {
    console.error('Failed to save posts to localStorage:', err);
  }
}

export function resetToInitialPosts(): BlogPost[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
  return INITIAL_POSTS;
}

export function getActiveUser(): CurrentUser {
  try {
    const raw = localStorage.getItem(ACTIVE_USER_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return PRESET_USERS[0];
}

export function saveActiveUser(user: CurrentUser): void {
  try {
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save active user:', err);
  }
}
