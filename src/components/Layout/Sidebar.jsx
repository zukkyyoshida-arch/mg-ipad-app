import React from 'react'

export default function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'dashboard', label: 'ダッシュボード', icon: '📊' },
    { id: 'financials', label: '決算書', icon: '📈' },
    { id: 'performance', label: '経営成績', icon: '🎯' },
    { id: 'ledger', label: '出納帳', icon: '📝' },
    { id: 'settings', label: '設定', icon: '⚙️' },
  ]

  return (
    <div style={{
      width: 'var(--sidebar-width)',
      background: 'var(--bg-shell)',
      borderRight: '1px solid var(--border-glass)',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 0',
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: activeTab === tab.id ? 'var(--surface-accent)' : 'transparent',
            border: 'none',
            borderLeft: activeTab === tab.id ? '4px solid var(--color-accent)' : '4px solid transparent',
            color: activeTab === tab.id ? 'var(--color-accent)' : 'var(--text-primary)',
            fontSize: '0.9rem',
            fontWeight: activeTab === tab.id ? '600' : '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
