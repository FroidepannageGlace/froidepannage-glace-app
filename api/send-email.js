export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { to, toName, subject, text } = req.body;
    
    if (!to || !subject || !text) {
      return res.status(400).json({ error: 'Champs manquants' });
    }

    if (!process.env.BREVO_API_KEY) {
      return res.status(500).json({ error: 'Clé API manquante' });
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { name: 'Froidepannagebar Glace', email: 'contact@livraison-glacons-marseille.fr' },
        to: [{ email: to, name: toName || to }],
        subject: subject,
        textContent: text
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Brevo error:', data);
      return res.status(500).json({ error: 'Erreur Brevo', details: data });
    }

    return res.status(200).json({ success: true, messageId: data.messageId });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
