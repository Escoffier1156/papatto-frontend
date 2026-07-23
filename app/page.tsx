'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { UserProfile, SearchFilterState } from '@/types/user';
import { ChatMessage } from '@/types/chat';
import { INITIAL_MOCK_USERS } from '@/data/mockUsers';
import { Header } from '@/components/Header';
import { SearchFilter } from '@/components/SearchFilter';
import { UserProfileCard } from '@/components/UserProfileCard';
import { RegistrationModal } from '@/components/RegistrationModal';
import { MyProfileModal } from '@/components/MyProfileModal';
import { ChatModal } from '@/components/ChatModal';
import { Sparkles, UserPlus, Users, SearchX, Clock, Search, MessageCircle } from 'lucide-react';

const INITIAL_FILTER: SearchFilterState = {
  ageMin: 18,
  ageMax: 50,
  heightMin: 140,
  heightMax: 200,
  bodyTypes: [],
  prefecture: '指定なし',
  hasAdultOptionOnly: false,
  keyword: '',
};

// 12時間のミリ秒
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

export default function Home() {
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [filter, setFilter] = useState<SearchFilterState>(INITIAL_FILTER);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // メイン画面のタブ切り替え ('explore': お相手を探す / 'messages': メッセージタブ)
  const [activeTab, setActiveTab] = useState<'explore' | 'messages'>('explore');

  // モーダル開閉ステート
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMyProfileOpen, setIsMyProfileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activePartner, setActivePartner] = useState<UserProfile | null>(null);

  // LocalStorageから自分のプロフィール ＆ チャット履歴の読み込み
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('papatto_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }

      const savedMsg = localStorage.getItem('papatto_messages');
      if (savedMsg) {
        setMessages(JSON.parse(savedMsg));
      } else {
        const now = Date.now();
        const demoMessages: ChatMessage[] = [
          {
            id: 'msg-demo-1',
            senderId: 'user-1', // みさき
            receiverId: 'user-my-default',
            content: 'はじめまして！今日これからカフェ行きませんか？☕️',
            timestamp: now - 30 * 60 * 1000,
            expiresAt: now - 30 * 60 * 1000 + TWELVE_HOURS_MS,
          },
          {
            id: 'msg-demo-2',
            senderId: 'user-2', // りな
            receiverId: 'user-my-default',
            content: 'こんばんは🍷夜サクッと飲みに行ける人探してます！',
            timestamp: now - 2 * 60 * 60 * 1000,
            expiresAt: now - 2 * 60 * 60 * 1000 + TWELVE_HOURS_MS,
          }
        ];
        setMessages(demoMessages);
      }
    } catch {
      // ignore
    }
  }, []);

  // 新規メッセージ送信
  const handleSendMessage = (receiverId: string, content: string) => {
    const senderId = currentUser ? currentUser.id : 'user-guest';
    const now = Date.now();

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      senderId,
      receiverId,
      content,
      timestamp: now,
      expiresAt: now + TWELVE_HOURS_MS, // 12時間後
    };

    setMessages((prev) => {
      const updated = [...prev, newMsg];
      try {
        localStorage.setItem('papatto_messages', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    // 擬似返信
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        senderId: receiverId,
        receiverId: senderId,
        content: `メッセージありがとうございます！ぱぱっとお会いしたいですね✨`,
        timestamp: Date.now(),
        expiresAt: Date.now() + TWELVE_HOURS_MS,
      };
      setMessages((prev) => {
        const updated = [...prev, replyMsg];
        try {
          localStorage.setItem('papatto_messages', JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    }, 2000);
  };

  // ユーザーカードからチャットを開始する
  const handleStartChatWithUser = (partner: UserProfile, initialText?: string) => {
    setActivePartner(partner);
    setActiveTab('messages'); // メッセージタブへ自動切替
    if (initialText) {
      handleSendMessage(partner.id, initialText);
    }
  };

  // プロフィール作成完了時
  const handleRegisterComplete = (newProfile: UserProfile) => {
    setCurrentUser(newProfile);
    setUsers((prev) => [newProfile, ...prev]);
    try {
      localStorage.setItem('papatto_user', JSON.stringify(newProfile));
    } catch {
      // ignore
    }
  };

  // マイプロフィール更新
  const handleUpdateProfile = (updated: UserProfile) => {
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    try {
      localStorage.setItem('papatto_user', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // 12時間以内のメッセージ数
  const validMessagesCount = useMemo(() => {
    const now = Date.now();
    return messages.filter((m) => m.expiresAt > now).length;
  }, [messages]);

  // フィルター処理
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (u.age < filter.ageMin || u.age > filter.ageMax) return false;
      if (u.height < filter.heightMin) return false;
      if (filter.bodyTypes.length > 0 && !filter.bodyTypes.includes(u.bodyType)) return false;
      if (filter.prefecture !== '指定なし' && u.prefecture !== filter.prefecture) return false;
      if (filter.hasAdultOptionOnly && !u.hasAdultOption) return false;

      if (filter.keyword.trim()) {
        const kw = filter.keyword.toLowerCase();
        const matchNickname = u.nickname.toLowerCase().includes(kw);
        const matchBio = u.bio.toLowerCase().includes(kw);
        const matchMbti = u.mbti.toLowerCase().includes(kw);
        const matchOcc = u.occupation.toLowerCase().includes(kw);
        const matchCode = u.userCode.toLowerCase().includes(kw);
        const matchTag = u.tags.some((t) => t.toLowerCase().includes(kw));

        if (!matchNickname && !matchBio && !matchMbti && !matchOcc && !matchCode && !matchTag) {
          return false;
        }
      }

      return true;
    });
  }, [users, filter]);

  return (
    <div className="min-h-screen flex flex-col font-sans pb-16 md:pb-0">
      
      {/* 1. 上中央ロゴ ＆ キャッチコピー付きヘッダー */}
      <Header
        currentUser={currentUser}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenMyProfile={() => setIsMyProfileOpen(true)}
        onOpenChat={() => setActiveTab('messages')}
        unreadCount={validMessagesCount > 0 ? 1 : 0}
      />

      {/* 2. メインナビゲーションタブ (「お相手を探す」/「メッセージ」) */}
      <div className="bg-white/80 dark:bg-slate-900/80 border-b border-pink-100 dark:border-slate-800 backdrop-blur-md sticky top-[69px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center space-x-2 py-2">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-full text-xs font-black transition-all duration-200 ${
              activeTab === 'explore'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/25 scale-105'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-pink-50'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>お相手を探す</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`relative flex items-center space-x-2 px-6 py-2.5 rounded-full text-xs font-black transition-all duration-200 ${
              activeTab === 'messages'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-purple-500/25 scale-105'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-pink-50'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>メッセージ</span>
            {validMessagesCount > 0 && (
              <span className="ml-1 bg-white text-pink-600 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full shadow">
                NEW
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 3. メインコンテンツエリア */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* ================= TAB 1: お相手を探す (Explore) ================= */}
        {activeTab === 'explore' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* 未登録時のウェルカムバナー */}
            {!currentUser && (
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white p-6 sm:p-8 shadow-xl shadow-pink-500/15 border border-pink-300/30">
                <div className="relative z-10 max-w-2xl space-y-3">
                  <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold">
                    <Clock className="w-3.5 h-3.5 text-yellow-300" />
                    <span>12時間消滅チャット搭載！プライバシー安心</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
                    「ぱぱっと」会いたい人と、すぐに出会えるマッチングサービス
                  </h2>
                  <p className="text-xs sm:text-sm text-pink-100 font-medium">
                    メッセージはすべて12時間で自動消滅！面倒なSMS認証なしで個人番号が即時発行され、気兼ねなくやり取りできます。
                  </p>
                  
                  <div className="pt-2">
                    <button
                      onClick={() => setIsRegisterOpen(true)}
                      className="bg-white text-pink-600 hover:bg-pink-50 font-black text-sm px-6 py-3 rounded-full shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4 text-pink-500" />
                      <span>今すぐプロフィールを作成 (無料)</span>
                    </button>
                  </div>
                </div>

                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              </div>
            )}

            {/* 検索バー ＆ 検索条件フィルター */}
            <SearchFilter
              filter={filter}
              onChangeFilter={setFilter}
              onReset={() => setFilter(INITIAL_FILTER)}
              totalResultsCount={filteredUsers.length}
            />

            {/* マッチングユーザーカードグリッド */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-pink-500" />
                  <span>おすすめの相手</span>
                </h3>
                
                <span className="text-xs text-slate-400 font-medium">
                  表示件数: {filteredUsers.length} 人
                </span>
              </div>

              {filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredUsers.map((u) => (
                    <UserProfileCard
                      key={u.id}
                      user={u}
                      onStartChat={handleStartChatWithUser}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white/60 dark:bg-slate-900/60 rounded-3xl border border-dashed border-pink-200 dark:border-slate-800 space-y-3">
                  <SearchX className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
                    該当するお相手が見つかりませんでした
                  </h4>
                  <p className="text-xs text-slate-400">
                    年齢、体型、身長、大人ありなどの条件を緩めて再検索してみてください。
                  </p>
                  <button
                    onClick={() => setFilter(INITIAL_FILTER)}
                    className="px-4 py-2 bg-pink-500 text-white font-bold text-xs rounded-full shadow hover:bg-pink-600 transition"
                  >
                    条件をクリア
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ================= TAB 2: メッセージタブ (Messages Tab) ================= */}
        {activeTab === 'messages' && (
          <div className="animate-fadeIn">
            {/* メッセージタブ用 インラインフルサイズ表示 */}
            <div className="w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-pink-100 dark:border-slate-800 min-h-[600px] flex flex-col">
              <ChatModal
                isOpen={true}
                onClose={() => setActiveTab('explore')}
                currentUser={currentUser}
                allUsers={users}
                activePartner={activePartner}
                onSelectPartner={setActivePartner}
                messages={messages}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>
        )}

      </main>

      {/* フッター */}
      <footer className="mt-12 bg-white/60 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 py-6 text-center text-xs text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 ぱぱっと (Papatto) - ぱぱっと会えるマッチングサイト</p>
          <div className="flex items-center space-x-4">
            <span className="hover:underline cursor-pointer">利用規約</span>
            <span className="hover:underline cursor-pointer">プライバシーポリシー</span>
            <span className="hover:underline cursor-pointer">特定商取引法に基づく表記</span>
          </div>
        </div>
      </footer>

      {/* モーダル群 */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterComplete={handleRegisterComplete}
      />

      {currentUser && (
        <MyProfileModal
          isOpen={isMyProfileOpen}
          onClose={() => setIsMyProfileOpen(false)}
          currentUser={currentUser}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

    </div>
  );
}
