import "../../App.css";
import "../../css/tools.css";


function PrimaryButton(props) {
  return (
    <div onClick={((e)=>{
      if(props.click){
        props.click(props.data?props.data:e)
      }
      
    })} 
    
    className="PrimaryButton ">
      <p className="">
        {props.text}
      </p>
         {props.icon ?
        <img src={props.icon} alt="" />
      :''}
   
    </div>
  );
}

export default PrimaryButton;
