import '../App.css';
import SideNavBar from '../components/sidenav/SideNavBar';
import '../css/documentReports.css';
import { useState } from 'react';
import axiosInstance from '../config/AxiosConfig';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function DocumentsReport() {
  const [reportData, setReportData] = useState(null);
  const [orders, setOrders] = useState(null);           // חדש - הזמנות פתוחות
  const [summary, setSummary] = useState(null);
  const [reportTitle, setReportTitle] = useState('');

  const fetchReport = async (type) => {
    try {
      let response;
      switch (type) {
        case 'inventory':
          response = await axiosInstance.get('/reports/inventory-zero');
          setReportTitle('דוח מלאי 0-');
          setReportData(response.data);
          setOrders(null);
          setSummary(null);
          break;
        case 'orders':
          response = await axiosInstance.get('/reports/open-orders');
          setReportTitle('דוח הזמנות פתוחות');
          setOrders(response.data.orders || []);
          setSummary(response.data.summary || null);
          setReportData(null);
          break;
        case 'bakery':
          response = await axiosInstance.get('/reports/bakery-summary?from=2024-01-01&to=2025-01-01');
          setReportTitle('דוח סיכום הזמנות אפייה');
          setReportData(response.data);
          setOrders(null);
          setSummary(null);
          break;
        default:
          return;
      }
    } catch (err) {
      console.error('שגיאה בשליפת הדוח:', err.message);
      setReportData([{ error: 'אירעה שגיאה בטעינת הדוח.' }]);
      setOrders(null);
      setSummary(null);
    }
  };

  const downloadExcel = () => {
    let dataToExport = reportData || orders;
    if (!dataToExport || !Array.isArray(dataToExport) || dataToExport.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, `${reportTitle || 'report'}.xlsx`);
  };

  return (
    <div className="report-container providersContainer">
      <SideNavBar />
      <div className="report-content ">
        <h1 className="report-title">מערכת דוחות</h1>

        <div className="report-buttons">
          <button onClick={() => fetchReport('inventory')}>חוסרים במלאי</button>
          <button onClick={() => fetchReport('orders')}>דוח הזמנות פתוחות</button>
          <button onClick={() => fetchReport('bakery')}>דוח סיכום הזמנות אפייה</button>
        </div>

        {reportTitle && <h2 className="report-subtitle">{reportTitle}</h2>}

        {/* טבלה לדוחות מסוג inventory או bakery */}
        {reportData && Array.isArray(reportData) && reportData.length > 0 ? (
          <>
            <table className="report-table">
              <thead>
                <tr>
                  {Object.keys(reportData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, index) => (
                  <tr key={index}>
                    {Object.values(item).map((value, i) => (
                      <td key={i}>{String(value)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={downloadExcel} style={{ marginTop: '20px' }}>
              הורד לאקסל
            </button>
          </>
        ) : reportData ? (
          <p className="report-empty">אין תוצאות להצגה בדוח זה.</p>
        ) : null}

        {/* טבלה לדוח הזמנות פתוחות */}
        {orders && orders.length > 0 ? (
          <>
            <h3>פרטי כל ההזמנות שלא נסגרו:</h3>
            <table className="report-table">
              <thead>
                <tr>
                  {Object.keys(orders[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={idx}>
                    {Object.values(order).map((val, i) => (
                      <td key={i}>{String(val)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={downloadExcel} style={{ marginTop: '20px' }}>
              הורד הזמנות לאקסל
            </button>
          </>
        ) : orders ? (
          <p className="report-empty">אין הזמנות פתוחות להצגה.</p>
        ) : null}

        {/* טבלת סיכום */}
        {summary && (
          <div className="report-summary">
            <h3>טבלת סיכום:</h3>
            <table className="summary-table">
              <tbody>
                {Object.entries(summary).map(([key, value]) => (
                  <tr key={key}>
                    <td className="summary-key">{key}</td>
                    <td className="summary-value">{String(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentsReport;
