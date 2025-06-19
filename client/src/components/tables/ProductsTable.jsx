import "../../App.css";
import "../../css/tools.css";
import { useState } from "react";
import { sortArray } from "../../components/tools/sort";

function ProductTable({
  Products,
  onDelete,
  deleteProductCompletely,
  handlePaymentAmount,
  handlePaymentUpdate,
  changeStatus,
}) {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedProducts = sortArray(Products, sortField, sortOrder);

  const getRowClass = (product) => {
    if (!product.is_active) return "inactive-row";
    const quantity = parseFloat(product.quantity);
    const minRequired = parseFloat(product.min_required);
    if (quantity < minRequired) return "low-stock";
    return "";
  };

  return (
    <div className="product-table-container">
      <div className="legend">
        <p className="write">מקרא:</p>
        <span className="legend-item red">חסר במלאי</span>
        <span className="legend-item gray"> לא פעיל</span>
      </div>

      <table className="tables">
        <thead>
          <tr>
          <th onClick={() => handleSort("id")}>מס'</th>
            <th onClick={() => handleSort("name")}>
              שם {sortField === "name" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
            </th>
            <th onClick={() => handleSort("category")}>
              קטגוריה {sortField === "category" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
            </th>
            <th onClick={() => handleSort("quantity")}>
              כמות {sortField === "quantity" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
            </th>
            <th>יחידת מידה</th>
            <th onClick={() => handleSort("min_required")}>
              כמות מינימלית {sortField === "min_required" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
            </th>
            <th onClick={() => handleSort("last_updated")}>
              עדכון אחרון {sortField === "last_updated" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
            </th>
            <th>פעיל</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                אין מוצרים להצגה
              </td>
            </tr>
          ) : (
            sortedProducts.map((product, index) => (
              <tr key={product.id || index} className={getRowClass(product)}>
                <td>{product.id || index}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{parseFloat(product.quantity).toFixed(0)}</td>
                <td>{product.unit}</td>
                <td>{parseFloat(product.min_required).toFixed(0)}</td>
                <td>{product.last_updated?.split("T")[0]}</td>

                {Number(product.quantity) > Number(product.min_required) ? (
                  ""
                ) : (
                  <td>
                    {product.is_active === 1 ? (
                      <button onClick={() => changeStatus(product.id, 0)}>כבה</button>
                    ) : (
                      <button onClick={() => changeStatus(product.id, 1)}>הפעל</button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
