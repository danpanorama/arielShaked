import '../App.css';
import SideNavBar from '../components/sidenav/SideNavBar';
import '../css/documentReports.css';
import { useState } from 'react';
import axiosInstance from '../config/AxiosConfig';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function formatDate(dateStr) {
  if (!dateStr) return '';
  // הופך מ-ISO "2024-06-12T14:30:00Z" ל-"2024-06-12 14:30"
  return dateStr.replace('T', ' ').replace('Z', '').slice(0, 16);
}

// מילון כותרות בעברית לכל שדה בדוחות
const headersMap = {
  // inventory
  id: 'מספר מוצר',
  name: 'שם מוצר',
  quantity: 'כמות',
  min_required: 'כמות מינימום',
  is_active: 'פעיל',

  // open orders
  provider_name: 'ספק',
  created_at: 'תאריך יצירה',
  price: 'מחיר',
  amount_paid: 'סכום ששולם',
  is_received: 'התקבל',
  is_paid: 'שולם',

  // bakery summary
  product_name: 'שם מוצר אפייה',
  total_orders: 'מספר הזמנות',
  total_units: 'כמות יחידות',

  // summary fields
  total_open_orders: 'סך הכל הזמנות פתוחות',
  total_order_value: 'סך כל הערך',
  total_paid: 'סך כל ששולם',
  total_remaining_to_pay: 'סכום לתשלום',
  unpaid_received_orders: 'הזמנות לא משולמות שהתקבלו',
  unpaid_received_total: 'סכום לא משולם בהזמנות שהתקבלו',
  
};

function translateHeader(key) {
  return headersMap[key] || key;
}

function DocumentsReport() {
  const [reportData, setReportData] = useState(null);
  const [orders, setOrders] = useState(null);
  const [summary, setSummary] = useState(null);
  const [reportTitle, setReportTitle] = useState('');

  const fetchReport = async (type) => {
    try {
      let response;
      switch (type) {
        case 'inventory':
          response = await axiosInstance.get('/reports/inventory-zero');
          setReportTitle("דוח חוסרים במלאי");
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

  // פונקציה להצגת שדות בטבלה, עם טיפול מיוחד בתאריך
  const renderTable = (data) => (
    <table className="report-table">
      <thead>
        <tr>
          {Object.keys(data[0]).map((key) => (
            <th key={key}>{translateHeader(key)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {Object.entries(item).map(([key, value], i) => (
              <td key={i}>
                {key.toLowerCase().includes('date') || key === 'created_at'
                  ? formatDate(value)
                  : String(value)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

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

        {/* דוח inventory או bakery */}
        {reportData && Array.isArray(reportData) && reportData.length > 0 ? (
          <>
            {renderTable(reportData)}
            <button onClick={downloadExcel} style={{ marginTop: '20px' }}>
              הורד לאקסל
            </button>
          </>
        ) : reportData ? (
          <p className="report-empty">אין תוצאות להצגה בדוח זה.</p>
        ) : null}

        {/* דוח הזמנות פתוחות */}
        {orders && orders.length > 0 ? (
          <>
            <h3>פרטי כל ההזמנות שלא נסגרו:</h3>
            {renderTable(orders)}
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
                    <td className="summary-key">{translateHeader(key)}</td>
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
