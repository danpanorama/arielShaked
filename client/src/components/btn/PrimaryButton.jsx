import "../../App.css";
import "../../css/tools.css";

function PrimaryButton(props) {
  return (
    <div onClick={((e)=>{
      props.click(props.data)
    })} 
    
    className="PrimaryButton">
        {props.text}
   
    </div>
  );
}

export default PrimaryButton;
