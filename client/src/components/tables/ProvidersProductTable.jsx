import "../../App.css";
import "../../css/tools.css";

function ProvidersProductTable({ providersProductArray, onDelete,handlePaymentUpdate,handlePaymentAmount,handleMinQtyUpdate,handleMinQtyChange }) {

  return (
    <table className="tables">
      <thead>
        <tr>
          <th>שם ספק </th>
          <th>שם פריט</th>
          <th>מספר פריט</th>
          <th>מספר ספק </th>
          <th>מחיר</th>
          <th>כמות מינימלית לאספקה </th>
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
  <td>{product.provider_name || index}</td>
  <td>{product.name}</td>
  <td>{product.item_number}</td>
  <td>{product.provider_id}</td>
  <td>
    <input
      onChange={handlePaymentAmount}
      type="text"
      placeholder={product.price}
    />
    <button onClick={() => handlePaymentUpdate(product)}>עדכן מחיר</button>
  </td>
  <td>
    <input
      type="number"
      placeholder={product.min_order_quantity?.split(".")[0]}
      onChange={(e) => handleMinQtyChange(e, product)}
    />
    <button onClick={() => handleMinQtyUpdate(product)}>עדכן כמות מינ'</button>
  </td>
</tr>

          ))
        )}
      </tbody>
    </table>
  );
}

export default ProvidersProductTable;
