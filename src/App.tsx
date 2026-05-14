import { useState, useEffect, useRef } from 'react';
import { Pickaxe, Scroll, Users, Home, Settings, Zap, Gem, Award, FlaskConical, Swords, Leaf, Sparkles, Shield, Flame, Skull, Crosshair, Droplets, Mountain, LayoutGrid, List, Pickaxe as MiningIcon, ChevronDown, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameState } from './hooks/useGameState';
import { CULTIVATION_STAGES } from './types';

const RANK_INFO: Record<string, string> = {
  'Глава секты': 'Принимает все стратегические решения, управляет сектой (Тренер/Менеджер)',
  'Старейшина': 'Командиры отрядов, наставники (Ассистент тренера)',
  'Элита': 'Опытные бойцы, основа турнирной силы (Ключевые игроки)',
  'Внутренний ученик': 'Основные боевые единицы, участвуют в турнирах (Основной состав)',
  'Новобранец': 'Молодые таланты, требуют обучения (Молодежный состав)',
  'Внешний ученик': 'Добыча ресурсов, крафт (Персонал)',
  'Служащий': 'Автоматическая добыча сырья, обслуживание зданий (Обслуживающий персонал)',
  'Гость': 'Приглашённые бойцы для конкретных задач',
  'Наёмник': 'Приглашённые бойцы для конкретных задач (Арендованные игроки)'
};

export const getDiscipleRank = (d: any) => d.rank || (d.type === 'inner' || (!d.type && ['Эпический', 'Легендарный', 'Мифический'].includes(d.rarity)) ? 'Внутренний ученик' : 'Внешний ученик');
export const isInnerDisciple = (d: any) => ['Глава секты', 'Старейшина', 'Элита', 'Внутренний ученик', 'Новобранец'].includes(getDiscipleRank(d));

export default function App() {
  const { state, upgradeBuilding, instantUpgradeBuilding, addDisciple, changeDiscipleRank, craftPill, instantCraftPill, craftArtifact, instantCraftArtifact, equipArtifact, unequipArtifact, usePill, promoteDisciple, instantPromoteDisciple, trainDisciple, instantTrainDisciple, clearSave, addCheats, claimArenaReward, updateTactics, updateTeams, claimResources, instantIncreaseInnerLimit } = useGameState();
  const [currentView, setCurrentView] = useState<'overview' | 'buildings' | 'disciples' | 'gacha' | 'alchemy' | 'cultivation' | 'arena' | 'teams' | 'tactics'>('overview');

  const { resources } = state;

  return (
    <div 
      className="flex h-screen overflow-hidden bg-cover bg-center bg-no-repeat text-stone-300 font-serif border-8 border-zinc-900 box-border relative"
      style={{ backgroundImage: "url('/bg.png'), url('/bg.jpg'), url('/bg.jpeg'), linear-gradient(to bottom right, #09090b, #18181b)" }}
    >
      <div className="absolute inset-0 bg-zinc-950/60 pointer-events-none"></div>
      
      {/* Sidebar */}
      <aside className="w-56 bg-zinc-950/40 backdrop-blur-md border-r border-zinc-800 flex flex-col relative z-10">
        <div className="p-4 border-b border-zinc-800 flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-amber-500/70 leading-none mb-1">Секта</span>
          <span className="text-xl font-bold text-amber-400 leading-none">НЕБЕСНЫЙ ПРЕДЕЛ</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <NavItem 
            icon={<LayoutGrid size={18} />}
            label="Овервью" 
            isActive={currentView === 'overview'} 
            onClick={() => setCurrentView('overview')} 
          />
          <NavItem 
            icon={<Home size={18} />}
            label="Территория" 
            isActive={currentView === 'buildings'} 
            onClick={() => setCurrentView('buildings')} 
          />
          <NavItem 
            icon={<FlaskConical size={18} />}
            label="Крафт и алхимия" 
            isActive={currentView === 'alchemy'} 
            onClick={() => setCurrentView('alchemy')} 
          />
          <NavItem 
            icon={<Users size={18} />}
            label="Ученики" 
            isActive={currentView === 'disciples'} 
            onClick={() => setCurrentView('disciples')} 
          />
          <NavItem 
            icon={<Zap size={18} />}
            label="Культивация" 
            isActive={currentView === 'cultivation'} 
            onClick={() => setCurrentView('cultivation')} 
          />
          <NavItem 
            icon={<Users size={18} />}
            label="Команды" 
            isActive={currentView === 'teams'} 
            onClick={() => setCurrentView('teams')} 
          />
          <NavItem 
            icon={<Shield size={18} />}
            label="Тактика" 
            isActive={currentView === 'tactics'} 
            onClick={() => setCurrentView('tactics')} 
          />
          <NavItem 
            icon={<Sparkles size={18} />}
            label="Призыв" 
            isActive={currentView === 'gacha'} 
            onClick={() => setCurrentView('gacha')} 
          />
          <NavItem 
            icon={<Swords size={18} />}
            label="Арена" 
            isActive={currentView === 'arena'} 
            onClick={() => setCurrentView('arena')} 
          />
        </nav>
        <div className="p-4 flex flex-col gap-2">
          <button 
            onClick={addCheats}
            className="flex items-center gap-2 text-[10px] uppercase text-amber-500 hover:text-amber-400 transition-colors w-full p-2 border border-amber-500/30 hover:bg-amber-500/10 rounded-sm justify-center mb-2"
          >
            <Sparkles size={12} /> Читы (+Ресурсы)
          </button>
          <button 
            onClick={clearSave}
            className="flex items-center gap-2 text-[10px] uppercase text-stone-500 hover:text-red-400 transition-colors w-full p-2 border border-zinc-800 hover:bg-zinc-900/60 backdrop-blur-md rounded-sm justify-center"
          >
            <Settings size={12} /> Начать заново
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <header className="h-20 border-b border-amber-500/30 bg-zinc-900/50 flex items-center justify-between px-8 relative z-10">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <ResourceItem value={Math.floor(resources.stones)} label="Духовные Камни" colorScheme="sky" symbol="֏" />
            <ResourceItem value={Math.floor(resources.qi)} label="Энергия Ци" colorScheme="purple" symbol="⚡" />
            <ResourceItem value={Math.floor(resources.herbs)} label="Травы" colorScheme="sky" symbol="🌿" />
            <ResourceItem value={Math.floor(resources.ore)} label="Руда" colorScheme="amber" symbol="⛏" />
            <ResourceItem value={Math.floor(resources.beastMaterials || 0)} label="Материалы" colorScheme="rose" symbol="🦴" />
            <ResourceItem value={Math.floor(resources.contribution || 0)} label="Вклад" colorScheme="emerald" symbol="✦" />
            <ResourceItem value={resources.prestige} label="Репутация" colorScheme="amber" symbol="★" />
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-[10px] uppercase text-stone-500 mb-0.5">Стадия Главы</div>
            <div className="text-amber-400 text-sm font-medium">
              Зарождение Души (Ранг III)
            </div>
          </div>
        </header>

        {/* Views */}
        <main className="flex-1 overflow-y-auto p-8 bg-zinc-950/60 backdrop-blur-md">
          <div className="max-w-5xl mx-auto">
            {currentView === 'overview' && <OverviewView state={state} />}
            {currentView === 'buildings' && <BuildingsView state={state} onUpgrade={upgradeBuilding} onInstantUpgrade={instantUpgradeBuilding} onClaim={claimResources} />}
            {currentView === 'disciples' && <DisciplesView state={state} onEquip={equipArtifact} onUnequip={unequipArtifact} onChangeRank={changeDiscipleRank} onUsePill={usePill} />}
            {currentView === 'gacha' && <GachaView state={state} onAdd={addDisciple} onInstantLimit={instantIncreaseInnerLimit} />}
            {currentView === 'alchemy' && <AlchemyView state={state} onCraftPill={craftPill} onInstantCraftPill={instantCraftPill} onCraftArtifact={craftArtifact} onInstantCraftArtifact={instantCraftArtifact} />}
            {currentView === 'cultivation' && <CultivationView state={state} onPromote={promoteDisciple} onInstantPromote={instantPromoteDisciple} onTrain={trainDisciple} onInstantTrain={instantTrainDisciple} />}
            {currentView === 'teams' && <TacticsView state={state} onUpdate={updateTactics} onUpdateTeams={updateTeams} initialTab="teams" />}
            {currentView === 'tactics' && <TacticsView state={state} onUpdate={updateTactics} onUpdateTeams={updateTeams} initialTab="tactics" />}
            {currentView === 'arena' && <ArenaView state={state} onReward={claimArenaReward} />}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="h-6 bg-zinc-950/60 backdrop-blur-md border-t border-zinc-900 px-6 flex items-center justify-between text-[9px] font-mono text-zinc-600">
          <div className="flex gap-6">
            <span>ВЕРСИЯ: 0.1.5</span>
            <span>СЕРВЕР: ДУХОВНЫЙ ПИК</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500/50"></span>
            <span>СВЯЗЬ С НЕБЕСАМИ СТАБИЛЬНА</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ----- Components & Views -----

function NavItem({ label, isActive, onClick, icon }: { label: string, isActive: boolean, onClick: () => void, icon?: any }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${
        isActive 
          ? 'bg-zinc-900/60 backdrop-blur-md border-l-2 border-amber-500 text-amber-400' 
          : 'text-stone-500 hover:text-sky-200 border-l-2 border-transparent'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ResourceItem({ value, label, colorScheme, symbol }: { value: number, label: string, colorScheme: 'sky' | 'purple' | 'amber' | 'emerald' | 'rose', symbol: string }) {
  const colorMap = {
    sky: 'text-sky-200',
    purple: 'text-purple-200',
    amber: 'text-amber-200',
    emerald: 'text-emerald-200',
    rose: 'text-rose-200'
  };
  const colorClass = colorMap[colorScheme];
  
  return (
    <div className="flex flex-col">
      <span className={`text-[10px] uppercase ${colorClass} opacity-50`}>{label}</span>
      <span className={`${colorClass} font-mono`}>{value.toLocaleString()} <span className="text-[10px] opacity-50">{symbol}</span></span>
    </div>
  );
}

const BUILDING_DATA: Record<string, any> = {
  mainHall: {
    title: "Главный зал",
    description: "Сердце секты. Увеличивает престиж и лимит учеников.",
    icon: <Home className="text-amber-400 opacity-80" size={32} />,
    getStats: (level: number) => [
      { label: 'Лимит учеников', value: 10 + level * 5, isRate: false },
      { label: 'Бонус престижа', value: `+${level * 10}%`, isRate: false }
    ],
    getCost: (level: number) => ({ stones: level > 0 ? level * 500 : 500 })
  },
  cave: {
    title: "Духовная пещера",
    description: "Ускоряет генерацию Ци и тренировки.",
    icon: <Zap className="text-purple-400 opacity-80" size={32} />,
    getStats: (level: number) => [
      { label: 'Производство Ци', value: level * 2, isRate: true, symbol: 'Ци' }
    ],
    getCost: (level: number) => ({ stones: level > 0 ? level * 300 : 300, ore: level > 0 ? level * 150 : 150 })
  },
  herbGarden: {
    title: "Духовные поля",
    description: "Выращивание духовных трав для алхимии.",
    icon: <Leaf className="text-amber-400 opacity-80" size={32} />,
    getStats: (level: number) => [
      { label: 'Сбор трав', value: level * 1.5, isRate: true, symbol: 'Травы' }
    ],
    getCost: (level: number) => ({ stones: level > 0 ? level * 400 + 400 : 500 })
  },
  alchemyLab: {
    title: "Алхимическая лаборатория",
    description: "Крафт пилюль (лечение, прорыв, сила).",
    icon: <FlaskConical className="text-purple-400 opacity-80" size={32} />,
    getStats: (level: number) => [
      { label: 'Шанс успеха', value: `${Math.min(95, 50 + level * 5)}%`, isRate: false },
      { label: 'Время крафта', value: `${Math.max(1, 10 - level)}с`, isRate: false }
    ],
    getCost: (level: number) => ({ stones: level > 0 ? level * 800 + 800 : 1000, herbs: level > 0 ? level * 200 : 200 })
  },
  armory: {
    title: "Оружейная",
    description: "Крафт оружия, брони, талисманов.",
    icon: <Shield className="text-stone-400 opacity-80" size={32} />,
    getStats: (level: number) => [
      { label: 'Качество крафта', value: `+${level * 2}%`, isRate: false },
      { label: 'Время крафта', value: `${Math.max(1, 15 - level)}с`, isRate: false }
    ],
    getCost: (level: number) => ({ stones: level > 0 ? level * 600 + 600 : 800, ore: level > 0 ? level * 200 : 200 })
  },
  library: {
    title: "Библиотека",
    description: "Изучение техник, мануалов, расшифровка свитков.",
    icon: <Scroll className="text-amber-200 opacity-80" size={32} />,
    getStats: (level: number) => [
      { label: 'Скорость изучения', value: `+${level * 10}%`, isRate: false },
      { label: 'Макс. техник', value: 2 + level, isRate: false }
    ],
    getCost: (level: number) => ({ stones: level > 0 ? level * 500 + 500 : 700 })
  },
  mine: {
    title: "Рудник",
    description: "Добыча духовных камней и руды.",
    icon: <Pickaxe className="text-sky-400 opacity-80" size={32} />,
    getStats: (level: number) => [
      { label: 'Добыча камней', value: level * 5, isRate: true, symbol: '֏' },
      { label: 'Добыча руды', value: level * 1, isRate: true, symbol: 'Руда' }
    ],
    getCost: (level: number) => ({ stones: level > 0 ? level * 400 : 400 })
  },
  market: {
    title: "Рынок",
    description: "Торговля ресурсами, вербовка учеников.",
    icon: <Users className="text-emerald-400 opacity-80" size={32} />,
    getStats: (level: number) => [
      { label: 'Скидка на рынке', value: `${Math.min(50, level * 2)}%`, isRate: false },
      { label: 'Слоты вербовки', value: 1 + level, isRate: false }
    ],
    getCost: (level: number) => ({ stones: level > 0 ? level * 500 + 500 : 600 })
  },
  arena: {
    title: "Арена",
    description: "Проведение турниров, тренировочные бои.",
    icon: <Swords className="text-red-400 opacity-80" size={32} />,
    getStats: (level: number) => [
      { label: 'Награда Арены', value: `+${level * 5}%`, isRate: false },
      { label: 'Слоты турнира', value: 4 + level * 2, isRate: false }
    ],
    getCost: (level: number) => ({ stones: level > 0 ? level * 1000 + 1000 : 1500 })
  }
};

function OverviewView({ state }: { state: any }) {
  const { resources, buildings, disciples, arena } = state;
  const innerDisciples = disciples.filter(isInnerDisciple);
  const outerDisciples = disciples.filter((d: any) => !isInnerDisciple(d));
  
  const totalPower = disciples.reduce((acc: number, d: any) => acc + d.power, 0);
  const avgPower = disciples.length > 0 ? Math.floor(totalPower / disciples.length) : 0;
  
  const [historyMode, setHistoryMode] = useState<'1v1' | 'team'>('1v1');
  const [historyIndex, setHistoryIndex] = useState(0);
  const filteredHistory = arena?.history?.filter((h: any) => h.mode === historyMode).reverse() || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-light text-stone-100 mb-2">Обзор Секты</h2>
        <p className="text-stone-500 text-sm">Сводная информация о состоянии вашей секты, ресурсах и учениках.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm">
          <div className="text-stone-500 text-xs uppercase tracking-wider mb-2">Всего учеников</div>
          <div className="text-2xl text-stone-200 font-light">{disciples.length}</div>
          <div className="text-xs text-stone-500 mt-2 flex justify-between">
            <span>Внутренние: <span className="text-purple-400">{innerDisciples.length}</span></span>
            <span>Внешние: <span className="text-amber-500">{outerDisciples.length}</span></span>
          </div>
        </div>
        <div className="p-4 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm">
          <div className="text-stone-500 text-xs uppercase tracking-wider mb-2">Общая Мощь</div>
          <div className="text-2xl text-amber-500 font-light">{totalPower}</div>
          <div className="text-xs text-stone-500 mt-2">
            В среднем: <span className="text-stone-300">{avgPower}</span>
          </div>
        </div>
        <div className="p-4 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm">
          <div className="text-stone-500 text-xs uppercase tracking-wider mb-2">Арена</div>
          <div className="text-2xl text-sky-400 font-light">{arena?.rating || 1000}</div>
          <div className="text-xs text-stone-500 mt-2">
            Рейтинг секты
          </div>
        </div>
        <div className="p-4 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm">
          <div className="text-stone-500 text-xs uppercase tracking-wider mb-2">События</div>
          <div className="text-emerald-400 font-light text-xs mt-3 uppercase tracking-widest">Турнир через 2 дн.</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm">
          <h3 className="text-sm uppercase text-amber-500 mb-4 tracking-widest flex items-center justify-between gap-2">
            <span className="flex items-center gap-2"><User size={14} /> Профиль Главы</span>
            <span className="text-[10px] text-zinc-500 capitalize font-normal opacity-60">Опыт дается за постройки, найм и крафт</span>
          </h3>
          {state.player && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
                <div className="text-stone-300 text-sm">Уровень / Опыт</div>
                <div className="text-stone-400 text-xs font-mono">{state.player.level} <span className="opacity-50">/ {state.player.exp}/{state.player.level * 100} xp</span></div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <div className="text-stone-500 text-[10px] uppercase tracking-widest">Авторитет</div>
                  <div className="text-amber-400 text-xs font-mono">{state.player.stats.authority}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-stone-500 text-[10px] uppercase tracking-widest">Харизма</div>
                  <div className="text-purple-400 text-xs font-mono">{state.player.stats.charisma}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-stone-500 text-[10px] uppercase tracking-widest">Стратегия</div>
                  <div className="text-sky-400 text-xs font-mono">{state.player.stats.strategy}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-stone-500 text-[10px] uppercase tracking-widest">Мудрость</div>
                  <div className="text-emerald-400 text-xs font-mono">{state.player.stats.wisdom}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-stone-500 text-[10px] uppercase tracking-widest">Хитрость</div>
                  <div className="text-rose-400 text-xs font-mono">{state.player.stats.cunning}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-stone-500 text-[10px] uppercase tracking-widest">Удача</div>
                  <div className="text-stone-300 text-xs font-mono">{state.player.stats.luck}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm">
          <h3 className="text-sm uppercase text-stone-400 mb-4 tracking-widest flex items-center gap-2">
            <Swords size={14} className="text-sky-400" />
            Дуэли и Турниры
          </h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
               <div className="text-stone-300 text-sm">Проведено дуэлей</div>
               <div className="text-stone-400 text-xs font-mono">{arena?.duelsPlayed || 0}</div>
             </div>
             <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
               <div className="text-stone-300 text-sm">Побед в дуэлях</div>
               <div className="text-emerald-400 text-xs font-mono">{arena?.duelsWon || 0}</div>
             </div>
             <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
               <div className="text-stone-300 text-sm">Участий в турнирах</div>
               <div className="text-stone-400 text-xs font-mono">{arena?.tournamentsPlayed || 0}</div>
             </div>
             <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
               <div className="text-stone-300 text-sm">Побед в турнирах</div>
               <div className="text-emerald-400 text-xs font-mono">{arena?.tournamentsWon || 0}</div>
             </div>
          </div>
        </div>

        <div className="p-6 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm">
          <h3 className="text-sm uppercase text-stone-400 mb-4 tracking-widest flex items-center gap-2">
            <FlaskConical size={14} className="text-purple-400" />
            Инвентарь и Ресурсы
          </h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
               <div className="text-stone-300 text-sm">Духовные Камни</div>
               <div className="text-amber-400 text-xs font-mono">{resources.stones}</div>
             </div>
             <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
               <div className="text-stone-300 text-sm">Травы</div>
               <div className="text-emerald-400 text-xs font-mono">{resources.herbs}</div>
             </div>
             <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
               <div className="text-stone-300 text-sm">Руда</div>
               <div className="text-stone-400 text-xs font-mono">{resources.minerals}</div>
             </div>
             <div className="flex justify-between items-center border-b border-zinc-800/50 pb-2">
               <div className="text-stone-300 text-sm">Пилюли / Артефакты</div>
               <div className="text-sky-400 text-xs font-mono">{state.inventory?.pills?.length || 0} / {state.inventory?.artifacts?.length || 0}</div>
             </div>
          </div>
        </div>
        <div className="p-6 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm uppercase text-stone-400 tracking-widest flex items-center gap-2">
              <Scroll size={14} className="text-amber-400" />
              История Сражений
            </h3>
            <div className="flex gap-2">
              <button 
                 onClick={() => { setHistoryMode('1v1'); setHistoryIndex(0); }}
                 className={`px-4 py-1.5 text-[10px] uppercase tracking-widest border transition-colors ${historyMode === '1v1' ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-zinc-800 text-stone-500 hover:border-zinc-700'}`}
              >
                Дуэли
              </button>
              <button 
                 onClick={() => { setHistoryMode('team'); setHistoryIndex(0); }}
                 className={`px-4 py-1.5 text-[10px] uppercase tracking-widest border transition-colors ${historyMode === 'team' ? 'border-purple-500 bg-purple-500/10 text-purple-400' : 'border-zinc-800 text-stone-500 hover:border-zinc-700'}`}
              >
                Турниры
              </button>
            </div>
          </div>
          
          <div className="space-y-3 flex-1 flex flex-col">
            {filteredHistory.length === 0 ? (
              <div className="text-center flex-1 p-6 flex items-center justify-center bg-zinc-950/50 border border-zinc-800 text-stone-500 text-sm">
                История сражений пуста
              </div>
            ) : (
              (() => {
                const h = filteredHistory[historyIndex];
                if (!h) return null;
                return (
                  <div className="flex-1 flex flex-col justify-between h-full space-y-4">
                    <div className="flex flex-col flex-1 md:flex-row md:items-center justify-between p-4 bg-zinc-950/60 backdrop-blur-md border border-zinc-800">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex flex-col items-start w-1/3">
                          <span className="text-stone-300 text-sm font-medium truncate w-full">{h.playerTeamName}</span>
                          <span className="text-amber-400 text-[10px] font-mono mt-0.5">БМ: {h.playerPower}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center px-4 w-1/3">
                          {h.won ? (
                            <span className="text-emerald-500 text-xs uppercase tracking-widest font-bold">Победа</span>
                          ) : (
                            <span className="text-red-500 text-xs uppercase tracking-widest font-bold">Поражение</span>
                          )}
                          <span className="text-zinc-600 text-[10px] uppercase">VS</span>
                        </div>
                        <div className="flex flex-col items-end w-1/3 text-right">
                          <span className="text-stone-300 text-sm font-medium truncate w-full">{h.enemyTeamName}</span>
                          <span className="text-rose-400 text-[10px] font-mono mt-0.5">БМ: {h.enemyPower}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-zinc-800/50">
                      <button 
                         onClick={() => setHistoryIndex(Math.max(0, historyIndex - 1))}
                         disabled={historyIndex === 0}
                         className="p-2 border border-zinc-800 text-stone-500 hover:text-stone-300 hover:border-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-sm"
                      >
                         <ChevronLeft size={16} />
                      </button>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-stone-500 font-mono">
                          {historyIndex + 1} / {filteredHistory.length}
                        </span>
                        <span className="text-[10px] text-zinc-600 font-mono mt-0.5">
                          {new Date(h.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <button 
                         onClick={() => setHistoryIndex(Math.min(filteredHistory.length - 1, historyIndex + 1))}
                         disabled={historyIndex === filteredHistory.length - 1}
                         className="p-2 border border-zinc-800 text-stone-500 hover:text-stone-300 hover:border-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-sm"
                      >
                         <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function BuildingsView({ state, onUpgrade, onInstantUpgrade, onClaim }: { state: any, onUpgrade: any, onInstantUpgrade: any, onClaim: any }) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [timeEnum, setTimeEnum] = useState<'min' | 'hour' | 'day'>('min');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeMultipliers = {
    min: 60,
    hour: 3600,
    day: 86400
  };

  const pending = state.pendingResources || { stones: 0, ore: 0, qi: 0, herbs: 0 };
  const hasPending = pending.stones > 0 || pending.ore > 0 || pending.qi > 0 || pending.herbs > 0;

  if (selectedType && BUILDING_DATA[selectedType]) {
    const data = BUILDING_DATA[selectedType];
    const level = state.buildings[selectedType] || 0;
    const costPattern = data.getCost(level);
    const canUpgrade = Object.entries(costPattern).every(([k, v]) => (state.resources[k as keyof typeof state.resources] || 0) >= (v as number));
    const stats = data.getStats(level);
    const nextStats = data.getStats(level + 1);
    
    // Check if upgrading
    const upgrade = state.buildingUpgrades?.[selectedType];
    const isUpgrading = !!upgrade;
    let remainingStr = '';
    let expectedQi = 0;
    
    if (isUpgrading) {
       const remainMs = Math.max(0, upgrade.finishAt - now);
       const remainSec = Math.ceil(remainMs / 1000);
       const m = Math.floor(remainSec / 60);
       const s = remainSec % 60;
       remainingStr = `${m}:${s.toString().padStart(2, '0')}`;
       expectedQi = remainSec * 10;
    }
    
    const canInstant = expectedQi > 0 && state.resources.qi >= expectedQi;
    const durationSeconds = level * 60; // 1 min per level

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <button 
          onClick={() => setSelectedType(null)}
          className="text-stone-400 hover:text-stone-200 text-sm uppercase tracking-widest flex items-center gap-2 transition-colors mb-4"
        >
          &larr; Назад к территории
        </button>

        <div className="p-8 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full"></div>
          
          <div className="flex items-start justify-between mb-8 relative z-10">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded-sm">
                {data.icon}
              </div>
              <div>
                <h2 className="text-3xl font-light text-stone-100 mb-2">{data.title}</h2>
                <div className="inline-flex px-3 py-1 bg-zinc-950/60 backdrop-blur-md border border-zinc-800 text-[10px] text-zinc-400 uppercase tracking-widest">
                  Уровень <span className="text-stone-200 ml-2 font-mono text-sm">{level}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setTimeEnum('min')}
                className={`px-3 py-1 text-[10px] uppercase tracking-widest border transition-colors ${timeEnum === 'min' ? 'border-amber-500/50 text-amber-400 bg-amber-500/10' : 'border-zinc-800 text-stone-500 hover:text-stone-300'}`}
              >
                /Мин
              </button>
              <button 
                onClick={() => setTimeEnum('hour')}
                className={`px-3 py-1 text-[10px] uppercase tracking-widest border transition-colors ${timeEnum === 'hour' ? 'border-amber-500/50 text-amber-400 bg-amber-500/10' : 'border-zinc-800 text-stone-500 hover:text-stone-300'}`}
              >
                /Час
              </button>
              <button 
                onClick={() => setTimeEnum('day')}
                className={`px-3 py-1 text-[10px] uppercase tracking-widest border transition-colors ${timeEnum === 'day' ? 'border-amber-500/50 text-amber-400 bg-amber-500/10' : 'border-zinc-800 text-stone-500 hover:text-stone-300'}`}
              >
                /День
              </button>
            </div>
          </div>

          <p className="text-stone-400 mb-8 max-w-2xl leading-relaxed">
            {data.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-10">
            <div className="space-y-4">
              <h3 className="text-sm uppercase text-stone-500 tracking-widest border-b border-zinc-800 pb-2">Текущие показатели</h3>
              <div className="space-y-3">
                {stats.map((stat: any, i: number) => {
                  let val = stat.isRate ? stat.value * timeMultipliers[timeEnum] : stat.value;
                  if (typeof val === 'number') val = parseFloat(val.toFixed(1));
                  return (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-stone-400">{stat.label}</span>
                      <span className="text-stone-200 font-mono">
                         {stat.isRate && '+'}{val} {stat.symbol && <span className="text-[10px] text-stone-500 uppercase ml-1">{stat.symbol}</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm uppercase text-amber-500/70 tracking-widest border-b border-zinc-800 pb-2">След. Уровень</h3>
              <div className="space-y-3">
                {nextStats.map((stat: any, i: number) => {
                  let val = stat.isRate ? stat.value * timeMultipliers[timeEnum] : stat.value;
                  if (typeof val === 'number') val = parseFloat(val.toFixed(1));
                  return (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-amber-500/50">{stat.label}</span>
                      <span className="text-amber-400 font-mono">
                         {stat.isRate && '+'}{val} {stat.symbol && <span className="text-[10px] text-amber-500/50 uppercase ml-1">{stat.symbol}</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
            <div className="flex flex-col text-center md:text-left self-start md:self-auto">
              <span className="text-[10px] uppercase text-stone-500 mb-1">Стоимость (Время: {durationSeconds / 60} мин)</span>
              <div className="flex gap-4">
                {Object.entries(costPattern).map(([k, v]) => {
                    const symbols: any = { stones: '֏', ore: 'Руда', herbs: 'Травы', qi: 'Ци' };
                    const hasEnough = (state.resources[k as keyof typeof state.resources] || 0) >= (v as number);
                    return (
                        <span key={k} className={`${hasEnough ? 'text-amber-400' : 'text-red-400'} font-mono text-lg`}>
                            {v as number} <span className="text-sm text-stone-500">{symbols[k] || k}</span>
                        </span>
                    );
                })}
              </div>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              {isUpgrading ? (
                <>
                  <div className="flex-1 md:flex-none px-6 py-3 border border-sky-500/30 text-sky-400 bg-sky-500/10 text-xs font-mono font-bold tracking-widest flex justify-center items-center gap-2">
                    <span className="text-[10px] uppercase text-sky-500/70">УЛУЧШЕНИЕ</span>
                    {remainingStr}
                  </div>
                  <motion.button 
                    whileHover={canInstant ? { scale: 1.02 } : {}}
                    whileTap={canInstant ? { scale: 0.98 } : {}}
                    onClick={() => onInstantUpgrade(selectedType)}
                    disabled={!canInstant}
                    className={`flex-1 md:flex-none px-6 py-3 border text-xs uppercase font-bold tracking-widest transition-colors flex justify-center items-center gap-2 ${
                      canInstant 
                        ? 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                        : 'border-zinc-800 text-stone-600 cursor-not-allowed'
                    }`}
                  >
                    <Zap size={14} /> {expectedQi} Ци
                  </motion.button>
                </>
              ) : (
                <motion.button 
                  whileHover={canUpgrade ? { scale: 1.02 } : {}}
                  whileTap={canUpgrade ? { scale: 0.98 } : {}}
                  onClick={() => onUpgrade(selectedType, costPattern, durationSeconds)}
                  disabled={!canUpgrade}
                  className={`w-full md:w-auto px-8 py-3 border text-xs uppercase font-bold tracking-widest transition-colors ${
                    canUpgrade 
                      ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                      : 'border-zinc-800 text-stone-600 cursor-not-allowed'
                  }`}
                >
                  Начать улучшение
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-light text-stone-100 mb-2">Территория Секты</h2>
          <p className="text-stone-500 text-sm">Управляйте зданиями для увеличения добычи ресурсов.</p>
        </div>
        
        {hasPending && (
          <div className="flex items-center gap-4 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 p-3 rounded-sm">
            <div className="flex gap-3 text-[10px] font-mono whitespace-nowrap overflow-x-auto">
                {pending.stones > 0 && <span className="text-amber-400">+{pending.stones.toFixed(0)} ֏</span>}
                {pending.qi > 0 && <span className="text-purple-400">+{pending.qi.toFixed(0)} Ци</span>}
                {pending.herbs > 0 && <span className="text-emerald-400">+{pending.herbs.toFixed(0)} Травы</span>}
                {pending.ore > 0 && <span className="text-sky-400">+{pending.ore.toFixed(0)} Руда</span>}
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClaim}
              className="px-4 py-2 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-[10px] uppercase font-bold tracking-widest transition-colors flex-shrink-0"
            >
              Собрать
            </motion.button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <BuildingCard 
            title={BUILDING_DATA.mainHall.title}
            level={state.buildings.mainHall}
            description={BUILDING_DATA.mainHall.description}
            icon={BUILDING_DATA.mainHall.icon}
            upgrading={state.buildingUpgrades?.mainHall}
            now={now}
            onClick={() => setSelectedType('mainHall')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BuildingCard 
            title={BUILDING_DATA.cave.title}
            level={state.buildings.cave}
            description={BUILDING_DATA.cave.description}
            icon={BUILDING_DATA.cave.icon}
            upgrading={state.buildingUpgrades?.cave}
            now={now}
            onClick={() => setSelectedType('cave')}
          />
          <BuildingCard 
            title={BUILDING_DATA.mine.title}
            level={state.buildings.mine}
            description={BUILDING_DATA.mine.description}
            icon={BUILDING_DATA.mine.icon}
            upgrading={state.buildingUpgrades?.mine}
            now={now}
            onClick={() => setSelectedType('mine')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BuildingCard 
            title={BUILDING_DATA.herbGarden.title}
            level={state.buildings.herbGarden}
            description={BUILDING_DATA.herbGarden.description}
            icon={BUILDING_DATA.herbGarden.icon}
            upgrading={state.buildingUpgrades?.herbGarden}
            now={now}
            onClick={() => setSelectedType('herbGarden')}
          />
          <BuildingCard 
            title={BUILDING_DATA.alchemyLab.title}
            level={state.buildings.alchemyLab}
            description={BUILDING_DATA.alchemyLab.description}
            icon={BUILDING_DATA.alchemyLab.icon}
            upgrading={state.buildingUpgrades?.alchemyLab}
            now={now}
            onClick={() => setSelectedType('alchemyLab')}
          />
          <BuildingCard 
            title={BUILDING_DATA.armory.title}
            level={state.buildings.armory || 0}
            description={BUILDING_DATA.armory.description}
            icon={BUILDING_DATA.armory.icon}
            upgrading={state.buildingUpgrades?.armory}
            now={now}
            onClick={() => setSelectedType('armory')}
          />
          <BuildingCard 
            title={BUILDING_DATA.library.title}
            level={state.buildings.library || 0}
            description={BUILDING_DATA.library.description}
            icon={BUILDING_DATA.library.icon}
            upgrading={state.buildingUpgrades?.library}
            now={now}
            onClick={() => setSelectedType('library')}
          />
          <BuildingCard 
            title={BUILDING_DATA.market.title}
            level={state.buildings.market || 0}
            description={BUILDING_DATA.market.description}
            icon={BUILDING_DATA.market.icon}
            upgrading={state.buildingUpgrades?.market}
            now={now}
            onClick={() => setSelectedType('market')}
          />
          <BuildingCard 
            title={BUILDING_DATA.arena.title}
            level={state.buildings.arena || 0}
            description={BUILDING_DATA.arena.description}
            icon={BUILDING_DATA.arena.icon}
            upgrading={state.buildingUpgrades?.arena}
            now={now}
            onClick={() => setSelectedType('arena')}
          />
        </div>
      </div>
    </div>
  );
}

function BuildingCard({ title, level, description, icon, upgrading, now, onClick }: any) {
  let remainingStr = null;
  if (upgrading) {
     const remainMs = Math.max(0, upgrading.finishAt - now);
     const remainSec = Math.ceil(remainMs / 1000);
     const m = Math.floor(remainSec / 60);
     const s = remainSec % 60;
     remainingStr = `${m}:${s.toString().padStart(2, '0')}`;
  }

  return (
    <div 
      onClick={onClick}
      className={`p-6 bg-zinc-900/60 backdrop-blur-md border ${upgrading ? 'border-sky-500/30' : 'border-zinc-800'} rounded-sm relative flex flex-col hover:border-amber-500/30 transition-colors cursor-pointer group`}
    >
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-transparent group-hover:border-amber-500/70 transition-colors"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-transparent group-hover:border-amber-500/70 transition-colors"></div>
      
      <div className="flex items-start justify-between mb-4">
        <div className={`transform group-hover:scale-110 transition-transform origin-top-left ${upgrading ? 'text-sky-500/50' : 'text-zinc-500'}`}>{icon}</div>
        
        <div className="flex flex-col items-end gap-1">
          <div className="text-center px-4 py-2 bg-zinc-950/60 backdrop-blur-md border border-zinc-800 group-hover:border-amber-500/30 transition-colors">
            <div className="text-[10px] text-zinc-500 uppercase">Уровень</div>
            <div className="text-lg text-stone-100 font-mono">{level}</div>
          </div>
          {upgrading && (
            <div className="text-[10px] uppercase text-sky-400 font-mono bg-sky-500/10 px-2 py-1 border border-sky-500/20">
              {remainingStr}
            </div>
          )}
        </div>
      </div>
      
      <h3 className={`text-xl font-light mb-2 transition-colors ${upgrading ? 'text-sky-400' : 'text-stone-100 group-hover:text-amber-400'}`}>
        {title} {upgrading && ' (Улучшается)'}
      </h3>
      <p className="text-sm text-stone-400 flex-1 leading-relaxed">{description}</p>
    </div>
  );
}

function DisciplesView({ state, onEquip, onUnequip, onChangeRank, onUsePill }: { state: any, onEquip: any, onUnequip: any, onChangeRank?: any, onUsePill?: any }) {
  const { disciples, inventory, teams, activeTeamId } = state;
  const activeTeam = teams?.find((t: any) => t.id === activeTeamId) || teams?.[0] || { members: [] };
  const team = activeTeam?.members || [];
  const [selectedDiscipleId, setSelectedDiscipleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'inner' | 'outer'>('inner');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortByPower, setSortByPower] = useState(true);

  const getRank = (d: any) => d.rank || (d.type === 'inner' || (!d.type && ['Эпический', 'Легендарный', 'Мифический'].includes(d.rarity)) ? 'Внутренний ученик' : 'Внешний ученик');
  const isInnerRank = (r: string) => ['Глава секты', 'Старейшина', 'Элита', 'Внутренний ученик', 'Новобранец'].includes(r);

  const isInner = (d: any) => isInnerRank(getRank(d));
  const isOuter = (d: any) => !isInner(d);

  const innerDisciples = disciples.filter(isInner);
  const outerDisciples = disciples.filter(isOuter);

  const getDiscipleStatus = (d: any) => {
    if (team.includes(d.id)) return { text: 'В команде', color: 'text-sky-400 border-sky-400/30 bg-sky-400/10' };
    
    if (isOuter(d)) {
      if (d.element === 'Земля' || d.element === 'Металл') return { text: 'В шахте', color: 'text-amber-500 border-amber-500/30 bg-amber-500/10' };
      if (d.element === 'Дерево' || d.element === 'Вода') return { text: 'В полях', color: 'text-green-500 border-green-500/30 bg-green-500/10' };
      return { text: 'Алхимия', color: 'text-purple-400 border-purple-400/30 bg-purple-400/10' };
    }
    
    return { text: 'Медитация', color: 'text-zinc-400 border-zinc-800 bg-zinc-950/60 backdrop-blur-md' };
  };

  if (selectedDiscipleId) {
    const d = disciples.find((disc: any) => disc.id === selectedDiscipleId);
    if (!d) {
      setSelectedDiscipleId(null);
      return null;
    }
    const tagClass = getRarityTag(d.rarity);
    const status = getDiscipleStatus(d);

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <button 
          onClick={() => setSelectedDiscipleId(null)}
          className="text-stone-400 hover:text-stone-200 text-sm uppercase tracking-widest flex items-center gap-2 transition-colors mb-4"
        >
          &larr; Назад к списку
        </button>

        <div className="p-8 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-64 h-64 blur-3xl opacity-20 rounded-full ${tagClass.bg.replace('bg-', 'bg-')}`}></div>
          
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className={`w-48 h-64 border ${tagClass.border} flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm self-start shrink-0 relative overflow-hidden group`}>
               <div className={`absolute inset-0 opacity-20 ${tagClass.bg}`}></div>
               <Users size={64} className="text-zinc-700/50" />
               <div className={`absolute bottom-0 inset-x-0 p-2 text-center text-[10px] uppercase font-bold tracking-widest ${tagClass.text} ${tagClass.borderTop} bg-zinc-950/80`}>
                 {d.rarity}
               </div>
            </div>

            <div className="flex-1 space-y-6">
              <div>
                 <div className="flex items-center gap-3 mb-2 flex-wrap">
                   <h2 className="text-3xl font-light text-stone-100">{d.name}</h2>
                   <div className={`px-2 py-0.5 border text-[10px] uppercase ${status.color}`}>
                     {status.text}
                   </div>
                   {onChangeRank && (
                     <div className="relative group/rank ml-auto flex flex-col items-end">
                       <div className="relative">
                         <select 
                           value={getDiscipleRank(d)}
                           onChange={(e) => onChangeRank(d.id, e.target.value)}
                           className="appearance-none bg-zinc-950/60 backdrop-blur-md border border-zinc-800 text-stone-300 text-xs px-3 py-1 pr-8 outline-none hover:border-amber-500/50 transition-colors cursor-pointer"
                         >
                           {['Глава секты', 'Старейшина', 'Элита', 'Внутренний ученик', 'Новобранец', 'Внешний ученик', 'Служащий', 'Гость', 'Наёмник'].map(r => (
                             <option key={r} value={r}>{r}</option>
                           ))}
                         </select>
                         <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                       </div>
                     </div>
                   )}
                 </div>
                 <div className="text-[10px] text-zinc-500 mt-1 mb-3 bg-zinc-950/60 backdrop-blur-md p-2 border border-zinc-800/50 rounded-xs inline-block">
                   <span className="text-stone-400 font-medium">{getDiscipleRank(d)}:</span> {RANK_INFO[getDiscipleRank(d)]}
                 </div>
                 <div className="flex items-center gap-4 text-sm text-stone-400">
                   <span className="flex items-center gap-1.5"><Swords size={14}/> {d.role}</span>
                   <span className="flex items-center gap-1.5"><Sparkles size={14}/> {d.element}</span>
                   <span className="text-amber-500">[{CULTIVATION_STAGES[d.cultivationStage]}]</span>
                   <span className="text-stone-300 font-mono bg-zinc-950/60 backdrop-blur-md px-2 py-1 border border-zinc-800">Ур. {d.level || 1}</span>
                 </div>
                 <div className="flex items-center gap-4 text-sm text-stone-400 mt-2">
                   <div className="flex flex-col gap-1 text-xs">
                     <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Лояльность: <span className="text-stone-300 font-mono">{Math.floor(d.loyalty || 0)}/100</span></span>
                     <div className="w-32 bg-zinc-900/60 backdrop-blur-md h-1 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500" style={{ width: `${Math.floor(d.loyalty || 0)}%` }}></div>
                     </div>
                   </div>
                   <div className="flex flex-col gap-1 text-xs">
                     <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Мораль: <span className="text-stone-300 font-mono">{Math.floor(d.morale ?? 100)}/100</span></span>
                     <div className="w-32 bg-zinc-900/60 backdrop-blur-md h-1 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500" style={{ width: `${Math.floor(d.morale ?? 100)}%` }}></div>
                     </div>
                   </div>
                 </div>
              </div>

              <div className="p-4 bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded-sm">
                <div className="text-[10px] uppercase text-zinc-500 mb-1">Боевая Мощь</div>
                <div className="text-2xl text-amber-400 font-mono tracking-wider">{d.power}</div>
                <div className="w-full bg-zinc-900/60 backdrop-blur-md h-1 mt-2 rounded-full overflow-hidden">
                  <div className={`h-full ${tagClass.bg}`} style={{ width: `${(d.power / 500) * 100}%` }}></div>
                </div>

                {d.combatStats && (
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between border-b border-zinc-800/50 pb-1">
                      <span className="text-stone-500">Атака:</span><span className="text-stone-300 font-mono">{Math.floor(d.power * 1.5)}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800/50 pb-1">
                      <span className="text-stone-500">Защита:</span><span className="text-stone-300 font-mono">{Math.floor(d.power * 1.0)}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800/50 pb-1">
                      <span className="text-stone-500">Здоровье:</span><span className="text-emerald-400 font-mono">{Math.floor(d.power * 12)}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800/50 pb-1">
                      <span className="text-stone-500">Скорость:</span><span className="text-sky-300 font-mono">{Math.floor(d.power * 1.0)}</span>
                    </div>
                  </div>
                )}
                
                {d.workStats && (
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between border-b border-zinc-800/50 pb-1">
                      <span className="text-stone-500">Добыча (шахта):</span><span className="text-amber-400 font-mono">{d.workStats.mining}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800/50 pb-1">
                      <span className="text-stone-500">Сбор (сады):</span><span className="text-green-400 font-mono">{d.workStats.farming}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800/50 pb-1">
                      <span className="text-stone-500">Алхимия:</span><span className="text-purple-400 font-mono">{d.workStats.alchemy}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800/50 pb-1">
                      <span className="text-stone-500">Крафт:</span><span className="text-zinc-300 font-mono">{d.workStats.crafting}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="text-sm uppercase text-stone-400 tracking-widest border-b border-zinc-800 pb-2">Экипировка</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['weapon', 'armor', 'talisman'] as const).map(slot => {
                     const equipped = (d.equipment || {})[slot];
                     const slotNames = { weapon: 'Оружие', armor: 'Броня', talisman: 'Талисман' };
                     const availableInInventory = (inventory.artifacts || []).filter((a: any) => a.type === slot);

                     return (
                       <div key={slot} className="flex flex-col gap-2 p-4 border border-zinc-800/50 bg-zinc-950/50">
                          <div className="flex justify-between items-center text-xs border-b border-zinc-800/50 pb-2">
                            <span className="text-stone-400 font-mono uppercase text-[10px]">{slotNames[slot]}</span>
                            {equipped && (
                              <button onClick={() => onUnequip(d.id, slot)} className="text-[10px] text-red-500 hover:text-red-400 transition-colors uppercase">Снять</button>
                            )}
                          </div>
                          
                          {equipped ? (
                             <div className="flex flex-col pt-2">
                               <div className={`font-medium text-sm truncate ${getRarityTag(equipped.rarity).text}`}>{equipped.name}</div>
                               <div className="text-[10px] text-zinc-500 mt-1">{equipped.rarity} • БМ +{equipped.powerBonus}</div>
                             </div>
                          ) : (
                             <div className="text-stone-600 italic text-[10px] pt-2">
                               Нет экипировки
                             </div>
                          )}

                          {availableInInventory.length > 0 && !equipped && (
                            <div className="mt-3 pt-3 border-t border-zinc-800/50 flex flex-col gap-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
                              <span className="text-[10px] text-zinc-500 uppercase">Доступно:</span>
                              {availableInInventory.map((art: any) => (
                                <button 
                                  key={art.id} 
                                  onClick={() => onEquip(d.id, art.id)}
                                  className="text-left p-2 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 backdrop-blur-md transition-colors group"
                                >
                                  <div className={`text-[10px] truncate ${getRarityTag(art.rarity).text}`}>{art.name}</div>
                                  <div className="text-[10px] text-zinc-500 group-hover:text-amber-400 transition-colors">+{art.powerBonus} БМ</div>
                                </button>
                              ))}
                            </div>
                          )}
                       </div>
                     );
                  })}
                </div>
              </div>

              {/* PILLS SECTION */}
              <div className="space-y-4">
                <h4 className="text-sm uppercase text-stone-400 tracking-widest border-b border-zinc-800 pb-2">Усиление пилюлями</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex-1 border border-zinc-800/50 bg-zinc-950/50 p-4">
                    <div className="flex justify-between items-center text-xs mb-2">
                        <span className="text-stone-300 font-mono text-[10px] uppercase">Восстановление</span>
                        <span className="text-emerald-400 font-mono text-[10px]">В наличии: {inventory.recoveryPills || 0}</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 mb-3">Восстанавливает здоровье ученика после боя (+50 HP).</div>
                    <button
                        onClick={() => onUsePill && onUsePill(d.id, 'recoveryPills')}
                        disabled={(inventory.recoveryPills || 0) <= 0 || (d.health || 0) >= 100}
                        className="w-full py-2 border border-emerald-500/30 text-[10px] uppercase font-bold text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Применить
                    </button>
                    {d.health !== undefined && (
                        <div className="mt-2 text-center text-[10px] text-stone-400">
                          Здоровье: {Math.floor(d.health)} / 100
                        </div>
                    )}
                  </div>
                  <div className="flex-1 border border-zinc-800/50 bg-zinc-950/50 p-4">
                    <div className="flex justify-between items-center text-xs mb-2">
                        <span className="text-stone-300 font-mono text-[10px] uppercase">Усиление</span>
                        <span className="text-amber-400 font-mono text-[10px]">В наличии: {inventory.strengthPills || 0}</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 mb-3">Временно увеличивает БМ (+200 БМ на 10 мин).</div>
                    <button
                        onClick={() => onUsePill && onUsePill(d.id, 'strengthPills')}
                        disabled={(inventory.strengthPills || 0) <= 0 || (d.buffs?.strengthUntil && d.buffs.strengthUntil > Date.now())}
                        className="w-full py-2 border border-amber-500/30 text-[10px] uppercase font-bold text-amber-400 hover:bg-amber-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Применить
                    </button>
                    {d.buffs?.strengthUntil && d.buffs.strengthUntil > Date.now() && (
                        <div className="mt-2 text-center text-[10px] text-amber-400 animate-pulse">
                          Активно
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderDiscipleCard = (d: any, isInner: boolean) => {
    const tagClass = getRarityTag(d.rarity);
    const status = getDiscipleStatus(d);

    if (isInner) {
      if (viewMode === 'grid') {
        return (
          <div 
            key={d.id} 
            onClick={() => setSelectedDiscipleId(d.id)}
            className={`flex flex-col border ${tagClass.border} hover:border-amber-500/50 bg-zinc-900/60 backdrop-blur-md cursor-pointer transition-colors group h-64 relative overflow-hidden`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 rounded-full ${tagClass.bg}`}></div>
            <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
               <div className={`w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center mb-4 bg-zinc-950/60 backdrop-blur-md ${tagClass.borderTop}`}>
                 <Users size={24} className="text-zinc-600 group-hover:text-stone-300 transition-colors" />
               </div>
               <h3 className="text-sm font-bold text-stone-200 mb-1 text-center">{d.name}</h3>
               <div className="text-[10px] text-zinc-500 uppercase mb-1">{getDiscipleRank(d)}</div>
               <div className="text-[10px] text-zinc-500 uppercase mb-3">Ур. {d.level || 1} • {d.role}</div>
               <div className={`text-xs ${tagClass.text} font-mono mb-2`}>{d.power} БМ</div>
            </div>
            <div className={`p-2 text-center text-[10px] uppercase font-bold tracking-widest bg-zinc-950/60 backdrop-blur-md ${status.color} border-t-0 border-x-0 border-b border-b-zinc-800/50`}>
              {status.text}
            </div>
          </div>
        );
      } else {
        return (
          <div 
            key={d.id} 
            onClick={() => setSelectedDiscipleId(d.id)}
            className={`p-3 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 flex items-center justify-between cursor-pointer transition-colors group ${tagClass.borderTop}`}
          >
            <div className="flex items-center gap-4">
               <div className={`w-10 h-10 border border-zinc-800 flex items-center justify-center bg-zinc-950/60 backdrop-blur-md`}>
                  <Users size={16} className="text-zinc-600" />
               </div>
               <div className="flex flex-col">
                 <span className="text-sm text-stone-200 font-medium group-hover:text-amber-400 transition-colors">{d.name}</span>
                 <span className="text-[10px] text-zinc-500">{getDiscipleRank(d)} • {d.role} • {d.element}</span>
               </div>
            </div>
            <div className="flex items-center gap-6">
               <div className={`px-2 py-0.5 border text-[9px] uppercase ${status.color}`}>
                 {status.text}
               </div>
               <div className="text-center w-20">
                 <div className="text-[10px] text-zinc-500 uppercase">БМ</div>
                 <div className="text-xs text-stone-300 font-mono">{d.power}</div>
               </div>
               <div className={`text-[10px] uppercase ${tagClass.text} w-24 text-right`}>
                 {d.rarity}
               </div>
            </div>
          </div>
        );
      }
    } else {
      // Outer disciples are small compact cards
      if (viewMode === 'grid') {
        return (
          <div 
            key={d.id} 
            onClick={() => setSelectedDiscipleId(d.id)}
            className={`p-3 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 hover:border-zinc-700 flex flex-col items-center justify-center cursor-pointer transition-colors ${tagClass.borderTop} h-32 relative group`}
          >
            <span className="text-sm text-stone-300 font-medium mb-1 group-hover:text-amber-400 transition-colors">{d.name}</span>
            <span className="text-[10px] text-zinc-500 mb-1">{getDiscipleRank(d)}</span>
            <span className="text-[10px] text-zinc-500 mb-2">Ур. {d.level || 1} • {d.power} БМ</span>
            <div className={`px-2 py-1 text-[9px] uppercase border ${status.color}`}>
              {status.text}
            </div>
          </div>
        );
      } else {
        return (
          <div 
            key={d.id} 
            onClick={() => setSelectedDiscipleId(d.id)}
            className={`p-3 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 hover:border-zinc-700 flex items-center justify-between cursor-pointer transition-colors ${tagClass.borderTop} group`}
          >
            <div className="flex flex-col">
              <span className="text-xs text-stone-300 font-medium group-hover:text-amber-400 transition-colors">{d.name}</span>
              <span className="text-[10px] text-zinc-500">{getDiscipleRank(d)} • Ур. {d.level || 1} • {d.power} БМ</span>
            </div>
            <div className={`px-2 py-1 text-[9px] uppercase border ${status.color}`}>
              {status.text}
            </div>
          </div>
        );
      }
    }
  };

  const baseDisplayedDisciples = activeTab === 'inner' ? innerDisciples : outerDisciples;
  const displayedDisciples = sortByPower ? [...baseDisplayedDisciples].sort((a,b) => b.power - a.power) : baseDisplayedDisciples;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-end justify-between border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-light text-stone-100 mb-2">Ученики Секты</h2>
          <p className="text-stone-500 text-sm">Управление составом секты.</p>
        </div>

        <div className="flex items-center gap-4">
          <button 
             onClick={() => setSortByPower(!sortByPower)}
             className={`px-4 py-2 text-xs uppercase tracking-widest font-medium transition-colors border hidden md:block ${sortByPower ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-zinc-900/60 backdrop-blur-md border-zinc-800 text-stone-500 hover:text-stone-300'}`}
          >
             Сортировка: {sortByPower ? 'По мощи' : 'По умолчанию'}
          </button>
          
          <div className="flex gap-2 bg-zinc-900/60 backdrop-blur-md p-1 border border-zinc-800 rounded-sm">
            <button 
              onClick={() => setActiveTab('inner')} 
              className={`px-4 py-1.5 text-xs uppercase tracking-widest font-medium transition-colors ${activeTab === 'inner' ? 'bg-amber-500/10 text-amber-400' : 'text-stone-500 hover:text-stone-300'}`}
            >
              Внутренние ({innerDisciples.length})
            </button>
            <button 
              onClick={() => setActiveTab('outer')} 
              className={`px-4 py-1.5 text-xs uppercase tracking-widest font-medium transition-colors ${activeTab === 'outer' ? 'bg-amber-500/10 text-amber-400' : 'text-stone-500 hover:text-stone-300'}`}
            >
              Внешние ({outerDisciples.length})
            </button>
          </div>
          
          <div className="flex gap-1 bg-zinc-900/60 backdrop-blur-md p-1 border border-zinc-800 rounded-sm">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-zinc-800 text-stone-200' : 'text-zinc-500 hover:text-stone-300'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-zinc-800 text-stone-200' : 'text-zinc-500 hover:text-stone-300'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {displayedDisciples.length === 0 ? (
        <div className="p-8 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm text-center">
          <Users size={32} className="mx-auto text-zinc-700 mb-4" />
          <h3 className="text-lg text-stone-300 mb-2">Учеников нет</h3>
          <p className="text-stone-500 text-sm">В этой категории пока нет учеников. Отправляйтесь во Врата Найма.</p>
        </div>
      ) : (
        <div className={
          activeTab === 'inner'
            ? (viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4" : "flex flex-col gap-2")
            : (viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3" : "flex flex-col gap-2")
        }>
          {displayedDisciples.map(d => renderDiscipleCard(d, activeTab === 'inner'))}
        </div>
      )}
    </div>
  );
}

function GachaView({ state, onAdd, onInstantLimit }: { state: any, onAdd: any, onInstantLimit: any }) {
  const discount = state.player ? state.player.stats.cunning * 0.005 : 0;
  const INNER_COST = Math.floor(1000 * (1 - discount));
  const OUTER_COST = Math.floor(200 * (1 - discount));

  const [isSummoning, setIsSummoning] = useState(false);
  const [summonResult, setSummonResult] = useState<any>(null);
  const [lastSummonType, setLastSummonType] = useState<'inner' | 'outer'>('inner');

  const maxInner = state.player ? 5 + Math.floor(state.player.stats.authority / 10) + (state.bonusInnerLimit || 0) : 5;
  const innerCount = state.disciples.filter((d: any) => d.type === 'inner' || ['Эпический', 'Легендарный', 'Мифический'].includes(d.rarity)).length;
  
  const [timerStr, setTimerStr] = useState<string>('');

  useEffect(() => {
    if (!state.nextInnerLimitAt) {
      setTimerStr('');
      return;
    }
    const interval = setInterval(() => {
      const remain = state.nextInnerLimitAt! - Date.now();
      if (remain <= 0) {
        setTimerStr('0s');
        clearInterval(interval);
      } else {
        const s = Math.floor(remain / 1000);
        setTimerStr(`${Math.floor(s / 60)}м ${s % 60}с`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [state.nextInnerLimitAt]);

  const canSummonInner = state.resources.stones >= INNER_COST && innerCount < maxInner;
  const canSummonOuter = state.resources.stones >= OUTER_COST;

  const handleSummon = (type: 'inner' | 'outer') => {
    const cost = type === 'inner' ? INNER_COST : OUTER_COST;
    if (state.resources.stones < cost || isSummoning) return;
    if (type === 'inner' && innerCount >= maxInner) return;
    
    setIsSummoning(true);
    setSummonResult(null);
    setLastSummonType(type);

    // Simulate summoning delay
    setTimeout(() => {
      const roles = ['Воин', 'Маг', 'Атакующий', 'Танк', 'Поддержка', 'Ассасин'];
      const elements = ['Огонь', 'Вода', 'Дерево', 'Металл', 'Земля'];
      const charismaBonus = state.player ? state.player.stats.charisma * 0.005 : 0;
      const r = Math.min(1, Math.random() + charismaBonus); // Харизма повышает шанс редких
      
      let rarity = 'Обычный';
      let powerBase = 50;
      
      if (type === 'inner') {
        if (r > 0.95) { rarity = 'Легендарный'; powerBase = 200; }
        else if (r > 0.70) { rarity = 'Эпический'; powerBase = 150; }
        else { rarity = 'Редкий'; powerBase = 100; }
      } else {
        if (r > 0.95) { rarity = 'Эпический'; powerBase = 150; }
        else if (r > 0.60) { rarity = 'Редкий'; powerBase = 100; }
        else { rarity = 'Обычный'; powerBase = 50; }
      }

      const firstNames = ['Лин', 'Фэн', 'Юнь', 'Шэнь', 'Чен', 'Вэй', 'Сюэ', 'Бай', 'Хань', 'Мо', 'Жуй', 'Тянь', 'Ин', 'Цзянь', 'Лун', 'Ян', 'Мин', 'Ши'];
      const lastNames = ['Фан', 'Сяо', 'Ли', 'Ван', 'Чжан', 'Лю', 'Е', 'Цзинь', 'Сюй', 'Чжао', 'Сун', 'Цю', 'Му', 'Лан', 'Гу'];

      const element = elements[Math.floor(Math.random() * elements.length)] as any;
      let combatStats = { attack: 0, defense: 0, health: 0, speed: 0 };
      let workStats = { mining: 0, farming: 0, alchemy: 0, crafting: 0 };

      if (type === 'inner') {
          combatStats = {
              attack: powerBase + Math.floor(Math.random() * powerBase),
              defense: powerBase + Math.floor(Math.random() * powerBase),
              health: powerBase * 10 + Math.floor(Math.random() * powerBase * 5),
              speed: powerBase + Math.floor(Math.random() * powerBase),
          };
          workStats = {
              mining: Math.floor(powerBase * 0.1),
              farming: Math.floor(powerBase * 0.1),
              alchemy: Math.floor(powerBase * 0.5),
              crafting: Math.floor(powerBase * 0.5),
          };
      } else {
          workStats = {
              mining: powerBase + Math.floor(Math.random() * powerBase),
              farming: powerBase + Math.floor(Math.random() * powerBase),
              alchemy: powerBase + Math.floor(Math.random() * powerBase),
              crafting: powerBase + Math.floor(Math.random() * powerBase),
          };
          
          if (element === 'Земля' || element === 'Металл') workStats.mining += powerBase;
          if (element === 'Вода' || element === 'Дерево') workStats.farming += powerBase;
          if (element === 'Огонь') {
              workStats.alchemy += powerBase;
              workStats.crafting += powerBase;
          }

          combatStats = {
              attack: Math.floor(powerBase * 0.5),
              defense: Math.floor(powerBase * 0.5),
              health: Math.floor(powerBase * 5),
              speed: Math.floor(powerBase * 0.5),
          };
      }

      const newDisciple = {
        id: Math.random().toString(36).substr(2, 9),
        name: `${lastNames[Math.floor(Math.random() * lastNames.length)]} ${firstNames[Math.floor(Math.random() * firstNames.length)]}`,
        rarity,
        role: roles[Math.floor(Math.random() * roles.length)] as any,
        element,
        level: 1,
        power: powerBase * 1.5,
        loyalty: Math.min(200, Math.floor((80 + Math.floor(Math.random() * 20)) * (1 + charismaBonus * 2))), // +1% per point
        cultivationStage: 0,
        type,
        rank: type === 'inner' ? 'Внутренний ученик' : 'Внешний ученик',
        combatStats,
        workStats,
      };

      onAdd(newDisciple, cost);
      setSummonResult(newDisciple);
      setIsSummoning(false);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-2xl mx-auto text-center mt-12"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-light text-stone-100 mb-2">Врата Найма</h2>
        <p className="text-stone-500 text-sm">Призовите культиваторов с разных уголков мира.<br/> Шанс Легендарного Внутреннего: 5%</p>
      </div>

      <div className="p-12 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm relative flex flex-col items-center overflow-hidden min-h-[300px] justify-center mb-8">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-500/30"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple-500/30"></div>
        
        <AnimatePresence mode="wait">
          {isSummoning ? (
            <motion.div 
              key="summoning"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ scale: 2, opacity: 0, filter: "blur(15px)", transition: { duration: 0.3 } }}
              className="flex flex-col items-center relative"
            >
              <motion.div 
                 animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                 transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-fuchsia-500/20 rounded-full blur-2xl -z-10"
              />
              <motion.div 
                 animate={{ boxShadow: ['0 0 20px rgba(217,70,239,0.5)', '0 0 50px rgba(217,70,239,0.8)', '0 0 20px rgba(217,70,239,0.5)'] }}
                 transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                 className="w-24 h-32 rounded-[100%] border-4 border-fuchsia-500 shadow-[0_0_30px_rgba(217,70,239,0.8)] flex items-center justify-center bg-zinc-950/60 backdrop-blur-md overflow-hidden relative"
              >
                <div className="absolute inset-0 opacity-50 bg-gradient-to-t from-fuchsia-500/40 to-transparent" />
                <Sparkles className="w-8 h-8 text-fuchsia-200 opacity-80" />
              </motion.div>
              <p className="text-fuchsia-400 mt-6 font-mono text-xs uppercase tracking-widest animate-pulse">Открытие Врат...</p>
            </motion.div>
          ) : summonResult ? (
            <motion.div 
              key="result"
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="flex flex-col items-center w-full"
            >
              <div className="mb-4 relative">
                <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 rounded-full"></div>
                <Users className="w-16 h-16 text-purple-300 relative z-10" />
              </div>
              <div className={`text-sm uppercase tracking-widest mb-2 font-bold ${getRarityTag(summonResult.rarity).text}`}>
                 Призван {summonResult.rarity.toLowerCase()} ученик
              </div>
              <h3 className="text-2xl text-stone-100 font-bold tracking-wider mb-2">{summonResult.name}</h3>
              <div className="flex gap-3 mb-8">
                <span className={`text-[10px] uppercase ${getRarityTag(summonResult.rarity).bg} px-3 py-1 border ${getRarityTag(summonResult.rarity).border} ${getRarityTag(summonResult.rarity).text}`}>
                   {summonResult.rarity}
                </span>
                <span className="text-[10px] uppercase bg-zinc-800 px-3 py-1 border border-zinc-700 text-stone-300">{summonResult.role} • {summonResult.element}</span>
              </div>
              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={lastSummonType === 'inner' ? (canSummonInner ? { scale: 1.05 } : {}) : (canSummonOuter ? { scale: 1.05 } : {})}
                  whileTap={lastSummonType === 'inner' ? (canSummonInner ? { scale: 0.95 } : {}) : (canSummonOuter ? { scale: 0.95 } : {})}
                  onClick={() => handleSummon(lastSummonType)}
                  disabled={(lastSummonType === 'inner' ? !canSummonInner : !canSummonOuter) || isSummoning}
                  className={`px-6 py-2 border text-xs uppercase tracking-widest transition-colors ${
                    (lastSummonType === 'inner' ? canSummonInner : canSummonOuter)
                      ? 'border-purple-500/50 text-purple-400 hover:bg-purple-500/10' 
                      : 'border-zinc-800 text-stone-600 cursor-not-allowed'
                  }`}
                >
                  <span className="mb-1 block">Призвать еще</span>
                  <span className="font-mono text-[10px] opacity-70">-{lastSummonType === 'inner' ? INNER_COST : OUTER_COST} ֏</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSummonResult(null)}
                  className="px-6 py-2 border border-zinc-700 text-stone-400 hover:text-stone-200 text-xs uppercase tracking-widest transition-colors"
                >
                  <div className="h-full flex items-center">Закрыть</div>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center w-full"
            >
              <Scroll className="w-16 h-16 text-purple-400/50 mb-8" />
              
              <div className="flex gap-4 w-full justify-center">
                <motion.button
                  whileHover={canSummonOuter ? { scale: 1.05, backgroundColor: "rgba(168,85,247,0.15)" } : {}}
                  whileTap={canSummonOuter ? { scale: 0.95 } : {}}
                  onClick={() => handleSummon('outer')}
                  disabled={!canSummonOuter || isSummoning}
                  className={`flex flex-col items-center justify-center px-8 py-4 border transition-all ${
                    canSummonOuter 
                      ? 'border-purple-500/50 text-purple-400 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]' 
                      : 'border-zinc-800 text-stone-600 cursor-not-allowed'
                  }`}
                >
                  <span className="text-sm font-bold uppercase tracking-widest mb-1">Призыв Рабочего</span>
                  <span className="text-[10px] opacity-70 uppercase">Внешний ученик</span>
                  <span className={`font-mono mt-2 px-3 py-1 bg-zinc-950/60 backdrop-blur-md border ${canSummonOuter ? 'border-purple-500/30 text-purple-300' : 'border-zinc-800 text-zinc-600'}`}>
                    {OUTER_COST} ֏
                  </span>
                </motion.button>

                <div className="flex flex-col items-center gap-2">
                  <motion.button
                    whileHover={canSummonInner ? { scale: 1.05, backgroundColor: "rgba(168,85,247,0.15)" } : {}}
                    whileTap={canSummonInner ? { scale: 0.95 } : {}}
                    onClick={() => handleSummon('inner')}
                    disabled={!canSummonInner || isSummoning}
                    className={`flex flex-col items-center justify-center px-8 py-4 w-full h-full border transition-all ${
                      canSummonInner 
                        ? 'border-fuchsia-500 text-fuchsia-200 bg-fuchsia-950/30 shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:shadow-[0_0_40px_rgba(217,70,239,0.7)] hover:bg-fuchsia-900/40' 
                        : 'border-zinc-800 text-stone-600 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-sm font-bold uppercase tracking-widest mb-1">Призыв Таланта</span>
                    <span className="text-[10px] opacity-70 uppercase">Внутренний ученик</span>
                    <span className={`font-mono mt-2 px-3 py-1 bg-zinc-950/60 backdrop-blur-md border ${canSummonInner ? 'border-fuchsia-500 text-fuchsia-300 font-bold' : 'border-zinc-800 text-zinc-600'}`}>
                      {INNER_COST} ֏
                    </span>
                  </motion.button>
                  {innerCount >= maxInner && (
                    <div className="text-[10px] text-fuchsia-400 uppercase tracking-widest mt-2 bg-fuchsia-500/10 border border-fuchsia-500/20 w-fit px-3 py-1 flex items-center justify-between gap-4 w-full">
                      <span>Лимит: {innerCount}/{maxInner}</span>
                      {timerStr && (
                         <div className="flex items-center gap-2">
                           <span>Ожидание: {timerStr}</span>
                           <button 
                             onClick={(e) => { e.stopPropagation(); onInstantLimit(); }}
                             className="bg-purple-600/30 hover:bg-purple-500/50 text-white px-2 py-0.5 rounded border border-purple-500/50 flex items-center gap-1 transition-colors relative z-20"
                           >
                             <Zap size={10} className="text-purple-300" />
                             Ускорить ({Math.ceil(Math.max(0, state.nextInnerLimitAt - Date.now()) / 1000) * 50} Ци)
                           </button>
                         </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function AlchemyView({ state, onCraftPill, onInstantCraftPill, onCraftArtifact, onInstantCraftArtifact }: { state: any, onCraftPill: any, onInstantCraftPill: any, onCraftArtifact: any, onInstantCraftArtifact: any }) {
  const { inventory, buildings, resources, alchemyTask, craftingTask } = state;
  const [now, setNow] = useState(Date.now());
  const [tab, setTab] = useState<'alchemy' | 'armory'>('alchemy');

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCraftArtifact = (type: 'weapon'|'armor'|'talisman', cost: Record<string, number>) => {
    const rarities = ['Обычный', 'Редкий', 'Эпический', 'Легендарный'] as const;
    
    let r = Math.random();
    let rarity: 'Обычный' | 'Редкий' | 'Эпический' | 'Легендарный' = 'Обычный';
    let powerBonus = 20;

    if (r > 0.95) { rarity = 'Легендарный'; powerBonus = 200; }
    else if (r > 0.80) { rarity = 'Эпический'; powerBonus = 100; }
    else if (r > 0.50) { rarity = 'Редкий'; powerBonus = 50; }

    const names = {
      'weapon': ['Меч', 'Копье', 'Кинжал', 'Посох', 'Кнут'],
      'armor': ['Одеяние', 'Доспех', 'Мантия', 'Кираса', 'Щит'],
      'talisman': ['Печать', 'Талисман', 'Амулет', 'Подвеска', 'Символ'],
    };
    const adjectives = ['Небесного Разрушения', 'Пылающего Лотоса', 'Ледяного Сердца', 'Глубокой Бездны', 'Сияющего Рассвета'];

    const name = `${names[type][Math.floor(Math.random() * names[type].length)]} ${adjectives[Math.floor(Math.random() * adjectives.length)]}`;

    const artifact = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type,
      rarity,
      powerBonus: Math.floor(powerBonus * (0.8 + Math.random() * 0.4)),
    };

    const durationSeconds = 300 - (buildings.armory || 0) * 10;
    onCraftArtifact(artifact, cost, Math.max(10, durationSeconds));
  };
  
  const handleCraftPill = (type: 'recoveryPills' | 'breakthroughPills' | 'strengthPills', cost: Record<string, number>) => {
    const durationSeconds = 120 - buildings.alchemyLab * 5;
    onCraftPill(type, cost, Math.max(5, durationSeconds));
  };

  // Task Formatting
  const getTaskInfo = (task: any) => {
    if (!task) return null;
    const remainMs = Math.max(0, task.finishAt - now);
    const remainSec = Math.ceil(remainMs / 1000);
    const m = Math.floor(remainSec / 60);
    const s = remainSec % 60;
    return { str: `${m}:${s.toString().padStart(2, '0')}`, expectedQi: remainSec * 10 };
  };

  const pillTask = getTaskInfo(alchemyTask);
  const canInstantPill = pillTask && resources.qi >= pillTask.expectedQi;

  const artTask = getTaskInfo(craftingTask);
  const canInstantArt = artTask && resources.qi >= artTask.expectedQi;

  const PILLS = [
    { id: 'recoveryPills', name: 'Пилюля Восстановления', desc: 'Восстановление здоровья учеников после боя.', cost: { herbs: 50, qi: 20 }, icon: <FlaskConical className="text-emerald-400" size={20} /> },
    { id: 'breakthroughPills', name: 'Пилюля Прорыва', desc: 'Повышение шанса успешного прорыва культивации.', cost: { herbs: 150, qi: 50 }, icon: <FlaskConical className="text-purple-400" size={20} /> },
    { id: 'strengthPills', name: 'Пилюля Силы', desc: 'Временный буст характеристик ученика.', cost: { herbs: 100, beastMaterials: 20 }, icon: <FlaskConical className="text-amber-400" size={20} /> }
  ] as const;

  const ARTIFACTS = [
    { id: 'weapon', name: 'Оружие', desc: 'Увеличение атаки ученика.', cost: { ore: 100, qi: 30 }, icon: <Swords className="text-red-400" size={20} /> },
    { id: 'armor', name: 'Броня', desc: 'Увеличение защиты ученика.', cost: { ore: 100, beastMaterials: 30 }, icon: <Shield className="text-sky-400" size={20} /> },
    { id: 'talisman', name: 'Талисман', desc: 'Одноразовый предмет для боя (защита/атака).', cost: { qi: 50, beastMaterials: 50 }, icon: <Scroll className="text-amber-200" size={20} /> }
  ] as const;

  const renderCost = (cost: Record<string, number>) => {
    const symbols: any = { herbs: '🌿', qi: '⚡', ore: '⛏', stones: '֏', beastMaterials: '🦴' };
    return (
      <div className="flex flex-wrap gap-4 mb-4">
        {Object.entries(cost).map(([k, v]) => {
          const hasEnough = (resources[k as keyof typeof resources] || 0) >= v;
          return (
            <div key={k} className="text-center">
              <div className="text-[10px] text-zinc-500 uppercase">{k}</div>
              <div className={`text-sm font-mono flex items-center gap-1 ${hasEnough ? 'text-stone-300' : 'text-red-400'}`}>
                {v} <span className="opacity-50 text-[10px]">{symbols[k] || ''}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-stone-100 mb-2">Производственная цепочка</h2>
          <p className="text-stone-500 text-sm">Переработка сырья в готовые продукты.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setTab('alchemy')}
                className={`px-4 py-2 border text-xs uppercase font-bold tracking-widest transition-colors ${tab === 'alchemy' ? 'border-purple-500/50 bg-purple-500/10 text-purple-400' : 'border-zinc-800 text-stone-500 hover:text-stone-300 hover:bg-zinc-900/60 backdrop-blur-md'}`}
            >Алхимия</button>
            <button 
                onClick={() => setTab('armory')}
                className={`px-4 py-2 border text-xs uppercase font-bold tracking-widest transition-colors ${tab === 'armory' ? 'border-amber-500/50 bg-amber-500/10 text-amber-400' : 'border-zinc-800 text-stone-500 hover:text-stone-300 hover:bg-zinc-900/60 backdrop-blur-md'}`}
            >Оружейная</button>
        </div>
      </div>

      {tab === 'alchemy' && (
        buildings.alchemyLab === 0 ? (
          <div className="p-8 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm text-center">
            <FlaskConical size={32} className="mx-auto text-zinc-700 mb-4" />
            <h3 className="text-lg text-stone-300 mb-2">Алхимическая лаборатория не построена</h3>
            <p className="text-stone-500 text-sm">Постройте Лабораторию на вкладке Территория.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {PILLS.map(p => {
              const canCraft = Object.entries(p.cost).every(([k, v]) => (resources[k as keyof typeof resources] || 0) >= v) && !alchemyTask;
              const isCraftingThis = alchemyTask?.type === p.id;
              
              return (
                <div key={p.id} className="p-6 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-light text-stone-100 mb-4 flex items-center gap-2">
                        {p.icon} {p.name}
                    </h3>
                    <p className="text-sm text-stone-400 mb-6">{p.desc}</p>
                    <div className="flex items-center justify-between bg-zinc-950/60 backdrop-blur-md p-4 border border-zinc-800 mb-6">
                        {renderCost(p.cost)}
                        <div className="text-center">
                          <div className="text-[10px] text-zinc-500 uppercase">Склад</div>
                          <div className="text-lg font-mono text-emerald-400">{inventory[p.id as keyof typeof inventory] || 0}</div>
                        </div>
                    </div>
                  </div>

                  <div className="flex gap-2 min-h-[38px]">
                    {isCraftingThis ? (
                      <>
                        <div className="flex-1 px-4 py-2 border border-sky-500/30 text-sky-400 bg-sky-500/10 text-xs font-mono font-bold tracking-widest flex justify-center items-center gap-2">
                          <span className="text-[10px] uppercase text-sky-500/70">СИНТЕЗ</span>
                          {pillTask!.str}
                        </div>
                        <motion.button 
                          whileHover={canInstantPill ? { scale: 1.02 } : {}}
                          whileTap={canInstantPill ? { scale: 0.98 } : {}}
                          onClick={() => onInstantCraftPill()}
                          disabled={!canInstantPill}
                          className={`flex-1 py-2 border text-[10px] uppercase font-bold tracking-widest transition-colors flex justify-center items-center gap-2 ${
                            canInstantPill ? 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10' : 'border-zinc-800 text-stone-600 cursor-not-allowed'
                          }`}
                        >
                          <Zap size={12} /> {pillTask!.expectedQi} Ци
                        </motion.button>
                      </>
                    ) : (
                      <motion.button 
                        whileHover={canCraft ? { scale: 1.02 } : {}}
                        whileTap={canCraft ? { scale: 0.98 } : {}}
                        onClick={() => handleCraftPill(p.id as any, p.cost)}
                        disabled={!canCraft || !!alchemyTask}
                        className={`w-full py-2 border text-[10px] uppercase font-bold tracking-widest transition-colors ${
                          canCraft 
                            ? 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10' 
                            : 'border-zinc-800 text-stone-600 cursor-not-allowed'
                        }`}
                      >
                        Начать Синтез
                      </motion.button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {tab === 'armory' && (
        (buildings.armory || 0) === 0 ? (
          <div className="p-8 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm text-center">
            <Swords size={32} className="mx-auto text-zinc-700 mb-4" />
            <h3 className="text-lg text-stone-300 mb-2">Оружейная не построена</h3>
            <p className="text-stone-500 text-sm">Постройте Оружейную на вкладке Территория для ковки снаряжения.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {ARTIFACTS.map(a => {
              const canCraft = Object.entries(a.cost).every(([k, v]) => (resources[k as keyof typeof resources] || 0) >= v) && !craftingTask;
              const isCraftingThis = craftingTask?.artifact.type === a.id;
              
              return (
                <div key={a.id} className="p-6 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-light text-stone-100 mb-4 flex items-center gap-2">
                        {a.icon} {a.name}
                    </h3>
                    <p className="text-sm text-stone-400 mb-6">{a.desc}</p>
                    <div className="flex items-center justify-between bg-zinc-950/60 backdrop-blur-md p-4 border border-zinc-800 mb-6">
                        {renderCost(a.cost)}
                        <div className="text-center">
                          <div className="text-[10px] text-zinc-500 uppercase">Склад</div>
                          <div className="text-lg font-mono text-amber-400">{(inventory.artifacts || []).filter((art: any) => art.type === a.id).length}</div>
                        </div>
                    </div>
                  </div>

                  <div className="flex gap-2 min-h-[38px]">
                    {isCraftingThis ? (
                      <>
                        <div className="flex-1 px-4 py-2 border border-sky-500/30 text-sky-400 bg-sky-500/10 text-xs font-mono font-bold tracking-widest flex justify-center items-center gap-2">
                          <span className="text-[10px] uppercase text-sky-500/70">КОВКА</span>
                          {artTask!.str}
                        </div>
                        <motion.button 
                          whileHover={canInstantArt ? { scale: 1.02 } : {}}
                          whileTap={canInstantArt ? { scale: 0.98 } : {}}
                          onClick={() => onInstantCraftArtifact()}
                          disabled={!canInstantArt}
                          className={`flex-1 py-2 border text-[10px] uppercase font-bold tracking-widest transition-colors flex justify-center items-center gap-2 ${
                            canInstantArt ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10' : 'border-zinc-800 text-stone-600 cursor-not-allowed'
                          }`}
                        >
                          <Zap size={12} /> {artTask!.expectedQi} Ци
                        </motion.button>
                      </>
                    ) : (
                      <motion.button 
                        whileHover={canCraft ? { scale: 1.02 } : {}}
                        whileTap={canCraft ? { scale: 0.98 } : {}}
                        onClick={() => handleCraftArtifact(a.id as any, a.cost)}
                        disabled={!canCraft || !!craftingTask}
                        className={`w-full py-2 border text-[10px] uppercase font-bold tracking-widest transition-colors ${
                          canCraft 
                            ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10' 
                            : 'border-zinc-800 text-stone-600 cursor-not-allowed'
                        }`}
                      >
                        Начать Ковку
                      </motion.button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}

function CultivationView({ state, onPromote, onInstantPromote, onTrain, onInstantTrain }: { state: any, onPromote: any, onInstantPromote: any, onTrain: (id: string, durationSeconds: number) => void, onInstantTrain: (id: string) => void }) {
  const { disciples, inventory, cultivatingTasks, trainingTasks, resources } = state;
  const [now, setNow] = useState(Date.now());
  const [sortByPower, setSortByPower] = useState(true);
  const sortedDisciples = sortByPower ? [...disciples].sort((a,b) => b.power - a.power) : disciples;

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getRequirementsForNextStage = (currentStage: number) => {
    switch (currentStage) {
      case 0: return { level: 20, breakPills: 1, beast: 0, legendArtifact: false, text: 'Уровень 20+, 1 Пилюля прорыва', bonusText: '+50% к мощи (заменяет +20%)' };
      case 1: return { level: 30, breakPills: 1, beast: 0, legendArtifact: false, text: 'Уровень 30+, 1 Пилюля прорыва (заменяет рецепт)', bonusText: '+100% к мощи' };
      case 2: return { level: 40, breakPills: 0, beast: 1000, legendArtifact: false, text: 'Уровень 40+, 1000 Костей (легендарные материалы)', bonusText: '+200% к мощи' };
      case 3: return { level: 50, breakPills: 0, beast: 0, legendArtifact: true, text: 'Уровень 50, 1 Легендарный артефакт в инвентаре', bonusText: '+400% к мощи' };
      default: return { level: 999, breakPills: 0, beast: 0, legendArtifact: false, text: 'Максимальный уровень', bonusText: '' };
    }
  };

  const hasRequirements = (d: any, reqs: any) => {
    if (d.level < reqs.level) return false;
    if (inventory.breakthroughPills < reqs.breakPills) return false;
    if ((resources.beastMaterials || 0) < reqs.beast) return false;
    if (reqs.legendArtifact && !(inventory.artifacts || []).some((a: any) => a.rarity === 'Легендарный')) return false;
    return true;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-light text-stone-100 mb-2">Зал Культивации</h2>
          <p className="text-stone-500 text-sm">Тренируйте учеников и проводите прорывы для кратного усиления боевой мощи.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
             onClick={() => setSortByPower(!sortByPower)}
             className={`px-4 py-2 text-xs uppercase tracking-widest font-medium transition-colors border ${sortByPower ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-zinc-900/60 backdrop-blur-md border-zinc-800 text-stone-500 hover:text-stone-300'}`}
          >
             Сортировка: {sortByPower ? 'По мощи' : 'По умолчанию'}
          </button>
          <div className="flex items-center gap-2 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 px-4 py-2">
            <FlaskConical size={16} className="text-purple-400" />
            <span className="text-sm text-stone-300">Пилюль Прорыва: <span className="font-mono text-amber-400">{inventory.breakthroughPills}</span></span>
          </div>
        </div>
      </div>

      {disciples.length === 0 ? (
        <div className="p-8 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm text-center">
          <Swords size={32} className="mx-auto text-zinc-700 mb-4" />
          <h3 className="text-lg text-stone-300 mb-2">Зал пустует</h3>
          <p className="text-stone-500 text-sm">Наймите учеников, чтобы наставлять их на путь бессмертия.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sortedDisciples.map((d: any) => {
            const isMaxStage = d.cultivationStage >= 4;
            const task = cultivatingTasks?.[d.id];
            const trainTask = trainingTasks?.[d.id];
            const reqs = getRequirementsForNextStage(d.cultivationStage);
            const canPromote = !isMaxStage && hasRequirements(d, reqs) && !task;
            const currentStageName = CULTIVATION_STAGES[d.cultivationStage];
            const nextStageName = isMaxStage ? 'Максимум' : CULTIVATION_STAGES[d.cultivationStage + 1];

            let remainStr = '';
            let expectedQi = 0;
            if (task) {
              const remainMs = Math.max(0, task.finishAt - now);
              const remainSec = Math.ceil(remainMs / 1000);
              const m = Math.floor(remainSec / 60);
              const s = remainSec % 60;
              remainStr = `${m}:${s.toString().padStart(2, '0')}`;
              expectedQi = remainSec * 10;
            }
            const canInstant = expectedQi > 0 && resources.qi >= expectedQi;
            
            let trainRemainStr = '';
            let expectedTrainQi = 0;
            if (trainTask) {
              const remainMs = Math.max(0, trainTask.finishAt - now);
              const remainSec = Math.ceil(remainMs / 1000);
              const m = Math.floor(remainSec / 60);
              const s = remainSec % 60;
              trainRemainStr = `${m}:${s.toString().padStart(2, '0')}`;
              expectedTrainQi = remainSec * 2;
            }
            const canInstantTrain = expectedTrainQi > 0 && resources.qi >= expectedTrainQi;
            const canTrain = resources.qi >= 10 && !task && !trainTask;
            const wisdomBonus = state.player ? state.player.stats.wisdom * 0.01 : 0;
            const durationMultiplier = Math.max(0.1, 1 - wisdomBonus);
            
            const durationSeconds = Math.floor(300 * (d.cultivationStage + 1) * durationMultiplier);
            const trainDurationSeconds = Math.floor(60 * (d.cultivationStage + 1) * durationMultiplier);

            return (
              <div key={d.id} className="relative p-4 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm flex flex-col md:flex-row gap-4 md:items-center justify-between">
                <div className="md:w-1/4 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm tracking-widest uppercase font-bold ${getRarityTag(d.rarity).text}`}>{d.name}</span>
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Мощь: <span className="text-stone-200 font-mono">{d.power} БМ</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-zinc-500 border border-zinc-800 px-2 py-0.5 bg-zinc-950/60 backdrop-blur-md uppercase">{currentStageName}</span>
                    <span className="text-[10px] text-stone-300 border border-stone-800 px-2 py-0.5 bg-zinc-950/60 backdrop-blur-md uppercase">Ур. {d.level || 1}</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center text-center justify-center">
                  {!isMaxStage && (
                    <div className="flex flex-col items-center pb-2 md:pb-0">
                       <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Следующая стадия:</span>
                       <span className="text-[12px] text-purple-400 uppercase font-bold tracking-widest leading-none">{nextStageName}</span>
                       {reqs.bonusText && <span className="text-[9px] text-purple-300/70 uppercase mt-1">{reqs.bonusText}</span>}
                       <div className="text-[10px] text-stone-500 mt-2">
                          <span className="uppercase opacity-70 mr-1">Требования:</span> {reqs.text}
                       </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-col min-w-[200px] justify-center md:pt-1">
                  {trainTask ? (
                    <>
                      <div className="px-3 py-2 border border-sky-500/30 text-sky-400 bg-sky-500/10 text-[11px] font-mono font-bold tracking-widest flex justify-center items-center gap-2">
                        <span className="text-[9px] uppercase text-sky-500/70">ТРЕНИРОВКА</span>
                        {trainRemainStr}
                      </div>
                      <motion.button 
                        whileHover={canInstantTrain ? { scale: 1.02 } : {}}
                        whileTap={canInstantTrain ? { scale: 0.98 } : {}}
                        onClick={() => onInstantTrain(d.id)}
                        disabled={!canInstantTrain}
                        className={`py-2 border text-[11px] uppercase font-bold tracking-widest transition-colors flex justify-center items-center gap-2 ${
                          canInstantTrain 
                            ? 'border-sky-500/30 text-sky-400 hover:bg-sky-500/10' 
                            : 'border-zinc-800 text-stone-600 cursor-not-allowed'
                        }`}
                      >
                        <Zap size={12} /> Ускорить ({expectedTrainQi} Ци)
                      </motion.button>
                    </>
                  ) : task ? (
                    <>
                      <div className="px-3 py-2 border border-purple-500/30 text-purple-400 bg-purple-500/10 text-[11px] font-mono font-bold tracking-widest flex justify-center items-center gap-2">
                        <span className="text-[9px] uppercase text-purple-500/70">ПРОРЫВ</span>
                        {remainStr}
                      </div>
                      <motion.button 
                        whileHover={canInstant ? { scale: 1.02 } : {}}
                        whileTap={canInstant ? { scale: 0.98 } : {}}
                        onClick={() => onInstantPromote(d.id)}
                        disabled={!canInstant}
                        className={`py-2 border text-[11px] uppercase font-bold tracking-widest transition-colors flex justify-center items-center gap-2 ${
                          canInstant 
                            ? 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10' 
                            : 'border-zinc-800 text-stone-600 cursor-not-allowed'
                        }`}
                      >
                        <Zap size={12} /> Ускорить ({expectedQi} Ци)
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button 
                        whileHover={canTrain ? { scale: 1.02 } : {}}
                        whileTap={canTrain ? { scale: 0.98 } : {}}
                        onClick={() => onTrain(d.id, trainDurationSeconds)}
                        disabled={!canTrain}
                        className={`px-4 py-1.5 border text-[10px] uppercase font-bold tracking-widest transition-colors ${
                          canTrain 
                            ? 'border-sky-500/30 text-sky-400 hover:bg-sky-500/10' 
                            : 'border-zinc-700 text-stone-500 cursor-not-allowed opacity-80'
                        }`}
                      >
                        Тренировать (-10 Ци / +1 Ур)
                      </motion.button>

                      {!isMaxStage && (
                        <motion.button 
                          whileHover={canPromote ? { scale: 1.02 } : {}}
                          whileTap={canPromote ? { scale: 0.98 } : {}}
                          onClick={() => onPromote(d.id, durationSeconds)}
                          disabled={!canPromote}
                          className={`px-4 py-2 border text-[11px] uppercase font-bold tracking-widest transition-all mt-1 ${
                            canPromote 
                              ? 'border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:bg-purple-500/20' 
                              : 'border-zinc-700 text-stone-500 cursor-not-allowed opacity-80'
                          }`}
                        >
                          Начать Прорыв
                        </motion.button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ArenaView({ state, onReward }: { state: any, onReward: any }) {
  const { disciples, teams = [], activeTeamId } = state;
  const activeTeam = teams?.find((t: any) => t.id === activeTeamId) || teams?.[0] || { members: [], formation: 'Триада Земли' };
  const team = activeTeam?.members || [];
  const formation = activeTeam.formation;

  const [selectedId, setSelectedId] = useState<string>('');
  const [combatState, setCombatState] = useState<'select' | 'selectOpponent' | 'fighting' | 'result'>('select');
  const [combatData, setCombatData] = useState<any>(null);
  const [battleType, setBattleType] = useState<'1v1' | 'team'>('1v1');
  const [opponents, setOpponents] = useState<any[]>([]);
  const [sortByPower, setSortByPower] = useState(true);
  const sortedDisciples = sortByPower ? [...disciples].sort((a,b) => b.power - a.power) : disciples;

  const [visibleLogCount, setVisibleLogCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  useEffect(() => {
    if (combatState === 'result' && combatData) {
      setVisibleLogCount(0);
      setRewardClaimed(false);
    }
  }, [combatState, combatData]);

  useEffect(() => {
    if (combatState === 'result' && combatData) {
      if (visibleLogCount < combatData.log.length) {
        const timer = setTimeout(() => {
          setVisibleLogCount(prev => prev + 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else if (!rewardClaimed) {
        setRewardClaimed(true);
        onReward(combatData.rewards.stones, combatData.rewards.prestige, combatData.won, combatData.mode, combatData.participants, combatData);
      }
    }
  }, [combatState, combatData, visibleLogCount, rewardClaimed, onReward]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLogCount]);

  const findOpponents = () => {
    const player = disciples.find((d:any) => d.id === selectedId);
    if (!player) return;
    
    const roles = ['Воин', 'Маг', 'Атакующий', 'Танк', 'Поддержка', 'Ассасин'];
    const elements = ['Огонь', 'Вода', 'Дерево', 'Металл', 'Земля'];
    
    const parts1 = ['Свирепый', 'Бродячий', 'Беглый', 'Безумный', 'Горный', 'Таинственный'];
    const parts2 = ['Мечник', 'Монах', 'Разбойник', 'Даос', 'Культиватор', 'Убийца'];

    const newOpponents = Array.from({length: 3}).map((_, i) => {
      const name = `${parts1[Math.floor(Math.random()*parts1.length)]} ${parts2[Math.floor(Math.random()*parts2.length)]}`;
      const power = Math.floor(player.power * (0.7 + Math.random() * 0.6));
      return {
        id: `enemy_${i}`,
        name,
        power,
        element: elements[Math.floor(Math.random() * elements.length)],
        role: roles[Math.floor(Math.random() * roles.length)],
        combatStats: {
          attack: power + Math.floor(Math.random() * power),
          defense: power + Math.floor(Math.random() * power),
          health: power * 10 + Math.floor(Math.random() * power * 5),
          speed: power + Math.floor(Math.random() * power),
        }
      };
    });
    
    setOpponents(newOpponents);
    setCombatState('selectOpponent');
  };

  const start1v1Combat = (enemyDisciple: any) => {
    const player = disciples.find((d:any) => d.id === selectedId);
    if (!player || !enemyDisciple) return;

    const elementsRules: Record<string, string> = {
      'Огонь': 'Металл', 'Металл': 'Дерево', 'Дерево': 'Земля',
      'Земля': 'Вода', 'Вода': 'Огонь'
    };

    const flavorTexts = [
      "обрушивает шквал ударов",
      "применяет секретную технику",
      "собирает Ци в разрушительный выпад",
      "совершает молниеносную атаку",
      "бьет в уязвимую точку"
    ];

    // Балансировка на основе текущей мощи (power), т.к. combatStats статичны и не учитывают прокачку
    let pHP = player.power * 12;
    let eHP = enemyDisciple.combatStats ? enemyDisciple.combatStats.health : enemyDisciple.power * 12;
    const maxPHP = pHP;
    const maxEHP = eHP;
    const log = [];
    let round = 1;

    const pMult = elementsRules[player.element] === enemyDisciple.element ? 1.2 : 1.0;
    const eMult = elementsRules[enemyDisciple.element] === player.element ? 1.2 : 1.0;

    let pAttack = Math.floor(player.power * 1.5);
    let eAttack = enemyDisciple.combatStats ? enemyDisciple.combatStats.attack : enemyDisciple.power * 1.5;

    log.push({ round: 0, actor: "Система", text: `Бой начинается!`, icon: 'system', pHP, eHP, maxPHP, maxEHP });

    while (pHP > 0 && eHP > 0 && round <= 10) {
       const flavor1 = flavorTexts[Math.floor(Math.random() * flavorTexts.length)];
       const pDmg = Math.floor(pAttack * pMult * (0.8 + Math.random() * 0.4));
       eHP -= pDmg;
       if (eHP < 0) eHP = 0;
       log.push({ round, actor: player.name, text: `${flavor1} стихии ${player.element}, нанося ${pDmg} урона`, icon: player.element, pHP, eHP, maxPHP, maxEHP });
       if (eHP <= 0) {
         log.push({ round, actor: "Система", text: `${enemyDisciple.name} падает без сил`, icon: 'defeat', pHP, eHP, maxPHP, maxEHP });
         break;
       }

       const flavor2 = flavorTexts[Math.floor(Math.random() * flavorTexts.length)];
       const eDmg = Math.floor(eAttack * eMult * (0.8 + Math.random() * 0.4));
       pHP -= eDmg;
       if (pHP < 0) pHP = 0;
       log.push({ round, actor: enemyDisciple.name, text: `в ответ ${flavor2} (${enemyDisciple.element}) на ${eDmg} урона`, icon: enemyDisciple.element, pHP, eHP, maxPHP, maxEHP });
       if (pHP <= 0) {
         log.push({ round, actor: "Система", text: `${player.name} не выдерживает удара и отступает`, icon: 'defeat', pHP, eHP, maxPHP, maxEHP });
       }
       round++;
    }

    const won = pHP > 0;
    const rewards = { stones: won ? 800 : 200, prestige: won ? 15 : 2 };
    
    setCombatData({ player, enemy: enemyDisciple, log, won, rewards, mode: '1v1', participants: [selectedId] });
    setCombatState('fighting');
    setTimeout(() => {
      setCombatState('result');
    }, 1000);
  };

  const startTeamCombat = () => {
    const teamDisciples = team.map((id: string) => disciples.find((d:any) => d.id === id)).filter(Boolean);
    if (teamDisciples.length === 0) return;
    
    const basePower = teamDisciples.reduce((acc: number, d: any) => acc + d.power, 0);
    const teamPower = Math.floor(basePower * 1.15); // Formation bonus
    
    const enemyPower = Math.floor(teamPower * (0.8 + Math.random() * 0.5));
    const enemyTeam = { name: 'Секта Кровавого Лотоса', power: enemyPower };
    const playerTeam = { name: 'Ваша Секта', power: teamPower };

    const baseHp = teamDisciples.reduce((acc: number, d: any) => acc + (d.power * 12), 0);
    const baseAttack = teamDisciples.reduce((acc: number, d: any) => acc + (Math.floor(d.power * 1.5)), 0);

    let pHP = Math.floor(baseHp * 1.15);
    let eHP = enemyPower * 12;
    const maxPHP = pHP;
    const maxEHP = eHP;
    const log = [];
    log.push({ round: 0, actor: 'Система', text: `Ваш отряд использует формацию [${formation}]`, icon: 'system', pHP, eHP, maxPHP, maxEHP });
    
    let round = 1;
    while (pHP > 0 && eHP > 0 && round <= 5) {
       const pDmg = Math.floor((baseAttack * 1.15) * (0.8 + Math.random() * 0.4));
       eHP -= pDmg;
       if (eHP < 0) eHP = 0;
       log.push({ round, actor: playerTeam.name, text: `проводит скоординированную атаку, нанося ${pDmg} урона`, icon: 'attack', pHP, eHP, maxPHP, maxEHP });
       if (eHP <= 0) break;

       const eDmg = Math.floor((enemyPower * 1.5) * (0.8 + Math.random() * 0.4));
       pHP -= eDmg;
       if (pHP < 0) pHP = 0;
       log.push({ round, actor: enemyTeam.name, text: `совершает командный прорыв, нанося ${eDmg} урона`, icon: 'attack', pHP, eHP, maxPHP, maxEHP });
       round++;
    }

    const won = pHP > 0;
    const rewards = { stones: won ? 3000 : 500, prestige: won ? 50 : 5 };
    
    setCombatData({ player: playerTeam, enemy: enemyTeam, log, won, rewards, mode: 'team', participants: team });
    setCombatState('fighting');
    setTimeout(() => {
      setCombatState('result');
    }, 1000);
  };

  if (combatState === 'select') {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-2xl font-light text-stone-100 mb-2">Арена Дуэлей</h2>
          <p className="text-stone-500 text-sm">Проверьте силу своих учеников в турнирных боях против странствующих культиваторов.</p>
        </div>

        <div className="flex gap-4 mb-4">
          <button 
            onClick={() => setBattleType('1v1')}
            className={`px-6 py-2 text-xs uppercase tracking-widest border transition-colors ${battleType === '1v1' ? 'border-amber-500 text-amber-400 bg-amber-500/10' : 'border-zinc-800 text-stone-500 hover:border-zinc-600'}`}
          >
            Одиночные Бои
          </button>
          <button 
            onClick={() => setBattleType('team')}
            className={`px-6 py-2 text-xs uppercase tracking-widest border transition-colors ${battleType === 'team' ? 'border-purple-500 text-purple-400 bg-purple-500/10' : 'border-zinc-800 text-stone-500 hover:border-zinc-600'}`}
          >
            Командный Турнир
          </button>
        </div>

        {disciples.length === 0 ? (
          <div className="p-8 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm text-center">
            <Swords size={32} className="mx-auto text-zinc-700 mb-4" />
            <h3 className="text-lg text-stone-300 mb-2">Учеников пока нет</h3>
            <p className="text-stone-500 text-sm">Наймите учеников, чтобы участвовать в боях.</p>
          </div>
        ) : (
          battleType === '1v1' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="text-sm uppercase text-amber-500 tracking-widest">Выбор Бойца</h3>
                   <button 
                     onClick={() => setSortByPower(!sortByPower)}
                     className={`px-3 py-1 text-[10px] uppercase tracking-widest font-medium transition-colors border ${sortByPower ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-zinc-950/60 backdrop-blur-md border-zinc-800 text-stone-500 hover:text-stone-300'}`}
                   >
                     {sortByPower ? 'По мощи' : 'По умолч.'}
                   </button>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-3 mb-6 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700">
                   {sortedDisciples.map((d: any) => (
                     <button
                       key={d.id}
                       onClick={() => setSelectedId(d.id)}
                       className={`p-3 border text-left flex flex-col transition-all ${
                         selectedId === d.id
                           ? 'bg-amber-500/10 border-amber-500/50 text-amber-400'
                           : 'bg-zinc-950/60 backdrop-blur-md border-zinc-800 text-stone-300 hover:border-zinc-700'
                       }`}
                     >
                       <span className="font-medium text-sm truncate w-full">{d.name}</span>
                       <span className="text-[10px] uppercase text-zinc-500 font-mono mt-1">БМ: {d.power} | {d.element}</span>
                     </button>
                   ))}
                 </div>
  
                 <motion.button 
                    whileHover={selectedId ? { scale: 1.02 } : {}}
                    whileTap={selectedId ? { scale: 0.98 } : {}}
                    onClick={findOpponents}
                    disabled={!selectedId}
                    className={`w-full py-3 border text-xs uppercase font-bold tracking-widest transition-all ${
                      selectedId 
                        ? 'border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:bg-amber-500/20' 
                        : 'border-zinc-800 text-stone-600 cursor-not-allowed'
                    }`}
                 >
                   Найти противника
                 </motion.button>
              </div>
              {selectedId && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded-sm"
                >
                   <h3 className="text-sm uppercase text-sky-500 tracking-widest mb-4">Характеристики</h3>
                   {(() => {
                     const d = disciples.find((d:any) => d.id === selectedId);
                     return d ? (
                       <div className="space-y-2 text-sm text-stone-400">
                         <p>Имя: <span className="text-stone-200">{d.name}</span></p>
                         <p>Боевая мощь: <span className="text-amber-400 font-mono">{d.power}</span></p>
                         <p>Стихия: <span className="text-sky-300">{d.element}</span></p>
                         <p>Роль: <span className="text-purple-300">{d.role}</span></p>
                       </div>
                     ) : null;
                   })()}
                </motion.div>
              )}
            </div>
          ) : (
            <div className="p-6 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm max-w-2xl">
              <h3 className="text-sm uppercase text-purple-500 tracking-widest mb-4">Командный Турнир Сект (5 на 5)</h3>
              
              {team.length === 0 ? (
                <p className="text-stone-500 text-sm mb-6">Ваша команда пуста. Перейдите во вкладку <span className="text-sky-400">Тактика и Отряд</span>, чтобы сформировать отряд.</p>
              ) : (
                <div className="mb-6 space-y-2 text-sm text-stone-300">
                  <p>Формация: <span className="text-purple-400">{formation}</span></p>
                  <p>Учеников в отряде: <span className="text-sky-400">{team.length}</span></p>
                  <p>Общая мощь (базовая): <span className="text-amber-400">{
                    Math.floor(team.reduce((acc: number, id: string) => {
                      const d = disciples.find((x: any) => x.id === id);
                      return acc + (d?.power || 0);
                    }, 0))
                  }</span></p>
                </div>
              )}

              <motion.button 
                 whileHover={team.length > 0 ? { scale: 1.02 } : {}}
                 whileTap={team.length > 0 ? { scale: 0.98 } : {}}
                 onClick={startTeamCombat}
                 disabled={team.length === 0}
                 className={`w-full py-3 border text-xs uppercase font-bold tracking-widest transition-colors ${
                   team.length > 0 
                     ? 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10' 
                     : 'border-zinc-800 text-stone-600 cursor-not-allowed'
                 }`}
              >
                Бросить вызов случайной секте
              </motion.button>
            </div>
          )
        )}
      </motion.div>
    );
  }

  if (combatState === 'selectOpponent') {
    const player = disciples.find((d:any) => d.id === selectedId);
    
    const elementsRules: Record<string, string> = {
      'Огонь': 'Металл', 'Металл': 'Дерево', 'Дерево': 'Земля',
      'Земля': 'Вода', 'Вода': 'Огонь'
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-2xl font-light text-stone-100 mb-2">Выбор Противника</h2>
          <p className="text-stone-500 text-sm">Выберите подходящего противника. Учитывайте стихию: Огонь &gt; Металл &gt; Дерево &gt; Земля &gt; Вода &gt; Огонь.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 p-6 bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded-sm">
             <h3 className="text-sm uppercase text-sky-500 tracking-widest mb-4">Ваш Боец</h3>
             {player && (
               <div className="space-y-4 text-sm text-stone-400">
                 <div>
                   <div className="text-stone-200 text-lg">{player.name}</div>
                   <div className="text-[10px] uppercase text-zinc-500">{player.role}</div>
                 </div>
                 <div className="flex justify-between border-b border-zinc-800/50 pb-2">
                   <span>Мощь:</span><span className="text-amber-400 font-mono">{player.power}</span>
                 </div>
                 <div className="flex justify-between border-b border-zinc-800/50 pb-2">
                   <span>Стихия:</span><span className="text-sky-300">{player.element}</span>
                 </div>
               </div>
             )}
             <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCombatState('select')}
                className="w-full mt-6 py-2 border border-zinc-700 text-stone-400 hover:text-stone-200 text-xs uppercase tracking-widest transition-colors"
             >
                Назад
             </motion.button>
          </div>

          <div className="md:w-2/3 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {opponents.map((opp, idx) => {
               const advPlayer = elementsRules[player?.element || ''] === opp.element;
               const advOpp = elementsRules[opp.element] === player?.element;

               return (
                 <div key={idx} className="p-4 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 hover:border-amber-500/50 transition-all rounded-sm flex flex-col justify-between group">
                   <div>
                     <h4 className="text-stone-200 text-base mb-1 truncate">{opp.name}</h4>
                     <div className="text-[10px] uppercase text-zinc-500 mb-4">{opp.role}</div>
                     
                     <div className="space-y-2 text-xs text-stone-400 mb-6">
                       <div className="flex justify-between border-b border-zinc-800/50 pb-1">
                         <span>Мощь:</span><span className="text-amber-400 font-mono">{opp.power}</span>
                       </div>
                       <div className={`flex justify-between border-b border-zinc-800/50 pb-1 ${advOpp ? 'text-red-400' : advPlayer ? 'text-emerald-400' : ''}`}>
                         <span>Стихия:</span>
                         <span className="flex items-center gap-1">
                           {opp.element}
                           {advPlayer && <span className="text-emerald-400" title="У вас преимущество">▼</span>} 
                           {advOpp && <span className="text-red-400" title="У противника преимущество">▲</span>}
                         </span>
                       </div>
                     </div>
                   </div>

                   <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => start1v1Combat(opp)}
                      className="w-full py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:bg-amber-500/20 text-[10px] uppercase font-bold tracking-widest transition-colors"
                   >
                     Атаковать
                   </motion.button>
                 </div>
               );
            })}
          </div>
        </div>
      </motion.div>
    );
  }

  if (combatState === 'fighting') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center p-32 space-y-6"
      >
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Swords size={64} className="text-amber-500/80 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
        </motion.div>
        <div className="text-stone-300 font-bold tracking-widest uppercase text-sm animate-pulse">Бой идет...</div>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { type: "spring" } }
  };

  const currentLog = visibleLogCount > 0 && combatData?.log ? combatData.log[visibleLogCount - 1] : combatData?.log?.[0] || { pHP: 0, eHP: 0, maxPHP: 1, maxEHP: 1 };
  const pHPPercent = Math.max(0, Math.min(100, (currentLog.pHP / currentLog.maxPHP) * 100)) || 0;
  const eHPPercent = Math.max(0, Math.min(100, (currentLog.eHP / currentLog.maxEHP) * 100)) || 0;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="p-6 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm relative">
        <h2 className="text-2xl font-light text-stone-100 mb-6">Результат Дуэли</h2>
        
        <div className="flex items-center justify-between mb-8 bg-zinc-950/60 backdrop-blur-md p-4 border border-zinc-800">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-center w-5/12">
            <div className="text-xl text-sky-300 truncate">{combatData.player.name}</div>
            <div className="text-[10px] uppercase text-zinc-500 mt-1 mb-2">Ваша секта</div>
            
            <div className="w-full bg-zinc-900/60 backdrop-blur-md h-1.5 mt-2 mb-3 rounded-full overflow-hidden border border-zinc-800">
               <div className="h-full bg-sky-500 transition-all duration-300" style={{ width: `${pHPPercent}%` }}></div>
            </div>

            {combatData.mode === '1v1' && (
               <div className="flex justify-center gap-3 text-xs text-stone-400 font-mono">
                 <span><span className="text-zinc-500 lowercase">БМ:</span> {combatData.player.power}</span>
                 <span><span className="text-zinc-500 lowercase">Стихия:</span> {combatData.player.element}</span>
               </div>
            )}
            {combatData.mode === 'team' && (
               <div className="flex justify-center gap-3 text-xs text-stone-400 font-mono">
                 <span><span className="text-zinc-500 lowercase">БМ:</span> {combatData.player.power}</span>
               </div>
            )}
          </motion.div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl text-stone-600 font-bold w-2/12 text-center">
            VS
          </motion.div>
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-center w-5/12">
            <div className="text-xl text-red-400 truncate">{combatData.enemy.name}</div>
            <div className="text-[10px] uppercase text-zinc-500 mt-1 mb-2">Оппонент</div>
            
            <div className="w-full bg-zinc-900/60 backdrop-blur-md h-1.5 mt-2 mb-3 rounded-full overflow-hidden border border-zinc-800">
               <div className="h-full bg-red-400 transition-all duration-300" style={{ width: `${eHPPercent}%` }}></div>
            </div>

            {combatData.mode === '1v1' && (
               <div className="flex justify-center gap-3 text-xs text-stone-400 font-mono">
                 <span><span className="text-zinc-500 lowercase">БМ:</span> {combatData.enemy.power}</span>
                 <span><span className="text-zinc-500 lowercase">Стихия:</span> {combatData.enemy.element}</span>
               </div>
            )}
            {combatData.mode === 'team' && (
               <div className="flex justify-center gap-3 text-xs text-stone-400 font-mono">
                 <span><span className="text-zinc-500 lowercase">БМ:</span> {combatData.enemy.power}</span>
               </div>
            )}
          </motion.div>
        </div>

        <h3 className="text-sm uppercase text-purple-300 tracking-widest mb-4">Журнал Событий</h3>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          ref={scrollRef}
          className="space-y-3 text-xs mb-8 h-64 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-zinc-700 scroll-smooth"
        >
          {combatData.log.slice(0, visibleLogCount).map((entry: any, i: number) => {
            let IconComp = null;
            let iconColor = "";
            switch (entry.icon) {
              case 'attack': IconComp = Swords; iconColor = "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"; break;
              case 'defend': IconComp = Shield; iconColor = "text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"; break;
              case 'defeat': IconComp = Skull; iconColor = "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"; break;
              case 'system': IconComp = Sparkles; iconColor = "text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]"; break;
              case 'magic': IconComp = Zap; iconColor = "text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]"; break;
              case 'Огонь': IconComp = Flame; iconColor = "text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]"; break;
              case 'Вода': IconComp = Droplets; iconColor = "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]"; break;
              case 'Дерево': IconComp = Leaf; iconColor = "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]"; break;
              case 'Металл': IconComp = Crosshair; iconColor = "text-zinc-400 drop-shadow-[0_0_8px_rgba(161,161,170,0.5)]"; break;
              case 'Земля': IconComp = Mountain; iconColor = "text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]"; break;
              default: break;
            }

            return (
              <motion.div variants={itemVariants} key={i} className="flex gap-3 text-stone-400 border-b border-zinc-800/50 pb-2 last:border-0 relative items-start">
                <span className="text-zinc-500 font-mono w-16 shrink-0 mt-[2px]">Раунд {entry.round}</span>
                <span className={entry.actor === combatData.player.name ? 'text-sky-400 font-medium mt-[2px]' : 'text-red-400 font-medium mt-[2px]'}>{entry.actor}</span>
                <span className="flex-1 flex items-center flex-wrap gap-x-2">
                  <span>{entry.text}</span>
                  {IconComp && (
                    <motion.div
                      initial={{ scale: 0, rotate: -45, opacity: 0 }}
                      animate={{ scale: [1.3, 1], rotate: 0, opacity: 1 }}
                      transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
                      className="inline-flex shrink-0 my-[-2px] ml-1"
                    >
                      <IconComp size={16} className={iconColor} />
                    </motion.div>
                  )}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        <AnimatePresence>
          {visibleLogCount >= combatData.log.length && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="border-t border-zinc-800 pt-6"
            >
           <div className="flex items-end justify-between mb-6">
             <div>
               <h3 className="text-sm uppercase text-amber-500 tracking-widest mb-4">Награды</h3>
               <div className="flex gap-6">
                 <div className="flex flex-col">
                   <span className="text-[10px] uppercase text-stone-500">Духовные Камни</span>
                   <span className="text-amber-400 font-mono text-lg">+{combatData.rewards.stones} ֏</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[10px] uppercase text-stone-500">Престиж</span>
                   <span className="text-purple-400 font-mono text-lg">+{combatData.rewards.prestige} ★</span>
                 </div>
               </div>
             </div>

             {combatData.won ? (
               <motion.div 
                 initial={{ rotate: -5, scale: 1.5, opacity: 0 }}
                 animate={{ rotate: 0, scale: 1, opacity: 1 }}
                 transition={{ type: 'spring' }}
                 className="px-8 py-3 border-2 border-green-500/50 bg-green-500/10 text-green-400 uppercase tracking-widest text-xl font-bold shadow-[0_0_25px_rgba(34,197,94,0.3)]"
               >
                 Победа
               </motion.div>
             ) : (
               <motion.div 
                 initial={{ rotate: 5, scale: 1.5, opacity: 0 }}
                 animate={{ rotate: 0, scale: 1, opacity: 1 }}
                 transition={{ type: 'spring' }}
                 className="px-8 py-3 border-2 border-red-500/50 bg-red-500/10 text-red-400 uppercase tracking-widest text-xl font-bold shadow-[0_0_25px_rgba(239,68,68,0.3)]"
               >
                 Поражение
               </motion.div>
             )}
           </div>

           <div className="flex gap-4">
             <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => combatData?.mode === 'team' ? startTeamCombat() : findOpponents()}
                className="flex-1 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs uppercase font-bold tracking-widest transition-colors"
             >
               {combatData?.mode === 'team' ? 'Следующий турнир' : 'Следующая дуэль'}
             </motion.button>
             <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCombatState('select')}
                className="flex-1 py-3 border border-zinc-700 text-stone-400 hover:text-stone-200 text-xs uppercase font-bold tracking-widest transition-colors"
             >
               Закрыть
             </motion.button>
           </div>
        </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const FORMATIONS_DATA = [
  { 
    name: 'Триада Земли', 
    desc: 'Сбалансированная линия из 3 учеников. Базовая тактика для малых групп.', 
    reqStrategy: 0,
    slots: [
      { id: 0, label: 'Авангард', x: 50, y: 20, bonusRole: ['Танк', 'Воин'], bonusText: '+15% БМ Танк/Воин', bonusMult: 1.15 },
      { id: 1, label: 'Левый фланг', x: 20, y: 70, bonusRole: ['Атакующий', 'Маг'], bonusText: '+15% БМ Атакующий/Маг', bonusMult: 1.15 },
      { id: 2, label: 'Правый фланг', x: 80, y: 70, bonusRole: ['Поддержка', 'Маг'], bonusText: '+15% БМ Поддержка/Маг', bonusMult: 1.15 },
    ]
  },
  { 
    name: 'Квадрат', 
    desc: 'Защитное построение для 4 учеников.', 
    reqStrategy: 0,
    slots: [
      { id: 0, label: 'Фронт Л', x: 30, y: 30, bonusRole: ['Танк'], bonusText: '+15% Танк', bonusMult: 1.15 },
      { id: 1, label: 'Фронт П', x: 70, y: 30, bonusRole: ['Воин'], bonusText: '+15% Воин', bonusMult: 1.15 },
      { id: 2, label: 'Тыл Л', x: 30, y: 70, bonusRole: ['Поддержка', 'Маг'], bonusText: '+15% Маг', bonusMult: 1.15 },
      { id: 3, label: 'Тыл П', x: 70, y: 70, bonusRole: ['Атакующий', 'Ассасин'], bonusText: '+15% Атака', bonusMult: 1.15 },
    ]
  },
  {
    name: 'Алмазный Строй',
    desc: 'Усиленный центр для 4 учеников.',
    reqStrategy: 10,
    slots: [
      { id: 0, label: 'Острие', x: 50, y: 15, bonusRole: ['Атакующий', 'Ассасин'], bonusText: '+15% Атака', bonusMult: 1.15 },
      { id: 1, label: 'Левое крыло', x: 20, y: 50, bonusRole: ['Воин', 'Танк'], bonusText: '+15% Воин/Танк', bonusMult: 1.15 },
      { id: 2, label: 'Правое крыло', x: 80, y: 50, bonusRole: ['Воин', 'Танк'], bonusText: '+15% Воин/Танк', bonusMult: 1.15 },
      { id: 3, label: 'Ядро', x: 50, y: 85, bonusRole: ['Поддержка', 'Маг'], bonusText: '+20% Поддержка', bonusMult: 1.2 },
    ]
  },
  { 
    name: 'Клинок прорыва', 
    desc: 'Агрессивная расстановка на 5 учеников.', 
    reqStrategy: 20,
    slots: [
      { id: 0, label: 'Острие', x: 50, y: 15, bonusRole: ['Танк', 'Воин'], bonusText: '+15% Танк/Воин', bonusMult: 1.15 },
      { id: 1, label: 'Лезвие Л', x: 30, y: 40, bonusRole: ['Ассасин'], bonusText: '+15% Ассасин', bonusMult: 1.15 },
      { id: 2, label: 'Лезвие П', x: 70, y: 40, bonusRole: ['Ассасин'], bonusText: '+15% Ассасин', bonusMult: 1.15 },
      { id: 3, label: 'Эфес Л', x: 20, y: 75, bonusRole: ['Маг', 'Атакующий'], bonusText: '+10% Атака', bonusMult: 1.10 },
      { id: 4, label: 'Эфес П', x: 80, y: 75, bonusRole: ['Поддержка'], bonusText: '+15% Поддержка', bonusMult: 1.15 },
    ]
  },
  { 
    name: 'Круговая оборона', 
    desc: 'Глухая защита для 5 на все направления.', 
    reqStrategy: 30,
    slots: [
      { id: 0, label: 'Центр', x: 50, y: 50, bonusRole: ['Поддержка'], bonusText: '+30% Поддержка', bonusMult: 1.3 },
      { id: 1, label: 'Север', x: 50, y: 15, bonusRole: ['Танк'], bonusText: '+15% Танк', bonusMult: 1.15 },
      { id: 2, label: 'Юг', x: 50, y: 85, bonusRole: ['Воин'], bonusText: '+15% Воин', bonusMult: 1.15 },
      { id: 3, label: 'Запад', x: 15, y: 50, bonusRole: ['Атакующий', 'Маг'], bonusText: '+15% Урон', bonusMult: 1.15 },
      { id: 4, label: 'Восток', x: 85, y: 50, bonusRole: ['Атакующий', 'Маг'], bonusText: '+15% Урон', bonusMult: 1.15 },
    ]
  }
];

function TacticsView({ state, onUpdate, onUpdateTeams, initialTab }: { state: any, onUpdate: any, onUpdateTeams: any, initialTab?: 'teams' | 'tactics' }) {
  const { disciples, teams = [], activeTeamId } = state;
  const innerDisciples = disciples.filter(isInnerDisciple);

  const [activeTab, setActiveTab] = useState<'teams' | 'tactics'>(initialTab || 'teams');
  const [sortByPower, setSortByPower] = useState(true);
  const sortedInnerDisciples = sortByPower ? [...innerDisciples].sort((a,b) => b.power - a.power) : innerDisciples;

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const activeTeamData = teams.find((t: any) => t.id === activeTeamId) || teams[0];
  const [localTeamId, setLocalTeamId] = useState<string>(activeTeamData?.id || 'team_1');
  const localTeamData = teams.find((t: any) => t.id === localTeamId) || activeTeamData;

  const [localFormationName, setLocalFormationName] = useState<string>(localTeamData?.formation || 'Триада Земли');
  
  const currentFormat = FORMATIONS_DATA.find(f => f.name === localFormationName) || FORMATIONS_DATA[0];
  
  const [localTeam, setLocalTeam] = useState<(string | null)[]>([]);

  useEffect(() => {
    if (!localTeamData) return;
    setLocalFormationName(localTeamData.formation);
    const format = FORMATIONS_DATA.find(f => f.name === localTeamData.formation) || FORMATIONS_DATA[0];
    const arr = [...localTeamData.members];
    while (arr.length < format.slots.length) arr.push(null);
    setLocalTeam(arr.slice(0, format.slots.length));
  }, [localTeamId, teams]);


  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  const handleFormationChange = (fName: string) => {
    const newF = FORMATIONS_DATA.find(f => f.name === fName);
    if (!newF) return;
    setLocalFormationName(fName);
    const newArr = [...localTeam].filter(id => id !== null); // Keep assigned disciples
    while (newArr.length < newF.slots.length) newArr.push(null);
    setLocalTeam(newArr.slice(0, newF.slots.length));
    setSelectedSlotIndex(null);
  };

  const handleToggleDisciple = (dId: string) => {
    if (selectedSlotIndex === null) return;
    const existingIndex = localTeam.indexOf(dId);
    if (existingIndex !== -1) {
      // Disciple is already somewhere else. Swap them or clear old position.
      const newTeam = [...localTeam];
      newTeam[existingIndex] = null;
      newTeam[selectedSlotIndex] = dId;
      setLocalTeam(newTeam);
    } else {
      const newTeam = [...localTeam];
      newTeam[selectedSlotIndex] = dId;
      setLocalTeam(newTeam);
    }
  };

  const handleClearSlot = (index: number) => {
    const newTeam = [...localTeam];
    newTeam[index] = null;
    setLocalTeam(newTeam);
  };

  const handleSave = () => {
    const newTeams = teams.map((t: any) => {
       if (t.id === localTeamId) {
          return { ...t, members: localTeam, formation: localFormationName };
       }
       return t;
    });
    onUpdateTeams(newTeams, activeTeamId);
  };

  const handleCreateTeam = () => {
    const newId = 'team_' + Date.now();
    const newTeam = {
      id: newId,
      name: `Отряд ${teams.length + 1}`,
      members: [],
      formation: 'Триада Земли'
    };
    onUpdateTeams([...teams, newTeam], activeTeamId);
    setLocalTeamId(newId);
  };

  const handleMakeActive = () => {
    const newTeams = teams.map((t: any) => {
       if (t.id === localTeamId) {
          return { ...t, members: localTeam, formation: localFormationName };
       }
       return t;
    });
    onUpdateTeams(newTeams, localTeamId);
  };

  const handleDeleteTeam = () => {
    if (teams.length <= 1) return;
    const newTeams = teams.filter((t: any) => t.id !== localTeamId);
    const nextActive = activeTeamId === localTeamId ? newTeams[0].id : activeTeamId;
    onUpdateTeams(newTeams, nextActive);
    setLocalTeamId(newTeams[0].id);
  };

  const isFull = localTeam.filter(id => id !== null).length === currentFormat.slots.length;
  let totalPower = 0;
  let activeBonuses = 0;

  if (isFull) {
    localTeam.forEach((id, index) => {
      if (id) {
        const d = disciples.find((disc: any) => disc.id === id);
        if (d) {
          const slot = currentFormat.slots[index];
          if (slot?.bonusRole?.includes(d.role)) {
            totalPower += Math.floor(d.power * (slot.bonusMult || 1));
            activeBonuses++;
          } else {
            totalPower += d.power;
          }
        }
      }
    });
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-light text-stone-100 mb-2">
              {activeTab === 'teams' ? 'Формирование Команды' : 'Тактические Построения'}
            </h2>
            <p className="text-stone-500 text-sm">
               {activeTab === 'teams' ? 'Выберите подходящих учеников для вашей группы.' : 'Сформируйте формацию из доступных учеников. Позиция имеет значение.'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
             <select 
                value={localTeamId} 
                onChange={(e) => setLocalTeamId(e.target.value)}
                className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 text-stone-200 text-sm p-2 rounded focus:border-amber-500 outline-none"
             >
                {teams.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.name} {t.id === activeTeamId ? '(Активный)' : ''}
                  </option>
                ))}
             </select>
             <button
               onClick={handleCreateTeam}
               className="bg-zinc-900/60 backdrop-blur-md hover:bg-zinc-800 border border-zinc-800 text-stone-300 p-2 rounded transition-colors text-sm"
               title="Создать новый отряд"
             >
               + Новый
             </button>
             {teams.length > 1 && (
               <button
                 onClick={handleDeleteTeam}
                 className="bg-zinc-900/60 backdrop-blur-md hover:bg-red-900/30 border border-zinc-800 hover:border-red-500/50 text-stone-500 hover:text-red-400 p-2 rounded transition-colors text-sm"
                 title="Удалить отряд"
               >
                 Удалить
               </button>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm relative mt-4">
            <h3 className="text-sm uppercase text-sky-400 tracking-widest mb-4">Карта Построения</h3>
            <div className="relative w-full h-[360px] bg-zinc-950/50 border border-zinc-800 rounded-sm flex items-center justify-center overflow-hidden">
               {/* Background pattern */}
               <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
                 <div className="w-64 h-64 border-2 border-stone-500 rounded-full"></div>
                 <div className="absolute w-48 h-48 border border-stone-500 rotate-45"></div>
               </div>

               {currentFormat.slots.map((slot, i) => {
                 const discipleId = localTeam[i];
                 const d = discipleId ? disciples.find((disc: any) => disc.id === discipleId) : null;
                 const isSelectedSlot = selectedSlotIndex === i;

                 return (
                   <div 
                     key={i} 
                     className="absolute flex flex-col items-center justify-center transition-all cursor-pointer"
                     style={{ left: `${slot.x}%`, top: `${slot.y}%`, transform: 'translate(-50%, -50%)', zIndex: isSelectedSlot ? 20 : 10 }}
                     onClick={() => setSelectedSlotIndex(i)}
                   >
                     {d ? (
                       <div className={`relative flex flex-col items-center group`}>
                         <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-2 bg-zinc-950/60 backdrop-blur-md flex items-center justify-center overflow-hidden transition-colors ${isSelectedSlot ? 'border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.5)]' : 'border-zinc-500'}`}>
                           <Users size={24} className={isSelectedSlot ? 'text-sky-400' : 'text-zinc-500'} />
                         </div>
                         <div className="mt-1 text-[10px] text-stone-300 font-mono text-center w-max bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800">
                           {d.name} <br/> <span className="opacity-70 text-[9px]">{d.role}</span>
                         </div>
                         {slot?.bonusRole?.includes(d.role) && (
                           <div className="absolute -top-2 -right-2 bg-amber-500 text-black text-[8px] px-1 font-bold rounded">
                             БОНУС
                           </div>
                         )}
                         <button 
                           onClick={(e) => { e.stopPropagation(); handleClearSlot(i); }} 
                           className="absolute -top-1 -left-1 hidden group-hover:flex w-5 h-5 bg-red-500 text-white items-center justify-center rounded-full text-[10px]"
                         >
                           ✕
                         </button>
                       </div>
                     ) : (
                       <div className={`relative flex flex-col items-center group`}>
                         <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-dashed bg-zinc-900/50 flex items-center justify-center transition-colors ${isSelectedSlot ? 'border-sky-400 text-sky-400 bg-sky-400/10' : 'border-zinc-700 text-zinc-600 hover:border-zinc-500'}`}>
                           <span className="text-xl">+</span>
                         </div>
                         <div className="mt-1 text-[9px] text-zinc-500 font-mono text-center uppercase">
                           {slot.label}
                         </div>
                       </div>
                     )}
                   </div>
                 )
               })}
            </div>
          </div>

          <div className="p-6 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm">
             {isFull ? (
               <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex items-center justify-between text-sm border-b border-zinc-800/50 pb-2">
                    <span className="text-stone-400 uppercase text-[10px]">Итоговая Мощь</span>
                    <span className="text-amber-400 font-mono text-xl">{totalPower} БМ</span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-b border-zinc-800/50 pb-2">
                    <span className="text-stone-400 uppercase text-[10px]">Активировано бонусов позиций</span>
                    <span className="text-sky-400 font-mono">{activeBonuses} / {currentFormat.slots.length}</span>
                  </div>
               </div>
             ) : (
               <div className="text-center p-4 border border-zinc-800 bg-zinc-950/50">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                    Заполните все {currentFormat.slots.length} слотов построения для расчета характеристик
                  </p>
               </div>
             )}
          </div>

          {activeTab === 'teams' && selectedSlotIndex !== null && (
            <div className="p-6 bg-zinc-900/60 backdrop-blur-md border border-sky-500/30 rounded-sm shadow-[0_0_20px_rgba(56,189,248,0.05)] text-left">
              <div className="flex justify-between items-center mb-2 border-b border-sky-400/20 pb-2">
                <h3 className="text-sm uppercase text-sky-400 tracking-widest">
                  Выбрать ученика для: {currentFormat.slots[selectedSlotIndex]?.label}
                </h3>
                <button 
                  onClick={() => setSortByPower(!sortByPower)}
                  className={`px-3 py-1 text-[10px] uppercase tracking-widest font-medium transition-colors border ${sortByPower ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-zinc-950/60 backdrop-blur-md border-zinc-800 text-stone-500 hover:text-stone-300'}`}
                >
                  {sortByPower ? 'По мощи' : 'По умолч.'}
                </button>
              </div>
              <p className="text-[10px] uppercase text-amber-500/70 mb-4 font-mono tracking-wider">
                Рекомендация: {currentFormat.slots[selectedSlotIndex]?.bonusText}
              </p>
              
              {innerDisciples.length === 0 ? (
                <p className="text-zinc-600 text-sm font-mono p-4 text-center">Нет внутренних учеников</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700">
                  {sortedInnerDisciples.map((d: any) => {
                    const isAlreadyAssigned = localTeam.includes(d.id);
                    const isPerfectFit = currentFormat.slots[selectedSlotIndex]?.bonusRole?.includes(d.role);
                    
                    return (
                      <button
                        key={d.id}
                        onClick={() => handleToggleDisciple(d.id)}
                        disabled={isAlreadyAssigned && localTeam.indexOf(d.id) === selectedSlotIndex}
                        className={`p-3 border text-left flex flex-col transition-all ${
                          isAlreadyAssigned && localTeam.indexOf(d.id) === selectedSlotIndex
                            ? 'bg-sky-500/10 border-sky-500/50 text-sky-400 opacity-100 cursor-not-allowed'
                            : isPerfectFit 
                              ? 'bg-amber-500/5 border-amber-500/30 text-amber-100 hover:bg-amber-500/20 hover:border-amber-500/50'
                              : 'bg-zinc-950/60 backdrop-blur-md border-zinc-800 text-stone-300 hover:border-zinc-700 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <span className="font-medium text-sm truncate w-full flex items-center justify-between">
                          {d.name} {isAlreadyAssigned && localTeam.indexOf(d.id) !== selectedSlotIndex && <span className="text-sky-400 text-[10px]">(Свап)</span>}
                        </span>
                        <span className="text-[10px] uppercase font-mono mt-1 opacity-70">
                          {d.role} | БМ: {d.power}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {activeTab === 'tactics' && (
            <div className="p-6 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-sm">
              <h3 className="text-sm uppercase text-amber-500 tracking-widest mb-4">Доступные Построения</h3>
              <div className="space-y-3">
                {FORMATIONS_DATA.map(f => {
                  const hasStrategy = (state.player?.stats.strategy || 0) >= (f.reqStrategy || 0);
                  return (
                  <button
                    key={f.name}
                    onClick={() => hasStrategy && handleFormationChange(f.name)}
                    disabled={!hasStrategy}
                    className={`w-full text-left p-3 border transition-colors relative ${
                      localFormationName === f.name 
                        ? 'border-amber-500/50 bg-amber-500/10 text-amber-400' 
                        : hasStrategy ? 'border-zinc-800 bg-zinc-950/60 backdrop-blur-md text-stone-400 hover:border-zinc-700' : 'border-zinc-800 bg-zinc-950/50 text-stone-500 cursor-not-allowed opacity-70'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                       <span className="font-medium text-sm flex items-center gap-2">
                         {f.name}
                         {!hasStrategy && <span className="text-[10px] text-stone-500 font-normal lowercase tracking-wide">треб. стратегия главы: {f.reqStrategy}</span>}
                       </span>
                       <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 text-zinc-500">Слотов: {f.slots.length}</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 leading-tight">{f.desc}</div>
                  </button>
                )})}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={handleMakeActive}
               className={`flex-1 py-4 border text-xs uppercase font-bold tracking-widest transition-colors flex justify-center items-center gap-2 ${
                 localTeamId === activeTeamId 
                   ? 'border-sky-500/50 bg-sky-500/10 text-sky-400 cursor-not-allowed' 
                   : 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
               }`}
               disabled={localTeamId === activeTeamId}
            >
               {localTeamId === activeTeamId ? 'Основной Отряд' : 'Сделать Основным'}
            </motion.button>
            <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={handleSave}
               className="flex-1 py-4 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs uppercase font-bold tracking-widest transition-colors flex justify-center items-center gap-2"
            >
               <Shield size={16} /> Сохранить
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Helpers
function getRarityTag(rarity: string) {
  switch (rarity) {
    case 'Легендарный': return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', borderTop: 'border-amber-500/50', text: 'text-amber-400' };
    case 'Эпический': return { bg: 'bg-purple-500/10', border: 'border-purple-500/20', borderTop: 'border-purple-500/50', text: 'text-purple-400' };
    case 'Редкий': return { bg: 'bg-sky-500/10', border: 'border-sky-500/20', borderTop: 'border-sky-500/50', text: 'text-sky-400' };
    default: return { bg: 'bg-stone-500/10', border: 'border-stone-500/20', borderTop: 'border-stone-500/50', text: 'text-stone-400' };
  }
}
