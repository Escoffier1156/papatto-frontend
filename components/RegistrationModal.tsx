'use client';

import React, { useState } from 'react';
import { UserProfile, BodyType, BloodType, MBTIType } from '@/types/user';
import { PREFECTURES } from '@/data/mockUsers';
import { 
  X, CheckCircle2, Sparkles, Heart, IdCard, Copy, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterComplete: (profile: UserProfile) => void;
}

const MBTI_OPTIONS: MBTIType[] = [
  'ENFP', 'INFP', 'ESTP', 'ESFP',
  'ENTP', 'INTP', 'ENTJ', 'INTJ',
  'ENFJ', 'INFJ', 'ESTJ', 'ISTJ',
  'ESFJ', 'ISFJ', 'ISTP', 'ISFP'
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80'
];

// 個人識別番号（重複防止用のユニークID）生成関数
function generateUserCode(): string {
  const rand1 = Math.floor(1000 + Math.random() * 9000);
  const rand2 = Math.floor(1000 + Math.random() * 9000);
  return `#PPT-${rand1}-${rand2}`;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegisterComplete,
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [createdUserCode, setCreatedUserCode] = useState('');
  const [copied, setCopied] = useState(false);

  // プロフィール情報 State
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [gender, setGender] = useState<'female' | 'male' | 'other'>('female');
  const [age, setAge] = useState<number>(23);
  const [bloodType, setBloodType] = useState<BloodType>('A');
  const [mbti, setMbti] = useState<MBTIType>('ENFP');
  const [height, setHeight] = useState<number>(160);
  const [bodyType, setBodyType] = useState<BodyType>('ふつう');
  const [occupation, setOccupation] = useState('');
  const [prefecture, setPrefecture] = useState('東京都');
  const [hasAdultOption, setHasAdultOption] = useState(true);
  const [bio, setBio] = useState('はじめまして！ぱぱっと楽しく過ごせる人と出会いたいです✨');

  if (!isOpen) return null;

  // プロフィール登録完了処理 (即時個人番号発行)
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      alert('ニックネームを入力してください');
      return;
    }

    const finalAvatar = customAvatarUrl.trim() ? customAvatarUrl : avatar;
    const userCode = generateUserCode();
    setCreatedUserCode(userCode);

    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      userCode,
      nickname,
      avatar: finalAvatar,
      age,
      gender,
      prefecture,
      bloodType,
      mbti,
      height,
      bodyType,
      occupation: occupation || '未設定',
      hasAdultOption,
      bio,
      tags: ['新規会員', 'ぱぱっと募集', prefecture],
      isOnline: true,
      registeredAt: new Date().toLocaleDateString('ja-JP'),
    };

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setIsCompleted(true);
    onRegisterComplete(newProfile);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(createdUserCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-pink-100 dark:border-slate-800 max-h-[90vh] flex flex-col">
        
        {/* モーダルヘッダー */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 animate-pulse" />
            <h2 className="text-xl font-bold">「ぱぱっと」プロフィール作成</h2>
          </div>
          <p className="text-xs text-pink-100 mt-1">
            {isCompleted ? '発行完了！個人番号を保存してください' : '本人確認不要！項目を入力すると独自の「個人番号」が自動発行されます'}
          </p>
        </div>

        {/* モーダルコンテンツ */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {!isCompleted ? (
            /* プロフィール入力フォーム */
            <form onSubmit={handleSaveProfile} className="space-y-5 animate-fadeIn">
              
              {/* プロフィール画像登録 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
                  <span>プロフィール画像設定</span>
                  <span className="text-[11px] text-pink-500 font-normal">写真を選択またはURL入力</span>
                </label>
                <div className="flex items-center space-x-4 mb-3">
                  <img
                    src={customAvatarUrl || avatar}
                    alt="Preview"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-pink-400 shadow-md"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {PRESET_AVATARS.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Preset ${idx}`}
                          onClick={() => { setAvatar(url); setCustomAvatarUrl(''); }}
                          className={`w-10 h-10 rounded-xl object-cover cursor-pointer border-2 transition ${
                            avatar === url && !customAvatarUrl ? 'border-pink-500 scale-105 shadow' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <input
                  type="url"
                  placeholder="画像直リンクURL（任意）"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              {/* ニックネーム & 年齢 & 性別 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ニックネーム *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="例: たろう"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    年齢
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={80}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    性別
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold"
                  >
                    <option value="female">女性</option>
                    <option value="male">男性</option>
                    <option value="other">その他</option>
                  </select>
                </div>
              </div>

              {/* 血液型 ＆ 身長 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    血液型
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['A', 'B', 'O', 'AB'] as BloodType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setBloodType(type)}
                        className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                          bloodType === type
                            ? 'bg-pink-500 text-white border-pink-500 shadow'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {type}型
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      身長
                    </label>
                    <span className="text-xs font-bold text-pink-500">{height} cm</span>
                  </div>
                  <input
                    type="range"
                    min={140}
                    max={200}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full accent-pink-500"
                  />
                </div>
              </div>

              {/* 体型選択 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  体型
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['ふつう', '細身', 'ぽっちゃり', '筋肉質'] as BodyType[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setBodyType(item)}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        bodyType === item
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-transparent shadow'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* MBTI 16タイプ選択 */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    MBTI (性格診断)
                  </label>
                  <span className="text-xs text-pink-500 font-bold">{mbti}</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {MBTI_OPTIONS.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setMbti(type)}
                      className={`py-1 text-[11px] font-bold rounded-md border transition ${
                        mbti === type
                          ? 'bg-purple-600 text-white border-purple-600 shadow'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* 職業（自由記入） ＆ 地域 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    職業 (自由記入)
                  </label>
                  <input
                    type="text"
                    placeholder="例: アパレル、ITエンジニア、学生"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    居住地域
                  </label>
                  <select
                    value={prefecture}
                    onChange={(e) => setPrefecture(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  >
                    {PREFECTURES.filter(p => p !== '指定なし').map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 「大人あり」スイッチ */}
              <div className="p-3 bg-pink-50/70 dark:bg-pink-950/30 border border-pink-200/80 dark:border-pink-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-pink-700 dark:text-pink-300 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                    <span>大人関係のOK設定（大人あり）</span>
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    マッチング後の大人な関係への柔軟な対応フラグ
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasAdultOption}
                    onChange={(e) => setHasAdultOption(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  自己紹介・メッセージ
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-pink-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:opacity-95 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-pink-500/30 transition transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>個人番号を発行して「ぱぱっと」を始める</span>
              </button>
            </form>
          ) : (
            /* 個人番号発行 完了画面 */
            <div className="text-center py-6 space-y-5 animate-fadeIn">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-600 text-white rounded-full flex items-center justify-center mx-auto shadow-xl animate-bounce">
                <IdCard className="w-10 h-10" />
              </div>
              
              <div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                  個人識別番号を発行しました！🎉
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  重複登録を防止するため、あなた専用の識別IDが割り当てられました。
                </p>
              </div>

              {/* 個人番号カード表示 */}
              <div className="max-w-md mx-auto bg-gradient-to-r from-pink-50 to-purple-50 dark:from-slate-800 dark:to-slate-800/80 p-4 rounded-2xl border border-pink-200 dark:border-slate-700 shadow-inner space-y-2">
                <span className="text-[10px] text-pink-600 dark:text-pink-300 font-bold uppercase tracking-wider">
                  あなたの「ぱぱっと」個人識別番号
                </span>
                
                <div className="flex items-center justify-center space-x-3 bg-white dark:bg-slate-900 py-3 px-4 rounded-xl border border-pink-300/80 shadow-sm">
                  <span className="text-xl font-black font-mono tracking-wider text-pink-600 dark:text-pink-400">
                    {createdUserCode}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="p-1.5 bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 rounded-lg hover:bg-pink-200 transition"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {copied && <p className="text-[10px] text-emerald-600 font-bold">番号をクリップボードにコピーしました！</p>}
              </div>

              <button
                onClick={onClose}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm rounded-full shadow-lg transition transform hover:scale-105"
              >
                ホーム画面で相手を探す
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
