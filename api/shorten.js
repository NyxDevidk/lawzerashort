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

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Lidar com requisições OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Apenas aceitar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: 'URL é obrigatória' });
    }

    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({ error: 'URL inválida' });
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
    const host = req.headers.host || 'localhost:3000';
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const shortUrl = `${protocol}://${host}/${shortCode}`;

    res.json({
      originalUrl,
      shortUrl,
      shortCode
    });

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}; 