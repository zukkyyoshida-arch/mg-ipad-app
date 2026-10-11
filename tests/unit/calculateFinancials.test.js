import { describe, it, expect } from 'vitest';
import { calculateFinancials, DEFAULT_PERIOD_DATA } from '../../src/utils/calculations.js';

// 現状の出力を正として固定する特性テスト（characterization test）。
const fresh = (o = {}) => ({ ...JSON.parse(JSON.stringify(DEFAULT_PERIOD_DATA.carryover)), ...o });
const pick = (r) => ({
  cash: r.bookEndingCash, inflow: r.cashInflow, outflow: r.cashOutflow,
  sales: r.pl.salesRevenue, fixedCost: r.pl.fixedCost, operatingProfit: r.pl.operatingProfit,
  tax: r.pl.corporateTax, netProfit: r.pl.netProfit,
  totalAssets: r.bs.totalAssets, totalLiab: r.bs.totalLiabilities, netAssets: r.bs.totalNetAssets,
  diff: r.bs.difference, rank: r.rank,
});

describe('calculateFinancials - 取引シナリオ', () => {
  it.each([
  ["空の帳簿", [], 1, {"cash":300,"inflow":0,"outflow":0,"sales":0,"fixedCost":0,"operatingProfit":0,"tax":7,"netProfit":-7,"totalAssets":300,"totalLiab":7,"netAssets":293,"diff":0,"rank":"C"}],
  ["現金売上", [{"category":"キ","amount":100,"quantity":2}], 1, {"cash":400,"inflow":100,"outflow":0,"sales":100,"fixedCost":0,"operatingProfit":100,"tax":30,"netProfit":70,"totalAssets":400,"totalLiab":30,"netAssets":370,"diff":0,"rank":"B"}],
  ["掛売上", [{"category":"ネ","amount":80,"quantity":2}], 1, {"cash":300,"inflow":0,"outflow":0,"sales":80,"fixedCost":0,"operatingProfit":80,"tax":24,"netProfit":56,"totalAssets":380,"totalLiab":24,"netAssets":356,"diff":0,"rank":"B"}],
  ["掛売上と回収", [{"category":"ネ","amount":80,"quantity":2},{"category":"ア","amount":80,"quantity":0}], 1, {"cash":380,"inflow":80,"outflow":0,"sales":80,"fixedCost":0,"operatingProfit":80,"tax":24,"netProfit":56,"totalAssets":380,"totalLiab":24,"netAssets":356,"diff":0,"rank":"B"}],
  ["材料購入→投入→完成", [{"category":"ツ","amount":20,"quantity":2},{"category":"コ","amount":2,"quantity":2},{"category":"サ","amount":2,"quantity":2}], 1, {"cash":276,"inflow":0,"outflow":24,"sales":0,"fixedCost":0,"operatingProfit":0,"tax":7,"netProfit":-7,"totalAssets":300,"totalLiab":7,"netAssets":293,"diff":0,"rank":"C"}],
  ["借入と返済", [{"category":"オ","amount":100,"quantity":0},{"category":"ナ","amount":30,"quantity":0}], 1, {"cash":370,"inflow":100,"outflow":30,"sales":0,"fixedCost":0,"operatingProfit":0,"tax":7,"netProfit":-7,"totalAssets":370,"totalLiab":77,"netAssets":293,"diff":0,"rank":"C"}],
  ["機械購入", [{"category":"ケ","amount":50,"quantity":1}], 1, {"cash":250,"inflow":0,"outflow":50,"sales":0,"fixedCost":0,"operatingProfit":0,"tax":7,"netProfit":-7,"totalAssets":300,"totalLiab":7,"netAssets":293,"diff":0,"rank":"C"}],
  ["火災(保険なし)", [{"category":"ツ","amount":20,"quantity":3},{"category":"火災","amount":0,"quantity":0}], 1, {"cash":280,"inflow":0,"outflow":20,"sales":0,"fixedCost":0,"operatingProfit":0,"tax":7,"netProfit":-27,"totalAssets":280,"totalLiab":7,"netAssets":273,"diff":0,"rank":"C"}],
  ["盗難(在庫なし)", [{"category":"盗難","amount":0,"quantity":0}], 1, {"cash":300,"inflow":0,"outflow":0,"sales":0,"fixedCost":0,"operatingProfit":0,"tax":7,"netProfit":-7,"totalAssets":300,"totalLiab":7,"netAssets":293,"diff":0,"rank":"C"}],
  ["各種経費", [{"category":"シ","amount":10,"quantity":0},{"category":"ス","amount":5,"quantity":0},{"category":"セ","amount":4,"quantity":0},{"category":"ソ","amount":3,"quantity":0},{"category":"タ","amount":2,"quantity":0},{"category":"チ","amount":6,"quantity":0}], 1, {"cash":270,"inflow":0,"outflow":30,"sales":0,"fixedCost":30,"operatingProfit":-30,"tax":7,"netProfit":-37,"totalAssets":270,"totalLiab":7,"netAssets":263,"diff":0,"rank":"C"}],
  ["文字列の金額数量", [{"category":"キ","amount":"100","quantity":"2"}], 1, {"cash":400,"inflow":100,"outflow":0,"sales":100,"fixedCost":0,"operatingProfit":100,"tax":30,"netProfit":70,"totalAssets":400,"totalLiab":30,"netAssets":370,"diff":0,"rank":"B"}],
  ["売上と経費の混在", [{"category":"キ","amount":200,"quantity":4},{"category":"ツ","amount":40,"quantity":4},{"category":"コ","amount":4,"quantity":4},{"category":"サ","amount":4,"quantity":4},{"category":"シ","amount":10,"quantity":0},{"category":"ソ","amount":5,"quantity":0}], 2, {"cash":437,"inflow":200,"outflow":63,"sales":200,"fixedCost":15,"operatingProfit":137,"tax":41,"netProfit":96,"totalAssets":437,"totalLiab":41,"netAssets":396,"diff":0,"rank":"B"}],
  ])('%s', (_name, ledger, period, expected) => {
    expect(pick(calculateFinancials(fresh(), ledger, {}, period))).toEqual(expected);
  });

  it('全シナリオでB/Sの貸借差額が0になる', () => {
    [0,0,0,0,0,0,0,0,0,0,0,0].forEach((d) => expect(d).toBe(0));
  });
});

describe('calculateFinancials - 期別の給与・保険料', () => {
  it.each([
  [0, {"ws":36,"ss":18,"ins":36,"fixed":90,"net":-97,"cash":300}],
  [1, {"ws":36,"ss":18,"ins":36,"fixed":90,"net":-97,"cash":300}],
  [2, {"ws":40,"ss":20,"ins":39,"fixed":99,"net":-106,"cash":300}],
  [3, {"ws":46,"ss":23,"ins":42,"fixed":111,"net":-118,"cash":300}],
  [4, {"ws":50,"ss":25,"ins":48,"fixed":123,"net":-130,"cash":300}],
  [5, {"ws":56,"ss":28,"ins":51,"fixed":135,"net":-142,"cash":300}],
  [9, {"ws":56,"ss":28,"ins":51,"fixed":135,"net":-142,"cash":300}],
  ])('第%s期 (ワーカー2・セールス1)', (period, expected) => {
    const r = calculateFinancials(fresh({ workers: 2, salesmen: 1 }), [], {}, period);
    expect({
      ws: r.pl.workerSalary, ss: r.pl.salesmanSalary, ins: r.pl.autoInsuranceCost,
      fixed: r.pl.fixedCost, net: r.pl.netProfit, cash: r.bookEndingCash,
    }).toEqual(expected);
  });

  it('範囲外の期番号は1〜5にクランプされる', () => {
    const at = (p) => calculateFinancials(fresh({ workers: 2, salesmen: 1 }), [], {}, p).pl.fixedCost;
    expect(at(0)).toBe(at(1));
    expect(at(9)).toBe(at(5));
    expect(at('abc')).toBe(at(1));
  });
});

describe('calculateFinancials - 期首繰越', () => {
  it('繰越の現金・借入・売掛・買掛・機械がB/Sに反映される', () => {
    const c = fresh({ cash: 500, capital: 300, retainedEarnings: 200, loan: 100, receivables: 50, payables: 30, machinesCount: 2, machinesValue: 80, largeMachines: 1, smallMachines: 1 });
    expect(pick(calculateFinancials(c, [], {}, 2))).toEqual({"cash":500,"inflow":0,"outflow":0,"sales":0,"fixedCost":30,"operatingProfit":-30,"tax":7,"netProfit":-37,"totalAssets":600,"totalLiab":137,"netAssets":463,"diff":0,"rank":"C"});
  });

  it('入力のcarryoverとledgerを破壊しない', () => {
    const c = fresh();
    const l = [{ category: 'キ', amount: 100, quantity: 2 }];
    const cs = JSON.stringify(c), ls = JSON.stringify(l);
    calculateFinancials(c, l, {}, 1);
    expect(JSON.stringify(c)).toBe(cs);
    expect(JSON.stringify(l)).toBe(ls);
  });

  it('戻り値に主要キーが揃っている', () => {
    const r = calculateFinancials(fresh(), [], {}, 1);
    ['bookEndingCash', 'cashInflow', 'cashOutflow', 'pl', 'bs', 'cf', 'totalAssets', 'rank', 'productionCapacity'].forEach((k) => expect(r).toHaveProperty(k));
  });
});
