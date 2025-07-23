"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./input.module.css";
import Header from "./components/Header";
import DateSection from "./components/DateSection";
import SalesTable from "./components/SalesTable";
import MessageDisplay from "./components/MessageDisplay";
import ButtonSection from "./components/ButtonSection";

export default function InputPage() {
  const router = useRouter();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [salesRows, setSalesRows] = useState([
    { id: 1, paymentType: "", amount: "" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 페이지를 벗어날 때 입력값 초기화
  useEffect(() => {
    const handleBeforeUnload = () => {
      // 페이지 새로고침이나 브라우저 닫기 시 초기화
      resetForm();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // 컴포넌트 언마운트 시 초기화
      resetForm();
    };
  }, []);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleSalesChange = (id, field, value) => {
    setSalesRows(prev =>
      prev.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const addRow = () => {
    const newId = Math.max(...salesRows.map(row => row.id), 0) + 1;
    setSalesRows(prev => [...prev, { id: newId, paymentType: "", amount: "" }]);
  };

  const removeRow = (id) => {
    if (salesRows.length > 1) {
      setSalesRows(prev => prev.filter(row => row.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // 유효한 데이터만 필터링
      const validRows = salesRows.filter(row =>
        row.paymentType && row.amount && parseInt(row.amount) > 0
      );

      if (validRows.length === 0) {
        setMessage("최소 하나의 매출 항목을 입력해주세요.");
        setIsLoading(false);
        return;
      }

      // 매출 데이터를 API 형식으로 변환
      const salesData = {};
      validRows.forEach(row => {
        const type = row.paymentType;
        const amount = parseInt(row.amount);
        if (!salesData[type]) {
          salesData[type] = 0;
        }
        salesData[type] += amount;
      });

      const totalAmount = Object.values(salesData).reduce((sum, value) => sum + value, 0);

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          sales: salesData,
          total: totalAmount
        }),
      });

      if (response.ok) {
        setMessage("매출이 성공적으로 저장되었습니다!");
        // 폼 초기화
        resetForm();
        // 2초 후 메인화면으로 이동
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setMessage("저장 중 오류가 발생했습니다.");
      }
    } catch (error) {
      setMessage("네트워크 오류가 발생했습니다.");
      console.error("Submit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSalesRows([{ id: 1, paymentType: "", amount: "" }]);
    setMessage("");
  };

  const clearForm = () => {
    resetForm();
  };

  const goToMain = () => {
    // 메인화면으로 이동하면서 입력값 초기화
    resetForm();
    router.push('/');
  };

  return (
    <div
      className={styles.container}
      style={{
        width: '1024px',
        height: '768px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Header onGoToMain={goToMain} />

      <form onSubmit={handleSubmit} className={styles.form}>
        <DateSection
          date={date}
          onDateChange={handleDateChange}
        />

        <SalesTable 
          salesRows={salesRows}
          onSalesChange={handleSalesChange}
          onAddRow={addRow}
          onRemoveRow={removeRow}
        />

        <MessageDisplay message={message} />

        <ButtonSection 
          isLoading={isLoading}
          onClearForm={clearForm}
          onSubmit={handleSubmit}
        />
      </form>
    </div>
  );
}
