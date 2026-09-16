const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Cloud Function: Valida o Token do chamador e atribui selos com segurança.
 */
exports.setUserBadge = onRequest({ cors: true }, async (req, res) => {
	try {
		// 1. Extrai o token de autenticação do cabeçalho
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ success: false, error: "Não autorizado. Token de autenticação ausente." });
		}

		const idToken = authHeader.split("Bearer ")[1];
    
		// 2. Valida o Token JWT no Firebase Auth
		const decodedToken = await admin.auth().verifyIdToken(idToken);
		const callerUid = decodedToken.uid;

		// 3. Regra de Autorização: Verifica se o chamador tem permissão de Admin no Firestore
		const callerDoc = await admin.firestore().collection("users").doc(callerUid).get();
		const isCallerAdmin = callerDoc.exists && callerDoc.data().role === "admin";

		if (!isCallerAdmin) {
			return res.status(403).json({ success: false, error: "Acesso negado. Apenas administradores podem atribuir selos." });
		}

		// 4. Executa a alteração caso o chamador seja um Admin validado
		const { userId, badgeType } = req.body;
		if (!userId || !badgeType) {
			return res.status(400).json({ success: false, error: "userId e badgeType são obrigatórios." });
		}

		await admin.firestore().collection("users").doc(userId).set({
			badge: badgeType,
			updatedAt: admin.firestore.FieldValue.serverTimestamp()
		}, { merge: true });

		return res.status(200).json({
			success: true,
			message: `Selo '${badgeType}' atribuído com sucesso pelo admin ${callerUid}.`
		});

	} catch (error) {
		console.error("Erro de autenticação ou execução na Cloud Function:", error);
		return res.status(401).json({ success: false, error: "Token inválido ou expirado." });
	}
});