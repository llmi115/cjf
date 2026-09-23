import { useEffect, useMemo, useState } from 'react';

type Difficulty = 'easy' | 'normal' | 'hard';
type EquipmentType = 'weapon' | 'armor' | 'accessory';

type HeroStats = {
  maxHp: number;
  attack: number;
  defense: number;
  crit: number;
};

type EquipmentItem = {
  id: string;
  name: string;
  type: EquipmentType;
  cost: number;
  stats: Partial<HeroStats>;
  rarity: '普通' | '稀有' | '史诗';
};

type Stage = {
  id: number;
  name: string;
  difficulty: Difficulty;
  enemyName: string;
  enemyHp: number;
  enemyAttack: number;
  enemyDefense: number;
  rewardGold: number;
  rewardGems: number;
};

type HeroSave = {
  level: number;
  gold: number;
  gems: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  crit: number;
};

type GameSave = {
  hero: HeroSave;
  selectedDifficulty: Difficulty;
  unlockedStage: number;
  ownedEquipment: string[];
  equipped: Record<EquipmentType, string | null>;
  logs: string[];
};

type BattleState = {
  stageId: number | null;
  enemyName: string;
  heroHp: number;
  enemyHp: number;
  round: number;
  status: 'ready' | 'player-win' | 'enemy-win';
  log: string[];
  enemyAttack: number;
  enemyDefense: number;
};

const STORAGE_KEY = 'cjf-rpg-save-v1';

const difficultySettings: Record<Difficulty, {label: string; multiplier: number; description: string}> = {
  easy: { label: '简单', multiplier: 1, description: '适合熟悉玩法' },
  normal: { label: '普通', multiplier: 1.35, description: '平衡挑战' },
  hard: { label: '困难', multiplier: 1.75, description: '高风险高收益' },
};

const equipmentCatalog: EquipmentItem[] = [
  { id: 'w1', name: '铁剑', type: 'weapon', cost: 35, stats: { attack: 8 }, rarity: '普通' },
  { id: 'w2', name: '烈焰长刀', type: 'weapon', cost: 120, stats: { attack: 19 }, rarity: '稀有' },
  { id: 'w3', name: '星陨剑', type: 'weapon', cost: 260, stats: { attack: 32, crit: 12 }, rarity: '史诗' },
  { id: 'a1', name: '皮甲', type: 'armor', cost: 30, stats: { defense: 6, maxHp: 20 }, rarity: '普通' },
  { id: 'a2', name: '守护铠甲', type: 'armor', cost: 110, stats: { defense: 15, maxHp: 45 }, rarity: '稀有' },
  { id: 'a3', name: '龙鳞护甲', type: 'armor', cost: 240, stats: { defense: 28, maxHp: 80 }, rarity: '史诗' },
  { id: 't1', name: '幸运护符', type: 'accessory', cost: 45, stats: { crit: 8 }, rarity: '普通' },
  { id: 't2', name: '魔力指环', type: 'accessory', cost: 130, stats: { crit: 18, attack: 10 }, rarity: '稀有' },
  { id: 't3', name: '天启坠饰', type: 'accessory', cost: 260, stats: { crit: 24, defense: 12, maxHp: 50 }, rarity: '史诗' },
];

const stages: Stage[] = [
  { id: 1, name: '墓地守卫', difficulty: 'easy', enemyName: '棘刺守卫', enemyHp: 90, enemyAttack: 16, enemyDefense: 4, rewardGold: 40, rewardGems: 4 },
  { id: 2, name: '森林幽谷', difficulty: 'easy', enemyName: '林间猎手', enemyHp: 120, enemyAttack: 20, enemyDefense: 6, rewardGold: 55, rewardGems: 5 },
  { id: 3, name: '熔岩裂谷', difficulty: 'normal', enemyName: '火元素', enemyHp: 180, enemyAttack: 28, enemyDefense: 9, rewardGold: 85, rewardGems: 8 },
  { id: 4, name: '冰封要塞', difficulty: 'normal', enemyName: '寒霜巨兽', enemyHp: 220, enemyAttack: 34, enemyDefense: 12, rewardGold: 100, rewardGems: 10 },
  { id: 5, name: '深渊王座', difficulty: 'hard', enemyName: '深渊领主', enemyHp: 300, enemyAttack: 42, enemyDefense: 16, rewardGold: 150, rewardGems: 14 },
  { id: 6, name: '灭世魔龙', difficulty: 'hard', enemyName: '古龙', enemyHp: 370, enemyAttack: 52, enemyDefense: 18, rewardGold: 210, rewardGems: 18 },
];

const defaultGame: GameSave = {
  hero: {
    level: 1,
    gold: 120,
    gems: 30,
    hp: 120,
    maxHp: 120,
    attack: 18,
    defense: 8,
    crit: 12,
  },
  selectedDifficulty: 'normal',
  unlockedStage: 1,
  ownedEquipment: ['w1', 'a1', 't1'],
  equipped: { weapon: 'w1', armor: 'a1', accessory: 't1' },
  logs: ['勇者踏入魔域，准备挑战危机四伏的秘境。'],
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function getCurrentEquipmentStats(equipped: Record<EquipmentType, string | null>, owned: string[]) {
  const selectedIds = Object.values(equipped).filter(Boolean) as string[];
  const combined = [...owned, ...selectedIds];
  const set = new Set(combined);

  return equipmentCatalog.reduce(
    (result, item) => {
      if (!set.has(item.id)) return result;
      result.maxHp = (result.maxHp ?? 0) + (item.stats.maxHp ?? 0);
      result.attack = (result.attack ?? 0) + (item.stats.attack ?? 0);
      result.defense = (result.defense ?? 0) + (item.stats.defense ?? 0);
      result.crit = (result.crit ?? 0) + (item.stats.crit ?? 0);
      return result;
    },
    { maxHp: 0, attack: 0, defense: 0, crit: 0 },
  );
}

function getHeroStats(hero: HeroSave, equipped: Record<EquipmentType, string | null>, owned: string[]): HeroStats {
  const equipmentBonus = getCurrentEquipmentStats(equipped, owned);

  return {
    maxHp: hero.maxHp + equipmentBonus.maxHp,
    attack: hero.attack + equipmentBonus.attack,
    defense: hero.defense + equipmentBonus.defense,
    crit: clamp(hero.crit + equipmentBonus.crit, 5, 80),
  };
}

function formatLog(message: string) {
  return `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}：${message}`;
}

export default function App() {
  const [save, setSave] = useState<GameSave>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultGame;
    try {
      return { ...defaultGame, ...JSON.parse(raw) };
    } catch {
      return defaultGame;
    }
  });

  const [selectedStage, setSelectedStage] = useState<number>(save.unlockedStage);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(save.selectedDifficulty);
  const [battle, setBattle] = useState<BattleState>({
    stageId: null,
    enemyName: '',
    heroHp: save.hero.maxHp,
    enemyHp: 0,
    round: 1,
    status: 'ready',
    log: [],
    enemyAttack: 0,
    enemyDefense: 0,
  });
  const [rechargeOpen, setRechargeOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  }, [save]);

  const heroStats = useMemo(() => getHeroStats(save.hero, save.equipped, save.ownedEquipment), [save]);

  const activeStage = stages.find((stage) => stage.id === selectedStage) ?? stages[0];
  const difficultyInfo = difficultySettings[selectedDifficulty];

  const buyEquipment = (id: string) => {
    const item = equipmentCatalog.find((entry) => entry.id === id);
    if (!item) return;
    if (save.ownedEquipment.includes(id)) {
      return;
    }
    if (save.hero.gold < item.cost) {
      const nextLogs = [...save.logs, formatLog(`金币不足，无法购买 ${item.name}。`)];
      setSave((prev) => ({ ...prev, logs: nextLogs.slice(-8) }));
      return;
    }

    setSave((prev) => ({
      ...prev,
      hero: { ...prev.hero, gold: prev.hero.gold - item.cost },
      ownedEquipment: [...prev.ownedEquipment, item.id],
      logs: [...prev.logs, formatLog(`购买成功：${item.name}。`)].slice(-8),
    }));
  };

  const equipItem = (id: string) => {
    const item = equipmentCatalog.find((entry) => entry.id === id);
    if (!item || !save.ownedEquipment.includes(id)) return;

    setSave((prev) => {
      const nextEquipped = { ...prev.equipped, [item.type]: id };
      return {
        ...prev,
        equipped: nextEquipped,
        logs: [...prev.logs, formatLog(`装备已穿戴：${item.name}。`)].slice(-8),
      };
    });
  };

  const unEquipItem = (type: EquipmentType) => {
    setSave((prev) => ({
      ...prev,
      equipped: { ...prev.equipped, [type]: null },
      logs: [...prev.logs, formatLog(`已卸下 ${type === 'weapon' ? '武器' : type === 'armor' ? '护甲' : '饰品'}。`)].slice(-8),
    }));
  };

  const handleAddGems = (count: number, label: string) => {
    setSave((prev) => ({
      ...prev,
      hero: { ...prev.hero, gems: prev.hero.gems + count },
      logs: [...prev.logs, formatLog(`${label}：成功充值 ${count} 钻石。`)].slice(-8),
    }));
    setRechargeOpen(false);
  };

  const startBattle = (stageId: number, difficulty: Difficulty) => {
    const stage = stages.find((item) => item.id === stageId);
    if (!stage) return;

    const multiplier = difficultySettings[difficulty].multiplier;
    const enemyAtk = Math.round(stage.enemyAttack * multiplier);
    const enemyDef = Math.round(stage.enemyDefense * multiplier);
    const enemyHp = Math.round(stage.enemyHp * multiplier);

    setBattle({
      stageId,
      enemyName: stage.enemyName,
      heroHp: heroStats.maxHp,
      enemyHp,
      round: 1,
      status: 'ready',
      log: [formatLog(`${stage.enemyName}出现在你面前，战斗开始！`)],
      enemyAttack: enemyAtk,
      enemyDefense: enemyDef,
    });
    setSelectedDifficulty(difficulty);
    setSelectedStage(stageId);
    setSave((prev) => ({ ...prev, selectedDifficulty: difficulty }));
  };

  const applyBattleTurn = (type: 'attack' | 'skill' | 'heal') => {
    if (!battle.stageId || battle.status !== 'ready') return;

    let heroHp = battle.heroHp;
    let enemyHp = battle.enemyHp;
    const log: string[] = [...battle.log];

    if (type === 'attack') {
      const critBonus = Math.random() < heroStats.crit / 100 ? 1.7 : 1;
      const dmg = Math.max(1, Math.round((heroStats.attack * critBonus) - battle.enemyDefense));
      enemyHp = Math.max(0, enemyHp - dmg);
      log.push(formatLog(`你发动普攻，造成 ${dmg} 点伤害。`));
    }

    if (type === 'skill') {
      const skillDamage = Math.max(8, Math.round(heroStats.attack * 1.5 + heroStats.crit * 0.4));
      enemyHp = Math.max(0, enemyHp - skillDamage);
      log.push(formatLog(`你使用烈焰斩，造成 ${skillDamage} 点伤害。`));
    }

    if (type === 'heal') {
      const heal = Math.round(heroStats.maxHp * 0.35);
      heroHp = clamp(heroHp + heal, 0, heroStats.maxHp);
      log.push(formatLog(`你使用治疗术，恢复 ${heal} 点生命值。`));
    }

    if (enemyHp <= 0) {
      const stage = stages.find((item) => item.id === battle.stageId);
      if (!stage) return;

      const rewardGold = Math.round(stage.rewardGold * difficultySettings[selectedDifficulty].multiplier);
      const rewardGems = Math.round(stage.rewardGems * difficultySettings[selectedDifficulty].multiplier);

      setSave((prev) => ({
        ...prev,
        hero: {
          ...prev.hero,
          gold: prev.hero.gold + rewardGold,
          gems: prev.hero.gems + rewardGems,
        },
        unlockedStage: Math.max(prev.unlockedStage, battle.stageId + 1),
        logs: [...prev.logs, formatLog(`通关成功：${stage.name}，获得 ${rewardGold} 金币、${rewardGems} 钻石。`)].slice(-8),
      }));

      setBattle({
        ...battle,
        enemyHp: 0,
        heroHp,
        status: 'player-win',
        log: [...log, formatLog(`战斗胜利！获得 ${rewardGold} 金币、${rewardGems} 钻石。`)],
      });
      return;
    }

    const enemyDamage = Math.max(3, Math.round(battle.enemyAttack - heroStats.defense + Math.random() * 8));
    heroHp = clamp(heroHp - enemyDamage, 0, heroStats.maxHp);
    log.push(formatLog(`${battle.enemyName}发起反击，造成 ${enemyDamage} 点伤害。`));

    if (heroHp <= 0) {
      setBattle({
        ...battle,
        heroHp: 0,
        enemyHp,
        round: battle.round + 1,
        status: 'enemy-win',
        log: [...log, formatLog(`你被 ${battle.enemyName}击败，战斗失败。`)],
      });
      return;
    }

    setBattle({
      ...battle,
      heroHp,
      enemyHp,
      round: battle.round + 1,
      status: 'ready',
      log,
    });
  };

  const currentOwnedItems = equipmentCatalog.filter((item) => save.ownedEquipment.includes(item.id));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-box">
          <div className="brand-mark">M</div>
          <div>
            <h1>魔域突袭</h1>
            <p>勇者远征</p>
          </div>
        </div>

        <div className="stat-panel">
          <div className="stat-row">
            <span>生命</span>
            <strong>{save.hero.hp}</strong>
          </div>
          <div className="stat-row">
            <span>金币</span>
            <strong>{save.hero.gold}</strong>
          </div>
          <div className="stat-row">
            <span>钻石</span>
            <strong>{save.hero.gems}</strong>
          </div>
          <button className="primary-button" onClick={() => setRechargeOpen(true)}>充值</button>
        </div>

        <div className="hero-card">
          <div className="hero-avatar">勇</div>
          <h2>星辰勇者</h2>
          <div className="hero-meta">
            <span>Lv.{save.hero.level}</span>
            <span>暴击 {heroStats.crit}%</span>
          </div>
          <div className="attr-grid">
            <div><label>攻击</label><strong>{heroStats.attack}</strong></div>
            <div><label>防御</label><strong>{heroStats.defense}</strong></div>
            <div><label>生命</label><strong>{heroStats.maxHp}</strong></div>
            <div><label>暴击</label><strong>{heroStats.crit}%</strong></div>
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <section className="topbar">
          <div>
            <p className="eyebrow">关卡选择</p>
            <h3>挑战秘境</h3>
          </div>
          <div className="difficulty-switcher">
            {(Object.entries(difficultySettings) as [Difficulty, typeof difficultySettings[Difficulty]][]).map(([key, value]) => (
              <button
                key={key}
                className={selectedDifficulty === key ? 'difficulty active' : 'difficulty'}
                onClick={() => {
                  setSelectedDifficulty(key);
                  setSave((prev) => ({ ...prev, selectedDifficulty: key }));
                }}
              >
                {value.label}
              </button>
            ))}
          </div>
        </section>

        <section className="stage-grid">
          {stages.map((stage) => {
            const unlocked = stage.id <= save.unlockedStage;
            const active = stage.id === selectedStage;
            return (
              <button
                key={stage.id}
                className={active ? 'stage-card active' : 'stage-card'}
                onClick={() => {
                  if (!unlocked) return;
                  setSelectedStage(stage.id);
                }}
                disabled={!unlocked}
              >
                <span className="stage-index">第{stage.id}关</span>
                <h4>{stage.name}</h4>
                <p>{stage.enemyName}</p>
                <div className="reward-line">
                  <span>奖励 {stage.rewardGold}G</span>
                  <span>{stage.rewardGems}钻</span>
                </div>
              </button>
            );
          })}
        </section>

        <section className="battle-panel">
          <div className="enemy-card">
            <div className="enemy-header">
              <span>敌人</span>
              <strong>{battle.enemyName || activeStage.enemyName}</strong>
            </div>

            <div className="hp-box">
              <label>生命值</label>
              <div className="bar">
                <div
                  className="bar-fill enemy"
                  style={{ width: `${((battle.enemyHp || activeStage.enemyHp) / (Math.round(activeStage.enemyHp * difficultySettings[selectedDifficulty].multiplier) || 1)) * 100}%` }}
                />
              </div>
              <span>{battle.enemyHp || activeStage.enemyHp} / {Math.round(activeStage.enemyHp * difficultySettings[selectedDifficulty].multiplier)}</span>
            </div>

            <div className="battle-actions">
              <button onClick={() => applyBattleTurn('attack')}>普通攻击</button>
              <button onClick={() => applyBattleTurn('skill')}>烈焰斩</button>
              <button onClick={() => applyBattleTurn('heal')}>治疗术</button>
            </div>
          </div>

          <div className="battle-summary">
            <div className="info-block">
              <span>当前难度</span>
              <strong>{difficultyInfo.label}</strong>
            </div>
            <div className="info-block">
              <span>敌人攻防</span>
              <strong>{battle.enemyAttack || Math.round(activeStage.enemyAttack * difficultySettings[selectedDifficulty].multiplier)} / {battle.enemyDefense || Math.round(activeStage.enemyDefense * difficultySettings[selectedDifficulty].multiplier)}</strong>
            </div>
            <button className="primary-button" onClick={() => startBattle(selectedStage, selectedDifficulty)}>
              {battle.status === 'ready' ? '开始战斗' : '重新挑战'}
            </button>
          </div>
        </section>

        <section className="content-grid">
          <div className="card-box">
            <div className="card-head">
              <h3>装备商店</h3>
              <span>金币购买</span>
            </div>
            <div className="equipment-list">
              {equipmentCatalog.map((item) => {
                const owned = save.ownedEquipment.includes(item.id);
                const active = save.equipped[item.type] === item.id;
                return (
                  <div key={item.id} className="equipment-item">
                    <div>
                      <strong>{item.name}</strong>
                      <small>{item.type} · {item.rarity}</small>
                    </div>
                    <div className="equipment-stats">
                      {item.stats.attack ? <span>+{item.stats.attack} 攻</span> : null}
                      {item.stats.defense ? <span>+{item.stats.defense} 防</span> : null}
                      {item.stats.maxHp ? <span>+{item.stats.maxHp} 生命</span> : null}
                      {item.stats.crit ? <span>+{item.stats.crit}% 暴</span> : null}
                    </div>
                    <div className="equipment-actions">
                      <span className="cost">{item.cost}G</span>
                      {!owned ? (
                        <button onClick={() => buyEquipment(item.id)}>购买</button>
                      ) : (
                        <button className={active ? 'active' : ''} onClick={() => equipItem(item.id)}>
                          {active ? '已装备' : '装备'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card-box">
            <div className="card-head">
              <h3>已穿戴</h3>
              <span>装备槽位</span>
            </div>
            <div className="equipped-box">
              {(Object.keys(save.equipped) as EquipmentType[]).map((type) => {
                const id = save.equipped[type];
                const item = equipmentCatalog.find((entry) => entry.id === id);
                return (
                  <div key={type} className="equipped-slot">
                    <span>{type === 'weapon' ? '武器' : type === 'armor' ? '护甲' : '饰品'}</span>
                    <strong>{item ? item.name : '未装备'}</strong>
                    {item ? <button onClick={() => unEquipItem(type)}>卸下</button> : null}
                  </div>
                );
              })}
            </div>

            <div className="card-head compact">
              <h3>背包</h3>
              <span>{currentOwnedItems.length} 件</span>
            </div>
            <div className="bag-list">
              {currentOwnedItems.length === 0 ? <p>背包为空，先去购买装备吧。</p> : currentOwnedItems.map((item) => (
                <div className="bag-item" key={item.id}>{item.name}</div>
              ))}
            </div>
          </div>
        </section>

        <section className="log-panel">
          <div className="card-head">
            <h3>战斗日志</h3>
            <span>实时状态</span>
          </div>
          <ul>
            {battle.log.length > 0 ? battle.log.map((entry, index) => <li key={`${entry}-${index}`}>{entry}</li>) : save.logs.map((entry, index) => <li key={`${entry}-${index}`}>{entry}</li>)}
          </ul>
        </section>
      </main>

      {rechargeOpen ? (
        <div className="modal-overlay" onClick={() => setRechargeOpen(false)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="card-head">
              <h3>充值中心</h3>
              <button className="close-button" onClick={() => setRechargeOpen(false)}>关闭</button>
            </div>
            <div className="recharge-list">
              {[{ label: '10钻', count: 10 }, { label: '30钻', count: 30 }, { label: '68钻', count: 68 }, { label: '128钻', count: 128 }].map((pack) => (
                <button key={pack.count} className="recharge-item" onClick={() => handleAddGems(pack.count, pack.label)}>
                  {pack.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
