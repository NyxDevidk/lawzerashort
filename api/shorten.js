const { nanoid } = require('nanoid');
const clientPromise = require('../lib/mongodb');

// Função para validar URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Lidar com requisições OPTIONS (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Apenas aceitar POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método não permitido' })
    };
  }

  try {
    const { originalUrl } = JSON.parse(event.body);

    if (!originalUrl) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'URL é obrigatória' })
      };
    }

    if (!isValidUrl(originalUrl)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'URL inválida' })
      };
    }

    // Conectar ao MongoDB
    const client = await clientPromise;
    const db = client.db('lawzerashort');
    const collection = db.collection('urls');

    // Gerar código curto único
    let shortCode;
    let existingUrl;
    
    // Garantir que o código seja único
    do {
      shortCode = nanoid(6);
      existingUrl = await collection.findOne({ shortCode });
    } while (existingUrl);

    // Criar nova URL
    const newUrl = {
      originalUrl,
      shortCode,
      createdAt: new Date(),
      clicks: 0
    };

    // Inserir no MongoDB
    await collection.insertOne(newUrl);

    // Construir URL curta
    const host = event.headers.host || 'localhost:3000';
    const protocol = event.headers['x-forwarded-proto'] || 'http';
    const shortUrl = `${protocol}://${host}/${shortCode}`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        originalUrl,
        shortUrl,
        shortCode
      })
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