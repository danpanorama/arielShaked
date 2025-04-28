

// import "../../App.css";
// import "../../css/tools.css";
// import AddProvides from "../providers/AddProvides";

// function PopUpGeneral(props) {


//   return (
//    <div  className={props.activeProvidersPopUp?"activeProviderPopUp":'closeProviderPopUp'}>
  

//   <div className="yellowPopUp">
//     <AddProvides  activePopUp={props.activePopUp} addProvider={props.addProvider}/>
//   </div>

//    </div>
//   );
// }

// export default PopUpGeneral;
import "../../App.css";
import "../../css/tools.css";
import AddProvides from "../providers/AddProvides";
import AddProduct from "../products/AddProducts";
import RemoveProduct from "../products/RemoveProduct";
import AssignProductTiProvider from "../ProvidersProducts/AssignProductTiProvider";

function PopUpGeneral({ type, activePopUp, isPopUpActive,providers, addProvider,products,removeProduct,deleteProduct,associateProductToProvider }) {
  return (
    <div className={isPopUpActive ? "activeProviderPopUp" : "closeProviderPopUp"}>
      <div className="yellowPopUp">
        {type === "provider" && (
          <AddProvides activePopUp={activePopUp} addProvider={addProvider} />
        )}
        {type === "product" && (
          <AddProduct activePopUp={activePopUp} addProvider={addProvider} />
        )}
        {type === "removeProduct" && (
          <RemoveProduct activePopUp={activePopUp} deleteProduct={deleteProduct} products={products} />
        )}
           {type === "provider-products" && (
          <AssignProductTiProvider associateProductToProvider={associateProductToProvider}  activePopUp={activePopUp} deleteProduct={deleteProduct}  />
        )}




      </div>
 
    </div>
  );
}

export default PopUpGeneral;
