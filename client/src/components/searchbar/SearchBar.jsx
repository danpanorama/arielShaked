import "../../App.css";
import SideNavBar from "../../components/sidenav/SideNavBar";
import "../../css/tools.css";
import Icon from '../../images/search1.svg'

function SearchBar({ onSearch }) {
  return (
    <div className="positionPlace">
      <input type="text" placeholder="חיפוש"  onChange={(e) => onSearch(e.target.value)} className="SearchBarReal" />
      <div className="searchIcon">
        <img src={Icon} alt="" className="searchIconPosition" />
    
      </div>
    </div>
  );
}

export default SearchBar;
