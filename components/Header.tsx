'use client';

import React from 'react';
import { UserProfile } from '@/types/user';
import { Sparkles, Heart, UserPlus, MessageCircle } from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile | null;
  onOpenRegister: () => void;
  onOpenMyProfile: () => void;
  onOpenChat: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenRegister,
  onOpenMyProfile,
  onOpenChat,
  unreadCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-pink-100 dark:border-slate-800 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* 左側アクション */}
        <div className="hidden md:flex items-center space-x-2 text-xs font-semibold text-pink-600 bg-pink-50 dark:bg-pink-950/40 dark:text-pink-300 px-3 py-1.5 rounded-full border border-pink-200/60 dark:border-pink-800/50 shadow-inner">
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-pulse" />
          <span>12時間消滅チャットで安心マッチング</span>
        </div>

        {/* 上部中央：アプリ名「ぱぱっと」＆ キャッチコピー */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative group cursor-pointer">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 bg-clip-text text-transparent drop-shadow-sm flex items-center justify-center gap-1">
              <span>ぱぱっと</span>
              <Sparkles className="w-6 h-6 text-pink-500 animate-bounce inline-block" />
            </h1>
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-rose-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-xs sm:text-sm font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mt-0.5 tracking-wide">
            ぱぱっと会えるマッチングサイト
          </p>
        </div>

        {/* 右側：チャット ＆ マイページ / プロフィール作成ボタン */}
        <div className="flex items-center space-x-2.5">
          
          {/* チャットアイコンボタン */}
          <button
            onClick={onOpenChat}
            className="relative p-2.5 bg-pink-50 dark:bg-slate-800 text-pink-600 dark:text-pink-300 hover:bg-pink-100 rounded-full transition transform hover:scale-105"
            title="チャット一覧を開く"
          >
            <MessageCircle className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                {unreadCount}
              </span>
            )}
          </button>

          {currentUser ? (
            <button
              onClick={onOpenMyProfile}
              className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.nickname}
                className="w-6 h-6 rounded-full object-cover border-2 border-white"
              />
              <div className="text-left">
                <span className="block leading-none">{currentUser.nickname}</span>
                <span className="text-[10px] text-pink-200 font-mono leading-none">{currentUser.userCode}</span>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenRegister}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all duration-200 transform hover:scale-105 active:scale-95 animate-pulse"
            >
              <UserPlus className="w-4 h-4" />
              <span>プロフィール作成 (無料)</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
