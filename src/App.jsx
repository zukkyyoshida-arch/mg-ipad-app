import React, { useState, useEffect } from 'react'
import { calculateFinancials, DEFAULT_PERIOD_DATA } from './utils/calculations'
import './App.css'
import TopBar from './components/Layout/TopBar'
import Sidebar from './components/Layout/Sidebar'
import Dashboard from './components/Dashboard/Dashboard'
import CashLedger from './components/CashLedger/CashLedger'
import FinancialStatements from './components/FinancialStatements/FinancialStatements'
import ManagementPlan from './components/ManagementPlan/ManagementPlan'
import PriorPeriodCarryover from './components/PriorPeriodCarryover/PriorPeriodCarryover'

// 安全な localStorage ラッパー
const safeStorage = {
  getItem: (key) => {
    try { return localStorage.getItem(key) } catch (e) { return null }
  },
  setItem: (key, value) => {
    try { localStorage.setItem(key, value) } catch (e) {}
  }
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  // テーマ状態
  const [theme, setTheme] = useState(() => {
    const saved = safeStorage.getItem('mg_ipad_theme')
    return saved || 'dark'
  })

  // 全期（1-5期）のデータ管理
  const [periods, setPeriods] = useState(() => {
    const saved = safeStorage.getItem('mg_ipad_periods_data')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse periods data', e)
      }
    }
    // 初期データ生成
    const initialData = {}
    for (let i = 1; i <= 5; i++) {
      initialData[i] = JSON.parse(JSON.stringify(DEFAULT_PERIOD_DATA))
    }
    return initialData
  })

  // 現在の期（1-5）
  const [currentPeriod, setCurrentPeriod] = useState(() => {
    const saved = safeStorage.getItem('mg_ipad_current_period')
    return saved ? Number(saved) : 1
  })

  // テーマ切り替え処理
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    safeStorage.setItem('mg_ipad_theme', theme)
  }, [theme])

  // データ変更時に localStorage に保存
  useEffect(() => {
    safeStorage.setItem('mg_ipad_periods_data', JSON.stringify(periods))
  }, [periods])

  useEffect(() => {
    safeStorage.setItem('mg_ipad_current_period', String(currentPeriod))
  }, [currentPeriod])

  // 現在の期のデータを取得
  const currentData = periods[currentPeriod] || JSON.parse(JSON.stringify(DEFAULT_PERIOD_DATA))

  // リアルタイム財務計算
  const results = calculateFinancials(currentData.carryover, currentData.ledger, currentData.actuals, currentPeriod)

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
      setActiveTab('dashboard')
    }
  }

  // 前期末データから今期期首データを自動引き継ぎ
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
        return <Dashboard periods={periods} currentPeriod={currentPeriod} results={results} />
      case 'financialStatements':
        return <FinancialStatements results={results} carryover={currentData.carryover} currentPeriod={currentPeriod} ledger={currentData.ledger} />
      case 'ledger':
        return <CashLedger carryover={currentData.carryover} ledger={currentData.ledger} onUpdateLedger={(newLedger) => updatePeriodData('ledger', newLedger)} results={results} currentPeriod={currentPeriod} />
      case 'plan':
        return <ManagementPlan budget={currentData.budget} carryover={currentData.carryover} onUpdateBudget={(newBudget) => updatePeriodData('budget', newBudget)} results={results} />
      case 'settings':
        return <PriorPeriodCarryover carryover={currentData.carryover} onUpdateCarryover={(newCarryover) => updatePeriodData('carryover', newCarryover)} currentPeriod={currentPeriod} periods={periods} setCurrentPeriod={setCurrentPeriod} rollForwardFromPrevious={rollForwardFromPrevious} resetAllData={resetAllData} />
      default:
        return null
    }
  }

  return (
    <div className="ipad-layout">
      <TopBar currentPeriod={currentPeriod} theme={theme} toggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} />
      <div className="main-container">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="main-content">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default App
