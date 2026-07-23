'use client';

import React from 'react';
import { SearchFilterState, BodyType } from '@/types/user';
import { PREFECTURES } from '@/data/mockUsers';
import { Search, SlidersHorizontal, Heart, RotateCcw, Sparkles } from 'lucide-react';

interface SearchFilterProps {
  filter: SearchFilterState;
  onChangeFilter: (newFilter: SearchFilterState) => void;
  onReset: () => void;
  totalResultsCount: number;
}

const BODY_TYPES: BodyType[] = ['ふつう', '細身', 'ぽっちゃり', '筋肉質'];

export const SearchFilter: React.FC<SearchFilterProps> = ({
  filter,
  onChangeFilter,
  onReset,
  totalResultsCount,
}) => {
  // 体型のトグル
  const handleToggleBodyType = (type: BodyType) => {
    const exists = filter.bodyTypes.includes(type);
    const updated = exists
      ? filter.bodyTypes.filter((t) => t !== type)
      : [...filter.bodyTypes, type];
    onChangeFilter({ ...filter, bodyTypes: updated });
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-5 shadow-xl border border-pink-100 dark:border-slate-800 space-y-4 mb-8 transition-all duration-300">
      
      {/* 上部タイトル ＆ リセット */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-5 h-5 text-pink-500" />
          <h2 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
            <span>ぱぱっと相手検索</span>
            <span className="text-xs bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 px-2 py-0.5 rounded-full font-bold">
              {totalResultsCount}件ヒット
            </span>
          </h2>
        </div>

        <button
          onClick={onReset}
          className="flex items-center space-x-1 text-xs text-slate-400 hover:text-pink-500 font-semibold transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>条件クリア</span>
        </button>
      </div>

      {/* メイン検索欄（キーワード検索） */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3.5 top-3 text-pink-400" />
        <input
          type="text"
          placeholder="キーワード、趣味、MBTI、職種などで探す (例: アパレル, ENFP, ドライブ)"
          value={filter.keyword}
          onChange={(e) => onChangeFilter({ ...filter, keyword: e.target.value })}
          className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-inner"
        />
      </div>

      {/* 検索条件グリッド（年齢・体型・身長・大人あり・地域） */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        
        {/* 年齢指定 */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex justify-between">
            <span>年齢条件</span>
            <span className="text-pink-500 font-bold">{filter.ageMin}歳 〜 {filter.ageMax}歳</span>
          </label>
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="range"
              min={18}
              max={50}
              value={filter.ageMin}
              onChange={(e) => onChangeFilter({ ...filter, ageMin: Number(e.target.value) })}
              className="w-full accent-pink-500"
            />
            <span className="text-xs text-slate-400">〜</span>
            <input
              type="range"
              min={18}
              max={60}
              value={filter.ageMax}
              onChange={(e) => onChangeFilter({ ...filter, ageMax: Number(e.target.value) })}
              className="w-full accent-pink-500"
            />
          </div>
        </div>

        {/* 身長指定 */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex justify-between">
            <span>身長条件</span>
            <span className="text-pink-500 font-bold">{filter.heightMin}cm 以上</span>
          </label>
          <input
            type="range"
            min={140}
            max={190}
            value={filter.heightMin}
            onChange={(e) => onChangeFilter({ ...filter, heightMin: Number(e.target.value) })}
            className="w-full accent-pink-500 mt-2"
          />
        </div>

        {/* 地域選択 */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
            地域・都道府県
          </label>
          <select
            value={filter.prefecture}
            onChange={(e) => onChangeFilter({ ...filter, prefecture: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white"
          >
            {PREFECTURES.map((pref) => (
              <option key={pref} value={pref}>{pref}</option>
            ))}
          </select>
        </div>

        {/* 条件: 「大人あり」トグル */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
            条件絞り込み
          </label>
          <button
            type="button"
            onClick={() => onChangeFilter({ ...filter, hasAdultOptionOnly: !filter.hasAdultOptionOnly })}
            className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-between shadow-sm ${
              filter.hasAdultOptionOnly
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-transparent shadow-pink-500/20'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Heart className={`w-3.5 h-3.5 ${filter.hasAdultOptionOnly ? 'fill-white text-white' : 'text-pink-500'}`} />
              <span>「大人あり」のみ表示</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20">
              {filter.hasAdultOptionOnly ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

      </div>

      {/* 体型選択タグボタン */}
      <div className="pt-2">
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
          体型フィルター (複数選択可)
        </label>
        <div className="flex flex-wrap gap-2">
          {BODY_TYPES.map((type) => {
            const selected = filter.bodyTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleToggleBodyType(type)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition duration-150 ${
                  selected
                    ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-500/20 scale-105'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-pink-300'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
