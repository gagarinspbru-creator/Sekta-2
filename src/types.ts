export interface Resources {
  stones: number;
  qi: number;
  prestige: number;
  herbs: number;
  ore: number;
  beastMaterials: number;
  contribution: number;
}

export interface Buildings {
  mainHall: number;
  mine: number;
  cave: number;
  alchemyLab: number;
  herbGarden: number;
  armory: number;
  library: number;
  market: number;
  arena: number;
}

export interface Artifact {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'talisman';
  rarity: Rarity;
  powerBonus: number;
}

export interface Inventory {
  breakthroughPills: number;
  recoveryPills: number;
  strengthPills: number;
  artifacts?: Artifact[];
}

export type FormationType = 'Клинок прорыва' | 'Черепаха' | 'Круговая оборона' | 'Волчья стая' | 'Лотос' | 'Триада Земли';
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
  'Период Плавки Ци',
  'Период Фундамента',
  'Период Золотого Пилюля',
  'Период Младенца-Нашествия',
  'Период Трансформации Духа',
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
  health?: number;
  power: number;
  basePower?: number;
  loyalty: number;
  morale?: number;
  combatStats?: {
    attack: number;
    defense: number;
    health: number;
    speed: number;
  };
  workStats?: {
    mining: number;
    farming: number;
    alchemy: number;
    crafting: number;
  };
  buffs?: {
    strengthUntil?: number;
  };
  cultivationStage: number; // index in CULTIVATION_STAGES
  type?: 'inner' | 'outer';
  rank?: RankType;
  equipment?: {
    weapon?: Artifact;
    armor?: Artifact;
    talisman?: Artifact;
  };
}

export interface PlayerProfile {
  level: number;
  exp: number;
  stats: {
    authority: number; // Авторитет
    charisma: number;  // Харизма
    strategy: number;  // Стратегия
    wisdom: number;    // Мудрость
    cunning: number;   // Хитрость
    luck: number;      // Удача
  };
}

export interface GameState {
  player?: PlayerProfile;
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
  alchemyTask?: { type: 'breakthroughPills' | 'recoveryPills' | 'strengthPills'; count: number; finishAt: number };
  craftingTask?: { artifact: Artifact; finishAt: number };
  cultivatingTasks?: Record<string, { finishAt: number }>;
  trainingTasks?: Record<string, { finishAt: number }>;
  arena?: { 
    rating: number;
    duelsPlayed?: number;
    duelsWon?: number;
    tournamentsPlayed?: number;
    tournamentsWon?: number;
  };
  lastUpdate: number;
  lastMoraleUpdate?: number;
}
