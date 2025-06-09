import "../../App.css";
import "../../css/tools.css";

function ProvidersProductTable({ providersProductArray, onDelete,handlePaymentUpdate,handlePaymentAmount }) {

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
              <td>{product.name } </td>
              <td>{product.item_number}</td>
              <td>{product.provider_id}</td>
              <td>
                 <input  onChange={handlePaymentAmount} type="text"placeholder={product.price} /><button onClick={((e)=>{handlePaymentUpdate(product)})}>שלח</button>
              </td>
              <td>{product.min_order_quantity?.split(".")[0]}</td>
         
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default ProvidersProductTable;
