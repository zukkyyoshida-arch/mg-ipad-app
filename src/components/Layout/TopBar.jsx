import React from 'react'

export default function TopBar() {
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
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '1.5rem' }}>🎮</span>
        <h1 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--color-accent)' }}>戦略MG</h1>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '12px' }}>iPad版</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button style={{
          background: 'transparent',
          border: 'none',
          fontSize: '1.1rem',
          cursor: 'pointer',
          padding: '8px',
        }}>
          ⚙️
        </button>
        <button style={{
          background: 'transparent',
          border: 'none',
          fontSize: '1.1rem',
          cursor: 'pointer',
          padding: '8px',
        }}>
          👤
        </button>
      </div>
    </div>
  )
}
