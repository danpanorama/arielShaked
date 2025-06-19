import { useSelector } from "react-redux";
import { useState } from "react";
import "../../css/forms.css";

function UserTable({ users, onDelete, onActiveUsers, myUserId, onRowClick }) {
  const userID = useSelector((state) => state.user);

  const [sortBy, setSortBy] = useState(null); // 'name' or 'permissions'
  const [sortDirection, setSortDirection] = useState("asc"); // 'asc' or 'desc'

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const sortedUsers = [...(users || [])].sort((a, b) => {
    if (!sortBy) return 0;

    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // עבור שם, השווה כטקסט
    if (sortBy === "name") {
      aValue = aValue?.toLowerCase?.() || "";
      bValue = bValue?.toLowerCase?.() || "";
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <table className="tables">
      <thead>
        <tr>
          <th
            onClick={() => handleSort("name")}
            style={{ cursor: "pointer" }}
            title="לחץ למיון לפי שם"
          >
            שם מלא {sortBy === "name" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
          </th>
          <th>טלפון</th>
          <th>אימייל</th>
          <th>סיסמה</th>
          <th
            onClick={() => handleSort("permissions")}
            style={{ cursor: "pointer" }}
            title="לחץ למיון לפי תפקיד"
          >
            תפקיד {sortBy === "permissions" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
          </th>
          <th>פעיל</th>
        </tr>
      </thead> 
      <tbody>
        {sortedUsers.length === 0 ? (
          <tr>
            <td colSpan="7" style={{ textAlign: "center" }}>
              אין משתמשים להצגה
            </td>
          </tr>
        ) : (
          sortedUsers.map((user, index) => {
            const isCurrentUser = user.id === userID.user.id;

            return (
              <tr
                key={user.id || index}
                className={`table-row ${user.is_active === 0 ? "bggray" : ""}`}  
               
                style={{
                  backgroundColor: isCurrentUser ? "#d4edda" : "",
                }}
              >
                <td  onClick={() => onRowClick(user)}>
                  {user.name}
                  {user.id === userID.user.id ? "*" : ""}
                </td>
                <td  onClick={() => onRowClick(user)}>{user.phone}</td>
                <td  onClick={() => onRowClick(user)}>{user.email}</td>
                <td  onClick={() => onRowClick(user)}>{user.password}</td>
                <td  onClick={() => onRowClick(user)}>
                  {user.permissions === 0
                    ? "עובד אפייה"
                    : user.permissions === 1
                    ? "עובד חנות"
                    : user.permissions === 2
                    ? "עוזר מנהל"
                    : user.permissions === 4
                    ? "מנהל"
                    : "לא מוגדר"}
                </td>
                <td>
                  {user.id !== userID.user.id &&
                    !isCurrentUser &&
                    (user.is_active === 1 ? (
                      <button onClick={() => onActiveUsers(user.id, 0)}>כבה</button>
                    ) : (
                      <button onClick={() => onActiveUsers(user.id, 1)}>הפעל</button>
                    ))}
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
