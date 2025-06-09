import "../../App.css";
import "../../css/tools.css";

function ProductTable({
  Products,
  onDelete,
  deleteProductCompletely,
  handlePaymentAmount,
  handlePaymentUpdate,
  changeStatus,
}) {
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
            <th>מס'</th>
            <th>שם</th>
            <th>קטגוריה</th>
            <th>כמות</th>
            <th>יחידת מידה</th>
            <th>כמות מינימלית</th>
            <th>עדכון אחרון</th>
            <th>פעיל</th>
          </tr>
        </thead>
        <tbody>
          {Products.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                אין מוצרים להצגה
              </td>
            </tr>
          ) : (
            Products.map((product, index) => (
              <tr key={product.id || index} className={getRowClass(product)}>
                <td>{product.id || index}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{parseFloat(product.quantity).toFixed(0)}</td>
                <td>{product.unit}</td>
                <td>{parseFloat(product.min_required).toFixed(0)}</td>
                <td>{product.last_updated?.split("T")[0]}</td>

                {Number(product.quantity) > Number(product.min_required)? (
                  ""
                ) : (
                  <td>
                    {product.is_active == 1 ? (
                      <button
                        onClick={(e) => {
                          changeStatus(product.id, 0);
                        }}
                      >
                        כבה
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          changeStatus(product.id, 1);
                        }}
                      >
                        הפעל
                      </button>
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
