import "../../App.css";
import "../../css/btn.css";

function CloseButton(props) {
  return (
    <button
      className="closeBtn5"
      onClick={() => {
        props.click();
      }}
    >
      {props.text}
    </button>
  );
}

export default CloseButton;
