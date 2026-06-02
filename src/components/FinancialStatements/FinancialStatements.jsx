import React, { useState } from 'react'

export default function FinancialStatements({ results, carryover, currentPeriod, ledger }) {
  const [statementTab, setStatementTab] = useState('pl')

  const pl = results?.pl || {}
  const bs = results?.bs || {}
  const cf = results?.cf || {}

  const isLandscape = window.innerWidth > window.innerHeight

  return (
    <div style={{
      padding: '20px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* タブナビゲーション */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {['pl', 'bs', 'cf'].map(tab => (
          <button
            key={tab}
            onClick={() => setStatementTab(tab)}
            style={{
              padding: '10px 16px',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: statementTab === tab ? 'var(--mg-blue)' : 'var(--surface-subtle)',
              color: statementTab === tab ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s'
            }}
          >
            {tab === 'pl' && '損益計算書'}
            {tab === 'bs' && '貸借対照表'}
            {tab === 'cf' && 'キャッシュフロー'}
          </button>
        ))}
      </div>

      {/* コンテンツ */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* P/L */}
        {statementTab === 'pl' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)' }}>
              第{currentPeriod}期 損益計算書
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: isLandscape ? '1fr 1fr' : '1fr', gap: '12px' }}>
              {/* 収益セクション */}
              <div style={{
                padding: '12px',
                background: 'var(--bg-shell)',
                borderRadius: '6px',
                border: '1px solid var(--border-glass)'
              }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  売上高
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--mg-pink)' }}>
                  {(pl.salesRevenue || 0).toLocaleString()}万円
                </div>
              </div>

              {/* 費用セクション */}
              <div style={{
                padding: '12px',
                background: 'var(--bg-shell)',
                borderRadius: '6px',
                border: '1px solid var(--border-glass)'
              }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  変動費
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--mg-green)' }}>
                  {(pl.variableCost || 0).toLocaleString()}万円
                </div>
              </div>

              {/* 付加価値 */}
              <div style={{
                padding: '12px',
                background: 'var(--surface-accent)',
                borderRadius: '6px',
                border: '2px solid var(--mg-blue)'
              }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  付加価値 (MQ)
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--mg-blue)' }}>
                  {((pl.salesRevenue || 0) - (pl.variableCost || 0)).toLocaleString()}万円
                </div>
              </div>

              {/* 固定費 */}
              <div style={{
                padding: '12px',
                background: 'var(--bg-shell)',
                borderRadius: '6px',
                border: '1px solid var(--border-glass)'
              }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  固定費
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--mg-yellow)' }}>
                  {(pl.fixedCost || 0).toLocaleString()}万円
                </div>
              </div>

              {/* 経常利益 */}
              <div style={{
                padding: '12px',
                background: pl.operatingProfit >= 0 ? 'var(--surface-success)' : '#fee2e2',
                borderRadius: '6px',
                border: `2px solid ${pl.operatingProfit >= 0 ? 'var(--mg-green)' : '#ef4444'}`
              }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  経常利益 (G)
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: pl.operatingProfit >= 0 ? 'var(--mg-green)' : '#ef4444'
                }}>
                  {(pl.operatingProfit || 0).toLocaleString()}万円
                </div>
              </div>
            </div>

            {/* 評価ランク */}
            {pl.rank && (
              <div style={{
                padding: '12px',
                background: 'var(--surface-subtle)',
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  評価ランク
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--mg-blue)' }}>
                  {pl.rank}
                </div>
              </div>
            )}
          </div>
        )}

        {/* B/S */}
        {statementTab === 'bs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)' }}>
              第{currentPeriod}期 貸借対照表
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: isLandscape ? '1fr 1fr' : '1fr', gap: '12px' }}>
              {/* 資産の部 */}
              <div>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  資産の部
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: '現金', value: bs.cash, color: 'var(--mg-blue)' },
                    { label: '売掛金', value: bs.receivables, color: 'var(--mg-pink)' },
                    { label: '在庫', value: (bs.materialsValue || 0) + (bs.wipValue || 0) + (bs.productValue || 0), color: 'var(--mg-green)' },
                    { label: '固定資産', value: bs.fixedAssets, color: 'var(--mg-purple)' }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px',
                        background: 'var(--bg-shell)',
                        borderRadius: '4px',
                        fontSize: '0.9rem'
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                      <span style={{ fontWeight: 'bold', color: item.color }}>
                        {(item.value || 0).toLocaleString()}万円
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: 'var(--surface-accent)',
                    borderRadius: '6px',
                    border: '2px solid var(--mg-blue)'
                  }}
                >
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    資産合計
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--mg-blue)' }}>
                    {(bs.totalAssets || 0).toLocaleString()}万円
                  </div>
                </div>
              </div>

              {/* 負債・純資産の部 */}
              <div>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  負債・純資産の部
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: '買掛金', value: bs.payables, color: 'var(--mg-yellow)' },
                    { label: '借入金', value: bs.loans, color: '#f97316' },
                    { label: '未払税金', value: bs.unpaidTax, color: '#ef4444' },
                    { label: '資本金', value: bs.capital, color: 'var(--mg-blue)' },
                    { label: '利益剰余金', value: bs.retainedEarnings, color: 'var(--mg-green)' }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px',
                        background: 'var(--bg-shell)',
                        borderRadius: '4px',
                        fontSize: '0.9rem'
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                      <span style={{ fontWeight: 'bold', color: item.color }}>
                        {(item.value || 0).toLocaleString()}万円
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: 'var(--surface-accent)',
                    borderRadius: '6px',
                    border: '2px solid var(--mg-green)'
                  }}
                >
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    純資産合計
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--mg-green)' }}>
                    {(bs.totalNetAssets || 0).toLocaleString()}万円
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* C/F */}
        {statementTab === 'cf' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)' }}>
              第{currentPeriod}期 キャッシュフロー計算書
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: isLandscape ? '1fr 1fr' : '1fr', gap: '12px' }}>
              {[
                { label: '営業CF', value: cf.operatingCF, color: 'var(--mg-blue)' },
                { label: '投資CF', value: cf.investingCF, color: 'var(--mg-green)' },
                { label: '財務CF', value: cf.financingCF, color: 'var(--mg-pink)' },
                { label: 'フリーCF', value: cf.freeCF, color: 'var(--mg-purple)' },
                { label: '合計CF', value: cf.totalCF, color: 'var(--mg-yellow)' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    background: 'var(--bg-shell)',
                    borderRadius: '6px',
                    border: `2px solid ${item.color}`
                  }}
                >
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: item.color }}>
                    {(item.value || 0).toLocaleString()}万円
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
