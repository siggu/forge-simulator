export interface Item {
  id: string;
  name: string;
  description: string;
  category: 'hero' | 'legendary' | 'mortal';
  maxLevel: number;
  images: string[];
}

export interface GachaItem {
  id: string;
  name: string;
  category: 'hero' | 'legendary';
  image: string;
}
