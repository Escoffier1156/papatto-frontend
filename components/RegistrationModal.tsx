'use client';

import React, { useState } from 'react';
import { UserProfile, BodyType, BloodType, MBTIType } from '@/types/user';
import { PREFECTURES } from '@/data/mockUsers';
import { 
  X, Phone, MessageSquareCode, CheckCircle2, 
  Sparkles, Camera, ArrowRight, ShieldCheck, Heart 
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

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegisterComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Step 1 State: 電話番号 & SMS
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [smsError, setSmsError] = useState('');

  // Step 2 State: プロフィール情報
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

  // Step 1: SMSコード送信処理
  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setSmsError('正しい電話番号を入力してください（例: 090-1234-5678）');
      return;
    }
    setSmsError('');
    setSmsSent(true);
  };

  // Step 1: SMS検証処理
  const handleVerifySms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length < 4) {
      setSmsError('認証コード（任意の4〜6桁）を入力してください');
      return;
    }
    setSmsError('');
    setStep(2); // プロフィール設定へ
  };

  // Step 2: プロフィール登録完了処理
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      alert('ニックネームを入力してください');
      return;
    }

    const finalAvatar = customAvatarUrl.trim() ? customAvatarUrl : avatar;

    const newProfile: UserProfile = {
      id: `user-my-${Date.now()}`,
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
      phoneNumber,
      registeredAt: new Date().toLocaleDateString('ja-JP'),
    };

    // Confetti アニメーション演出
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setStep(3);
    onRegisterComplete(newProfile);
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
            <h2 className="text-xl font-bold">「ぱぱっと」無料会員登録</h2>
          </div>
          <p className="text-xs text-pink-100 mt-1">
            ステップ {step} / 3: {step === 1 ? '電話番号で本人確認' : step === 2 ? 'プロフィール入力' : '登録完了'}
          </p>

          {/* ステップインジケーター */}
          <div className="w-full bg-white/20 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* モーダルコンテンツ（スクロール可能） */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: 電話番号 ＆ SMSコード入力 */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-pink-100 dark:bg-pink-950/60 text-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <Phone className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  SMS（ショートメッセージ）本人確認
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  安全にご利用いただくため、電話番号にSMSで登録リンクと認証コードを送信します。
                </p>
              </div>

              {!smsSent ? (
                <form onSubmit={handleSendSms} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      携帯電話番号
                    </label>
                    <div className="relative">
                      <Phone className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="090-1234-5678"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm font-semibold"
                      />
                    </div>
                  </div>

                  {smsError && <p className="text-xs text-red-500 font-bold">{smsError}</p>}

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-pink-500/25 transition flex items-center justify-center gap-2"
                  >
                    <span>SMSで登録リンクを送信</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifySms} className="space-y-4 animate-fadeIn">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">【疑似SMS受信メッセージ】</p>
                      <p className="mt-0.5">「ぱぱっと登録リンクです。認証コード【8888】を入力してプロフィールを登録してください。」</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      認証コード (任意の4〜6桁)
                    </label>
                    <div className="relative">
                      <MessageSquareCode className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder="例: 8888"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm font-bold tracking-widest text-center"
                      />
                    </div>
                  </div>

                  {smsError && <p className="text-xs text-red-500 font-bold">{smsError}</p>}

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSmsSent(false)}
                      className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl"
                    >
                      やり直す
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-pink-500/25 transition flex items-center justify-center gap-2"
                    >
                      <span>プロフィール登録へ開く</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: プロフィール登録フォーム */}
          {step === 2 && (
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

              {/* 「大人あり」スイッチ & 自己紹介 */}
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
                <span>プロフィールを登録して「ぱぱっと」を始める</span>
              </button>
            </form>
          )}

          {/* STEP 3: 完了感謝メッセージ */}
          {step === 3 && (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-600 text-white rounded-full flex items-center justify-center mx-auto shadow-xl animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                登録が完了しました！🎉
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                「ぱぱっと」へようこそ！気になる相手を探して即時マッチングやメッセージを送ってみましょう。
              </p>

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
