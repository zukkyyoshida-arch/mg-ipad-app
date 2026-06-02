import React from 'react'

export default function TopBar({ currentPeriod, theme, toggleTheme }) {
  return (
    <div style={{
      height: 'var(--topbar-height)',
      background: 'var(--bg-shell)',
      borderBottom: '1px solid var(--border-glass)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: '20px',
      paddingRight: '20px',
      boxShadow: 'var(--shadow-sm)',
      gap: '20px',
      flexWrap: 'nowrap',
    }}>
      {/* 左側: タイトル */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <span style={{ fontSize: '1.5rem' }}>🎮</span>
        <h1 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--color-accent)', whiteSpace: 'nowrap' }}>戦略MG</h1>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>iPad版</span>
      </div>

      {/* 中央: 現在期表示 */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 16px',
        background: 'var(--surface-accent)',
        borderRadius: '6px',
        minWidth: '100px'
      }}>
        <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-accent)' }}>
          第{currentPeriod}期
        </span>
      </div>

      {/* 右側: アクション */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <button
          onClick={toggleTheme}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '6px',
            transition: 'all 0.2s'
          }}
          title="テーマ切り替え"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  )
}
