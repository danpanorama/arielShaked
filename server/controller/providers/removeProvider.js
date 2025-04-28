const providers = require("../../models/providers");

const removeProviderController = async (req, res) => {
    try {
        ("Inside Remove Provider Route");
        ('req.body: ', req.body);

        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                message: "יש לספק מזהה ספק (id) למחיקה.",
            });
        }

        // בדיקה אם הספק קיים
        let providerExists = await providers.getProvidersById(id);
        if (!providerExists) {
            return res.status(404).json({
                error: { message: "ספק לא נמצא במערכת", header: "שגיאה" }
            });
        }

        // מחיקת הספק מהמסד
        let deleteProvider = await providers.deleteProviderById(id);

        if (deleteProvider) {
            return res.status(200).json({
                message: "הספק נמחק בהצלחה",
                providerId: id
            });
        }

    } catch (err) {
        console.error("Error during provider deletion:", err.message);
        return res.status(500).json({
            message: "שגיאה בעת מחיקת ספק."
        });
    }
};

module.exports.removeProviderController = removeProviderController;
