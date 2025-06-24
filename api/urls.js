const clientPromise = require('../lib/mongodb');

exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  // Lidar com requisições OPTIONS (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Apenas aceitar GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método não permitido' })
    };
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(formattedUrls)
    };

  } catch (error) {
    console.error('Erro:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro interno do servidor' })
    };
  }
}; 