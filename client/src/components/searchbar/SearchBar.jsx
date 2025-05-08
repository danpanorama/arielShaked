import "../../App.css";
import SideNavBar from "../../components/sidenav/SideNavBar";
import "../../css/tools.css";

function SearchBar({ onSearch }) {
  return (
    <div className="">
      <input type="text" placeholder="חיפוש"  onChange={(e) => onSearch(e.target.value)} className="SearchBar" />
      <div className="searchIcon">
        {/* <svg
          width="31"
          height="31"
          viewBox="0 0 31 31"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="31" height="31" fill="url(#pattern0_17_1208)" />
          <defs>
            <pattern
              id="pattern0_17_1208"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <use
                href="#image0_17_1208"
                transform="translate(0 -0.0301205) scale(0.0120482)"
              />
            </pattern>
            <image
              id="image0_17_1208"
              width="83"
              height="88"
              preserveAspectRatio="none"
              href="data:image/png;base64,..."
            />
          </defs>
        </svg> */}
      </div>
    </div>
  );
}

export default SearchBar;
