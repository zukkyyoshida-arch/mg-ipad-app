import React from 'react'

export default function Sidebar({ activeTab, setActiveTab }) {
  const isPortrait = window.innerWidth < window.innerHeight

  const tabs = [
    { id: 'dashboard', label: 'ルーム', icon: '🌐' },
    { id: 'ledger', label: '出納帳', icon: '📝' },
    { id: 'statements', label: '決算書', icon: '📈' },
    { id: 'periodEnd', label: '期末', icon: '📅' },
    { id: 'plan', label: '計画', icon: '🎯' },
    { id: 'board', label: '会社盤', icon: '🎮' },
    { id: 'settings', label: '設定', icon: '⚙️' },
  ]

  return (
    <div style={{
      background: 'var(--bg-shell)',
      display: 'flex',
      flexDirection: isPortrait ? 'row' : 'column',
      padding: isPortrait ? '0' : '8px 0',
      gap: '0',
      overflowX: isPortrait ? 'auto' : 'hidden',
      overflowY: isPortrait ? 'hidden' : 'auto',
      minHeight: isPortrait ? 'var(--topbar-height)' : 'auto'
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            flex: isPortrait ? '0 0 auto' : '1 1 100%',
            minWidth: isPortrait ? '90px' : 'auto',
            padding: isPortrait ? '8px 10px' : '10px 12px',
            background: activeTab === tab.id ? 'var(--surface-accent)' : 'transparent',
            border: 'none',
            borderLeft: isPortrait ? 'none' : activeTab === tab.id ? '4px solid var(--color-accent)' : '4px solid transparent',
            borderBottom: isPortrait ? activeTab === tab.id ? '4px solid var(--color-accent)' : '4px solid transparent' : 'none',
            color: activeTab === tab.id ? 'var(--color-accent)' : 'var(--text-primary)',
            fontSize: isPortrait ? '0.75rem' : '0.85rem',
            fontWeight: activeTab === tab.id ? '600' : '500',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: isPortrait ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isPortrait ? '2px' : '8px',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            outline: 'none',
            borderRadius: '0'
          }}
          title={tab.label}
        >
          <span style={{ fontSize: isPortrait ? '1rem' : '1.2rem', lineHeight: '1' }}>
            {tab.icon}
          </span>
          {!isPortrait && <span>{tab.label}</span>}
        </button>
      ))}
    </div>
  )
}
