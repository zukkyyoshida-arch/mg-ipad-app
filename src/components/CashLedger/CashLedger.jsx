import React, { useState } from 'react'
import { CATEGORIES } from '../../utils/calculations'

export default function CashLedger({ carryover, ledger, onUpdateLedger, results, currentPeriod }) {
  const [voucherNo, setVoucherNo] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('キ')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')

  const categoryEntries = Object.entries(CATEGORIES).map(([code, info]) => ({
    code,
    name: info.label || info.name || '不明',
    requiresQuantity: false
  }))

  // 科目の入力フォーム動的変更
  const currentCategoryInfo = categoryEntries.find(c => c.code === selectedCategory)

  const handleAddTransaction = () => {
    if (!voucherNo || !selectedCategory || (!quantity && currentCategoryInfo?.requiresQuantity) || !price) {
      alert('必須項目を入力してください')
      return
    }

    const qty = currentCategoryInfo?.requiresQuantity ? parseInt(quantity) : 0
    const priceVal = parseInt(price)
    const amount = qty * priceVal

    const newTransaction = {
      id: Date.now(),
      voucherNo,
      category: selectedCategory,
      quantity: qty,
      price: priceVal,
      amount
    }

    onUpdateLedger([...ledger, newTransaction])

    // フォームリセット
    setVoucherNo('')
    setQuantity('')
    setPrice('')
    setSelectedCategory('キ')
  }

  const handleDeleteTransaction = (id) => {
    if (window.confirm('この取引を削除しますか？')) {
      onUpdateLedger(ledger.filter(t => t.id !== id))
    }
  }

  // iPad レスポンシブレイアウト
  const isLandscape = window.innerWidth > window.innerHeight

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      flexDirection: isLandscape ? 'row' : 'column',
      gap: '20px',
      padding: '20px',
      overflow: 'hidden'
    }}>
      {/* 左側: 入力フォーム */}
      <div style={{
        width: isLandscape ? '30%' : '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflowY: 'auto',
        paddingRight: isLandscape ? '0' : '0'
      }}>
        <h3 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)' }}>取引を追加</h3>

        {/* 伝票番号 */}
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>伝票番号</label>
          <input
            type="text"
            value={voucherNo}
            onChange={(e) => setVoucherNo(e.target.value)}
            placeholder="例: V001"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid var(--border-glass)',
              borderRadius: '6px',
              fontSize: '1rem',
              background: 'var(--bg-shell)',
              color: 'var(--text-primary)',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* 勘定科目 */}
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>勘定科目</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid var(--border-glass)',
              borderRadius: '6px',
              fontSize: '1rem',
              background: 'var(--bg-shell)',
              color: 'var(--text-primary)',
              boxSizing: 'border-box'
            }}
          >
            {categoryEntries.map(cat => (
              <option key={cat.code} value={cat.code}>
                {cat.code} - {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 数量（科目に応じて表示） */}
        {currentCategoryInfo?.requiresQuantity && (
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>数量</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid var(--border-glass)',
                borderRadius: '6px',
                fontSize: '1rem',
                background: 'var(--bg-shell)',
                color: 'var(--text-primary)',
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}

        {/* 単価 */}
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {currentCategoryInfo?.requiresQuantity ? '単価' : '金額'}
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid var(--border-glass)',
              borderRadius: '6px',
              fontSize: '1rem',
              background: 'var(--bg-shell)',
              color: 'var(--text-primary)',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* 金額表示 */}
        {currentCategoryInfo?.requiresQuantity && quantity && price && (
          <div style={{
            padding: '12px',
            background: 'var(--surface-subtle)',
            borderRadius: '6px',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>金額:</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--mg-blue)' }}>
              {(parseInt(quantity) * parseInt(price)).toLocaleString()}万円
            </div>
          </div>
        )}

        {/* ボタン */}
        <button
          onClick={handleAddTransaction}
          style={{
            padding: '12px',
            background: 'var(--mg-blue)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: 'auto'
          }}
        >
          取引を追加する
        </button>
      </div>

      {/* 右側: 取引履歴リスト */}
      <div style={{
        width: isLandscape ? '70%' : '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        overflowY: 'auto'
      }}>
        <h3 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)' }}>
          取引履歴 ({ledger.length}件)
        </h3>

        {ledger.length === 0 ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: 'var(--text-secondary)'
          }}>
            <p>取引がまだ登録されていません</p>
          </div>
        ) : (
          ledger.map((transaction, idx) => (
            <div
              key={transaction.id}
              style={{
                padding: '12px',
                background: 'var(--bg-shell)',
                border: '1px solid var(--border-glass)',
                borderRadius: '6px',
                display: 'grid',
                gridTemplateColumns: '60px 60px 1fr 100px 40px',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.9rem'
              }}
            >
              <div style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                {idx + 1}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {transaction.voucherNo}
              </div>
              <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                {transaction.category} - {CATEGORIES[transaction.category]?.label || CATEGORIES[transaction.category]?.name || '不明'}
              </div>
              <div style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--mg-blue)' }}>
                {transaction.amount.toLocaleString()}
              </div>
              <button
                onClick={() => handleDeleteTransaction(transaction.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0'
                }}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
