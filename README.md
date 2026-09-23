:root {
  color: #f3f8ff;
  background: #0d1117;
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: dark;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

html, body, #root {
  margin: 0;
  min-height: 100%;
  min-width: 100%;
  background: radial-gradient(circle at top, #111b2a 0%, #0a0e17 60%, #070b12 100%);
}

button {
  font: inherit;
}

.app-shell {
  display: flex;
  min-height: 100vh;
  padding: 28px;
  gap: 24px;
}

.sidebar {
  width: 320px;
  background: rgba(12, 22, 35, 0.8);
  border: 1px solid rgba(122, 146, 181, 0.25);
  border-radius: 24px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.brand-box {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-mark {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  background: linear-gradient(135deg, #00d2ff, #7a5cff);
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 22px;
}

.brand-box h1 {
  margin: 0;
  font-size: 1.9rem;
}

.brand-box p {
  margin: 4px 0 0;
  color: #97a7bb;
}

.stat-panel,
.hero-card,
.card-box,
.log-panel,
.modal-card,
.enemy-card,
.battle-summary {
  background: rgba(19, 29, 43, 0.8);
  border: 1px solid rgba(148, 165, 190, 0.2);
  border-radius: 20px;
}

.stat-panel {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  color: #dfeaff;
}

.primary-button,
.difficulty,
.stage-card,
.battle-actions button,
.recharge-item,
.equipment-actions button,
.equipped-slot button,
.close-button {
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.primary-button:hover,
.difficulty:hover,
.stage-card:hover,
.battle-actions button:hover,
.recharge-item:hover,
.equipment-actions button:hover,
.equipped-slot button:hover,
.close-button:hover {
  transform: translateY(-1px);
}

.primary-button {
  background: linear-gradient(135deg, #2ec5ff, #7a5cff);
  color: #fff;
  padding: 12px 18px;
  font-weight: 600;
}

.hero-card {
  padding: 18px;
}

.hero-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #ffbb55, #ff7b54);
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.hero-card h2 {
  margin: 0;
  font-size: 1.35rem;
}

.hero-meta {
  display: flex;
  justify-content: space-between;
  color: #9db5d5;
  margin: 8px 0 16px;
}

.attr-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.attr-grid div {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.attr-grid label,
.info-block span,
.card-head span,
.equipped-slot span {
  color: #9fb1c8;
  font-size: 0.82rem;
}

.main-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  padding: 8px 4px;
}

.eyebrow {
  margin: 0 0 6px;
  color: #7addff;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.topbar h3,
.card-head h3 {
  margin: 0;
  font-size: 1.7rem;
}

.difficulty-switcher {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.difficulty {
  background: rgba(255, 255, 255, 0.04);
  color: #dfeaff;
  padding: 10px 14px;
  border: 1px solid rgba(133, 151, 176, 0.2);
}

.difficulty.active {
  background: linear-gradient(135deg, rgba(42, 201, 255, 0.3), rgba(122, 92, 255, 0.35));
  border-color: rgba(100, 200, 255, 0.7);
}

.stage-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.stage-card {
  background: rgba(17, 27, 38, 0.8);
  border: 1px solid rgba(160, 176, 201, 0.18);
  color: #eef7ff;
  min-height: 160px;
  text-align: left;
  padding: 18px;
}

.stage-card.active {
  border-color: rgba(83, 186, 255, 0.75);
  background: linear-gradient(135deg, rgba(15, 98, 146, 0.26), rgba(65, 47, 104, 0.3));
}

.stage-card:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.stage-card h4 {
  margin: 10px 0 6px;
  font-size: 1.4rem;
}

.stage-card p {
  margin: 0;
  color: #9ab3ce;
}

.stage-index {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(103, 175, 255, 0.15);
  color: #89d6ff;
  font-size: 0.8rem;
}

.reward-line {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  color: #d6edff;
  font-size: 0.9rem;
}

.battle-panel {
  display: grid;
  grid-template-columns: 1.4fr 0.8fr;
  gap: 20px;
}

.enemy-card,
.battle-summary,
.card-box,
.log-panel,
.modal-card {
  padding: 20px;
}

.enemy-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  color: #d9ebff;
}

.hp-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bar {
  width: 100%;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
}

.bar-fill {
  display: block;
  height: 100%;
}

.bar-fill.enemy {
  background: linear-gradient(90deg, #ff6980, #ffb462);
}

.battle-actions {
  display: flex;
  gap: 12px;
  margin-top: 18px;
  flex-wrap: wrap;
}

.battle-actions button,
.equipment-actions button,
.equipped-slot button,
.close-button,
.recharge-item {
  background: rgba(137, 196, 255, 0.1);
  color: #dfeeff;
  padding: 10px 14px;
  border: 1px solid rgba(153, 177, 210, 0.18);
}

.battle-actions button:nth-child(2) {
  background: rgba(255, 143, 90, 0.12);
}

.battle-actions button:nth-child(3) {
  background: rgba(90, 255, 160, 0.12);
}

.battle-summary {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
}

.info-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
}

.content-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.equipment-list,
.equipped-box,
.bag-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.equipment-item,
.equipped-slot,
.bag-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(159, 175, 201, 0.14);
  border-radius: 14px;
  padding: 12px 14px;
}

.equipment-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.equipment-item strong,
.equipped-slot strong {
  display: block;
  font-size: 1rem;
}

.equipment-item small {
  color: #8ea5c2;
}

.equipment-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: #bfe0ff;
  font-size: 0.82rem;
}

.equipment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.cost {
  color: #ffd76a;
  font-weight: 700;
}

.equipped-slot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.bag-list {
  margin-top: 10px;
}

.bag-item {
  color: #dfe9f8;
}

.log-panel ul {
  margin: 0;
  padding-left: 18px;
  color: #dcecff;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 9, 16, 0.7);
  display: grid;
  place-items: center;
  padding: 20px;
}

.modal-card {
  width: min(440px, 100%);
}

.recharge-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.recharge-item {
  padding: 18px 12px;
  font-size: 1.05rem;
  font-weight: 600;
}

.close-button {
  padding: 8px 12px;
}

@media (max-width: 980px) {
  .app-shell {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .battle-panel,
  .content-grid,
  .stage-grid {
    grid-template-columns: 1fr;
  }
}
