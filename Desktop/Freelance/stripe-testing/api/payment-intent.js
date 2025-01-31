const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { productId } = req.body;

    // Vérification du produit envoyé
    if (productId !== "prod_RgfebF9Wr8sIay") {
      return res.status(400).json({ error: "Produit invalide" });
    }

    // Prix en centimes (56€)
    const amount = 5600;

    // Création du PaymentIntent
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
}
