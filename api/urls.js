const clientPromise = require('../lib/mongodb');

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Lidar com requisições OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Apenas aceitar GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Conectar ao MongoDB
    const client = await clientPromise;
    const db = client.db('lawzerashort');
    const collection = db.collection('urls');

    // Buscar todas as URLs ordenadas por data de criação (mais recentes primeiro)
    const urls = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Formatar dados para o frontend
    const formattedUrls = urls.map(url => ({
      original_url: url.originalUrl,
      short_code: url.shortCode,
      created_at: url.createdAt,
      clicks: url.clicks
    }));

    res.json(formattedUrls);

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}; 