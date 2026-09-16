const { onRequest } = require("firebase-functions/v2/https");
const { GoogleGenAI } = require("@google/genai");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");

if (!admin.apps.length) {
	admin.initializeApp();
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
			updatedAt: FieldValue.serverTimestamp()
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

exports.generateStudioIdea = onRequest({ cors: true }, async (req, res) => {
	try {
		const authHeader = req.headers.authorization;
		let userId = "anonymous";

		if (authHeader && authHeader.startsWith("Bearer ")) {
			try {
				const token = authHeader.split("Bearer ")[1];
				const decodedToken = await admin.auth().verifyIdToken(token);
				userId = decodedToken.uid;
			} catch (authError) {
				return res.status(401).json({ success: false, error: "Token de autenticação inválido." });
			}
		}

		const { prompt } = req.body;

		if (!prompt) {
			return res.status(400).json({ success: false, error: "O parâmetro 'prompt' é obrigatório." });
		}

		const response = await ai.models.generateContent({
			model: "gemini-3.6-flash",
			contents: prompt,
			config: {
				systemInstruction: "Você é um produtor musical sênior do Fagulha Studio Hub. Responda sempre de forma técnica, objetiva e estruturada.",
				responseMimeType: "application/json",
				responseSchema: {
					type: "OBJECT",
					properties: {
						estilo: { type: "STRING" },
						bpm: { type: "NUMBER" },
						tom: { type: "STRING" },
						progressao: {
							type: "ARRAY",
							items: { type: "STRING" }
						},
						bateria: { type: "STRING" },
						dica_producao: { type: "STRING" }
					},
					required: ["estilo", "bpm", "tom", "progressao", "bateria", "dica_producao"]
				}
			}
		});

		const studioIdea = JSON.parse(response.text);
		const ideaRef = await admin.firestore().collection("studio_ideas").add({
			userId,
			prompt,
			idea: studioIdea,
			createdAt: FieldValue.serverTimestamp()
		});

		return res.status(200).json({
			success: true,
			ideaId: ideaRef.id,
			data: studioIdea
		});
	} catch (error) {
		console.error("Erro ao gerar conteúdo com IA:", error);
		return res.status(500).json({ success: false, error: error.message });
	}
});