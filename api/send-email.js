export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  const { to, toName, subject, text } = req.body;
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: { name: 'Froidepannagebar Glace', email: 'contact@livraison-glacons-marseille.fr' },
      to: [{ email: to, name: toName }],
      subject: subject,
      textContent: text
    })
  });
  const data = await response.json();
  res.status(response.ok ? 200 : 500).json(data);
}
