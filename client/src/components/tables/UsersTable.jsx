import { useSelector } from "react-redux";

function UserTable({ users, onDelete, onRevokePermission, myUserId }) {
   const userID = useSelector((state)=> state.user)
  return ( 
      <table className="tables">
        <thead>
          <tr>
            <th>מספר משתמש</th>
            <th>שם מלא</th>
            <th>אימייל</th>
            <th>טלפון</th>
            <th>הרשאות</th>
            <th>ביטול הרשאה</th>
            <th>מחק</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                אין משתמשים להצגה
              </td>
            </tr>
          ) : (
            users.map((user, index) => {
              const isCurrentUser = user.id === userID.user.id;
              
              return (
                <tr

                  key={user.id || index}
                  style={{
                    backgroundColor: isCurrentUser ? "#d4edda" : "transparent", // ירוק בהיר למשתמש הנוכחי
                  }}
                >
                  <td>{user.id || index + 1}</td>
                  <td>{user.name}
                  
                    {user.id ==userID.user.id?"*":"" }
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.permissions}</td>
                  <td>
         
                    {!isCurrentUser && (
                     <div>
                       <button className={user.permissions == 'user' ? "activeButton":""} onClick={() => onRevokePermission(user.id,"user")}>
                       כללי
                      </button>
                      <button className={user.permissions == 'admin' ? "activeButton":""} onClick={() => onRevokePermission(user.id,"admin")}>
                       מנהל
                      </button>
                      {/* <button  onClick={() => onRevokePermission(user.id)}>
                       בכיר
                      </button> */}
                     </div>
                    )}
                  </td>
                 
                  <td>

                    {user.id !=userID.user.id && !isCurrentUser && (
                      <button onClick={() => onDelete(user.id)}>מחק</button>
                    )}
                 
                  </td>

                </tr>
              );
            })
          )}
        </tbody>
      </table>
    );
  }
  
  export default UserTable;
  