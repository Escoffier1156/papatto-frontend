'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/user';
import { ChatMessage, ChatRoom } from '@/types/chat';
import { 
  X, Send, Clock, Sparkles, ArrowLeft, Heart, ShieldAlert, Zap, MessageCircle
} from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  activePartner: UserProfile | null;
  onSelectPartner: (partner: UserProfile | null) => void;
  messages: ChatMessage[];
  onSendMessage: (receiverId: string, content: string) => void;
}

// 12時間のミリ秒数
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

// 定型文テンプレート
const QUICK_TEMPLATES = [
  '今日これから会える？✨',
  'お茶しよう！☕️',
  'サクッと飲みに行かない？🍷',
  '大人ありで話したいな💗',
  'フットワーク軽いよ！'
];

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  activePartner,
  onSelectPartner,
  messages,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const [now, setNow] = useState<number>(Date.now());

  // 1分ごとに現在時刻を更新してカウントダウン計算
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  // 12時間を経過していない有効なメッセージのみフィルタリング
  const validMessages = messages.filter((m) => m.expiresAt > now);

  // 現在ユーザーが参加しているトークルーム一覧の作成
  const roomMap = new Map<string, ChatRoom>();

  if (currentUser) {
    // 自分以外の全ユーザーとのルーム枠またはメッセージ履歴から生成
    allUsers.forEach((user) => {
      if (user.id !== currentUser.id) {
        roomMap.set(user.id, {
          partner: user,
          messages: [],
          unreadCount: 0,
        });
      }
    });

    validMessages.forEach((msg) => {
      const partnerId = msg.senderId === currentUser.id ? msg.receiverId : msg.senderId;
      const room = roomMap.get(partnerId);
      if (room) {
        room.messages.push(msg);
        room.lastMessage = msg.content;
        room.lastMessageTime = msg.timestamp;
      }
    });
  }

  // メッセージ履歴がある相手を優先してソート
  const chatRooms = Array.from(roomMap.values()).sort((a, b) => {
    const timeA = a.lastMessageTime || 0;
    const timeB = b.lastMessageTime || 0;
    return timeB - timeA;
  });

  // アクティブな会話ログ
  const currentConversationMessages = activePartner
    ? validMessages.filter(
        (m) =>
          (m.senderId === currentUser?.id && m.receiverId === activePartner.id) ||
          (m.senderId === activePartner.id && m.receiverId === currentUser?.id)
      )
    : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePartner) return;
    onSendMessage(activePartner.id, inputText.trim());
    setInputText('');
  };

  const handleSendTemplate = (text: string) => {
    if (!activePartner) return;
    onSendMessage(activePartner.id, text);
  };

  // 残り時間のフォーマット計算（例: "11時間42分"）
  const getRemainingTime = (expiresAt: number) => {
    const diff = expiresAt - now;
    if (diff <= 0) return '期限切れ';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}時間${mins}分`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-pink-100 dark:border-slate-800 h-[85vh] flex flex-col md:flex-row">
        
        {/* ================= モバイル・デスクトップ左側: トーク一覧 (Inbox) ================= */}
        <div 
          className={`w-full md:w-80 bg-slate-50/80 dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-800 flex flex-col ${
            activePartner ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* ヘッダー */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
            <div className="flex items-center space-x-2.5">
              <button
                onClick={onClose}
                title="閉じる"
                className="p-1.5 text-slate-400 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-slate-800 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-pink-500" />
                <h2 className="text-base font-black text-slate-800 dark:text-white">メッセージ一覧</h2>
              </div>
            </div>
          </div>

          {/* 消滅に関する注記 */}
          <div className="p-3 bg-pink-50/80 dark:bg-pink-950/40 text-[11px] font-bold text-pink-600 dark:text-pink-300 flex items-center gap-1.5 border-b border-pink-100 dark:border-pink-900/40">
            <Clock className="w-4 h-4 shrink-0 text-pink-500" />
            <span>全メッセージは送信から【12時間】で自動消滅します</span>
          </div>

          {/* ルームリスト */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {chatRooms.map((room) => {
              const isSelected = activePartner?.id === room.partner.id;
              return (
                <div
                  key={room.partner.id}
                  onClick={() => onSelectPartner(room.partner)}
                  className={`p-3.5 flex items-center space-x-3 cursor-pointer transition hover:bg-pink-50/50 dark:hover:bg-slate-800/50 ${
                    isSelected ? 'bg-pink-50 dark:bg-slate-800 border-l-4 border-pink-500' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={room.partner.avatar}
                      alt={room.partner.nickname}
                      className="w-12 h-12 rounded-full object-cover border border-pink-200"
                    />
                    {room.partner.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">
                        {room.partner.nickname} ({room.partner.age})
                      </h4>
                      {room.partner.hasAdultOption && (
                        <span className="text-[9px] bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded-full font-bold">
                          大人あり
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                      {room.lastMessage || 'タップしてメッセージを送る...'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= 右側: 個別トークルーム (Chat Room) ================= */}
        <div 
          className={`flex-1 flex flex-col bg-white dark:bg-slate-900 ${
            !activePartner ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activePartner ? (
            <>
              {/* トークルームヘッダー */}
              <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onSelectPartner(null)}
                    className="md:hidden text-slate-400 hover:text-slate-600 p-1"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <img
                    src={activePartner.avatar}
                    alt={activePartner.nickname}
                    className="w-10 h-10 rounded-full object-cover border border-pink-300"
                  />

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-black text-slate-800 dark:text-white">
                        {activePartner.nickname} ({activePartner.age}歳)
                      </h3>
                      <span className="text-[10px] text-purple-600 font-bold bg-purple-100 dark:bg-purple-950/60 px-1.5 py-0.5 rounded">
                        MBTI: {activePartner.mbti}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <span>📍 {activePartner.prefecture}</span>
                      <span>•</span>
                      <span>{activePartner.height}cm</span>
                      <span>•</span>
                      <span>{activePartner.bodyType}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="hidden sm:flex items-center gap-1 text-[11px] text-pink-600 font-bold bg-pink-50 dark:bg-pink-950/60 px-2.5 py-1 rounded-full border border-pink-200">
                    <Clock className="w-3.5 h-3.5 text-pink-500 animate-spin" />
                    <span>12時間消滅モード</span>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* メッセージログ表示エリア */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/30 dark:bg-slate-950/30">
                
                {/* 消滅アナウンスバナー */}
                <div className="text-center py-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 font-semibold">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    送信されたメッセージは12時間後に自動消滅します
                  </span>
                </div>

                {currentConversationMessages.length === 0 ? (
                  <div className="text-center py-12 space-y-2">
                    <Sparkles className="w-10 h-10 text-pink-400 mx-auto animate-bounce" />
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {activePartner.nickname}さんに最初のメッセージを送ってみましょう！
                    </p>
                    <p className="text-[11px] text-slate-400">
                      定型文ボタンからワンタップで送ることもできます。
                    </p>
                  </div>
                ) : (
                  currentConversationMessages.map((msg) => {
                    const isMine = msg.senderId === currentUser?.id;
                    const remainingStr = getRemainingTime(msg.expiresAt);

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} space-y-1 animate-fadeIn`}
                      >
                        <div
                          className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                            isMine
                              ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white rounded-br-none'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                          }`}
                        >
                          {msg.content}
                        </div>

                        {/* 残り消滅時間表示 */}
                        <div className="flex items-center space-x-1 text-[10px] text-slate-400 px-1 font-mono">
                          <Clock className="w-3 h-3 text-pink-400" />
                          <span>消滅まであと {remainingStr}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* 定型文ボタンエリア */}
              <div className="px-3 py-2 bg-slate-100/60 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 overflow-x-auto flex items-center space-x-2">
                <span className="text-[10px] font-bold text-pink-500 shrink-0 flex items-center gap-0.5">
                  <Zap className="w-3 h-3 fill-pink-500 text-pink-500" />
                  即レス:
                </span>
                {QUICK_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendTemplate(tmpl)}
                    className="px-2.5 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold rounded-full border border-slate-200 dark:border-slate-700 hover:border-pink-400 hover:text-pink-600 shrink-0 transition"
                  >
                    {tmpl}
                  </button>
                ))}
              </div>

              {/* 入力フォーム */}
              <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`${activePartner.nickname}さんにメッセージ...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 text-white rounded-2xl shadow transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <MessageCircle className="w-14 h-14 text-pink-300" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                チャットするお相手を選択してください
              </h3>
              <p className="text-xs text-slate-400 max-w-xs">
                左側のリストから相手を選ぶか、ホームのユーザーカードからオファーを送ることができます。
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
