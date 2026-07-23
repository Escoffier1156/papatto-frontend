'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { UserProfile, SearchFilterState } from '@/types/user';
import { INITIAL_MOCK_USERS } from '@/data/mockUsers';
import { Header } from '@/components/Header';
import { SearchFilter } from '@/components/SearchFilter';
import { UserProfileCard } from '@/components/UserProfileCard';
import { RegistrationModal } from '@/components/RegistrationModal';
import { MyProfileModal } from '@/components/MyProfileModal';
import { Sparkles, UserPlus, Users, SearchX } from 'lucide-react';

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

export default function Home() {
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [filter, setFilter] = useState<SearchFilterState>(INITIAL_FILTER);

  // モーダル開閉ステート
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMyProfileOpen, setIsMyProfileOpen] = useState(false);

  // LocalStorageから自分のプロフィールを読み込み
  useEffect(() => {
    try {
      const saved = localStorage.getItem('papatto_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCurrentUser(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

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
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* 1. 上中央ロゴ ＆ キャッチコピー付きヘッダー */}
      <Header
        currentUser={currentUser}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenMyProfile={() => setIsMyProfileOpen(true)}
      />

      {/* 2. メインコンテンツエリア */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* 未登録時のウェルカムバナー */}
        {!currentUser && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white p-6 sm:p-8 shadow-xl shadow-pink-500/15 border border-pink-300/30 animate-fadeIn">
            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>面倒な登録なし！個人識別番号が自動発行されます</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
                「ぱぱっと」会いたい人と、すぐに出会えるマッチングサービス
              </h2>
              <p className="text-xs sm:text-sm text-pink-100 font-medium">
                面倒なSMS・メール等の認証は一切なし！プロフィール（血液型・MBTI・体型・身長・大人あり）を登録するだけで固有の個人識別番号が割り振られ、すぐにスタートできます。
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

        {/* 3. 検索バー ＆ 検索条件フィルター */}
        <SearchFilter
          filter={filter}
          onChangeFilter={setFilter}
          onReset={() => setFilter(INITIAL_FILTER)}
          totalResultsCount={filteredUsers.length}
        />

        {/* 4. マッチングユーザーカードグリッド */}
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

      {/* 5. プロフィール作成モーダル */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterComplete={handleRegisterComplete}
      />

      {/* 6. マイプロフィール確認・編集モーダル */}
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
