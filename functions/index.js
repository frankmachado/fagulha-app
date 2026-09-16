const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

// Inicializa o SDK de Administrador do Firebase
admin.initializeApp();

/**
 * Cloud Function: Validar e atualizar perfil/selos de usuário com segurança no servidor.
 */
exports.setUserBadge = onRequest({ cors: true }, async (req, res) => {
	try {
		const { userId, badgeType } = req.body;

		if (!userId || !badgeType) {
			return res.status(400).json({ success: false, error: "userId e badgeType são obrigatórios." });
		}

		// Atualiza diretamente no Firestore usando credenciais de Admin
		await admin.firestore().collection("users").doc(userId).set({
			badge: badgeType,
			updatedAt: admin.firestore.FieldValue.serverTimestamp()
		}, { merge: true });

		return res.status(200).json({
			success: true,
			message: `Selo '${badgeType}' atribuído com sucesso ao usuário!`
		});
	} catch (error) {
		console.error("Erro na Cloud Function:", error);
		return res.status(500).json({ success: false, error: error.message });
	}
});
