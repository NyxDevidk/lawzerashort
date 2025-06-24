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
    const { shortCode } = req.query;

    if (!shortCode) {
      return res.status(400).json({ error: 'Código da URL é obrigatório' });
    }

    // Conectar ao MongoDB
    const client = await clientPromise;
    const db = client.db('lawzerashort');
    const collection = db.collection('urls');

    // Buscar URL no banco
    const url = await collection.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ error: 'URL não encontrada' });
    }

    // Incrementar contador de cliques
    await collection.updateOne(
      { shortCode },
      { $inc: { clicks: 1 } }
    );

    // Redirecionar para URL original
    res.redirect(url.originalUrl);

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}; 