import { useSelector } from "react-redux";

function UserTable({ users, onDelete, onActiveUsers, myUserId }) {
  const userID = useSelector((state) => state.user);
  return (
    <table className="tables">
      <thead>
        <tr>
          <th>שם מלא</th>
          <th>טלפון</th>
          <th>אימייל</th>
          <th>סיסמה</th>

          <th> תפקיד</th>
          <th> פעיל</th>
        </tr>
      </thead>
      <tbody>
        {users && users.length === 0 ? (
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
                <td>
                  {user.name}

                  {user.id == userID.user.id ? "*" : ""}
                </td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>********</td>

                <td>
                  {user.permissions === 0
                    ? "עובד מאפייה"
                    : user.permissions === 1
                    ? "עובד חנות"
                    : user.permissions === 2
                    ? "עוזר מנהל"
                    : user.permissions === 4
                    ? "מנהל"
                    : "לא מוגדר"}
                </td>

                {/* <td>{user.is_active == 1 ? 'משתמש פעיל':'משתמש חסום'}</td> */}

                <td>
                  {user.id !== userID.user.id &&
                    !isCurrentUser &&
                    (user.is_active === 1 ? (
                      <button onClick={() => onActiveUsers(user.id, 0)}>
                        {" "}
                        כבה{" "}
                      </button>
                    ) : (
                      <button onClick={() => onActiveUsers(user.id, 1)}>
                        {" "}
                        הפעל{" "}
                      </button>
                    ))}
                </td>

                {/* <td>

                    {user.id !=userID.user.id && !isCurrentUser && (
                      <button onClick={() => onDelete(user.id)}>מחק לגמרי</button>
                    )}
                 
                  </td> */}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}

export default UserTable;
