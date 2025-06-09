import '../App.css';
import SideNavBar from '../components/sidenav/SideNavBar';
import '../css/documentReports.css'; // ניצור אותו עוד רגע
import { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../config/AxiosConfig';

function DocumentsReport() {
  const [reportData, setReportData] = useState(null);
  const [reportTitle, setReportTitle] = useState('');

  const fetchReport = async (type) => {
    try {
      let response;
      switch (type) {
        case 'inventory':
          response = await axiosInstance.get('/reports/inventory-zero');
          setReportTitle('דוח מלאי 0-');
          break;
        case 'orders':
          response = await axiosInstance.get('/reports/open-orders');
          setReportTitle('דוח הזמנות פתוחות');
          break;
        case 'bakery':
          response = await axiosInstance.get('/reports/bakery-summary?from=2024-01-01&to=2025-01-01');
          setReportTitle('דוח סיכום הזמנות אפייה');
          break;
        default:
          return;
      }
      setReportData(response.data);
    } catch (err) {
      console.error('שגיאה בשליפת הדוח:', err.message);
      setReportData([{ error: 'אירעה שגיאה בטעינת הדוח.' }]);
    }
  };

  return (
    <div className="report-container providersContainer">
      <SideNavBar />
      <div className="report-content ">
        <h1 className="report-title">מערכת דוחות</h1>

        <div className="report-buttons">
          <button onClick={() => fetchReport('inventory')}>דוח מלאי 0-</button>
          <button onClick={() => fetchReport('orders')}>דוח הזמנות פתוחות</button>
          <button onClick={() => fetchReport('bakery')}>דוח סיכום הזמנות אפייה</button>
        </div>

        {reportTitle && <h2 className="report-subtitle">{reportTitle}</h2>}

     {Array.isArray(reportData) && reportData.length > 0 ? (
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
) : (
  <p className="report-empty">אין תוצאות להצגה בדוח זה.</p>
)}


     {reportData && reportData.summary && (
  <div className="report-summary">
    <h3>טבלת סיכום:</h3>
    <table className="summary-table">
      <tbody>
        {Object.entries(reportData.summary).map(([key, value]) => (
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
   