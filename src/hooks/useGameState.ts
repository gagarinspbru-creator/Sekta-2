import { useState, useEffect, useCallback } from 'react';
import { GameState, Disciple, FormationType } from '../types';

const generateId = () => Math.random().toString(36).substring(2, 9);

const createInitialDisciples = (): Disciple[] => [
  {
    id: generateId(),
    name: 'Линь Фэн',
    rarity: 'Редкий',
    role: 'Воин',
    element: 'Огонь',
    level: 5,
    power: 120,
    loyalty: 100,
    cultivationStage: 1,
    type: 'inner',
    rank: 'Внутренний ученик',
    combatStats: { attack: 130, defense: 110, health: 1200, speed: 105 },
    workStats: { mining: 10, farming: 10, alchemy: 20, crafting: 15 }
  },
  {
    id: generateId(),
    name: 'Ван Линь',
    rarity: 'Обычный',
    role: 'Атакующий',
    element: 'Вода',
    level: 3,
    power: 80,
    loyalty: 90,
    cultivationStage: 0,
    type: 'inner',
    rank: 'Внутренний ученик',
    combatStats: { attack: 95, defense: 60, health: 700, speed: 85 },
    workStats: { mining: 5, farming: 5, alchemy: 10, crafting: 8 }
  },
  {
    id: generateId(),
    name: 'Бай Юй',
    rarity: 'Обычный',
    role: 'Поддержка',
    element: 'Дерево',
    level: 3,
    power: 75,
    loyalty: 90,
    cultivationStage: 0,
    type: 'inner',
    rank: 'Внутренний ученик',
    combatStats: { attack: 60, defense: 85, health: 800, speed: 60 },
    workStats: { mining: 5, farming: 15, alchemy: 10, crafting: 5 }
  },
  {
    id: generateId(),
    name: 'Чжан Сань',
    rarity: 'Обычный',
    role: 'Танк',
    element: 'Земля',
    level: 1,
    power: 30,
    loyalty: 80,
    cultivationStage: 0,
    type: 'outer',
    rank: 'Внешний ученик',
    combatStats: { attack: 10, defense: 25, health: 300, speed: 10 },
    workStats: { mining: 45, farming: 30, alchemy: 5, crafting: 10 }
  },
  {
    id: generateId(),
    name: 'Ли Сы',
    rarity: 'Обычный',
    role: 'Маг',
    element: 'Огонь',
    level: 1,
    power: 35,
    loyalty: 80,
    cultivationStage: 0,
    type: 'outer',
    rank: 'Внешний ученик',
    combatStats: { attack: 15, defense: 15, health: 200, speed: 15 },
    workStats: { mining: 10, farming: 10, alchemy: 35, crafting: 35 }
  },
  {
    id: generateId(),
    name: 'Ван Ву',
    rarity: 'Обычный',
    role: 'Ассасин',
    element: 'Дерево',
    level: 1,
    power: 40,
    loyalty: 80,
    cultivationStage: 0,
    type: 'outer',
    rank: 'Внешний ученик',
    combatStats: { attack: 20, defense: 10, health: 250, speed: 25 },
    workStats: { mining: 15, farming: 40, alchemy: 10, crafting: 10 }
  },
  {
    id: generateId(),
    name: 'Чжао Лю',
    rarity: 'Обычный',
    role: 'Воин',
    element: 'Металл',
    level: 1,
    power: 35,
    loyalty: 80,
    cultivationStage: 0,
    type: 'outer',
    rank: 'Внешний ученик',
    combatStats: { attack: 18, defense: 20, health: 350, speed: 12 },
    workStats: { mining: 35, farming: 10, alchemy: 10, crafting: 20 }
  },
  {
    id: generateId(),
    name: 'Сунь Ци',
    rarity: 'Обычный',
    role: 'Поддержка',
    element: 'Вода',
    level: 1,
    power: 30,
    loyalty: 80,
    cultivationStage: 0,
    type: 'outer',
    rank: 'Внешний ученик',
    combatStats: { attack: 10, defense: 20, health: 300, speed: 15 },
    workStats: { mining: 10, farming: 40, alchemy: 15, crafting: 15 }
  }
];

const getInitialState = (): GameState => ({
  player: {
    level: 1,
    exp: 0,
    stats: {
      authority: 5,
      charisma: 3,
      strategy: 2,
      wisdom: 3,
      cunning: 2,
      luck: 1
    }
  },
  resources: { stones: 1000, qi: 100, prestige: 10, herbs: 0, ore: 0, beastMaterials: 0, contribution: 0 },
  buildings: { mainHall: 1, mine: 1, cave: 1, alchemyLab: 0, herbGarden: 0, armory: 0, library: 0, market: 0, arena: 0 },
  inventory: { breakthroughPills: 0, recoveryPills: 0, strengthPills: 0, artifacts: [] },
  disciples: createInitialDisciples(),
  teams: [
    { id: 'team_1', name: 'Отряд 1', members: [], formation: 'Триада Земли' }
  ],
  activeTeamId: 'team_1',
  lastUpdate: Date.now(),
});

function gainExp(state: GameState, amount: number): GameState {
  if (!state.player) return state;
  let newExp = state.player.exp + amount;
  let newLevel = state.player.level;
  let newStats = { ...state.player.stats };

  let expNeeded = newLevel * 100;
  let leveledUp = false;
  while (newExp >= expNeeded) {
    newExp -= expNeeded;
    newLevel++;
    newStats.authority += 1;
    newStats.charisma += 1;
    newStats.strategy += 1;
    newStats.wisdom += 1;
    newStats.cunning += 1;
    newStats.luck += 1;
    expNeeded = newLevel * 100;
    leveledUp = true;
  }
  
  if (!leveledUp && newExp === state.player.exp) return state;

  return {
    ...state,
    player: { ...state.player, exp: newExp, level: newLevel, stats: newStats }
  };
}

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem('wuxia_sect_save_v2');
      if (saved) {
        const parsed: GameState = JSON.parse(saved);
        if (!parsed.teams) {
          parsed.teams = [{
             id: 'team_1',
             name: 'Отряд 1',
             members: parsed.team || [],
             formation: parsed.formation || 'Триада Земли'
          }];
          parsed.activeTeamId = 'team_1';
        }
        
        // Ensure starting disciples exist if the save has no disciples (e.g. wiped save or legacy bug)
        if (!parsed.disciples || parsed.disciples.length === 0) {
            parsed.disciples = createInitialDisciples();
        }

        if (!parsed.player) {
          parsed.player = getInitialState().player;
        }

        const initialBuildings = getInitialState().buildings;
        if (!parsed.buildings) parsed.buildings = initialBuildings;
        parsed.buildings = { ...initialBuildings, ...parsed.buildings };

        const initialInventory = getInitialState().inventory;
        if (!parsed.inventory) parsed.inventory = initialInventory;
        parsed.inventory = { ...initialInventory, ...parsed.inventory };
        
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load save', e);
    }
    return getInitialState();
  });

  // Save to local storage on changes
  useEffect(() => {
    localStorage.setItem('wuxia_sect_save_v2', JSON.stringify(state));
  }, [state]);

  // Game Loop (Resources generation)
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        const now = Date.now();
        const deltaSeconds = (now - prev.lastUpdate) / 1000;
        
        let miningBonus = 0;
        let farmingBonus = 0;

        prev.disciples.forEach(d => {
            const isInner = ['Глава секты', 'Старейшина', 'Элита', 'Внутренний ученик', 'Новобранец'].includes(d.rank || (d.type === 'inner' ? 'Внутренний ученик' : 'Внешний ученик'));
            // only outer disciples not in active team can work (or simplify: just outer disciples not in team)
            if (!isInner && !prev.teams?.some(t => t.members.includes(d.id))) {
                const mineStat = d.workStats?.mining || (d.element === 'Земля' || d.element === 'Металл' ? d.power : 0);
                const farmStat = d.workStats?.farming || (d.element === 'Дерево' || d.element === 'Вода' ? d.power : 0);
                
                miningBonus += (mineStat / 100);
                farmingBonus += (farmStat / 100);
            }
        });

        const stoneIncome = prev.buildings.mine * 5 * deltaSeconds * (1 + miningBonus); 
        const oreIncome = prev.buildings.mine * 1 * deltaSeconds * (1 + miningBonus);
        const qiIncome = prev.buildings.cave * 2 * deltaSeconds;
        const herbsIncome = prev.buildings.herbGarden * 1.5 * deltaSeconds * (1 + farmingBonus);

        let newBuildings = { ...prev.buildings };
        let newUpgrades = { ...prev.buildingUpgrades };
        let newInventory = { ...prev.inventory };
        let newDisciples = [...prev.disciples];
        let newAlchemyTask = prev.alchemyTask;
        let newCraftingTask = prev.craftingTask;
        let newCultivatingTasks = { ...prev.cultivatingTasks };
        let newTrainingTasks = { ...prev.trainingTasks };
        let stateChanged = false;
        let moraleUpdated = false;

        const maxInner = prev.player ? 5 + Math.floor(prev.player.stats.authority / 10) + (prev.bonusInnerLimit || 0) : 5;
        const innerCount = prev.disciples.filter((d: any) => d.type === 'inner' || ['Эпический', 'Легендарный', 'Мифический'].includes(d.rarity)).length;
        
        let newBonusInnerLimit = prev.bonusInnerLimit;
        let newNextInnerLimitAt = prev.nextInnerLimitAt;

        if (innerCount >= maxInner && !newNextInnerLimitAt) {
           newNextInnerLimitAt = now + 60 * 1000; // 1 minute cooldown to increase limit
           stateChanged = true;
        }

        if (newNextInnerLimitAt && now >= newNextInnerLimitAt) {
          stateChanged = true;
          newNextInnerLimitAt = undefined;
          newBonusInnerLimit = (newBonusInnerLimit || 0) + 1;
        }

        if (!prev.lastMoraleUpdate || now - prev.lastMoraleUpdate >= 60000) {
          const leavingDisciples: string[] = [];
          const charisma = prev.player?.stats.charisma || 0;
          const leaveChance = Math.max(0.01, 0.1 - charisma * 0.002);
          const moraleDrop = Math.max(0, 2 - charisma * 0.05);

          newDisciples = newDisciples.map(d => {
            const newLoyalty = Math.max(0, (d.loyalty || 0) - 1);
            // Temporarily disable disciple leaving
            // if (newLoyalty < 20 && Math.random() < leaveChance) {
            //   // chance to leave per minute if loyalty < 20, mitigated by charisma
            //   leavingDisciples.push(d.id);
            // }
            return {
              ...d,
              morale: Math.min(100, Math.max(0, (d.morale ?? 100) - moraleDrop)), 
              loyalty: newLoyalty
            };
          }).filter(d => !leavingDisciples.includes(d.id));
          
          moraleUpdated = true;
          stateChanged = true;
        }

        if (prev.buildingUpgrades) {
          Object.entries(prev.buildingUpgrades).forEach(([bId, upgrade]) => {
            if (upgrade && now >= (upgrade as { finishAt: number }).finishAt) {
              newBuildings[bId as keyof GameState['buildings']] = (upgrade as { targetLevel: number }).targetLevel;
              delete newUpgrades[bId as keyof GameState['buildings']];
              stateChanged = true;
            }
          });
        }

        if (prev.alchemyTask && now >= prev.alchemyTask.finishAt) {
           const type = prev.alchemyTask.type as keyof typeof newInventory;
           newInventory[type] = ((newInventory[type] as number) || 0) + prev.alchemyTask.count;
           newAlchemyTask = undefined;
           stateChanged = true;
        }

        if (prev.craftingTask && now >= prev.craftingTask.finishAt) {
           newInventory.artifacts = [...(newInventory.artifacts || []), prev.craftingTask.artifact];
           newCraftingTask = undefined;
           stateChanged = true;
        }

        newDisciples = newDisciples.map(d => {
          if (d.buffs?.strengthUntil && now >= d.buffs.strengthUntil) {
            stateChanged = true;
            return {
              ...d,
              power: Math.max(0, d.power - 200),
              buffs: { ...d.buffs, strengthUntil: undefined }
            };
          }
          return d;
        });

        if (prev.cultivatingTasks) {
          Object.entries(prev.cultivatingTasks).forEach(([dId, task]) => {
            if (task && now >= (task as { finishAt: number }).finishAt) {
              const dIndex = newDisciples.findIndex(d => d.id === dId);
              if (dIndex !== -1) {
                const d = { ...newDisciples[dIndex] };
                d.cultivationStage += 1;
                d.level = (d.level || 1) + 1;
                const multipliers = [1.5, 2.0, 2.0, 2.0];
                const mult = multipliers[d.cultivationStage - 1] || 1.5;
                d.power = Math.floor(d.power * mult);
                d.loyalty = Math.min(100, (d.loyalty || 0) + 10);
                d.morale = Math.min(100, (d.morale ?? 100) + 20);
                newDisciples[dIndex] = d;
              }
              delete newCultivatingTasks[dId];
              stateChanged = true;
            }
          });
        }

        if (prev.trainingTasks) {
          Object.entries(prev.trainingTasks).forEach(([dId, task]) => {
            if (task && now >= (task as { finishAt: number }).finishAt) {
              const dIndex = newDisciples.findIndex(d => d.id === dId);
              if (dIndex !== -1) {
                const d = { ...newDisciples[dIndex] };
                d.level = (d.level || 1) + 1;
                newDisciples[dIndex] = d;
              }
              delete newTrainingTasks[dId];
              stateChanged = true;
            }
          });
        }

        return {
          ...prev,
          buildings: newBuildings,
          buildingUpgrades: stateChanged ? newUpgrades : prev.buildingUpgrades,
          inventory: stateChanged ? newInventory : prev.inventory,
          disciples: stateChanged ? newDisciples : prev.disciples,
          alchemyTask: stateChanged ? newAlchemyTask : prev.alchemyTask,
          craftingTask: stateChanged ? newCraftingTask : prev.craftingTask,
          cultivatingTasks: stateChanged ? newCultivatingTasks : prev.cultivatingTasks,
          trainingTasks: stateChanged ? newTrainingTasks : prev.trainingTasks,
          nextInnerLimitAt: stateChanged ? newNextInnerLimitAt : prev.nextInnerLimitAt,
          bonusInnerLimit: stateChanged ? newBonusInnerLimit : prev.bonusInnerLimit,
          pendingResources: {
            stones: (prev.pendingResources?.stones || 0) + stoneIncome,
            ore: (prev.pendingResources?.ore || 0) + oreIncome,
            qi: (prev.pendingResources?.qi || 0) + qiIncome,
            herbs: (prev.pendingResources?.herbs || 0) + herbsIncome,
            prestige: prev.pendingResources?.prestige || 0,
            beastMaterials: prev.pendingResources?.beastMaterials || 0,
            contribution: prev.pendingResources?.contribution || 0,
          },
          lastUpdate: now,
          lastMoraleUpdate: moraleUpdated ? now : prev.lastMoraleUpdate,
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const upgradeBuilding = useCallback((buildingId: keyof GameState['buildings'], costPattern: Record<string, number>, durationSeconds: number) => {
    setState((prev) => {
      const canUpgrade = Object.entries(costPattern).every(([k, v]) => (prev.resources[k as keyof typeof prev.resources] || 0) >= v);
      if (canUpgrade && !prev.buildingUpgrades?.[buildingId]) {
        const newResources = { ...prev.resources };
        Object.entries(costPattern).forEach(([k, v]) => {
            const key = k as keyof typeof newResources;
            newResources[key] = (newResources[key] || 0) - v;
        });
        
        return gainExp({
          ...prev,
          resources: newResources,
          buildingUpgrades: {
            ...prev.buildingUpgrades,
            [buildingId]: {
              targetLevel: (prev.buildings[buildingId] || 0) + 1,
              finishAt: Date.now() + durationSeconds * 1000
            }
          }
        }, 50);
      }
      return prev;
    });
  }, []);

  const instantUpgradeBuilding = useCallback((buildingId: keyof GameState['buildings']) => {
    setState((prev) => {
      const upgrade = prev.buildingUpgrades?.[buildingId];
      if (upgrade) {
        const remainingMs = Math.max(0, upgrade.finishAt - Date.now());
        const expectedQi = Math.ceil(remainingMs / 1000) * 10; // 10 Qi per second
        
        if (prev.resources.qi >= expectedQi) {
          const newUpgrades = { ...prev.buildingUpgrades };
          delete newUpgrades[buildingId];
          return gainExp({
            ...prev,
            resources: {
              ...prev.resources,
              qi: prev.resources.qi - expectedQi,
            },
            buildings: {
              ...prev.buildings,
              [buildingId]: upgrade.targetLevel,
            },
            buildingUpgrades: newUpgrades,
          }, 20);
        }
      }
      return prev;
    });
  }, []);

  const addDisciple = useCallback((disciple: Disciple, cost: number) => {
    setState((prev) => {
      if (prev.resources.stones >= cost) {
        return gainExp({
          ...prev,
          resources: {
            ...prev.resources,
            stones: prev.resources.stones - cost,
          },
          disciples: [...prev.disciples, disciple],
        }, 20);
      }
      return prev;
    });
  }, []);

  const changeDiscipleRank = useCallback((discipleId: string, rank: any) => {
    setState((prev) => {
      const dIndex = prev.disciples.findIndex((d) => d.id === discipleId);
      if (dIndex !== -1) {
        const newDisciples = [...prev.disciples];
        newDisciples[dIndex] = { ...newDisciples[dIndex], rank };
        return { ...prev, disciples: newDisciples };
      }
      return prev;
    });
  }, []);

  const craftPill = useCallback((pillType: 'breakthroughPills' | 'recoveryPills' | 'strengthPills', cost: Record<string, number>, durationSeconds: number) => {
    setState((prev) => {
      const canCraft = Object.entries(cost).every(([k, v]) => (prev.resources[k as keyof typeof prev.resources] || 0) >= v);
      if (prev.buildings.alchemyLab > 0 && canCraft && !prev.alchemyTask) {
        const newResources = { ...prev.resources };
        Object.entries(cost).forEach(([k, v]) => {
            const key = k as keyof typeof newResources;
            newResources[key] = (newResources[key] || 0) - v;
        });
        
        return gainExp({
          ...prev,
          resources: newResources,
          alchemyTask: {
            type: pillType,
            count: 1,
            finishAt: Date.now() + durationSeconds * 1000
          }
        }, 10);
      }
      return prev;
    });
  }, []);

  const instantCraftPill = useCallback(() => {
    setState((prev) => {
      if (prev.alchemyTask) {
        const remainingMs = Math.max(0, prev.alchemyTask.finishAt - Date.now());
        const expectedQi = Math.ceil(remainingMs / 1000) * 10;
        if (prev.resources.qi >= expectedQi) {
          const pType = prev.alchemyTask.type;
          return gainExp({
            ...prev,
            resources: {
              ...prev.resources,
              qi: prev.resources.qi - expectedQi,
            },
            inventory: {
              ...prev.inventory,
              [pType]: prev.inventory[pType] + prev.alchemyTask.count
            },
            alchemyTask: undefined
          }, 5);
        }
      }
      return prev;
    });
  }, []);

  const craftArtifact = useCallback((artifact: any, cost: Record<string, number>, durationSeconds: number) => {
    setState((prev) => {
      const canCraft = Object.entries(cost).every(([k, v]) => (prev.resources[k as keyof typeof prev.resources] || 0) >= v);
      if (canCraft && !prev.craftingTask) {
        const newResources = { ...prev.resources };
        Object.entries(cost).forEach(([k, v]) => {
            const key = k as keyof typeof newResources;
            newResources[key] = (newResources[key] || 0) - v;
        });
        return gainExp({
          ...prev,
          resources: newResources,
          craftingTask: {
            artifact,
            finishAt: Date.now() + durationSeconds * 1000
          }
        }, 15);
      }
      return prev;
    });
  }, []);

  const instantCraftArtifact = useCallback(() => {
    setState((prev) => {
      if (prev.craftingTask) {
        const remainingMs = Math.max(0, prev.craftingTask.finishAt - Date.now());
        const expectedQi = Math.ceil(remainingMs / 1000) * 10;
        if (prev.resources.qi >= expectedQi) {
          return gainExp({
            ...prev,
            resources: {
              ...prev.resources,
              qi: prev.resources.qi - expectedQi,
            },
            inventory: {
              ...prev.inventory,
              artifacts: [...(prev.inventory.artifacts || []), prev.craftingTask.artifact],
            },
            craftingTask: undefined
          }, 10);
        }
      }
      return prev;
    });
  }, []);

  const equipArtifact = useCallback((discipleId: string, artifactId: string) => {
    setState((prev) => {
      const artIndex = (prev.inventory.artifacts || []).findIndex(a => a.id === artifactId);
      if (artIndex === -1) return prev;
      
      const artifact = prev.inventory.artifacts![artIndex];
      const newDisciples = [...prev.disciples];
      const dIndex = newDisciples.findIndex(d => d.id === discipleId);
      if (dIndex === -1) return prev;

      const d = { ...newDisciples[dIndex] };
      const currentEq = d.equipment || {};
      
      let newInventoryArts = [...(prev.inventory.artifacts || [])];
      newInventoryArts.splice(artIndex, 1); // remove from inventory

      // If already equipped, return old one to inventory
      if (currentEq[artifact.type]) {
        newInventoryArts.push(currentEq[artifact.type]!);
        d.power -= currentEq[artifact.type]!.powerBonus; // remove old power
      }

      d.equipment = {
        ...currentEq,
        [artifact.type]: artifact,
      };
      
      if (artifact.rarity === 'Эпический' || artifact.rarity === 'Легендарный' || artifact.rarity === 'Редкий') {
        d.loyalty = Math.min(100, (d.loyalty || 0) + 5);
        d.morale = Math.min(100, (d.morale ?? 100) + 10);
      }

      d.power += artifact.powerBonus;

      newDisciples[dIndex] = d;

      return {
        ...prev,
        inventory: {
          ...prev.inventory,
          artifacts: newInventoryArts,
        },
        disciples: newDisciples
      };
    });
  }, []);

  const unequipArtifact = useCallback((discipleId: string, slot: 'weapon'|'armor'|'talisman') => {
    setState((prev) => {
      const newDisciples = [...prev.disciples];
      const dIndex = newDisciples.findIndex(d => d.id === discipleId);
      if (dIndex === -1) return prev;

      const d = { ...newDisciples[dIndex] };
      if (!d.equipment || !d.equipment[slot]) return prev;

      const artifact = d.equipment[slot]!;
      d.power -= artifact.powerBonus;
      d.equipment = { ...d.equipment };
      delete d.equipment[slot];

      newDisciples[dIndex] = d;

      return {
        ...prev,
        inventory: {
          ...prev.inventory,
          artifacts: [...(prev.inventory.artifacts || []), artifact],
        },
        disciples: newDisciples
      };
    });
  }, []);

  const usePill = useCallback((discipleId: string, pillType: 'recoveryPills' | 'strengthPills') => {
    setState((prev) => {
      if ((prev.inventory[pillType] || 0) <= 0) return prev;
      
      const newDisciples = [...prev.disciples];
      const dIndex = newDisciples.findIndex(d => d.id === discipleId);
      if (dIndex === -1) return prev;

      const d = { ...newDisciples[dIndex] };
      
      if (pillType === 'recoveryPills') {
        d.health = Math.min(100, (d.health !== undefined ? d.health : 100) + 50);
      } else if (pillType === 'strengthPills') {
        d.buffs = { ...d.buffs, strengthUntil: Date.now() + 60 * 1000 * 10 }; // 10 minutes buff
        d.basePower = d.basePower || d.power;
        d.power += 200; // Temporary massive power bump
      }

      d.loyalty = Math.min(100, (d.loyalty || 0) + 5);
      d.morale = Math.min(100, (d.morale ?? 100) + 10);

      newDisciples[dIndex] = d;

      return {
        ...prev,
        inventory: {
          ...prev.inventory,
          [pillType]: prev.inventory[pillType] - 1
        },
        disciples: newDisciples
      };
    });
  }, []);

  const promoteDisciple = useCallback((discipleId: string, durationSeconds: number) => {
    setState((prev) => {
      const dIndex = prev.disciples.findIndex(d => d.id === discipleId);
      if (dIndex === -1 || prev.disciples[dIndex].cultivationStage >= 4 || prev.cultivatingTasks?.[discipleId]) return prev;
      const d = prev.disciples[dIndex];
      const s = d.cultivationStage;
      let reqs = { breakPills: 0, beast: 0, level: 0 };
      if (s === 0) reqs = { breakPills: 1, beast: 0, level: 20 };
      if (s === 1) reqs = { breakPills: 1, beast: 0, level: 30 };
      if (s === 2) reqs = { breakPills: 0, beast: 1000, level: 40 };
      if (s === 3) reqs = { breakPills: 0, beast: 0, level: 50 }; // requires legend artifact

      if (d.level < reqs.level) return prev;
      if (prev.inventory.breakthroughPills < reqs.breakPills) return prev;
      if ((prev.resources.beastMaterials || 0) < reqs.beast) return prev;
      if (s === 3 && !(prev.inventory.artifacts || []).some(a => a.rarity === 'Легендарный')) return prev;

      return {
        ...prev,
        inventory: {
          ...prev.inventory,
          breakthroughPills: prev.inventory.breakthroughPills - reqs.breakPills,
        },
        resources: {
          ...prev.resources,
          beastMaterials: (prev.resources.beastMaterials || 0) - reqs.beast,
        },
        cultivatingTasks: {
          ...(prev.cultivatingTasks || {}),
          [discipleId]: {
            finishAt: Date.now() + durationSeconds * 1000
          }
        }
      };
    });
  }, []);

  const instantPromoteDisciple = useCallback((discipleId: string) => {
    setState((prev) => {
      const task = prev.cultivatingTasks?.[discipleId];
      if (task) {
        const remainingMs = Math.max(0, task.finishAt - Date.now());
        const expectedQi = Math.ceil(remainingMs / 1000) * 10;
        
        if (prev.resources.qi >= expectedQi) {
          const newCultivatingTasks = { ...prev.cultivatingTasks };
          delete newCultivatingTasks[discipleId];
          
          const newDisciples = [...prev.disciples];
          const dIndex = newDisciples.findIndex(d => d.id === discipleId);
          if (dIndex !== -1) {
             const d = { ...newDisciples[dIndex] };
             d.cultivationStage += 1;
             d.level = (d.level || 1) + 1;
             const multipliers = [1.5, 2.0, 2.0, 2.0];
             const mult = multipliers[d.cultivationStage - 1] || 1.5;
             d.power = Math.floor(d.power * mult);
             d.loyalty = Math.min(100, (d.loyalty || 0) + 10);
             d.morale = Math.min(100, (d.morale ?? 100) + 20);
             newDisciples[dIndex] = d;
          }

          return {
            ...prev,
            resources: {
              ...prev.resources,
              qi: prev.resources.qi - expectedQi,
            },
            disciples: newDisciples,
            cultivatingTasks: newCultivatingTasks
          };
        }
      }
      return prev;
    });
  }, []);

  const claimArenaReward = useCallback((stones: number, prestige: number, isWin: boolean, mode: string, participants: string[] = [], combatData?: any) => {
    setState((prev) => {
      const arena = prev.arena || { rating: 1000, duelsPlayed: 0, duelsWon: 0, tournamentsPlayed: 0, tournamentsWon: 0, history: [] };
      let newArena = { ...arena };
      const ratingGain = isWin ? 10 : -5;
      newArena.rating = Math.max(100, newArena.rating + ratingGain);

      if (mode === '1v1') {
        newArena.duelsPlayed = (newArena.duelsPlayed || 0) + 1;
        if (isWin) newArena.duelsWon = (newArena.duelsWon || 0) + 1;
      } else if (mode === 'team') {
        newArena.tournamentsPlayed = (newArena.tournamentsPlayed || 0) + 1;
        if (isWin) newArena.tournamentsWon = (newArena.tournamentsWon || 0) + 1;
      }
      
      if (combatData) {
        newArena.history = [...(newArena.history || []), {
           ...combatData,
           id: Date.now().toString() + Math.random().toString(),
           timestamp: Date.now(),
           playerTeamName: combatData.player.name,
           enemyTeamName: combatData.enemy.name,
           playerPower: combatData.player.power,
           enemyPower: combatData.enemy.power,
        }].slice(-20); // Keep last 20
      }

      const newDisciples = prev.disciples.map(d => {
        if (participants.includes(d.id)) {
          let newLoyalty = d.loyalty;
          let newMorale = d.morale ?? 100;
          if (isWin) {
            newLoyalty = Math.min(100, newLoyalty + 2); // Малый рост
            newMorale = Math.min(100, newMorale + 30); // Значительный рост
          } else {
            newLoyalty = Math.max(0, newLoyalty - 5); // Снижение
            newMorale = Math.max(0, newMorale - 30); // Снижение
          }
          return { ...d, loyalty: newLoyalty, morale: newMorale };
        }
        return d;
      });

      return gainExp({
        ...prev,
        resources: {
          ...prev.resources,
          stones: prev.resources.stones + stones,
          prestige: prev.resources.prestige + prestige,
        },
        arena: newArena,
        disciples: newDisciples
      }, isWin ? 50 : 20);
    });
  }, []);

  const updateTactics = useCallback((team: string[], formation: FormationType) => {
    setState((prev) => {
      // Find the active team and update it, ensuring backwards compat
      const newTeams = [...prev.teams];
      const activeIdx = newTeams.findIndex(t => t.id === prev.activeTeamId);
      if (activeIdx !== -1) {
        newTeams[activeIdx] = { ...newTeams[activeIdx], members: team, formation };
      }
      return {
        ...prev,
        teams: newTeams,
        team, // Keep legacy in sync just in case
        formation,
      };
    });
  }, []);

  const updateTeams = useCallback((teams: any[], activeTeamId: string) => {
    setState((prev) => ({
      ...prev,
      teams,
      activeTeamId
    }));
  }, []);

  const trainDisciple = useCallback((discipleId: string, durationSeconds: number) => {
    setState((prev) => {
      if (prev.resources.qi >= 10 && !prev.trainingTasks?.[discipleId]) {
        const dIndex = prev.disciples.findIndex(d => d.id === discipleId);
        if (dIndex === -1) return prev;
        
        return gainExp({
          ...prev,
          resources: {
            ...prev.resources,
            qi: prev.resources.qi - 10
          },
          trainingTasks: {
            ...(prev.trainingTasks || {}),
            [discipleId]: {
              finishAt: Date.now() + durationSeconds * 1000
            }
          }
        }, 15);
      }
      return prev;
    });
  }, []);

  const instantTrainDisciple = useCallback((discipleId: string) => {
    setState((prev) => {
      const task = prev.trainingTasks?.[discipleId];
      if (task) {
        const remainingMs = Math.max(0, task.finishAt - Date.now());
        const expectedQi = Math.ceil(remainingMs / 1000) * 2; // 2 Qi per second
        
        if (prev.resources.qi >= expectedQi) {
          const newTrainingTasks = { ...prev.trainingTasks };
          delete newTrainingTasks[discipleId];
          
          const newDisciples = [...prev.disciples];
          const dIndex = newDisciples.findIndex(d => d.id === discipleId);
          if (dIndex !== -1) {
             const d = { ...newDisciples[dIndex] };
             d.level = (d.level || 1) + 1;
             newDisciples[dIndex] = d;
          }

          return gainExp({
            ...prev,
            resources: {
              ...prev.resources,
              qi: prev.resources.qi - expectedQi,
            },
            disciples: newDisciples,
            trainingTasks: newTrainingTasks
          }, 10);
        }
      }
      return prev;
    });
  }, []);

  const claimResources = useCallback(() => {
    setState((prev) => {
      if (!prev.pendingResources) return prev;
      return {
        ...prev,
        resources: {
          stones: prev.resources.stones + (prev.pendingResources.stones || 0),
          ore: prev.resources.ore + (prev.pendingResources.ore || 0),
          qi: prev.resources.qi + (prev.pendingResources.qi || 0),
          herbs: prev.resources.herbs + (prev.pendingResources.herbs || 0),
          prestige: prev.resources.prestige + (prev.pendingResources.prestige || 0),
          beastMaterials: (prev.resources.beastMaterials || 0) + (prev.pendingResources.beastMaterials || 0),
          contribution: (prev.resources.contribution || 0) + (prev.pendingResources.contribution || 0),
        },
        pendingResources: {
          stones: 0,
          ore: 0,
          qi: 0,
          herbs: 0,
          prestige: 0,
          beastMaterials: 0,
          contribution: 0,
        }
      };
    });
  }, []);

  const clearSave = useCallback(() => {
    localStorage.removeItem('wuxia_sect_save_v2');
    setState({ ...getInitialState(), lastUpdate: Date.now() });
  }, []);

  const instantIncreaseInnerLimit = useCallback(() => {
    setState((prev) => {
      if (prev.nextInnerLimitAt) {
        const remainingMs = Math.max(0, prev.nextInnerLimitAt - Date.now());
        const expectedQi = Math.ceil(remainingMs / 1000) * 50; // 50 Qi per second
        if (prev.resources.qi >= expectedQi) {
          return gainExp({
            ...prev,
            resources: {
              ...prev.resources,
              qi: prev.resources.qi - expectedQi,
            },
            nextInnerLimitAt: undefined,
            bonusInnerLimit: (prev.bonusInnerLimit || 0) + 1,
          }, 10);
        }
      }
      return prev;
    });
  }, []);

  const addCheats = useCallback(() => {
    setState((prev) => ({
      ...prev,
      resources: {
        stones: prev.resources.stones + 100000,
        qi: prev.resources.qi + 10000,
        herbs: prev.resources.herbs + 10000,
        ore: prev.resources.ore + 10000,
        prestige: prev.resources.prestige + 500,
        beastMaterials: (prev.resources.beastMaterials || 0) + 1000,
        contribution: (prev.resources.contribution || 0) + 1000,
      },
      inventory: {
        ...prev.inventory,
        breakthroughPills: prev.inventory.breakthroughPills + 10,
      }
    }));
  }, []);

  return { state, upgradeBuilding, instantUpgradeBuilding, claimResources, addDisciple, changeDiscipleRank, craftPill, instantCraftPill, craftArtifact, instantCraftArtifact, equipArtifact, unequipArtifact, usePill, promoteDisciple, instantPromoteDisciple, trainDisciple, instantTrainDisciple, claimArenaReward, updateTactics, updateTeams, clearSave, addCheats, instantIncreaseInnerLimit };
}
