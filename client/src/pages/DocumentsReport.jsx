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

function formatDate(dateStr) {
  if (!dateStr) return "";
  return dateStr.replace("T", " ").replace("Z", "").slice(0, 16);
}

const headersMap = {
  id: "מספר מוצר",

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
    last_updated:"עדכון אחרון",
    unit:"יחידת מידה ",
  product_name: "שם מוצר אפייה",
  total_orders: "מספר הזמנות",
  total_units: "כמות יחידות",
  total_open_orders: "סך הכל הזמנות פתוחות",
  total_order_value: "סך כל הערך",
  total_paid: "סך כל ששולם",
  total_remaining_to_pay: "סכום לתשלום",
  unpaid_received_orders: "הזמנות לא משולמות שהתקבלו",
  unpaid_received_total: "סכום לא משולם בהזמנות שהתקבלו",
  is_approved:'האם התקבל למלאי',
  product_id:"מספר מוצר",
};

function translateHeader(key) {
  return headersMap[key] || key;
}

function DocumentsReport() {
  const [reportData, setReportData] = useState(null);
  const [reportData2, setReportData2] = useState(null);
  const [orders, setOrders] = useState(null);
  const [avregeTime, setAvrageTime] = useState(0);
  const [summary, setSummary] = useState(null);
  const [reportTitle, setReportTitle] = useState("");

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
          setReportData(response.data.summary);
         

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


  
  const renderOrdersTable = (orders) => (
  <table className="report-table">
    <thead>
      <tr>
        {Object.keys(orders[0]).map((key) => (
          <th key={key}>{translateHeader(key)}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {orders.map((order, index) => (
        <tr key={index}>
          {Object.entries(order).map(([key, value], i) => (
            <td key={i}>
              
              {key.toLowerCase().includes("date") || key === "created_at"
                ? formatDate(value)
                : typeof value === "boolean"
                ? value ? "✔️" : "❌"
                : (value === 1 || value === 0) && key.toLowerCase() !== "id"
                ? value === 1 ? "כן" : "לא"
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
            <RemovalPieChart data={reportData} />

            {/* {renderTable(reportData)} */}
            {/* <button className="exelbtn" onClick={downloadExcel} style={{ marginTop: "20px" }}>
              הורד לאקסל
            </button> */}
          </>
        )}

        {reportTitle === "דוח סיכום הזמנות אפייה" && reportData && (
            <div>
              <p className="text">זמן ממוצע להזמנה: {avregeTime.time}</p>
            </div>
        )}


        {reportTitle && <h2 className="report-subtitle">{reportTitle}</h2>}

        {reportTitle === "דוח חוסרים במלאי" && reportData && (
          <InventoryPieChart data={reportData} products={reportData2} />
        )}



        {reportData && Array.isArray(reportData) && reportData.length > 0 ? (
          <>
         

            {renderTable(reportData)}

            <button className="exelbtn" onClick={downloadExcel} style={{ marginTop: "20px" }}>
              הורד לאקסל
            </button>
          </>
        ) : reportData ? (
          <p className="report-empty">אין תוצאות להצגה בדוח זה.</p>
        ) : null}

    

        <div className="summary-cont">
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



        



        <br />
        <br />

        {orders && orders.length > 0 ? (
          <>
          
            <OrdersPieCharts orders={orders} />
            
            <h3>פרטי כל ההזמנות שלא נסגרו:</h3>
            {renderOrdersTable(orders)}
            <button className="exelbtn" onClick={downloadExcel} style={{ marginTop: "20px" }}>
              הורד הזמנות לאקסל
            </button>
          </>
        ) : orders ? (
          <p className="report-empty">אין הזמנות פתוחות להצגה.</p>
        ) : null}




      </div>
    </div>
  );
}

export default DocumentsReport;



// import "../App.css";
// import SideNavBar from "../components/sidenav/SideNavBar";
// import "../css/documentReports.css";
// import { useState } from "react";
// import axiosInstance from "../config/AxiosConfig";
// import InventoryPieChart from "../components/charts/InventoryPieCharts";
// import OrdersPieCharts from "../components/charts/OrdersPieCharts";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import SummaryBarChart from "../components/charts/SummaryBarChart";
// import PreparationTimeBarChart from "../components/charts/PreparationTimeBarChart";
// import RemovalPieChart from "../components/charts/RemovalPieChart";
// import HosarioBaMlay from "../components/charts/HosarioBaMlay";
// import Gor from "../components/charts/Gor";

// function formatDate(dateStr) {
//   if (!dateStr) return "";
//   return dateStr.replace("T", " ").replace("Z", "").slice(0, 16);
// }

// const headersMap = {
//   id: "מספר מוצר",
//   name: "שם מוצר",
//   unit: " יחידת מידה",
//   category: "  קטגוריה",
//   quantity: "כמות",
//   min_required: "כמות מינימום",
//   last_updated: "עדכון אחרון ",
//   is_active: "פעיל",
//   product_id: "מספר מוצר",
//   provider_name: "ספק",
//   created_at: "תאריך יצירה",
//   price: "מחיר",
//   reason: "סיבה",
//   withdrawn_at: "מתי יצא מהמלאי",
//   amount_paid: "סכום ששולם",
//   is_received: "התקבל",
//   is_paid: "שולם",
//   product_name: "שם מוצר אפייה",
//   total_orders: "מספר הזמנות",
//   total_units: "כמות יחידות",
//   total_open_orders: "סך הכל הזמנות פתוחות",
//   total_order_value: "סך כל הערך",
//   total_paid: "סך כל ששולם",
//   total_remaining_to_pay: "סכום לתשלום",
//   unpaid_received_orders: "הזמנות לא משולמות שהתקבלו",
//   unpaid_received_total: "סכום לא משולם בהזמנות שהתקבלו",
// };

// function translateHeader(key) {
//   return headersMap[key] || key;
// }

// function DocumentsReport() {
//   const [reportData, setReportData] = useState(null);
//   const [reportData2, setReportData2] = useState(null);
//   const [Wid, seytWid] = useState(false);

//   const [orders, setOrders] = useState(null);
//   const [avregeTime, setAvrageTime] = useState(0);
//   const [summary, setSummary] = useState(null);
//   const [reportTitle, setReportTitle] = useState("");

//   const fetchReport = async (type) => {
//     try {
//       let response;
//       switch (type) {
//         case "inventory":
//           response = await axiosInstance.get("/reports/inventory-zero");
      
//           setReportTitle("דוח חוסרים במלאי");
//           setReportData(response.data.data);
//           setReportData2(response.data.products);
//           setOrders(null);
//           setSummary(null);
//           seytWid(false);
//           break;
//         case "orders":
//           response = await axiosInstance.get("/reports/open-orders");
   
//           setReportTitle("דוח הזמנות פתוחות");
//           setOrders(response.data.orders || []);
//           setSummary(response.data.summary || null);
//           setReportData(null);

//           seytWid(false);
//           break;
//         case "withdrawals":
//           response = await axiosInstance.get("/reports/removal-history-chart");
//           setReportTitle("היסטוריית הוצאה מהמלאי");
//           seytWid(true);
//           setReportData(response.data.history);
//           setOrders(null);

//           setSummary(null);
//           break;

//         case "bakery":
//           response = await axiosInstance.get("/reports/bakery-summary");
//           seytWid(false);

//           console.log("🍞 Bakery summary data:", response.data); // בדיקת אפייה
//           setReportTitle("דוח סיכום הזמנות אפייה");
//           // setReportData(response.data);
//           setReportData(response.data.summary);

//           setAvrageTime({
//             time: response.data.average_preparation_time,
//             second: response.data.average_seconds,
//           });

//           setOrders(null);
//           setSummary(null);
//           break;
//         default:
//           return;
//       }
//     } catch (err) {
//       console.error("❌ שגיאה בשליפת הדוח:", err.message);
//       setReportData([{ error: "אירעה שגיאה בטעינת הדוח." }]);
//       setOrders(null);
//       setSummary(null);
//     }
//   };

//   const prepareExcelData = (data) => {
//     return data.map((item) => {
//       const translatedItem = {};
//       for (const key in item) {
//         const translatedKey = translateHeader(key);
//         let value = item[key];
//         if (key.toLowerCase().includes("date") || key === "created_at") {
//           value = formatDate(value);
//         }
//         translatedItem[translatedKey] = value;
//       }
//       return translatedItem;
//     });
//   };

//   const downloadExcel = () => {
//     let dataToExport = reportData || orders;
//     if (
//       !dataToExport ||
//       !Array.isArray(dataToExport) ||
//       dataToExport.length === 0
//     )
//       return;

//     const formattedData = prepareExcelData(dataToExport);
//     const worksheet = XLSX.utils.json_to_sheet(formattedData);
//     const workbook = XLSX.utils.book_new();
//     const range = XLSX.utils.decode_range(worksheet["!ref"]);
//     const tableRef = XLSX.utils.encode_range(range);
//     worksheet["!autofilter"] = { ref: tableRef };

//     XLSX.utils.book_append_sheet(workbook, worksheet, "דוח");
//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });
//     const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(blob, `${reportTitle || "דוח"}.xlsx`);
//   };

//   const renderTable = (data) => (
//     <table className="report-table">
//       <thead>
//         <tr>
//           {Object.keys(data[0]).map((key) => (
//             <th key={key}>{translateHeader(key)}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((item, index) => (
//           <tr key={index}>
//             {Object.entries(item).map(([key, value], i) => (
//               <td key={i}>
//                 {key.toLowerCase().includes("date") || key === "created_at"
//                   ? formatDate(value)
//                   : String(value)}
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );

//   return (
//     <div className="report-container providersContainer">
//       <SideNavBar />
//       <div className="report-content">
//         <h1 className="report-title">מערכת דוחות</h1>
//         <div className="report-buttons">
//           <button onClick={() => fetchReport("inventory")}>חוסרים במלאי</button>
//           <button onClick={() => fetchReport("orders")}>
//             דוח הזמנות פתוחות
//           </button>
//           <button onClick={() => fetchReport("bakery")}>
//             דוח סיכום הזמנות אפייה
//           </button>
//           <button onClick={() => fetchReport("withdrawals")}>
//             היסטוריית הוצאה מהמלאי
//           </button>
//         </div>

//         {/* {reportData2? 
        
//         <HosarioBaMlay data={reportData} />
//       :""} */}

//         {reportTitle && <h2 className="report-subtitle">{reportTitle}</h2>}

//         {reportTitle === "דוח חוסרים במלאי" && reportData && (
//           <div className="o">
//               <InventoryPieChart data={reportData} products={reportData2} />



//           </div>
        
//         )}


//         <div className="summary-cont">
//           {summary && (
//             <div className="report-summary">
//               <h3>טבלת סיכום:</h3>
//               <table className="summary-table">
//                 <tbody>
//                   {Object.entries(summary).map(([key, value]) => (
//                     <tr key={key}>
//                       <td className="summary-key">{translateHeader(key)}</td>
//                       <td className="summary-value">{String(value)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//           {summary && (
//             <div className="report-summary">
//               <div className="summary-table">
//                 <SummaryBarChart summary={summary} />
//               </div>
//             </div>
//           )}
//         </div>
//         <br />
//         <br />

//         {orders && orders.length > 0 ? (
//           <>
//             <OrdersPieCharts orders={orders} />
//             <h3>פרטי כל ההזמנות שלא נסגרו:</h3>
//             {renderTable(orders)}
//             <button className="exelbtn" onClick={downloadExcel} style={{ marginTop: "20px" }}>
//               הורד הזמנות לאקסל
//             </button>
//           </>
//         ) : orders ? (
//           <p className="report-empty">אין הזמנות פתוחות להצגה.</p>
//         ) : null}

//         {reportTitle === "היסטוריית הוצאה מהמלאי" && reportData && (
//           <>
//             <RemovalPieChart data={reportData} />

//             {renderTable(reportData)}
//             <button className="exelbtn" onClick={downloadExcel} style={{ marginTop: "20px" }}>
//               הורד לאקסל
//             </button>
//           </>
//         )}










































































// {/* z=doh sicom hazmanot afiya 
//  */}


 
//         {reportData && Array.isArray(reportData) && reportData.length > 0 ? (
//           <>
//             <br />
//             <div>
//               {reportTitle === "דוח סיכום הזמנות אפייה" && avregeTime ? (
//                 <p className="text">זמן ממוצע להזמנה: {avregeTime.time}</p>
//               ) : null}
//             </div>
//             <br />
//             {/* כאן הדיאגרמה */}

//             {renderTable(reportData)}

//             <button className="exelbtn" onClick={downloadExcel} style={{ marginTop: "20px" }}>
//               הורד לאקסל
//             </button>
//           </>
//         ) : reportData ? (
//           <p className="report-empty">אין תוצאות להצגה בדוח זה.</p>
//         ) : null}






//       </div>

//     </div>
//   );
// }

// export default DocumentsReport;
