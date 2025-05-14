import { useEffect, useState } from 'react';
import '../App.css';
import SignUp from '../components/entering/SignUp';
import '../css/entering.css';
import Login from './Login';
import axiosInstance from '../config/AxiosConfig';
import { ERROR } from '../redux/contents/errContent';
import { useDispatch } from 'react-redux';

function Entering() {
  const dispatch = useDispatch();
  const [hasAdmin, setHasAdmin] = useState(null); // null = עדיין לא בדקנו

  useEffect(() => {
    getAllUsers();
  }, []);

  async function getAllUsers() {
    try {
      const response = await axiosInstance.get('/users', { withCredentials: true});
      console.log(response)

      if (response.data.error) {
        dispatch({
          type: ERROR,
          data: { message: 'שגיאה במשיכת משתמשים', header: 'קבלת כל המשתמשים נכשלה' },
        });
        return;
      }

      const users = response.data.users || [];
      
      
     const adminExists = users.some((user) => user.permissions === 4);

      setHasAdmin(adminExists);

    } catch (e) {
      dispatch({
        type: ERROR,
        data: { message: 'שגיאה במשיכת משתמשים', header: 'קבלת כל המשתמשים נכשלה' },
      });
    }
  }

  if (hasAdmin === null) return null; // או טוען...
  
  return (
    <div className="">
      {hasAdmin ? <Login /> : <SignUp />}
    </div>
  );
}

export default Entering;
