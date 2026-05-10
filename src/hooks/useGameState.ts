import { useState, useEffect, useCallback } from 'react';
import { GameState, Disciple, FormationType } from '../types';

const INITIAL_STATE: GameState = {
  resources: { stones: 1000, qi: 100, prestige: 10, herbs: 0, ore: 0 },
  buildings: { mainHall: 1, mine: 1, cave: 1, alchemyLab: 0, herbGarden: 0 },
  inventory: { breakthroughPills: 0, artifacts: [] },
  disciples: [],
  teams: [
    { id: 'team_1', name: 'Отряд 1', members: [], formation: 'Круговая оборона' }
  ],
  activeTeamId: 'team_1',
  lastUpdate: Date.now(),
};

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
             formation: parsed.formation || 'Круговая оборона'
          }];
          parsed.activeTeamId = 'team_1';
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load save', e);
    }
    return INITIAL_STATE;
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
        
        const stoneIncome = prev.buildings.mine * 5 * deltaSeconds; 
        const oreIncome = prev.buildings.mine * 1 * deltaSeconds;
        const qiIncome = prev.buildings.cave * 2 * deltaSeconds;
        const herbsIncome = prev.buildings.herbGarden * 1.5 * deltaSeconds;

        let newBuildings = { ...prev.buildings };
        let newUpgrades = { ...prev.buildingUpgrades };
        let newInventory = { ...prev.inventory };
        let newDisciples = [...prev.disciples];
        let newAlchemyTask = prev.alchemyTask;
        let newCraftingTask = prev.craftingTask;
        let newCultivatingTasks = { ...prev.cultivatingTasks };
        let stateChanged = false;

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
           newInventory.breakthroughPills += prev.alchemyTask.count;
           newAlchemyTask = undefined;
           stateChanged = true;
        }

        if (prev.craftingTask && now >= prev.craftingTask.finishAt) {
           newInventory.artifacts = [...(newInventory.artifacts || []), prev.craftingTask.artifact];
           newCraftingTask = undefined;
           stateChanged = true;
        }

        if (prev.cultivatingTasks) {
          Object.entries(prev.cultivatingTasks).forEach(([dId, task]) => {
            if (task && now >= (task as { finishAt: number }).finishAt) {
              const dIndex = newDisciples.findIndex(d => d.id === dId);
              if (dIndex !== -1) {
                const d = { ...newDisciples[dIndex] };
                d.cultivationStage += 1;
                d.level = (d.level || 1) + 1;
                d.power = Math.floor(d.power * 2.5);
                newDisciples[dIndex] = d;
              }
              delete newCultivatingTasks[dId];
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
          pendingResources: {
            stones: (prev.pendingResources?.stones || 0) + stoneIncome,
            ore: (prev.pendingResources?.ore || 0) + oreIncome,
            qi: (prev.pendingResources?.qi || 0) + qiIncome,
            herbs: (prev.pendingResources?.herbs || 0) + herbsIncome,
            prestige: prev.pendingResources?.prestige || 0,
          },
          lastUpdate: now,
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const upgradeBuilding = useCallback((buildingId: keyof GameState['buildings'], cost: number, durationSeconds: number) => {
    setState((prev) => {
      if (prev.resources.stones >= cost && !prev.buildingUpgrades?.[buildingId]) {
        return {
          ...prev,
          resources: {
            ...prev.resources,
            stones: prev.resources.stones - cost,
          },
          buildingUpgrades: {
            ...prev.buildingUpgrades,
            [buildingId]: {
              targetLevel: prev.buildings[buildingId] + 1,
              finishAt: Date.now() + durationSeconds * 1000
            }
          }
        };
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
          return {
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
          };
        }
      }
      return prev;
    });
  }, []);

  const addDisciple = useCallback((disciple: Disciple, cost: number) => {
    setState((prev) => {
      if (prev.resources.stones >= cost) {
        return {
          ...prev,
          resources: {
            ...prev.resources,
            stones: prev.resources.stones - cost,
          },
          disciples: [...prev.disciples, disciple],
        };
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

  const craftPill = useCallback((costHerbs: number, costQi: number, durationSeconds: number) => {
    setState((prev) => {
      if (prev.buildings.alchemyLab > 0 && prev.resources.herbs >= costHerbs && prev.resources.qi >= costQi && !prev.alchemyTask) {
        return {
          ...prev,
          resources: {
            ...prev.resources,
            herbs: prev.resources.herbs - costHerbs,
            qi: prev.resources.qi - costQi,
          },
          alchemyTask: {
            count: 1,
            finishAt: Date.now() + durationSeconds * 1000
          }
        };
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
          return {
            ...prev,
            resources: {
              ...prev.resources,
              qi: prev.resources.qi - expectedQi,
            },
            inventory: {
              ...prev.inventory,
              breakthroughPills: prev.inventory.breakthroughPills + prev.alchemyTask.count
            },
            alchemyTask: undefined
          };
        }
      }
      return prev;
    });
  }, []);

  const craftArtifact = useCallback((artifact: any, costOre: number, costStones: number, durationSeconds: number) => {
    setState((prev) => {
      if (prev.resources.ore >= costOre && prev.resources.stones >= costStones && !prev.craftingTask) {
        return {
          ...prev,
          resources: {
            ...prev.resources,
            ore: prev.resources.ore - costOre,
            stones: prev.resources.stones - costStones,
          },
          craftingTask: {
            artifact,
            finishAt: Date.now() + durationSeconds * 1000
          }
        }
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
          return {
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
          };
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

  const unequipArtifact = useCallback((discipleId: string, slot: 'weapon'|'armor'|'accessory') => {
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

  const promoteDisciple = useCallback((discipleId: string, durationSeconds: number) => {
    setState((prev) => {
      if (prev.inventory.breakthroughPills >= 1 && !prev.cultivatingTasks?.[discipleId]) {
        const dIndex = prev.disciples.findIndex(d => d.id === discipleId);
        if (dIndex === -1 || prev.disciples[dIndex].cultivationStage >= 4) return prev;
        
        return {
          ...prev,
          inventory: {
            ...prev.inventory,
            breakthroughPills: prev.inventory.breakthroughPills - 1,
          },
          cultivatingTasks: {
            ...(prev.cultivatingTasks || {}),
            [discipleId]: {
              finishAt: Date.now() + durationSeconds * 1000
            }
          }
        };
      }
      return prev;
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
             d.power = Math.floor(d.power * 2.5);
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

  const claimArenaReward = useCallback((stones: number, prestige: number, isWin: boolean, mode: string) => {
    setState((prev) => {
      const arena = prev.arena || { rating: 1000, duelsPlayed: 0, duelsWon: 0, tournamentsPlayed: 0, tournamentsWon: 0 };
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

      return {
        ...prev,
        resources: {
          ...prev.resources,
          stones: prev.resources.stones + stones,
          prestige: prev.resources.prestige + prestige,
        },
        arena: newArena
      };
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
        },
        pendingResources: {
          stones: 0,
          ore: 0,
          qi: 0,
          herbs: 0,
          prestige: 0,
        }
      };
    });
  }, []);

  const clearSave = useCallback(() => {
    localStorage.removeItem('wuxia_sect_save_v2');
    setState({ ...INITIAL_STATE, lastUpdate: Date.now() });
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
      },
      inventory: {
        ...prev.inventory,
        breakthroughPills: prev.inventory.breakthroughPills + 10,
      }
    }));
  }, []);

  return { state, upgradeBuilding, instantUpgradeBuilding, claimResources, addDisciple, changeDiscipleRank, craftPill, instantCraftPill, craftArtifact, instantCraftArtifact, equipArtifact, unequipArtifact, promoteDisciple, instantPromoteDisciple, claimArenaReward, updateTactics, updateTeams, clearSave, addCheats };
}
