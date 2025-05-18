import "../../App.css";
import "../../css/tools.css";

function ProviderTable({ providers, onDelete,deleteProvider,changeStatus }) {
  return (
    <table className="tables">
      <thead>
        <tr>
          <th>מספר ספק</th>
          <th>שם ספק</th>
          <th>שם איש קשר</th>
          <th>מס' טלפון</th>
          <th>כתובת</th>
          <th>מייל</th>
          <th>הפעלה \ הקפאה</th>
       

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
              <td>{provider.is_active ? <button onClick={((e)=>{
                changeStatus(provider,0)
              })}>כבה</button> : <button onClick={((e)=>{
                changeStatus(provider,1)
              })}>הפעל</button>}</td>
              {/* <td><button onClick={(()=>{
                deleteProvider(provider.id)
              })} > מחק</button></td> */}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default ProviderTable;
