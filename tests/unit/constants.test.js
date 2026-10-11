import { describe, it, expect } from 'vitest';
import { CATEGORIES, SALARY_TABLE, DEFAULT_PERIOD_DATA } from '../../src/utils/calculations.js';

describe('CATEGORIES', () => {
  it('勘定科目は41件で、種別はinflow/outflowのみ', () => {
    expect(Object.keys(CATEGORIES)).toHaveLength(41);
    Object.values(CATEGORIES).forEach((c) => expect(['inflow', 'outflow']).toContain(c.type));
  });

  it('全科目にlabel・symbol・actionNameがある', () => {
    Object.values(CATEGORIES).forEach((c) => {
      expect(typeof c.label).toBe('string');
      expect(typeof c.symbol).toBe('string');
      expect(typeof c.actionName).toBe('string');
    });
  });

  it.each([
  ["ネ", "inflow", "売掛・売上"],
  ["ア", "inflow", "売掛金入金"],
  ["イ", "inflow", "機械売却"],
  ["エ", "inflow", "受取保険金"],
  ["オ", "inflow", "借入金"],
  ["カ", "inflow", "資本金増加"],
  ["キ", "inflow", "現金売上"],
  ["ケ", "outflow", "機械工具購入"],
  ["コ", "outflow", "材料投入費"],
  ["サ", "outflow", "完成費"],
  ["生産", "outflow", "投入・完成"],
  ["シ", "outflow", "労務費"],
  ["ス", "outflow", "製造経費"],
  ["セ", "outflow", "販売費"],
  ["ソ", "outflow", "一般管理費"],
  ["給与", "outflow", "給与・保険料 (期末自動)"],
  ["採用", "outflow", "採用 (ワーカー・セールスマン)"],
  ["保険", "outflow", "保険"],
  ["MD", "outflow", "マーチャンダイザー"],
  ["リサーチ", "outflow", "マーケットリサーチ"],
  ["PAC", "outflow", "PAC生産性"],
  ["緑チップ", "outflow", "緑チップ購入 (PAC/MD/リサーチ)"],
  ["配置転換", "outflow", "配置転換"],
  ["火災", "outflow", "火災 (材料ロス)"],
  ["製造ミス", "outflow", "製造ミス (仕掛品ロス)"],
  ["盗難", "outflow", "盗難 (製品ロス)"],
  ["棚卸ロス(材料)", "outflow", "材料紛失ロス"],
  ["棚卸ロス(仕掛品)", "outflow", "仕掛品紛失ロス"],
  ["棚卸ロス(製品)", "outflow", "製品紛失ロス"],
  ["タ", "outflow", "営業外費用"],
  ["チ", "outflow", "研究開発費"],
  ["ツ", "outflow", "材料現金仕入"],
  ["ノ", "outflow", "材料買掛仕入"],
  ["ナ", "outflow", "借入金返済"],
  ["ニ", "outflow", "納税"],
  ["ヌ", "outflow", "買掛金支払"],
  ["期首処理", "outflow", "期首一括処理"],
  ["売掛割引", "inflow", "売掛割引 (5%)"],
  ["リスクカード", "outflow", "リスクカード"],
  ["退職", "outflow", "退職"],
  ["研究開発失敗", "outflow", "研究開発失敗"],
  ])('%s の種別は %s、ラベルは %s', (key, type, label) => {
    expect(CATEGORIES[key].type).toBe(type);
    expect(CATEGORIES[key].label).toBe(label);
  });
});

describe('SALARY_TABLE', () => {
  it('給与・退職給与・保険料の期別単価', () => {
    expect(SALARY_TABLE).toEqual({"normal":{"1":18,"2":20,"3":23,"4":25,"5":28},"severance":{"1":12,"2":14,"3":17,"4":19,"5":22},"insurance":{"1":12,"2":13,"3":14,"4":16,"5":17}});
  });

  it('各テーブルは第1〜5期をすべて持つ', () => {
    Object.values(SALARY_TABLE).forEach((t) => expect(Object.keys(t)).toEqual(['1', '2', '3', '4', '5']));
  });
});

describe('DEFAULT_PERIOD_DATA', () => {
  it('期首繰越の初期値', () => {
    expect(DEFAULT_PERIOD_DATA.carryover).toEqual({"cash":300,"materialsCount":0,"materialsValue":0,"wipCount":0,"wipValue":0,"productCount":0,"productValue":0,"machinesCount":0,"machinesValue":0,"loan":0,"receivables":0,"payables":0,"retainedEarnings":0,"capital":300,"largeMachines":0,"smallMachines":0,"attachments":0,"workers":0,"salesmen":0});
  });

  it('予定計画(budget)の初期値は全て0', () => {
    expect(DEFAULT_PERIOD_DATA.budget).toEqual({"targetG":0,"laborBudget":0,"manufacturingBudget":0,"depreciationBudget":0,"salesBudget":0,"adminBudget":0,"nonOperatingBudget":0,"rdBudget":0});
  });
});
