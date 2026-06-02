import React from 'react'

export default function PriorPeriodCarryover({
  carryover,
  onUpdateCarryover,
  currentPeriod,
  periods,
  setCurrentPeriod,
  rollForwardFromPrevious,
  resetAllData
}) {
  const handleUpdateField = (field, value) => {
    onUpdateCarryover({
      ...carryover,
      [field]: value
    })
  }

  const carrierFields = [
    { key: 'cash', label: '現金', color: 'var(--mg-blue)' },
    { key: 'materialsCount', label: '材料在庫（個）', color: 'var(--mg-green)' },
    { key: 'materialsValue', label: '材料評価額', color: 'var(--mg-green)' },
    { key: 'wipCount', label: '仕掛品在庫（個）', color: 'var(--mg-blue)' },
    { key: 'wipValue', label: '仕掛品評価額', color: 'var(--mg-blue)' },
    { key: 'productCount', label: '製品在庫（個）', color: 'var(--mg-pink)' },
    { key: 'productValue', label: '製品評価額', color: 'var(--mg-pink)' },
    { key: 'largeMachines', label: '大型機械', color: 'var(--mg-purple)' },
    { key: 'smallMachines', label: '小型機械', color: 'var(--mg-purple)' },
    { key: 'attachments', label: 'アタッチメント', color: 'var(--mg-purple)' },
    { key: 'loan', label: '借入金', color: '#f97316' },
    { key: 'receivables', label: '売掛金', color: 'var(--mg-pink)' },
    { key: 'payables', label: '買掛金', color: 'var(--mg-yellow)' },
    { key: 'capital', label: '資本金', color: 'var(--mg-blue)' },
    { key: 'retainedEarnings', label: '利益剰余金', color: 'var(--mg-green)' }
  ]

  const isLandscape = window.innerWidth > window.innerHeight

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
        ⚙️ 期首設定 & 設定
      </h3>

      {/* 期選択 */}
      <div style={{
        marginBottom: '20px',
        padding: '16px',
        background: 'var(--bg-shell)',
        borderRadius: '6px',
        border: '1px solid var(--border-glass)'
      }}>
        <label style={{
          display: 'block',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          marginBottom: '12px'
        }}>
          期を選択
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5].map(period => (
            <button
              key={period}
              onClick={() => setCurrentPeriod(period)}
              style={{
                padding: '10px 16px',
                fontSize: '0.95rem',
                fontWeight: 'bold',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: currentPeriod === period ? 'var(--mg-blue)' : 'var(--surface-subtle)',
                color: currentPeriod === period ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
            >
              第{period}期
            </button>
          ))}
        </div>
      </div>

      {/* 期首繰越データ編集 */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <h4 style={{
          margin: '0 0 12px 0',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)'
        }}>
          第{currentPeriod}期 期首繰越データ
        </h4>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isLandscape ? '1fr 1fr' : '1fr',
          gap: '12px'
        }}>
          {carrierFields.map(field => (
            <div key={field.key}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                marginBottom: '6px'
              }}>
                {field.label}
              </label>
              <input
                type="number"
                value={carryover[field.key] || 0}
                onChange={(e) => handleUpdateField(field.key, parseInt(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `2px solid ${field.color}`,
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  background: 'var(--bg-shell)',
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* アクションボタン */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '1px solid var(--border-glass)'
      }}>
        <button
          onClick={rollForwardFromPrevious}
          disabled={currentPeriod <= 1}
          style={{
            padding: '12px',
            background: currentPeriod <= 1 ? '#ccc' : 'var(--mg-green)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.95rem',
            fontWeight: 'bold',
            cursor: currentPeriod <= 1 ? 'not-allowed' : 'pointer',
            opacity: currentPeriod <= 1 ? 0.5 : 1
          }}
        >
          ↙️ 前期末データから自動引き継ぎ
        </button>

        <button
          onClick={resetAllData}
          style={{
            padding: '12px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.95rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🔄 全データをリセット
        </button>
      </div>
    </div>
  )
}
