
import "../../App.css";
import "../../css/tools.css";
import AddProvides from "../providers/AddProvides";
import AddProduct from "../products/AddProducts";
import RemoveProduct from "../products/RemoveProduct";
import AssignProductTiProvider from "../ProvidersProducts/AssignProductTiProvider";
import SignUpEmployee from "../users/SignUpEmployee";
import AddToStock from "../products/AddToStock";
import ReceiveOrderPopup from "../products/ReceiveOrderPopup";

function PopUpGeneral({
   type,
  addStockToProduct,
  handleUpdate,
  addUser,
  users,
  userData,
  isPopUpActive,
  activePopUp,
  handleChange,
  togglePopUp,
  isError,
  userDataState,
  setusersData,
  errorMessages,
  providers,
  addProvider,
  products,
  removeProduct,
  associateProductToProvider,
  deleteProduct,
  refreshProducts,
     setProviderData,
     providerData
}) {
  return (
    <div className={isPopUpActive ? "activeProviderPopUp" : "closeProviderPopUp"}>
      <div className="yellowPopUp">
        {type === "provider" && (
          <AddProvides setProviderData={setProviderData} providerData={providerData } activePopUp={activePopUp} addProvider={addProvider} />
        )}
        {type === "product" && (
          <AddProduct activePopUp={activePopUp} addProvider={addProvider} />
        )}
        {type === "removeProduct" && (
          <RemoveProduct activePopUp={activePopUp} removeProduct={removeProduct}  products={products} />
        )}
        {type === "provider-products" && (
          <AssignProductTiProvider associateProductToProvider={associateProductToProvider} activePopUp={activePopUp} deleteProduct={deleteProduct} />
        )}
        {type === "user" && (
          <SignUpEmployee
            users={users}
            userData={userData}
            handleChange={handleChange}
            signUp={addUser}
            togglePopUp={togglePopUp}
            isError={isError}
            errorMessages={errorMessages}
            usersData={userDataState}
            setusersData={setusersData}
            handleUpdate={handleUpdate}
          />
        )}
         {type === "addStock" && (
        <AddToStock
          products={products}
          addStockToProduct={addStockToProduct}
          activePopUp={activePopUp}
        />
      )}
      {type === "receiveOrder" && (
        <ReceiveOrderPopup
          products={products}
          activePopUp={activePopUp}
          refreshProducts={refreshProducts}
        />
      )}
      </div>
    </div>
  );
}

export default PopUpGeneral;
