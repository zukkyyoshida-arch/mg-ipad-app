import React, { useState, useMemo } from 'react'
import { calculateFinancials } from '../../utils/calculations'

export default function Dashboard({ periods, currentPeriod, results }) {
  const [selectedTab, setSelectedTab] = useState('overall')

  // 期別データを計算
  const sortedPeriods = useMemo(() => {
    const periodsList = []

    for (let p = 1; p <= 5; p++) {
      const pData = periods?.[p]
      if (!pData) continue

      const pResults = calculateFinancials(pData.carryover || {}, pData.ledger || [], pData.actuals || {}, p)

      const totalNetAssets = pResults?.bs?.totalNetAssets || 0
      const sales = pResults?.pl?.salesRevenue || 0
      const profit = pResults?.pl?.operatingProfit || 0
      const salesQty = pResults?.prod?.salesCount || 0

      periodsList.push({
        period: p,
        totalNetAssets,
        sales,
        profit,
        salesQty,
        averagePrice: salesQty > 0 ? Math.round(sales / salesQty) : 0
      })
    }

    return periodsList.sort((a, b) => (b.totalNetAssets || 0) - (a.totalNetAssets || 0))
  }, [periods])

  return (
    <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* ヘッダー */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>📊 経営成績ランキング</h2>

        {/* タブUI */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['1', '2', '3', '4', '5', 'overall'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              style={{
                padding: '10px 16px',
                fontSize: '0.95rem',
                fontWeight: 'bold',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: selectedTab === tab ? 'var(--mg-blue)' : 'var(--surface-subtle)',
                color: selectedTab === tab ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
            >
              {tab === 'overall' ? '総合' : `第${tab}期`}
            </button>
          ))}
        </div>
      </div>

      {/* ランキングテーブル */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {sortedPeriods.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
            <p>データがありません</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* テーブルヘッダー */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr 100px 100px 100px 80px',
              gap: '12px',
              padding: '12px 16px',
              background: 'var(--surface-subtle)',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              position: 'sticky',
              top: 0
            }}>
              <div>順位</div>
              <div>期</div>
              <div style={{ textAlign: 'right' }}>純資産</div>
              <div style={{ textAlign: 'right' }}>売上</div>
              <div style={{ textAlign: 'right' }}>利益</div>
              <div style={{ textAlign: 'right' }}>販売数</div>
            </div>

            {/* ランキング行 */}
            {sortedPeriods.map((period, index) => {
              const isTop = index === 0
              return (
                <div
                  key={period.period}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 100px 100px 100px 80px',
                    gap: '12px',
                    alignItems: 'center',
                    padding: '16px',
                    background: isTop ? 'var(--surface-accent)' : 'var(--bg-shell)',
                    borderRadius: '8px',
                    border: isTop ? '2px solid var(--mg-blue)' : '1px solid var(--border-glass)',
                    boxShadow: isTop ? '0 4px 12px rgba(42, 132, 255, 0.1)' : 'none'
                  }}
                >
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: isTop ? 'var(--mg-blue)' : 'var(--text-secondary)'
                  }}>
                    {isTop ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}位`}
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)'
                  }}>
                    第{period.period}期
                  </div>
                  <div style={{
                    textAlign: 'right',
                    fontSize: '1rem',
                    fontFamily: 'monospace',
                    color: 'var(--mg-blue)',
                    fontWeight: '600'
                  }}>
                    {(period.totalNetAssets || 0).toLocaleString()}
                  </div>
                  <div style={{
                    textAlign: 'right',
                    fontSize: '1rem',
                    fontFamily: 'monospace',
                    color: 'var(--mg-pink)'
                  }}>
                    {(period.sales || 0).toLocaleString()}
                  </div>
                  <div style={{
                    textAlign: 'right',
                    fontSize: '1rem',
                    fontFamily: 'monospace',
                    color: period.profit >= 0 ? 'var(--mg-green)' : '#ef4444',
                    fontWeight: '600'
                  }}>
                    {(period.profit || 0).toLocaleString()}
                  </div>
                  <div style={{
                    textAlign: 'right',
                    fontSize: '0.95rem',
                    color: 'var(--text-secondary)'
                  }}>
                    {period.salesQty} 個
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
