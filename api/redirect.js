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
    const { shortCode } = event.queryStringParameters || {};

    if (!shortCode) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Código da URL é obrigatório' })
      };
    }

    // Conectar ao MongoDB
    const client = await clientPromise;
    const db = client.db('lawzerashort');
    const collection = db.collection('urls');

    // Buscar URL no banco
    const url = await collection.findOne({ shortCode });

    if (!url) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'URL não encontrada' })
      };
    }

    // Incrementar contador de cliques
    await collection.updateOne(
      { shortCode },
      { $inc: { clicks: 1 } }
    );

    // Redirecionar para URL original
    return {
      statusCode: 302,
      headers: {
        ...headers,
        'Location': url.originalUrl
      },
      body: ''
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