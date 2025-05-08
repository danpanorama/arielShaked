import "../../App.css";
import "../../css/tools.css";

function ProductTable({ Products, onDelete }) {

  return (
    <table className="tables">
      <thead>
        <tr>
          <th >מס'</th>
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
            
            <tr key={product.id || index}>
              <td>{product.id || index}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.quantity}</td>
              <td>{product.unit}</td>
              <td>{product.min_required}</td>
              <td>{product.last_updated?.split('Z')}</td>
              <td>{product.is_active ? "כן" : "לא"}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default ProductTable;
