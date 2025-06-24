const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { nanoid } = require('nanoid');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Inicializar banco de dados
const db = new sqlite3.Database('urls.db');

// Criar tabela se não existir
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_url TEXT NOT NULL,
    short_code TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    clicks INTEGER DEFAULT 0
  )`);
});

// Função para validar URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Rota principal - servir a página HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API para encurtar URL
app.post('/api/shorten', (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'URL é obrigatória' });
  }

  if (!isValidUrl(originalUrl)) {
    return res.status(400).json({ error: 'URL inválida' });
  }

  // Gerar código curto único
  const shortCode = nanoid(6);

  // Inserir no banco de dados
  const stmt = db.prepare('INSERT INTO urls (original_url, short_code) VALUES (?, ?)');
  
  stmt.run(originalUrl, shortCode, function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        // Código já existe, tentar novamente
        return res.status(500).json({ error: 'Erro interno, tente novamente' });
      }
      return res.status(500).json({ error: 'Erro ao salvar URL' });
    }

    const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
    res.json({
      originalUrl,
      shortUrl,
      shortCode
    });
  });

  stmt.finalize();
});

// Redirecionamento para URL original
app.get('/:shortCode', (req, res) => {
  const { shortCode } = req.params;

  db.get('SELECT original_url FROM urls WHERE short_code = ?', [shortCode], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno' });
    }

    if (!row) {
      return res.status(404).json({ error: 'URL não encontrada' });
    }

    // Incrementar contador de cliques
    db.run('UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?', [shortCode]);

    // Redirecionar para URL original
    res.redirect(row.original_url);
  });
});

// API para obter estatísticas
app.get('/api/stats/:shortCode', (req, res) => {
  const { shortCode } = req.params;

  db.get('SELECT original_url, short_code, created_at, clicks FROM urls WHERE short_code = ?', 
    [shortCode], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno' });
    }

    if (!row) {
      return res.status(404).json({ error: 'URL não encontrada' });
    }

    res.json({
      originalUrl: row.original_url,
      shortCode: row.short_code,
      createdAt: row.created_at,
      clicks: row.clicks
    });
  });
});

// API para listar todas as URLs
app.get('/api/urls', (req, res) => {
  db.all('SELECT original_url, short_code, created_at, clicks FROM urls ORDER BY created_at DESC', 
    (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno' });
    }

    res.json(rows);
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 LawzeraShort rodando na porta ${PORT}`);
  console.log(`📱 Acesse: http://localhost:${PORT}`);
}); 