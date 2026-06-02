import React from 'react'

export default function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'ledger', label: '出納帳', icon: '📝' },
    { id: 'statements', label: '決算書', icon: '📈' },
    { id: 'periodEnd', label: '期末処理', icon: '📅' },
    { id: 'plan', label: '計画表', icon: '🎯' },
    { id: 'board', label: '会社盤', icon: '🎮' },
    { id: 'settings', label: '設定', icon: '⚙️' },
  ]

  const isPortrait = window.innerWidth < window.innerHeight

  return (
    <div style={{
      width: isPortrait ? '100%' : 'var(--sidebar-width)',
      background: 'var(--bg-shell)',
      borderRight: isPortrait ? 'none' : '1px solid var(--border-glass)',
      borderBottom: isPortrait ? '1px solid var(--border-glass)' : 'none',
      overflowY: isPortrait ? 'hidden' : 'auto',
      overflowX: isPortrait ? 'auto' : 'hidden',
      display: 'flex',
      flexDirection: isPortrait ? 'row' : 'column',
      padding: isPortrait ? '0' : '20px 0',
      gap: isPortrait ? '0' : '0',
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            width: isPortrait ? 'auto' : '100%',
            minWidth: isPortrait ? '120px' : 'auto',
            padding: isPortrait ? '12px 12px' : '12px 16px',
            background: activeTab === tab.id ? 'var(--surface-accent)' : 'transparent',
            border: 'none',
            borderLeft: isPortrait ? 'none' : activeTab === tab.id ? '4px solid var(--color-accent)' : '4px solid transparent',
            borderBottom: isPortrait ? activeTab === tab.id ? '4px solid var(--color-accent)' : '4px solid transparent' : 'none',
            color: activeTab === tab.id ? 'var(--color-accent)' : 'var(--text-primary)',
            fontSize: isPortrait ? '0.8rem' : '0.9rem',
            fontWeight: activeTab === tab.id ? '600' : '500',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: isPortrait ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isPortrait ? '4px' : '8px',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
