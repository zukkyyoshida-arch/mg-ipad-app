import React from 'react'

export default function TopBar({ currentPeriod, theme, toggleTheme, syncStatus }) {
  return (
    <div style={{
      height: 'var(--topbar-height)',
      background: 'var(--bg-shell)',
      borderBottom: '1px solid var(--border-glass)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: '16px',
      paddingRight: '16px',
      boxShadow: 'var(--shadow-sm)',
      gap: '16px',
      flexWrap: 'nowrap',
    }}>
      {/* 左側: タイトル */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, minWidth: 'min-content' }}>
        <span style={{ fontSize: '1.4rem' }}>🎮</span>
        <h1 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--color-accent)', fontWeight: '600', whiteSpace: 'nowrap' }}>
          戦略MG iPad版
        </h1>
      </div>

      {/* 中央: 期表示 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px 12px',
        background: 'var(--surface-accent)',
        borderRadius: '6px',
        flexShrink: 0,
        minWidth: '80px'
      }}>
        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-accent)' }}>
          第{currentPeriod}期
        </span>
      </div>

      {/* 同期ステータス */}
      {syncStatus && (
        <div style={{
          fontSize: '0.8rem',
          color: syncStatus.includes('エラー') ? '#ef4444' : 'var(--text-secondary)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          minWidth: 'min-content'
        }}>
          ☁️ {syncStatus}
        </div>
      )}

      {/* テーマ切り替え */}
      <button
        onClick={toggleTheme}
        style={{
          background: 'transparent',
          border: 'none',
          fontSize: '1.1rem',
          cursor: 'pointer',
          padding: '6px',
          borderRadius: '6px',
          transition: 'all 0.2s',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title="テーマ切り替え"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  )
}
