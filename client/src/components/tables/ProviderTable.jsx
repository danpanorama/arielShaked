import "../../App.css";
import "../../css/tools.css";

function ProviderTable({ providers, onDelete,deleteProvider }) {
  return (
    <table>
      <thead>
        <tr>
          <th>מספר ספק</th>
          <th>שם ספק</th>
          <th>שם איש קשר</th>
          <th>מס' טלפון</th>
          <th>כתובת</th>
          <th>מייל</th>
          <th>פעיל</th>
          <th>מחק</th>

        </tr>
      </thead>
      <tbody>
        {providers.length === 0 ? (
          <tr>
            <td colSpan="7" style={{ textAlign: "center" }}>
              אין ספקים להצגה
            </td>
          </tr>
        ) : (
          providers.map((provider, index) => (
            <tr key={provider.id || index}>
              <td>{provider.id || index + 1}</td>
              <td>{provider.name}</td>
              <td>{provider.contact_name}</td>
              <td>{provider.phone_number}</td>
              <td>{provider.address}</td>
              <td>{provider.email}</td>
              <td>{provider.is_active ? "כן" : "לא"}</td>
              <td><button onClick={(()=>{
                deleteProvider(provider.id)
              })} > מחק</button></td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default ProviderTable;
