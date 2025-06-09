const providers = require("../../models/providers");

const addProviderController = async (req, res, next) => {
  try {
    ("Inside Add Provider Route");


    const { name, contact_name,delivery_time, phone, address, email} = req.body;

    if (!name || !contact_name || !phone || !address || !email ) {
      return res.status(400).json({
        error:{message:"יש למלא את כל השדות: שם ספק, איש קשר, טלפון, כתובת, אימייל וסטטוס פעיל."} 
      });
    }
    
    // בדיקה אם ספק עם אותו אימייל כבר קיים
    const existingProvider = await providers.checkIfEmailExists(email);
  
    if (existingProvider[0].length > 0) {
          

      return res.status(400).json({
        error: { message: "כתובת האימייל כבר קיימת במערכת.", header: "הספק כבר קיים" }
      });
    }

    // הכנסת ספק חדש למסד הנתונים
    const insertResult = await providers.insertNewProvider(
      name, contact_name, phone,delivery_time, address, email,
      1
    );

  

    if (insertResult) {   
      const [newProvider] = await providers.checkIfEmailExists(email);
    
      res.json({data:newProvider[0]})    
    }

  } catch (err) {
    console.error("Error during provider creation:", err.message);
    let errorMessage = "שגיאה בעת יצירת ספק חדש.";

    if (err.code === 11000 || err.message.includes("email")) {
      errorMessage = "כתובת האימייל כבר קיימת במערכת.";
    }

    return res.status(400).json({ message: errorMessage,Header:'ggg' });
  }
};

module.exports.addProviderController = addProviderController;
