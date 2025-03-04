import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios'; // יש להוסיף את axios
import { userCheckAuth } from '../Redux/Actions/userBaseDataAction';

const PrivateRouter = () => {
  const user = useSelector((state) => state.userData);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // הוספת סטייט עבור הצלחת האימות
  const [authSuccess, setAuthSuccess] = useState(null);

  const from = location.state?.from?.pathname || "/dashboard"; // ברירת מחדל: דשבורד

  // פונקציה לבדיקת התחברות
  async function checkAuthOnReload() {
    try {
        const response = await axios.get('/checkAuth', { withCredentials: true }); // שליחה עם credentials כדי להשתמש בעוגיות
    
        if (response.data.success) {
          // אם האימות הצליח, נעדכן את הסטייט
          setAuthSuccess(true);
          navigate(from, { replace: true });
        } else {
          // אם האימות נכשל, נפנה אותו להתחברות
          setAuthSuccess(false);
          navigate('/login', { state: { from: location }, replace: true });
        }
      } catch (error) {
        // במקרה של שגיאה, ניתוב להתחברות
        console.error('Authentication failed:', error.message);
        setAuthSuccess(false);
        navigate('/login', { state: { from: location }, replace: true });
      }
  }

  useEffect(() => {
    // נבצע את הבדיקה בכל טעינה
    checkAuthOnReload();
  }, [user.connect, dispatch, navigate, from]);

  // כאשר הבדיקה עדיין בעיצומה, ניתן להחזיר ספינר/המתנה
  if (authSuccess === null) {
    return <div>טוען...</div>;
  }

  // אם המשתמש מחובר, נראה את התוכן הפנימי של ה־Outlet
  return authSuccess ? <Outlet /> : <Navigate to="/login" state={{ from: location }} />;
}

export default PrivateRouter;
