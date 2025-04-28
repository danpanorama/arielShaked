import axiosInstance from "../../config/AxiosConfig";
import { ERROR } from "../../redux/contents/errContent";

export async function FetchData(url) {
  try {
    const response = await axiosInstance.get(url, { withCredentials: true });
    return response.data;
  } catch (err) {
    console.error(`שגיאה בשליפת נתונים מ-${url}`, err);
    return [];
  }
}


  // פונקציה כללית לשימוש חוזר
  // export const getFromServer = async (url, setter, errorMsg, errorHeader) => {
  //   try {
  //     const response = await axiosInstance.get(url, {
  //       withCredentials: true,
  //     });
  //     setter(response.data);
  //   } catch (e) {
  //     dispatch({
  //       type: ERROR,
  //       data: {
  //         message: e?.response?.data?.message || errorMsg,
  //         header: errorHeader,
  //       },
  //     });
  //   }
  // };



  export const getFromServer = async (
    url,
    setter,
    errorMsg,
    errorHeader,
    dispatch,
    customConfig = {}
  ) => {
    try {
      const response = await axiosInstance.get(url, {
        withCredentials: true,
        ...customConfig,
      });
      setter(response.data);
    } catch (e) {
      dispatch({
        type: ERROR,
        data: {
          message: e?.response?.data?.message || errorMsg,
          header: errorHeader,
        },
      });
    }
  };
  