import "../App.css";
import SideNavBar from "../components/sidenav/SideNavBar";
import "../css/documentReports.css";
import { useState } from "react";
import axiosInstance from "../config/AxiosConfig";
import InventoryPieChart from "../components/charts/InventoryPieCharts";
import OrdersPieCharts from "../components/charts/OrdersPieCharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import SummaryBarChart from "../components/charts/SummaryBarChart";
import PreparationTimeBarChart from "../components/charts/PreparationTimeBarChart";
import RemovalPieChart from "../components/charts/RemovalPieChart";
import OpenOrderChart from "../components/charts/OpenOrderChart";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return dateStr.replace("T", " ").replace("Z", "").slice(0, 16);
}

const headersMap = {
  id: "מספר מוצר",
  orderId: "מספר הזמנה",
  name: "שם מוצר",
  quantity: "כמות",
  min_required: "כמות מינימום",
  is_active: "פעיל",
  provider_name: "ספק",
  created_at: "תאריך יצירה",
  price: "מחיר",
  reason: "סיבה",
  withdrawn_at: "תאריך יציאה מהמלאי",
  amount_paid: "סכום ששולם",
  is_received: "התקבל",
  is_paid: "שולם",
  category: "קטגוריה",
  total_units_with_unit: "כמות",
  last_updated: "עדכון אחרון",
  unit: "יחידת מידה ",
  product_name: "שם מוצר אפייה",
  total_orders: "מספר הזמנות",
  total_units: "כמות ",
  total_open_orders: "סך הכל הזמנות פתוחות (שעדיין לא שולמו אך התקבלו)",
  total_order_value: "סך כל הערך",
  total_paid: "סך כל ששולם",
  total_remaining_to_pay: "סכום לתשלום",
  unpaid_received_orders: "הזמנות לא משולמות שהתקבלו",
  unpaid_received_total: "סכום לא משולם בהזמנות שהתקבלו",
  is_approved: "האם התקבל למלאי",
  product_id: "מספר מוצר",
  total_unapproved_orders: "הזמנות שלא התקבלו למלאי",
};

function translateHeader(key) {
  return headersMap[key] || key;
}

function DocumentsReport() {
  const [reportData, setReportData] = useState(null);
  const [reportData2, setReportData2] = useState(null);
  const [reportData3, setReportData3] = useState(null);
  const [orders, setOrders] = useState(null);
  const [unApproveOrders, setunApproveOrder] = useState(null);
  const [avregeTime, setAvrageTime] = useState(0);
  const [summary, setSummary] = useState(null);
  const [reportTitle, setReportTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const moneyKeys = [
    "total_order_value",
    "total_paid",
    "total_remaining_to_pay",
    "unpaid_received_total",
  ];

  const handleDateSearch = async () => {
    if (!startDate || !endDate) {
      alert("יש לבחור גם תאריך התחלה וגם תאריך סיום.");
      return;
    }

    try {
      const response = await axiosInstance.post("/reports/bakery-time-order", {
        from: startDate,
        to: endDate,
      });

      console.log("🍞 Bakery summary filtered:", response.data.orders);

      setReportData3(response.data.orders);
    } catch (err) {
      console.error("❌ שגיאה בחיפוש לפי תאריכים:", err.message);
    }
  };

  const handleDateSearch2 = async () => {
    if (!startDate || !endDate) {
      alert("יש לבחור גם תאריך התחלה וגם תאריך סיום.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/reports/removal-history-chart-bet",
        {
          from: startDate,
          to: endDate,
        }
      );

      setReportData(response.data.orders);
      setOrders(null);
      setSummary(null);

      console.log(response.data);
    } catch (err) {
      console.error("❌ שגיאה בחיפוש לפי תאריכים:", err.message);
    }
  };

  const fetchReport = async (type) => {
    try {
      let response;
      switch (type) {
        case "inventory":
          response = await axiosInstance.get("/reports/inventory-zero");
          console.log("📦 Inventory report data:", response.data.data); // בדיקת נתוני מלאי
          setReportTitle("דוח חוסרים במלאי");
          setReportData(response.data.data);
          setReportData2(response.data.products);
          setOrders(null);
          setSummary(null);
          break;
        case "orders":
          response = await axiosInstance.get("/reports/open-orders");
          console.log("📦 Orders data:::::::-----------------:", response.data);
          console.log("📦 Orders data:", response.data.orders); // בדיקת הזמנות
          console.log("📊 Summary data:", response.data.summary); // בדיקת סיכום
          setReportTitle("דוח הזמנות פתוחות");         
          setOrders(response.data.orders || []);    
          setunApproveOrder(response.data.unApproveOrder[0]);
          setSummary(response.data.summary || null);
          setReportData(null);
          break;
        case "withdrawals":
          response = await axiosInstance.get("/reports/removal-history-chart");
          setReportTitle("היסטוריית הוצאה מהמלאי");
          setReportData(response.data.history);
          setOrders(null);
          setSummary(null);
          break;

        case "bakery":
          response = await axiosInstance.get("/reports/bakery-summary");
          console.log("🍞 Bakery summary data:", response.data); // בדיקת אפייה
          setReportTitle("דוח סיכום הזמנות אפייה");

          // setReportData(response.data);
          setReportData(null);
          setReportData3(response.data.summary);
          setAvrageTime({
            time: response.data.average_preparation_time,
            second: response.data.average_seconds,
          });

          setOrders(null);
          setSummary(null);
          break;
        default:
          return;
      }
    } catch (err) {
      console.error("❌ שגיאה בשליפת הדוח:", err.message);
      setReportData([{ error: "אירעה שגיאה בטעינת הדוח." }]);
      setOrders(null);
      setSummary(null);
    }
  };

  const prepareExcelData = (data) => {
    return data.map((item) => {
      const translatedItem = {};
      for (const key in item) {
        const translatedKey = translateHeader(key);
        let value = item[key];
        if (key.toLowerCase().includes("date") || key === "created_at") {
          value = formatDate(value);
        }
        translatedItem[translatedKey] = value;
      }
      return translatedItem;
    });
  };

  const downloadExcel = () => {
    let dataToExport = reportData || orders;
    if (
      !dataToExport ||
      !Array.isArray(dataToExport) ||
      dataToExport.length === 0
    )
      return;

    const formattedData = prepareExcelData(dataToExport);
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    const tableRef = XLSX.utils.encode_range(range);
    worksheet["!autofilter"] = { ref: tableRef };

    XLSX.utils.book_append_sheet(workbook, worksheet, "דוח");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${reportTitle || "דוח"}.xlsx`);
  };

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
                {key.toLowerCase().includes("date") || key === "created_at"
                  ? formatDate(value)
                  : String(value)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderOrdersTable = (orders) => {
    console.log(orders,"fafafafafafafafaff")
    const filteredOrders = orders.filter(
      (order) => !order.is_paid && !order.is_received
    );

    if (filteredOrders.length === 0) return <p>אין הזמנות מתאימות להצגה</p>;

    return (
      <table className="report-table">
        <thead>
          <tr>
            {Object.keys(filteredOrders[0]).map((key) => (
              <th key={key}>{translateHeader(key)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => (
            <tr key={index}>
              {Object.entries(order).map(([key, value], i) => (
                <td key={i}>
                  {key.toLowerCase().includes("date") || key === "created_at"
                    ? formatDate(value)
                    : typeof value === "boolean"
                    ? value
                      ? "✔️"
                      : "❌"
                    : (value === 1 || value === 0) &&
                      key.toLowerCase() !== "orderid"
                    ? value === 1
                      ? "כן"
                      : "לא"
                    : String(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };



  const renderOrdersTable2 = (orders) => {
  

    const filteredOrders = orders.filter(
      (order) =>  Number(order.amount_paid) < Number(order.price) 
    );
  console.log(filteredOrders , "gdgfdgdgdgd")
    if (filteredOrders.length === 0) return <p>אין הזמנות מתאימות להצגה</p>;

    return (
      <table className="report-table">
        <thead>
          <tr>
            {Object.keys(filteredOrders[0]).map((key) => (
              <th key={key}>{translateHeader(key)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => (
            <tr key={index}>
              {Object.entries(order).map(([key, value], i) => (
                <td key={i}>
                  {key.toLowerCase().includes("date") || key === "created_at"
                    ? formatDate(value)
                    : typeof value === "boolean"
                    ? value
                      ? "✔️"
                      : "❌"
                    : (value === 1 || value === 0) &&
                      key.toLowerCase() !== "orderid"
                    ? value === 1
                      ? "כן"
                      : "לא"
                    : String(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="report-container providersContainer">
      <SideNavBar />
      <div className="report-content">
        <h1 className="report-title">מערכת דוחות</h1>
        <div className="report-buttons">
          <button onClick={() => fetchReport("inventory")}>חוסרים במלאי</button>
          <button onClick={() => fetchReport("orders")}>
            דוח הזמנות פתוחות
          </button>
          <button onClick={() => fetchReport("bakery")}>
            דוח סיכום הזמנות אפייה
          </button>
          <button onClick={() => fetchReport("withdrawals")}>
            היסטוריית הוצאה מהמלאי
          </button>
        </div>

        {reportTitle === "היסטוריית הוצאה מהמלאי" && reportData && (
          <>

            {reportTitle && <h2 className="report-subtitle">{reportTitle}</h2>}
            <div className="flexRow">
              <label htmlFor="start-date">מתאריך</label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

              <label htmlFor="end-date">עד תאריך</label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />

              <button onClick={handleDateSearch2}>חפש</button>
            </div>

       

            <RemovalPieChart data={reportData} />


          </>
        )}

        {reportTitle === "דוח סיכום הזמנות אפייה" && reportData3 && (
          <>

            {reportTitle && <h2 className="report-subtitle">{reportTitle}</h2>}
            <p className="text">⏱️ זמן ממוצע להזמנה: {avregeTime.time}</p>

            <div className="flexRow">
              <label htmlFor="start-date">מתאריך</label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

              <label htmlFor="end-date">עד תאריך</label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />

              <button onClick={handleDateSearch}>חפש</button>
            </div>

            {Array.isArray(reportData3) && reportData3.length > 0 ? (
              <>
                {renderTable(reportData3)}
                <button
                  className="exelbtn"
                  onClick={downloadExcel}
                  style={{ marginTop: "20px" }}
                >
                  הורד לאקסל
                </button>
              </>
            ) : (
              <p className="report-empty">אין תוצאות להצגה בדוח זה.</p>
            )}
          </>
        )}

      
        {reportTitle === "דוח חוסרים במלאי" && reportData && (
          <InventoryPieChart data={reportData} products={reportData2} />
        )}

        {reportData && Array.isArray(reportData) && reportData.length > 0 ? (
          <>
            {renderTable(reportData)}

            <button
              className="exelbtn"
              onClick={downloadExcel}
              style={{ marginTop: "20px" }}
            >
              הורד לאקסל
            </button>
          </>
        ) : reportData ? (
          <p className="report-empty">אין תוצאות להצגה בדוח זה.</p>
        ) : null}

        {orders && orders.length > 0 ? (
          <>
            <div className="flexRow">
              <div className="report-summary">
                <OrdersPieCharts orders={orders} />
              </div>
              <div className="report-summary">
                <OpenOrderChart orders={orders} />
              </div>
            </div>
            <div className="summary-cont">
              {summary && (
                <div className="report-summary">
                  <h3>טבלת סיכום הזמנות שהתקבלו אך לא שולמו:</h3>
                  <table className="summary-table">
                    <tbody>
                      {Object.entries(summary).map(([key, value]) => (
                        <tr key={key}>
                          <td className="summary-key">
                            {translateHeader(key)}
                          </td>
                          <td className="summary-value">
                            {moneyKeys.includes(key)
                              ? `${Number(value).toLocaleString()} ש"ח`
                              : String(value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {unApproveOrders && (
                <div className="report-summary mr2">
                  <h3>טבלת סיכום הזמנות שלא התקבלו למלאי :</h3>
                  <table className="summary-table">
                    <tbody>
                      {Object.entries(unApproveOrders).map(([key, value]) => (
                        <tr key={key}>
                          <td className="summary-key">
                            {translateHeader(key)}
                          </td>
                          <td className="summary-value">
                            {[
                              "total_order_value",
                              "total_paid",
                              "total_remaining_to_pay",
                              "unpaid_received_total",
                            ].includes(key)
                              ? `${Number(value).toLocaleString()} ש״ח`
                              : String(value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <br />

            <h3>פרטי כל ההזמנות שלא נסגרו:</h3>

  <h1> את צריכה לראות את השינוי הזה  </h1>

            {renderOrdersTable2(orders)}

            <button
              className="exelbtn"
              onClick={downloadExcel}
              style={{ marginTop: "20px" }}
            >
              הורד הזמנות לאקסל
            </button>
          </>
        ) : orders ? (
          <p className="report-empty">אין הזמנות פתוחות להצגה.</p>
        ) : null}

        <br />
        <br />
      </div>
    </div>
  );
}

export default DocumentsReport;
