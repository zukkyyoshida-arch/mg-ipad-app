import React, { useState } from 'react';
import { calculateBudget } from '../../utils/calculations';

function ManagementPlan({ budget, carryover, onUpdateBudget, results }) {
  const [currentScenario, setCurrentScenario] = useState('A'); // 'A', 'B', 'C'
  
  const [scenarios, setScenarios] = useState(() => {
    const period = results?.rank || 1;
    const rates = {
      1: { worker: 10, machine: 20, sales: 10, admin: 10 },
      2: { worker: 12, machine: 24, sales: 12, admin: 11 },
      3: { worker: 14, machine: 26, sales: 14, admin: 12 },
      4: { worker: 17, machine: 29, sales: 17, admin: 13 },
      5: { worker: 19, machine: 31, sales: 19, admin: 14 },
    };
    const currentRates = rates[period] || rates[5];

    const defaultData = {
      targetG: 100,
      
      // 労務費
      laborWorkers: carryover?.workers || 0,
      laborUnitPrice: currentRates.worker,
      
      // 製造経費
      mfgMachines: (carryover?.largeMachines || 0) + (carryover?.smallMachines || 0),
      mfgUnitPrice: currentRates.machine,
      mfgPacCount: 0,
      mfgRepairCount: 0,
      
      // 減価償却費
      depLarge: carryover?.largeMachines || 0,
      depSmall: carryover?.smallMachines || 0,
      depAttach: carryover?.attachments || 0,
      
      // 販売費
      salesSalesmen: carryover?.salesmen || 0,
      salesUnitPrice: currentRates.sales,
      salesResearchCount: 0,
      salesAdCount: 0,
      salesClaimCount: 0,
      
      // 一般管理費
      adminStaffTotal: (carryover?.workers || 0) + (carryover?.salesmen || 0),
      adminUnitPrice: currentRates.admin,
      adminMdCount: 0,
      adminInsuranceCount: 0,
      adminTransferCount: 0,
      adminHireCount: 0,
      
      // 営業外費用
      nonOpStartBalance: carryover?.loan || 0,
      nonOpStartRate: period >= 4 ? 5 : (period >= 2 ? 10 : 0),
      nonOpMidBalance: 0,
      nonOpMidRate: period >= 4 ? 5 : (period >= 2 ? 10 : 0),
      
      // 研究開発費
      rdCount: 0
    };
    return {
      A: { ...defaultData, targetG: 150 },
      B: { ...defaultData, targetG: 80 },
      C: { ...defaultData, targetG: 50 }
    };
  });

  const deriveTotals = (b) => {
    return {
      ...b,
      laborBudget: b.laborWorkers * b.laborUnitPrice,
      manufacturingBudget: (b.mfgMachines * b.mfgUnitPrice) + (b.mfgPacCount * 10) + (b.mfgRepairCount * 5),
      depreciationBudget: (b.depLarge * 20) + (b.depSmall * 10) + (b.depAttach * 2),
      salesBudget: (b.salesSalesmen * b.salesUnitPrice) + (b.salesResearchCount * 10) + (b.salesAdCount * 10) + (b.salesClaimCount * 5),
      adminBudget: (b.adminStaffTotal * b.adminUnitPrice) + (b.adminMdCount * 10) + (b.adminInsuranceCount * 5) + (b.adminTransferCount * 5) + (b.adminHireCount * 5),
      nonOperatingBudget: Math.round((b.nonOpStartBalance * b.nonOpStartRate / 100)) + Math.round((b.nonOpMidBalance * b.nonOpMidRate / 100)),
      rdBudget: b.rdCount * 20
    };
  };

  const activeBudget = scenarios[currentScenario];

  const handleInputChange = (field, val) => {
    const num = val === '' ? 0 : Number(val);
    const updatedScenario = {
      ...activeBudget,
      [field]: num
    };

    setScenarios(prev => ({
      ...prev,
      [currentScenario]: updatedScenario
    }));

    if (currentScenario === 'A') {
      onUpdateBudget(deriveTotals(updatedScenario));
    }
  };

  const calcResults = {
    A: calculateBudget(deriveTotals(scenarios.A)),
    B: calculateBudget(deriveTotals(scenarios.B)),
    C: calculateBudget(deriveTotals(scenarios.C))
  };

  const activeResult = calcResults[currentScenario];

  return (
    <div style={{ padding: '0 0 20px 0' }}>
      
      {/* シナリオ切り替え */}
      <div className="glass-card" style={{ padding: '8px 10px', margin: '0 0 10px 0' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['A', 'B', 'C'].map((scenario) => (
            <button
              key={scenario}
              onClick={() => setCurrentScenario(scenario)}
              className={`nav-item ${currentScenario === scenario ? 'active' : ''}`}
              style={{ flex: 1, padding: '6px 0', fontSize: '0.85rem', fontWeight: '800' }}
            >
              {scenario} 予算
            </button>
          ))}
        </div>
      </div>

      {/* 3列レイアウトグリッド */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        
        {/* ==================== 1列目 ==================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* ① 必要目標利益 (G) を決める */}
          <div className="glass-card" style={{ margin: 0, padding: '10px' }}>
            <div className="glass-card-header" style={{ marginBottom: '6px' }}>
              <h3 className="glass-card-title" style={{ fontSize: '0.85rem' }}>① 必要目標利益 (G) を決める</h3>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div className="form-group" style={{ margin: 0, flex: 1.2 }}>
                <div className="input-with-icon">
                  <span className="input-icon" style={{ fontSize: '0.75rem' }}>¥</span>
                  <input
                    type="number"
                    value={activeBudget.targetG || ''}
                    onChange={(e) => handleInputChange('targetG', e.target.value)}
                    placeholder="0"
                    className="form-input"
                    style={{ fontSize: '0.9rem', fontWeight: '800', height: '28px', padding: '2px 6px 2px 18px' }}
                  />
                  <span className="input-suffix" style={{ fontSize: '0.75rem' }}>万</span>
                </div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', background: 'rgba(236, 72, 153, 0.1)', padding: '4px 6px', borderRadius: '6px', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--mg-pink)', fontWeight: 'bold' }}>必要MQ (G+F)</div>
                <div className="electric-number" style={{ fontSize: '0.95rem', color: 'var(--mg-pink)' }}>
                  ¥{activeResult.requiredMQ.toLocaleString()}<span style={{ fontSize: '0.7rem' }}>万</span>
                </div>
              </div>
            </div>
          </div>

          {/* 1. 労務費 */}
          <div className="glass-card" style={{ margin: 0, padding: '10px' }}>
            <h4 style={{ color: 'var(--mg-blue)', marginBottom: '6px', fontSize: '0.8rem' }}>1. 労務費</h4>
            <div className="grid-2">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.7rem' }}>ワーカー (人)</label>
                <input type="number" value={activeBudget.laborWorkers} onChange={(e) => handleInputChange('laborWorkers', e.target.value)} className="form-input" style={{ height: '28px', fontSize: '0.8rem', padding: '4px 8px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.7rem' }}>単価 (万)</label>
                <input type="number" value={activeBudget.laborUnitPrice} onChange={(e) => handleInputChange('laborUnitPrice', e.target.value)} className="form-input" style={{ height: '28px', fontSize: '0.8rem', padding: '4px 8px' }} />
              </div>
            </div>
            <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '0.75rem', marginTop: '4px' }}>小計: ¥{deriveTotals(activeBudget).laborBudget.toLocaleString()}万</div>
          </div>

          {/* 3. 減価償却費 */}
          <div className="glass-card" style={{ margin: 0, padding: '10px' }}>
            <h4 style={{ color: 'var(--mg-blue)', marginBottom: '6px', fontSize: '0.8rem' }}>3. 減価償却費</h4>
            <div className="grid-2">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.7rem' }}>大型 × 20</label>
                <input type="number" value={activeBudget.depLarge} onChange={(e) => handleInputChange('depLarge', e.target.value)} className="form-input" style={{ height: '28px', fontSize: '0.8rem', padding: '4px 8px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.7rem' }}>小型 × 10</label>
                <input type="number" value={activeBudget.depSmall} onChange={(e) => handleInputChange('depSmall', e.target.value)} className="form-input" style={{ height: '28px', fontSize: '0.8rem', padding: '4px 8px' }} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '6px', marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.7rem' }}>アタッチメント × 2</label>
              <input type="number" value={activeBudget.depAttach} onChange={(e) => handleInputChange('depAttach', e.target.value)} className="form-input" style={{ height: '28px', fontSize: '0.8rem', padding: '4px 8px' }} />
            </div>
            <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '0.75rem', marginTop: '4px' }}>小計: ¥{deriveTotals(activeBudget).depreciationBudget.toLocaleString()}万</div>
          </div>

        </div>

        {/* ==================== 2列目 ==================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* 2. 製造経費 */}
          <div className="glass-card" style={{ margin: 0, padding: '10px' }}>
            <h4 style={{ color: 'var(--mg-blue)', marginBottom: '6px', fontSize: '0.8rem' }}>2. 製造経費</h4>
            <div className="grid-2">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.7rem' }}>機械 (台)</label>
                <input type="number" value={activeBudget.mfgMachines} onChange={(e) => handleInputChange('mfgMachines', e.target.value)} className="form-input" style={{ height: '28px', fontSize: '0.8rem', padding: '4px 8px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.7rem' }}>単価 (万)</label>
                <input type="number" value={activeBudget.mfgUnitPrice} onChange={(e) => handleInputChange('mfgUnitPrice', e.target.value)} className="form-input" style={{ height: '28px', fontSize: '0.8rem', padding: '4px 8px' }} />
              </div>
            </div>
            <div className="grid-2" style={{ marginTop: '6px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.7rem' }}>PAC × 10</label>
                <input type="number" value={activeBudget.mfgPacCount} onChange={(e) => handleInputChange('mfgPacCount', e.target.value)} className="form-input" style={{ height: '28px', fontSize: '0.8rem', padding: '4px 8px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.7rem' }}>修理 × 5</label>
                <input type="number" value={activeBudget.mfgRepairCount} onChange={(e) => handleInputChange('mfgRepairCount', e.target.value)} className="form-input" style={{ height: '28px', fontSize: '0.8rem', padding: '4px 8px' }} />
              </div>
            </div>
            <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '0.75rem', marginTop: '4px' }}>小計: ¥{deriveTotals(activeBudget).manufacturingBudget.toLocaleString()}万</div>
          </div>

          {/* 4. 販売費 */}
          <div className="glass-card" style={{ margin: 0, padding: '10px' }}>
            <h4 style={{ color: 'var(--mg-blue)', marginBottom: '6px', fontSize: '0.8rem' }}>4. 販売費</h4>
            <div className="grid-2">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.7rem' }}>ｾｰﾙｽﾏﾝ (人)</label>
                <input type="number" value={activeBudget.salesSalesmen} onChange={(e) => handleInputChange('salesSalesmen', e.target.value)} className="form-input" style={{ height: '28px', fontSize: '0.8rem', padding: '4px 8px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.7rem' }}>単価 (万)</label>
                <input type="number" value={activeBudget.salesUnitPrice} onChange={(e) => handleInputChange('salesUnitPrice', e.target.value)} className="form-input" style={{ height: '28px', fontSize: '0.8rem', padding: '4px 8px' }} />
              </div>
            </div>
            <div className="grid-2" style={{ marginTop: '6px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.7rem' }}>ﾘｻｰﾁ × 10</label>
                <input type="number" value={activeBudget.salesResearchCount} onChange={(e) => handleInputChange('salesResearchCount', e.target.value)} className="form-input" style={{ height: '28px', fontSize: '0.8rem', padding: '4px 8px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.7(' }}>広告 × 10</label>
                <input type="number" value={activeBudget.salesAdCount} onChange={(e) => handleInputChange('salesAdCount', e.target.value)} className="form-input" style={{ height: '28px', fontSize: '0.8rem', padding: '4px 8px' }} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '6px', marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.7rem' }}>クレーム処理 × 5</label>
              <input type="number" value={activeBudget.salesClaimCount} onChange={(e) => handleInputChange('salesClaimCount', e.target.value)} className="form-input" style={{ height: '28px', fontSize: '0.8rem', padding: '4px 8px' }} />
            </div>
            <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '0.75rem', marginTop: '4px' }}>小計: ¥{deriveTotals(activeBudget).salesBudget.toLocaleString()}万</div>
          </div>

        </div>

        {/* ==================== 3列目 ==================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* 5. 一般管理費 */}
          <div className="glass-card" style={{ margin: 0, padding: '10px' }}>
            <h4 style={{ color: 'var(--mg-blue)', marginBottom: '6px', fontSize: '0.8rem' }}>5. 一般管理費</h4>
            <div className="grid-2">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.7rem' }}>人員合計 (人)</label>
                <input type="number" value={activeBudget.adminStaffTotal} onChange={(e) => handleInputChange('adminStaffTotal', e.target.value)} className="form-input" style={{ height: '28px', fontSize: '0.8rem', padding: '4px 8px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.7rem' }}>単価 (万)</label>
                <input type="number" value={activeBudget.adminUnitPrice} onChange={(e) => handleInputChange('adminUnitPrice', e.target.value)} className="form-input" style={{ height: '28px', fontSize: '0.8rem', padding: '4px 8px' }} />
              </div>
            </div>
            <div className="grid-2" style={{ marginTop: '6px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.7rem' }}>MD × 10</label>
                <input type="number" value={activeBudget.adminMdCount} onChange={(e) => handleInputChange('adminMdCount', e.target.value)} className="form-input" style={{ height: '28px', fontSize: '0.8rem', padding: '4px 8px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.7rem' }}>保険 × 5</label>
                <input type="number" value={activeBudget.adminInsuranceCount} onChange={(e) => handleInputChange('adminInsuranceCount', e.target.value)} className="form-input" style={{ height: '28px', fontSize: '0.8rem', padding: '4px 8px' }} />
              </div>
            </div>
            <div className="grid-2" style={{ marginTop: '6px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.7rem' }}>配置転換 × 5</label>
                <input type="number" value={activeBudget.adminTransferCount} onChange={(e) => handleInputChange('adminTransferCount', e.target.value)} className="form-input" style={{ height: '28px', fontSize: '0.8rem', padding: '4px 8px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.7rem' }}>採用・退職 × 5</label>
                <input type="number" value={activeBudget.adminHireCount} onChange={(e) => handleInputChange('adminHireCount', e.target.value)} className="form-input" style={{ height: '28px', fontSize: '0.8rem', padding: '4px 8px' }} />
              </div>
            </div>
            <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '0.75rem', marginTop: '4px' }}>小計: ¥{deriveTotals(activeBudget).adminBudget.toLocaleString()}万</div>
          </div>

          {/* 6. 営業外 ＆ 7. 研究開発 */}
          <div className="glass-card" style={{ margin: 0, padding: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <h4 style={{ color: 'var(--mg-blue)', marginBottom: '4px', fontSize: '0.8rem' }}>6. 金利 (万)</h4>
                <input type="number" value={activeBudget.nonOpStartBalance} onChange={(e) => handleInputChange('nonOpStartBalance', e.target.value)} className="form-input" style={{ height: '28px', fontSize: '0.8rem', padding: '4px 8px' }} placeholder="残高" />
                <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '0.75rem', marginTop: '4px' }}>¥{deriveTotals(activeBudget).nonOperatingBudget.toLocaleString()}万</div>
              </div>
              <div>
                <h4 style={{ color: 'var(--mg-blue)', marginBottom: '4px', fontSize: '0.8rem' }}>7. 研究開発 × 20</h4>
                <input type="number" value={activeBudget.rdCount} onChange={(e) => handleInputChange('rdCount', e.target.value)} className="form-input" style={{ height: '28px', fontSize: '0.8rem', padding: '4px 8px' }} placeholder="枚数" />
                <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '0.75rem', marginTop: '4px' }}>¥{deriveTotals(activeBudget).rdBudget.toLocaleString()}万</div>
              </div>
            </div>
          </div>

          {/* 固定費予算合計 */}
          <div className="glass-card" style={{ margin: 0, padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(42, 132, 255, 0.08)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800' }}>固定費合計 (F):</span>
            <span className="electric-number" style={{ fontSize: '1.1rem', color: 'var(--color-accent)' }}>
              ¥{activeResult.fixedCostTotal.toLocaleString()}万
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default ManagementPlan;
