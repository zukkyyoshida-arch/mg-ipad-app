import React, { useState, useEffect, useRef } from 'react'
import { calculateFinancials, DEFAULT_PERIOD_DATA } from './utils/calculations'
import CashLedger from './components/CashLedger'
import FinancialStatements from './components/FinancialStatements'
import PeriodEndWizard from './components/PeriodEndWizard'
import ManagementPlan from './components/ManagementPlan'
import PriorPeriodCarryover from './components/PriorPeriodCarryover'
import PerformanceReport from './components/PerformanceReport'
import CompanyBoardMinimap from './components/CompanyBoardMinimap'
import ErrorBoundary from './components/ErrorBoundary'
// import { syncPlayerData, removePlayer } from './firebase'
import './App.css'

// Firebase のダミー関数（ローカル開発用）
const syncPlayerData = () => Promise.resolve()
const removePlayer = () => {}
import TopBar from './components/Layout/TopBar'
import Sidebar from './components/Layout/Sidebar'

// 安全な localStorage ラッパー
const safeStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key)
    } catch (e) {
      return null
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value)
    } catch (e) {}
  }
}

function App() {
  // テーマの状態 (ダーク / ライト)
  const [theme, setTheme] = useState(() => {
    const saved = safeStorage.getItem('mg_ipad_theme')
    return saved || 'dark'
  })

  // 成績表表示の状態
  const [showPerformanceReport, setShowPerformanceReport] = useState(false)

  // Firebase Room/Player ID
  const [roomId, setRoomId] = useState(() => safeStorage.getItem('mg_ipad_room_id') || '')
  const [playerId, setPlayerId] = useState(() => safeStorage.getItem('mg_ipad_player_id') || '')
  const [isOffline, setIsOffline] = useState(() => safeStorage.getItem('mg_ipad_offline_mode') === 'true')
  const [showLogin, setShowLogin] = useState(() => {
    if (safeStorage.getItem('mg_ipad_offline_mode') === 'true') return false
    return !safeStorage.getItem('mg_ipad_room_id') || !safeStorage.getItem('mg_ipad_player_id')
  })
  const [loginInput, setLoginInput] = useState({ room: safeStorage.getItem('mg_ipad_room_id') || '', player: safeStorage.getItem('mg_ipad_player_id') || '' })
  const [syncStatus, setSyncStatus] = useState(isOffline ? 'オフライン' : '未同期')

  // 全期 (1期〜5期) のデータ管理
  const [periods, setPeriods] = useState(() => {
    const saved = safeStorage.getItem('mg_ipad_periods_data')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse periods data', e)
      }
    }
    const initialData = {}
    for (let i = 1; i <= 5; i++) {
      initialData[i] = JSON.parse(JSON.stringify(DEFAULT_PERIOD_DATA))
    }
    return initialData
  })

  // 現在の期 (1〜5)
  const [currentPeriod, setCurrentPeriod] = useState(() => {
    const saved = safeStorage.getItem('mg_ipad_current_period')
    return saved ? Number(saved) : 1
  })

  // アクティブなタブ (ledger, statements, periodEnd, plan, board, settings, dashboard)
  const [activeTab, setActiveTab] = useState('ledger')

  // 取引モード ('cash' or 'credit')
  const [transactionMode, setTransactionMode] = useState(() => {
    return safeStorage.getItem('mg_ipad_transaction_mode') || 'cash'
  })

  // データ変更時に localStorage に保存
  useEffect(() => {
    safeStorage.setItem('mg_ipad_periods_data', JSON.stringify(periods))
  }, [periods])

  useEffect(() => {
    safeStorage.setItem('mg_ipad_current_period', String(currentPeriod))
  }, [currentPeriod])

  useEffect(() => {
    safeStorage.setItem('mg_ipad_transaction_mode', transactionMode)
  }, [transactionMode])

  useEffect(() => {
    safeStorage.setItem('mg_ipad_room_id', roomId)
    safeStorage.setItem('mg_ipad_player_id', playerId)
  }, [roomId, playerId])

  // テーマ切り替え処理
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    safeStorage.setItem('mg_ipad_theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  // 現在の期のデータを取得
  const currentData = periods[currentPeriod] || JSON.parse(JSON.stringify(DEFAULT_PERIOD_DATA))

  // リアルタイム財務計算を実行
  const results = calculateFinancials(currentData.carryover, currentData.ledger, currentData.actuals, currentPeriod)

  // Firebase 同期
  useEffect(() => {
    if (roomId && playerId && !isOffline) {
      setSyncStatus('同期中...')
      const periodsData = {}
      for (let p = 1; p <= 5; p++) {
        const pData = periods[p]
        if (pData) {
          const pResults = calculateFinancials(pData.carryover, pData.ledger, pData.actuals, p)
          periodsData[p] = {
            totalNetAssets: pResults?.bs?.totalNetAssets || 0,
            sales: pResults?.pl?.salesRevenue || 0,
            profit: pResults?.pl?.operatingProfit || 0,
            salesQty: pResults?.prod?.salesCount || 0,
            averagePrice: pResults?.prod?.salesCount > 0 ? Math.round((pResults?.pl?.salesRevenue || 0) / (pResults?.prod?.salesCount || 1)) : 0,
            cash: pResults?.bs?.cash || 0,
            capital: pResults?.bs?.capital || 0,
            retainedEarnings: pResults?.bs?.retainedEarnings || 0
          }
        }
      }
      syncPlayerData(roomId, playerId, {
        currentPeriod,
        totalNetAssets: results?.bs?.totalNetAssets || 0,
        cash: results?.bs?.cash || 0,
        capital: results?.bs?.capital || 0,
        retainedEarnings: results?.bs?.retainedEarnings || 0,
        sales: results?.pl?.salesRevenue || 0,
        profit: results?.pl?.operatingProfit || 0,
        salesQty: results?.prod?.salesCount || 0,
        averagePrice: results?.prod?.salesCount > 0 ? Math.round((results?.pl?.salesRevenue || 0) / (results?.prod?.salesCount || 1)) : 0,
        lastUpdated: Date.now(),
        periods: periodsData
      }).then(() => {
        setSyncStatus(`同期完了 (${new Date().toLocaleTimeString()})`)
      }).catch(() => {
        setSyncStatus('同期エラー')
      })
    }
  }, [results, currentPeriod, roomId, playerId, isOffline, periods])

  // データ更新関数
  const updatePeriodData = (field, newData) => {
    setPeriods(prev => ({
      ...prev,
      [currentPeriod]: {
        ...prev[currentPeriod],
        [field]: newData
      }
    }))
  }

  // 全期リセット
  const resetAllData = () => {
    if (window.confirm('全てのデータを初期化して最初から開始しますか？\n（この操作は取り消せません）')) {
      const freshData = {}
      for (let i = 1; i <= 5; i++) {
        freshData[i] = JSON.parse(JSON.stringify(DEFAULT_PERIOD_DATA))
      }
      setPeriods(freshData)
      setCurrentPeriod(1)
      setTransactionMode('cash')
      setActiveTab('ledger')
    }
  }

  // 前期ロールフォワード
  const rollForwardFromPrevious = () => {
    if (currentPeriod <= 1) return
    const prevPeriod = currentPeriod - 1
    const prevData = periods[prevPeriod]
    if (!prevData) return

    const prevResults = calculateFinancials(prevData.carryover, prevData.ledger, prevData.actuals, prevPeriod)
    const prevBS = prevResults.bs
    const prevMat = prevResults.mat
    const prevWip = prevResults.wip
    const prevProd = prevResults.prod
    const prevMach = prevResults.machines

    const nextCarryover = {
      cash: prevBS.cash,
      materialsCount: prevMat.endingCount,
      materialsValue: prevMat.endingValue,
      wipCount: prevWip.endingCount,
      wipValue: prevWip.endingValue,
      productCount: prevProd.endingCount,
      productValue: prevProd.endingValue,
      largeMachines: prevMach.large,
      smallMachines: prevMach.small,
      attachments: prevMach.attachments,
      machinesCount: prevMach.large + prevMach.small,
      machinesValue: prevBS.fixedAssets,
      loan: prevBS.loans,
      receivables: prevBS.receivables,
      payables: prevBS.payables,
      taxes: prevBS.unpaidTax,
      retainedEarnings: prevBS.retainedEarnings,
      capital: prevBS.capital,
      workers: prevResults.workers || 0,
      salesmen: prevResults.salesmen || 0
    }

    if (window.confirm(`第${prevPeriod}期末の決算データを、第${currentPeriod}期の期首データとして自動引き継ぎしますか？`)) {
      setPeriods(prev => ({
        ...prev,
        [currentPeriod]: {
          ...prev[currentPeriod],
          carryover: nextCarryover,
          actuals: {
            ...prev[currentPeriod].actuals,
            actualCash: prevBS.cash,
            actualMaterials: prevMat.endingCount,
            actualWip: prevWip.endingCount,
            actualProduct: prevProd.endingCount
          }
        }
      }))
      alert(`第${currentPeriod}期の期首データを自動設定しました！`)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ margin: '0 0 20px 0' }}>📊 ルーム連携ダッシュボード</h2>
            {showLogin ? (
              <div style={{
                padding: '20px',
                background: 'var(--bg-shell)',
                borderRadius: '8px',
                border: '1px solid var(--border-glass)',
                maxWidth: '500px'
              }}>
                <h3 style={{ marginTop: 0 }}>研修ルームに参加</h3>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>ルームID</label>
                  <input
                    type="text"
                    value={loginInput.room}
                    onChange={e => setLoginInput({...loginInput, room: e.target.value})}
                    placeholder="例: mg-tokyo-01"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>プレイヤー名</label>
                  <input
                    type="text"
                    value={loginInput.player}
                    onChange={e => setLoginInput({...loginInput, player: e.target.value})}
                    placeholder="例: 鈴木一郎"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    const cleanRoom = loginInput.room.trim()
                    const cleanPlayer = loginInput.player.trim()
                    if (!cleanRoom || !cleanPlayer) {
                      alert('ルームIDとプレイヤー名を入力してください')
                      return
                    }
                    safeStorage.setItem('mg_ipad_room_id', cleanRoom)
                    safeStorage.setItem('mg_ipad_player_id', cleanPlayer)
                    safeStorage.setItem('mg_ipad_offline_mode', 'false')
                    setRoomId(cleanRoom)
                    setPlayerId(cleanPlayer)
                    setIsOffline(false)
                    setShowLogin(false)
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--color-accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginBottom: '12px'
                  }}
                >
                  参加する
                </button>
                <button
                  onClick={() => {
                    safeStorage.setItem('mg_ipad_offline_mode', 'true')
                    setIsOffline(true)
                    setSyncStatus('オフライン')
                    setShowLogin(false)
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--surface-subtle)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  参加せずにプレイする
                </button>
              </div>
            ) : (
              <div style={{
                padding: '20px',
                background: 'var(--bg-shell)',
                borderRadius: '8px',
                border: '1px solid var(--border-glass)'
              }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>ルームID</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '4px' }}>{roomId}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>プレイヤー名</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '4px' }}>{playerId}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>同期ステータス</div>
                  <div style={{ fontSize: '1rem', color: syncStatus.includes('エラー') ? '#ef4444' : 'var(--mg-green)', marginTop: '4px' }}>{syncStatus}</div>
                </div>
                <button
                  onClick={() => {
                    if(window.confirm('ルーム設定を変更しますか？')) {
                      if (roomId && playerId) {
                        removePlayer(roomId, playerId)
                      }
                      safeStorage.setItem('mg_ipad_room_id', '')
                      safeStorage.setItem('mg_ipad_player_id', '')
                      setRoomId('')
                      setPlayerId('')
                      setShowLogin(true)
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  ルーム変更
                </button>
              </div>
            )}
          </div>
        )
      case 'ledger':
        return (
          <ErrorBoundary>
            <CashLedger
              carryover={currentData.carryover}
              ledger={currentData.ledger}
              onUpdateLedger={(newLedger) => updatePeriodData('ledger', newLedger)}
              results={results}
              currentPeriod={currentPeriod}
              transactionMode={transactionMode}
              setTransactionMode={setTransactionMode}
            />
          </ErrorBoundary>
        )
      case 'statements':
        return (
          <ErrorBoundary>
            <FinancialStatements
              results={results}
              carryover={currentData.carryover}
              currentPeriod={currentPeriod}
              ledger={currentData.ledger}
              onShowPerformance={() => setShowPerformanceReport(true)}
            />
          </ErrorBoundary>
        )
      case 'periodEnd':
        return (
          <ErrorBoundary>
            <PeriodEndWizard
              carryover={currentData.carryover}
              ledger={currentData.ledger}
              actuals={currentData.actuals}
              onUpdateActuals={(newActuals) => updatePeriodData('actuals', newActuals)}
              onUpdateLedger={(newLedger) => updatePeriodData('ledger', newLedger)}
              currentPeriod={currentPeriod}
              results={results}
              onShowPerformance={() => setShowPerformanceReport(true)}
            />
          </ErrorBoundary>
        )
      case 'plan':
        return (
          <ErrorBoundary>
            <ManagementPlan
              budget={currentData.budget}
              carryover={currentData.carryover}
              onUpdateBudget={(newBudget) => updatePeriodData('budget', newBudget)}
              results={results}
            />
          </ErrorBoundary>
        )
      case 'board':
        return (
          <div style={{ padding: '20px', height: '100%' }}>
            <h2 style={{ margin: '0 0 20px 0', color: 'var(--text-primary)' }}>🎮 会社盤</h2>
            <p style={{ color: 'var(--text-secondary)' }}>会社盤は右側パネルに常時表示されています</p>
            <div style={{
              marginTop: '20px',
              padding: '20px',
              background: 'var(--bg-shell)',
              borderRadius: '8px',
              border: '1px solid var(--border-glass)'
            }}>
              <h3 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)' }}>現在の経営状態</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.9rem' }}>
                <div>
                  <div style={{ color: 'var(--text-secondary)' }}>現金</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--mg-blue)' }}>
                    {(results?.bs?.cash || 0).toLocaleString()}万円
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)' }}>純資産</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--mg-green)' }}>
                    {(results?.bs?.totalNetAssets || 0).toLocaleString()}万円
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)' }}>売上</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--mg-pink)' }}>
                    {(results?.pl?.salesRevenue || 0).toLocaleString()}万円
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)' }}>利益</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: (results?.pl?.operatingProfit || 0) >= 0 ? 'var(--mg-green)' : '#ef4444' }}>
                    {(results?.pl?.operatingProfit || 0).toLocaleString()}万円
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'settings':
        return (
          <ErrorBoundary>
            <PriorPeriodCarryover
              carryover={currentData.carryover}
              onUpdateCarryover={(newCarryover) => updatePeriodData('carryover', newCarryover)}
              currentPeriod={currentPeriod}
              periods={periods}
              setCurrentPeriod={setCurrentPeriod}
              rollForwardFromPrevious={rollForwardFromPrevious}
              resetAllData={resetAllData}
            />
          </ErrorBoundary>
        )
      default:
        return null
    }
  }

  return (
    <div className="ipad-layout">
      <TopBar currentPeriod={currentPeriod} theme={theme} toggleTheme={toggleTheme} syncStatus={syncStatus} />
      <div className="main-container">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="main-content">
          {renderContent()}
        </div>
        {/* 会社盤ミニマップ：常時表示 */}
        <div className="minimap-panel">
          <ErrorBoundary>
            <CompanyBoardMinimap carryover={currentData.carryover} results={results} />
          </ErrorBoundary>
        </div>
      </div>

      {showPerformanceReport && (() => {
        const prevData = currentPeriod > 1 ? periods[currentPeriod - 1] : null
        const prevResults = prevData ? calculateFinancials(prevData.carryover, prevData.ledger, prevData.actuals, currentPeriod - 1) : null

        return (
          <ErrorBoundary>
            <PerformanceReport
              ledger={currentData.ledger}
              results={results}
              prevLedger={prevData?.ledger}
              prevResults={prevResults}
              currentPeriod={currentPeriod}
              onClose={() => setShowPerformanceReport(false)}
            />
          </ErrorBoundary>
        )
      })()}
    </div>
  )
}

export default App
