import React, { useState } from 'react'

export default function ManagementPlan({ budget, carryover, onUpdateBudget, results }) {
  const [selectedScenario, setSelectedScenario] = useState('A')

  const currentBudget = budget || {}

  // シナリオデータ（A/B/C）
  const scenarios = {
    A: {
      name: 'シナリオA',
      targetG: currentBudget.targetG_A || 0,
      description: '保守的戦略'
    },
    B: {
      name: 'シナリオB',
      targetG: currentBudget.targetG_B || 0,
      description: '標準戦略'
    },
    C: {
      name: 'シナリオC',
      targetG: currentBudget.targetG_C || 0,
      description: 'アグレッシブ戦略'
    }
  }

  const handleUpdateBudget = (scenario, field, value) => {
    onUpdateBudget({
      ...currentBudget,
      [`${field}_${scenario}`]: value
    })
  }

  const isLandscape = window.innerWidth > window.innerHeight

  // 必要MQ計算
  const calculateRequiredMQ = (targetG) => {
    const fixedCost = currentBudget.fixedCost || 0
    return targetG + fixedCost
  }

  return (
    <div style={{
      padding: '20px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* ヘッダー */}
      <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>
        📊 経営計画表
      </h3>

      {/* シナリオセレクト */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['A', 'B', 'C'].map(scenario => (
          <button
            key={scenario}
            onClick={() => setSelectedScenario(scenario)}
            style={{
              padding: '10px 16px',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: selectedScenario === scenario ? 'var(--mg-blue)' : 'var(--surface-subtle)',
              color: selectedScenario === scenario ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s'
            }}
          >
            {scenarios[scenario].name}
          </button>
        ))}
      </div>

      {/* コンテンツ */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isLandscape ? '1fr 1fr' : '1fr', gap: '16px' }}>
          {/* シナリオ比較 */}
          {isLandscape && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                シナリオ比較
              </h4>
              {['A', 'B', 'C'].map(scenario => {
                const targetG = scenarios[scenario].targetG
                const requiredMQ = calculateRequiredMQ(targetG)
                const actualMQ = (results?.pl?.salesRevenue || 0) - (results?.pl?.variableCost || 0)

                return (
                  <div
                    key={scenario}
                    style={{
                      padding: '12px',
                      background: 'var(--bg-shell)',
                      borderRadius: '6px',
                      border: selectedScenario === scenario ? '2px solid var(--mg-blue)' : '1px solid var(--border-glass)'
                    }}
                  >
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      color: selectedScenario === scenario ? 'var(--mg-blue)' : 'var(--text-primary)',
                      marginBottom: '8px'
                    }}>
                      {scenarios[scenario].name} - {scenarios[scenario].description}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>目標利益(G):</span>
                        <span style={{ fontWeight: 'bold', color: 'var(--mg-pink)' }}>
                          {targetG.toLocaleString()}万円
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>必要MQ:</span>
                        <span style={{ fontWeight: 'bold', color: 'var(--mg-blue)' }}>
                          {requiredMQ.toLocaleString()}万円
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '6px',
                        borderTop: '1px solid var(--border-glass)'
                      }}>
                        <span style={{ color: 'var(--text-secondary)' }}>実績MQ:</span>
                        <span style={{
                          fontWeight: 'bold',
                          color: actualMQ >= requiredMQ ? 'var(--mg-green)' : '#ef4444'
                        }}>
                          {actualMQ.toLocaleString()}万円
                        </span>
                      </div>
                    </div>

                    {/* 達成度 */}
                    <div style={{
                      marginTop: '8px',
                      padding: '8px',
                      background: 'var(--surface-subtle)',
                      borderRadius: '4px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: actualMQ >= requiredMQ ? 'var(--mg-green)' : 'var(--mg-pink)'
                      }}>
                        {requiredMQ > 0 ? Math.round((actualMQ / requiredMQ) * 100) : 0}%
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* 選択シナリオの詳細編集 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              {scenarios[selectedScenario].name} - 詳細設定
            </h4>

            {[
              { key: 'targetG', label: '目標利益(G)', color: 'var(--mg-pink)' },
              { key: 'laborBudget', label: '労務費予算', color: 'var(--mg-green)' },
              { key: 'manufacturingBudget', label: '製造経費予算', color: 'var(--mg-blue)' },
              { key: 'fixedCost', label: '固定費予算', color: 'var(--mg-yellow)' }
            ].map(item => (
              <div key={item.key}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '6px'
                }}>
                  {item.label}
                </label>
                <input
                  type="number"
                  value={currentBudget[`${item.key}_${selectedScenario}`] || 0}
                  onChange={(e) => handleUpdateBudget(selectedScenario, item.key, parseInt(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `2px solid ${item.color}`,
                    borderRadius: '6px',
                    fontSize: '1rem',
                    background: 'var(--bg-shell)',
                    color: 'var(--text-primary)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            ))}

            {/* 計算結果 */}
            <div style={{
              padding: '12px',
              background: 'var(--surface-accent)',
              borderRadius: '6px',
              border: '2px solid var(--mg-blue)',
              marginTop: '12px'
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                必要MQ (目標G + 固定費)
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--mg-blue)' }}>
                {calculateRequiredMQ(scenarios[selectedScenario].targetG).toLocaleString()}万円
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
