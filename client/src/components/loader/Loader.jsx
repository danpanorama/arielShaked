import { useSelector } from "react-redux";
import "../../css/loader.css";

function Loader() {

    const loader = useSelector((state) => state.loader);

  return (
    <div className={loader.Loader?"loader":'stopLoading'}>
        <div className="loaderBox">
            loading
        </div>

    </div>
  );
}

export default Loader;
