export type BodyType = 'ふつう' | '細身' | 'ぽっちゃり' | '筋肉質';

export type BloodType = 'A' | 'B' | 'O' | 'AB';

export type MBTIType = 
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface UserProfile {
  id: string;
  userCode: string; // ユニークな個人識別番号 (例: #PPT-8492-1049)
  nickname: string;
  avatar: string;
  age: number;
  gender: 'female' | 'male' | 'other';
  prefecture: string;
  bloodType: BloodType;
  mbti: MBTIType;
  height: number;
  bodyType: BodyType;
  occupation: string;
  hasAdultOption: boolean; // 大人あり
  bio: string;
  tags: string[];
  isOnline: boolean;
  registeredAt?: string;
}

export interface SearchFilterState {
  ageMin: number;
  ageMax: number;
  heightMin: number;
  heightMax: number;
  bodyTypes: BodyType[];
  prefecture: string;
  hasAdultOptionOnly: boolean;
  keyword: string;
}
