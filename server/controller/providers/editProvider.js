const providers = require("../models/providers");

const editProviderController = async (req, res) => {
    try {
        ("Inside Edit Provider Route");
        ('req.body: ', req.body);

        const { id, name, contactPerson, phone, address, email, isActive } = req.body;

        if (!id || !name || !contactPerson || !phone || !address || !email || isActive === undefined) {
            return res.status(400).json({
                message: "All fields are required: id, name, contactPerson, phone, address, email, and isActive.",
            });
        }

        // בדיקה אם הספק קיים במערכת
        let providerExists = await providers.getProviderById(id);
        if (!providerExists) {
            return res.status(404).json({
                error: { message: "ספק לא נמצא במערכת", header: "שגיאה" }
            });
        }

        // עדכון פרטי הספק במסד הנתונים
        let updateProvider = await providers.updateProvider(id, name, contactPerson, phone, address, email, isActive);

        if (updateProvider) {
            return res.status(200).json({
                message: "הספק עודכן בהצלחה",
                provider: await providers.getProviderById(id) // מחזיר את המידע המעודכן
            });
        }

    } catch (err) {
        console.error("Error during provider update:", err.message);
        return res.status(500).json({
            message: "שגיאה בעת עדכון ספק."
        });
    }
};

module.exports.editProviderController = editProviderController;
