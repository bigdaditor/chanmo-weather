"use client";

import styles from "../input.module.css";

export default function SalesTable({ 
  salesRows, 
  onSalesChange, 
  onAddRow, 
  onRemoveRow 
}) {
  const getTotalAmount = () => {
    return salesRows
      .filter(row => row.paymentType && row.amount && parseInt(row.amount) > 0)
      .reduce((sum, row) => sum + parseInt(row.amount), 0);
  };

  return (
    <div className={styles.salesSection}>
      <div className={styles.salesHeader}>
        <h2>매출 입력</h2>
        <button 
          type="button" 
          onClick={onAddRow} 
          className={styles.addRowButton}
        >
          + 행 추가
        </button>
      </div>
      
      <div className={styles.salesTable}>
        <div className={styles.tableHeader}>
          <div className={styles.headerPaymentType}>매출처</div>
          <div className={styles.headerAmount}>금액</div>
          <div className={styles.headerAction}>삭제</div>
        </div>
        
        {salesRows.map((row) => (
          <div key={row.id} className={styles.salesRow}>
            <div className={styles.paymentTypeCell}>
              <select
                value={row.paymentType}
                onChange={(e) => onSalesChange(row.id, "paymentType", e.target.value)}
                required
                className={styles.paymentTypeSelect}
              >
                <option value="">매출처 선택</option>
                <option value="cash">현금</option>
                <option value="card">카드</option>
                <option value="onnuri">온누리상품권</option>
                <option value="delivery">배달</option>
                <option value="other">기타</option>
              </select>
            </div>
            
            <div className={styles.amountCell}>
              <input
                type="number"
                value={row.amount}
                onChange={(e) => onSalesChange(row.id, "amount", e.target.value)}
                placeholder="0"
                min="0"
                required
                className={styles.amountInput}
              />
            </div>
            
            <div className={styles.actionCell}>
              {salesRows.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveRow(row.id)}
                  className={styles.removeButton}
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 총 매출 표시 */}
      <div className={styles.totalSection}>
        <div className={styles.totalAmount}>
          <span>총 매출:</span>
          <span className={styles.totalValue}>
            {getTotalAmount().toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
} 