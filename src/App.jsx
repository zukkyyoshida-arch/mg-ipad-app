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
import './App.css'
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
    // 初期データ (1期〜5期)
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

  // アクティブなタブ (ledger, statements, periodEnd, plan, settings)
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

  // データの更新関数群
  const updatePeriodData = (field, newData) => {
    setPeriods(prev => ({
      ...prev,
      [currentPeriod]: {
        ...prev[currentPeriod],
        [field]: newData
      }
    }))
  }

  // 全期リセット機能
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

  // 前期の期末決算データから今期の期首データ（繰越）を自動引き継ぎ
  const rollForwardFromPrevious = () => {
    if (currentPeriod <= 1) return
    const prevPeriod = currentPeriod - 1
    const prevData = periods[prevPeriod]
    if (!prevData) return

    // 前期の決算計算結果を取得
    const prevResults = calculateFinancials(prevData.carryover, prevData.ledger, prevData.actuals, prevPeriod)

    const prevBS = prevResults.bs
    const prevMat = prevResults.mat
    const prevWip = prevResults.wip
    const prevProd = prevResults.prod
    const prevMach = prevResults.machines

    // B/S残高を引き継ぎ（次期に必要な全情報を網羅）
    const nextCarryover = {
      // 現金
      cash: prevBS.cash,
      // 棚卸資産
      materialsCount: prevMat.endingCount,
      materialsValue: prevMat.endingValue,
      wipCount: prevWip.endingCount,
      wipValue: prevWip.endingValue,
      productCount: prevProd.endingCount,
      productValue: prevProd.endingValue,
      // 機械設備
      largeMachines: prevMach.large,
      smallMachines: prevMach.small,
      attachments: prevMach.attachments,
      machinesCount: prevMach.large + prevMach.small,
      machinesValue: prevBS.fixedAssets,
      // 負債
      loan: prevBS.loans,
      receivables: prevBS.receivables,
      payables: prevBS.payables,
      taxes: prevBS.unpaidTax, // 未払法人税等
      // 純資産
      retainedEarnings: prevBS.retainedEarnings,
      capital: prevBS.capital,
      // 人員
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
      alert(`第${currentPeriod}期の期首データを自動設定しました！「設定」タブから内訳を確認・修正できます。`)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
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
          <ErrorBoundary>
            <CompanyBoardMinimap carryover={currentData.carryover} results={results} />
          </ErrorBoundary>
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
      <TopBar currentPeriod={currentPeriod} theme={theme} toggleTheme={toggleTheme} />
      <div className="main-container">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="main-content">
          {renderContent()}
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
