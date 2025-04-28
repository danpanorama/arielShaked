import "../../App.css";
import "../../css/tools.css";

function ProvidersProductTable({ providersProductArray, onDelete }) {

  return (
    <table>
      <thead>
        <tr>
          <th>מספר מזהה</th>
          <th>מספר פריט</th>
          <th>שם פריט</th>
     
          <th>מספר ספק </th>
          <th> שם ספק</th>
          <th> מחיר</th>
          <th>זמן אספקה משוער </th>
          <th>  כמות מינימלית </th>

        </tr>
      </thead>
      <tbody>
        {providersProductArray?.length === 0 ? (
          <tr>
            <td colSpan="8" style={{ textAlign: "center" }}>
              אין מוצרים להצגה
            </td>
          </tr>
        ) : (
          providersProductArray?.map((product, index) => (
            
            <tr key={product.id || index}>
              <td>{product.id || index}</td>
              <td>{product.item_number}</td>
              <td>{product.name}</td>
              <td>{product.provider_id}</td>
              <td>{product.price}</td>
              <td>{product.estimated_delivery_time}</td>
              <td>{product.min_order_quantity}</td>
              <td>{product.is_active ? "כן" : "לא"}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default ProvidersProductTable;
