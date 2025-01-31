const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Importer CORS
const cors = require("cors");

// Activer CORS avec les bons paramètres
const corsHandler = cors({ origin: "*" });

export default async function handler(req, res) {
  // Appliquer CORS à la requête
  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Méthode non autorisée" });
    }

    try {
      const { productId } = req.body;

      if (productId !== "prod_RgfebF9Wr8sIay") {
        return res.status(400).json({ error: "Produit invalide" });
      }

      const amount = 5600; // 56€ en centimes

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "eur",
        payment_method_types: ["card"],
        metadata: { productName: "Abonnement Mensuel - 56€" },
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}
