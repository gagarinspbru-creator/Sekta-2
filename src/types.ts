export interface Resources {
  stones: number;
  qi: number;
  prestige: number;
  herbs: number;
  ore: number;
}

export interface Buildings {
  mainHall: number;
  mine: number;
  cave: number;
  alchemyLab: number;
  herbGarden: number;
}

export interface Artifact {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory';
  rarity: Rarity;
  powerBonus: number;
}

export interface Inventory {
  breakthroughPills: number;
  artifacts?: Artifact[];
}

export type FormationType = 'Клинок прорыва' | 'Черепаха' | 'Круговая оборона' | 'Волчья стая' | 'Лотос';
export type Rarity = 'Обычный' | 'Редкий' | 'Эпический' | 'Легендарный';
export type Role = 'Воин' | 'Маг' | 'Атакующий' | 'Танк' | 'Поддержка' | 'Ассасин';
export type Element = 'Огонь' | 'Вода' | 'Дерево' | 'Металл' | 'Земля';

export interface TeamSetup {
  id: string;
  name: string;
  members: string[]; // Disciple IDs
  formation: FormationType;
}

export const CULTIVATION_STAGES = [
  'Плавка Ци',
  'Фундамент',
  'Золотая Пилюля',
  'Младенец-Душа',
  'Трансформация Духа',
];

export type RankType = 
  | 'Глава секты' 
  | 'Старейшина' 
  | 'Внутренний ученик' 
  | 'Элита' 
  | 'Новобранец' 
  | 'Внешний ученик' 
  | 'Служащий' 
  | 'Гость'
  | 'Наёмник';

export interface Disciple {
  id: string;
  name: string;
  rarity: Rarity;
  role: Role;
  element: Element;
  level: number;
  exp?: number;
  power: number;
  loyalty: number;
  cultivationStage: number; // index in CULTIVATION_STAGES
  type?: 'inner' | 'outer';
  rank?: RankType;
  equipment?: {
    weapon?: Artifact;
    armor?: Artifact;
    accessory?: Artifact;
  };
}

export interface GameState {
  resources: Resources;
  pendingResources?: Resources;
  buildings: Buildings;
  inventory: Inventory;
  disciples: Disciple[];
  teams: TeamSetup[];
  activeTeamId: string;
  team?: string[];
  formation?: FormationType;
  buildingUpgrades?: Partial<Record<keyof Buildings, { targetLevel: number, finishAt: number }>>;
  alchemyTask?: { count: number; finishAt: number };
  craftingTask?: { artifact: Artifact; finishAt: number };
  cultivatingTasks?: Record<string, { finishAt: number }>;
  arena?: { 
    rating: number;
    duelsPlayed?: number;
    duelsWon?: number;
    tournamentsPlayed?: number;
    tournamentsWon?: number;
  };
  lastUpdate: number;
}
