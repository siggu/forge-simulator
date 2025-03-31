export interface Item {
  id: string;
  name: string;
  description: string;
  category: 'hero' | 'legendary' | 'mortal';
  maxLevel: number;
  images: string[];
}
