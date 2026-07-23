'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types/user';
import { Heart, MapPin, Sparkles, MessageCircle, Send, X, ShieldCheck, Zap } from 'lucide-react';

interface UserProfileCardProps {
  user: UserProfile;
  onSendLike?: (user: UserProfile) => void;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, onSendLike }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [liked, setLiked] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [chatInput, setChatInput] = useState('');

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    if (onSendLike) onSendLike(user);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setChatInput('');
      setMessageSent(false);
      setShowDetail(false);
    }, 1800);
  };

  return (
    <>
      {/* ユーザーカード */}
      <div 
        onClick={() => setShowDetail(true)}
        className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-pink-100/80 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col"
      >
        {/* 画像エリア */}
        <div className="relative h-64 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={user.avatar}
            alt={user.nickname}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* グラデーションオーバーレイ */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* オンラインバッジ */}
          {user.isOnline && (
            <div className="absolute top-3 left-3 flex items-center space-x-1.5 bg-emerald-500/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow">
              <span className="w-2 h-2 bg-white rounded-full animate-ping" />
              <span>ON LINE</span>
            </div>
          )}

          {/* 「大人あり」バッジ */}
          {user.hasAdultOption && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 animate-pulse">
              <Heart className="w-3 h-3 fill-white text-white" />
              <span>大人あり</span>
            </div>
          )}

          {/* 画像上のテキスト（名前・年齢・地域） */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="flex items-baseline space-x-2">
              <h3 className="text-xl font-black drop-shadow-md">{user.nickname}</h3>
              <span className="text-base font-bold text-pink-200">{user.age}歳</span>
            </div>
            
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200 mt-1">
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3.5 h-3.5 text-pink-400" />
                {user.prefecture}
              </span>
              <span>•</span>
              <span>{user.height}cm</span>
              <span>•</span>
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">{user.bodyType}</span>
            </div>
          </div>
        </div>

        {/* 下部情報エリア */}
        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
          
          {/* Tag & MBTI & 血液型 */}
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 font-extrabold text-[11px] rounded-md">
              MBTI: {user.mbti}
            </span>
            <span className="px-2 py-0.5 bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-300 font-bold text-[11px] rounded-md">
              {user.bloodType}型
            </span>
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[11px] rounded-md truncate max-w-[120px]">
              {user.occupation}
            </span>
          </div>

          {/* 自己紹介一言 */}
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-2 leading-relaxed">
            {user.bio}
          </p>

          {/* アクションボタン */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>ぱぱっと会える度 高め</span>
            </span>

            <button
              onClick={handleLikeClick}
              className={`p-2.5 rounded-full transition transform active:scale-90 ${
                liked
                  ? 'bg-pink-500 text-white shadow-md shadow-pink-500/40'
                  : 'bg-pink-50 dark:bg-slate-800 text-pink-500 hover:bg-pink-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} />
            </button>
          </div>

        </div>
      </div>

      {/* 詳細モーダル */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-pink-100 dark:border-slate-800 max-h-[90vh] flex flex-col">
            
            {/* モーダル画像ヘッダー */}
            <div className="relative h-72 w-full bg-slate-900">
              <img
                src={user.avatar}
                alt={user.nickname}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40" />

              <button
                onClick={() => setShowDetail(false)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 text-white">
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-black">{user.nickname}</h2>
                  <span className="text-xl font-bold text-pink-300">{user.age}歳</span>
                  {user.hasAdultOption && (
                    <span className="bg-pink-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow">
                      大人あり
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                  <span>📍 {user.prefecture}</span>
                  <span>•</span>
                  <span>📏 {user.height}cm</span>
                  <span>•</span>
                  <span>💪 {user.bodyType}</span>
                </p>
              </div>
            </div>

            {/* 詳細コンテンツ */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              
              {/* プロフィールスペック */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl text-center">
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold">血液型</span>
                  <span className="text-xs font-black text-slate-800 dark:text-white">{user.bloodType}型</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold">MBTI</span>
                  <span className="text-xs font-black text-purple-600 dark:text-purple-400">{user.mbti}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold">職業</span>
                  <span className="text-xs font-black text-slate-800 dark:text-white truncate block">{user.occupation}</span>
                </div>
              </div>

              {/* 自己紹介メッセージ */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 mb-1">自己紹介</h4>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium bg-pink-50/50 dark:bg-pink-950/20 p-3 rounded-xl border border-pink-100/60 dark:border-pink-900/40">
                  {user.bio}
                </p>
              </div>

              {/* タグ一覧 */}
              <div className="flex flex-wrap gap-1.5">
                {user.tags.map((tag, idx) => (
                  <span key={idx} className="text-[11px] font-bold text-pink-600 dark:text-pink-300 bg-pink-100/60 dark:bg-pink-950/60 px-2.5 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* チャット送信フォーム */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                {messageSent ? (
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 animate-fadeIn">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span>「ぱぱっと」オファーメッセージを送信しました！</span>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={`${user.nickname}さんに最初のメッセージを送る...`}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="w-full pl-4 pr-12 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-pink-500 outline-none"
                      />
                      <button
                        type="submit"
                        className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold text-xs hover:opacity-90 transition flex items-center justify-center"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
};
