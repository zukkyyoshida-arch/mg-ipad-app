import React, { useState } from 'react'
import './App.css'
import Sidebar from './components/Layout/Sidebar'
import TopBar from './components/Layout/TopBar'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="ipad-layout">
      <TopBar />
      <div className="main-container">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="main-content">
          <div style={{ textAlign: 'center', paddingTop: '40px' }}>
            <h1>🎮 iPad版 戦略MG</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '16px' }}>
              {activeTab === 'dashboard' && 'ダッシュボード'}
              {activeTab === 'financials' && '決算書'}
              {activeTab === 'performance' && '経営成績'}
              {activeTab === 'ledger' && '出納帳'}
              {activeTab === 'settings' && '設定'}
            </p>
            <p style={{ color: 'var(--text-muted)', marginTop: '16px', fontSize: '0.9rem' }}>
              Phase 1: 開発環境セットアップ完了 ✅
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
