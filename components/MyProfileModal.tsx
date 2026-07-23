'use client';

import React, { useState } from 'react';
import { UserProfile, BodyType, BloodType, MBTIType } from '@/types/user';
import { PREFECTURES } from '@/data/mockUsers';
import { X, Heart, Save, IdCard, Copy, Check } from 'lucide-react';

interface MyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const MyProfileModal: React.FC<MyProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile,
}) => {
  const [nickname, setNickname] = useState(currentUser.nickname);
  const [height, setHeight] = useState(currentUser.height);
  const [bodyType, setBodyType] = useState<BodyType>(currentUser.bodyType);
  const [bloodType, setBloodType] = useState<BloodType>(currentUser.bloodType);
  const [mbti, setMbti] = useState<MBTIType>(currentUser.mbti);
  const [occupation, setOccupation] = useState(currentUser.occupation);
  const [prefecture, setPrefecture] = useState(currentUser.prefecture);
  const [hasAdultOption, setHasAdultOption] = useState(currentUser.hasAdultOption);
  const [bio, setBio] = useState(currentUser.bio);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      nickname,
      height,
      bodyType,
      bloodType,
      mbti,
      occupation,
      prefecture,
      hasAdultOption,
      bio,
    };
    onUpdateProfile(updated);
    onClose();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(currentUser.userCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-pink-100 dark:border-slate-800 max-h-[90vh] flex flex-col">
        
        {/* モーダルヘッダー */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/20 p-1.5 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.nickname}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
            />
            <div>
              <h2 className="text-lg font-bold">マイプロフィール設定</h2>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <IdCard className="w-3.5 h-3.5 text-pink-200" />
                <span className="text-xs font-mono font-bold text-pink-100">{currentUser.userCode}</span>
                <button
                  onClick={copyCode}
                  className="p-1 hover:bg-white/20 rounded transition"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3 text-white/80" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 編集フォーム */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* 個人番号確認エリア */}
          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800/60 flex items-center justify-between">
            <div>
              <span className="font-bold text-purple-700 dark:text-purple-300">個人識別番号 (ユーザーID)</span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">重複防止用にシステムから自動発行された番号です</p>
            </div>
            <span className="font-mono font-black text-sm text-purple-600 dark:text-purple-300 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-purple-200">
              {currentUser.userCode}
            </span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ニックネーム</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">身長 ({height}cm)</label>
              <input
                type="range"
                min={140}
                max={200}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full accent-pink-500 mt-2"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">体型</label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
              >
                <option value="ふつう">ふつう</option>
                <option value="細身">細身</option>
                <option value="ぽっちゃり">ぽっちゃり</option>
                <option value="筋肉質">筋肉質</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">血液型</label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
              >
                <option value="A">A型</option>
                <option value="B">B型</option>
                <option value="O">O型</option>
                <option value="AB">AB型</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">地域</label>
              <select
                value={prefecture}
                onChange={(e) => setPrefecture(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
              >
                {PREFECTURES.filter(p => p !== '指定なし').map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">職業 (自由記入)</label>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
            />
          </div>

          <div className="p-3 bg-pink-50 dark:bg-pink-950/40 rounded-xl flex items-center justify-between">
            <span className="font-bold text-pink-600 dark:text-pink-300 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              <span>「大人あり」フラグ設定</span>
            </span>
            <input
              type="checkbox"
              checked={hasAdultOption}
              onChange={(e) => setHasAdultOption(e.target.checked)}
              className="w-4 h-4 accent-pink-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">自己紹介</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-medium resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>プロフィール変更を保存</span>
          </button>
        </form>

      </div>
    </div>
  );
};
