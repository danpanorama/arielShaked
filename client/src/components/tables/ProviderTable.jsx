import React, { useState } from "react";
import "../../App.css";
import "../../css/tools.css";

function ProviderTable({ providers, onDelete, deleteProvider, changeStatus }) {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedProviders = [...providers].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });

  // פונקציה שמחזירה את החץ הנכון
  const renderSortArrow = (field) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  return (
    <table className="tables">
      <thead>
        <tr>
          <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
            מספר ספק{renderSortArrow("id")}
          </th>
          <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
            שם ספק{renderSortArrow("name")}
          </th>
          <th>שם איש קשר</th>
          <th>מס' טלפון</th>
          <th>כתובת</th>
          <th>מייל</th>
          <th>הפעלה \ הקפאה</th>
        </tr>
      </thead>
      <tbody>
        {sortedProviders.length === 0 ? (
          <tr>
            <td colSpan="7" style={{ textAlign: "center" }}>
              אין ספקים להצגה
            </td>
          </tr>
        ) : (
          sortedProviders.map((provider, index) => (
            <tr
              key={provider.id || index}
              className={provider.is_active ? "" : "inactive-row"}
            >
              <td>{provider.id || index + 1}</td>
              <td>{provider.name}</td>
              <td>{provider.contact_name}</td>
              <td>{provider.phone_number}</td>
              <td>{provider.address}</td>
              <td>{provider.email}</td>
              <td>
                {provider.is_active ? (
                  <button onClick={() => changeStatus(provider, 0)}>כבה</button>
                ) : (
                  <button onClick={() => changeStatus(provider, 1)}>הפעל</button>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default ProviderTable;
