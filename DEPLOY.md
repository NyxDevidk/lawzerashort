# 🚀 Guia de Deploy - URL Shortener

## 📋 Opções de Deploy

### 🟢 **Vercel (Recomendado para Frontend)**
✅ **Vantagens:**
- Deploy gratuito
- Integração com GitHub
- CDN global
- Funções serverless

❌ **Limitações:**
- Banco em memória (dados se perdem)
- Sem persistência real

**Passos:**
1. Faça push para GitHub
2. Conecte no Vercel
3. Deploy automático

### 🟡 **Netlify (Similar ao Vercel)**
✅ **Vantagens:**
- Deploy gratuito
- Interface amigável
- CDN global

❌ **Limitações:**
- Mesmas limitações do Vercel
- Menos funções serverless

### 🔵 **Render/Railway/Heroku (Recomendado para Produção)**
✅ **Vantagens:**
- Suporta Node.js completo
- Banco de dados real
- Persistência de dados

❌ **Limitações:**
- Pode ter custo
- Mais complexo

## 🛠️ Deploy no Vercel

### 1. Preparação
```bash
# Certifique-se de que está na branch main
git add .
git commit -m "Preparando para deploy no Vercel"
git push origin main
```

### 2. Deploy
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione seu repositório
5. Clique em "Deploy"

### 3. Configuração
O arquivo `vercel.json` já está configurado para:
- Servir arquivos estáticos da pasta `public`
- Rotear `/api/*` para funções serverless
- Configurar CORS automaticamente

## 🗄️ Banco de Dados Real (Opcional)

Para persistência real, use um destes:

### **PlanetScale (MySQL)**
```bash
npm install mysql2
```

### **Supabase (PostgreSQL)**
```bash
npm install @supabase/supabase-js
```

### **MongoDB Atlas**
```bash
npm install mongodb
```

## 🔧 Configuração para Produção

### Variáveis de Ambiente
Crie um arquivo `.env`:
```env
DATABASE_URL=sua_url_do_banco
NODE_ENV=production
```

### Atualizar package.json
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'Build completed'"
  }
}
```

## 📱 Deploy em Outras Plataformas

### **Render**
1. Conecte GitHub
2. Selecione "Web Service"
3. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`

### **Railway**
1. Conecte GitHub
2. Deploy automático
3. Configure variáveis de ambiente

### **Heroku**
```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Criar app
heroku create seu-app-name

# Deploy
git push heroku main
```

## 🔒 Segurança em Produção

### **HTTPS**
- Vercel/Netlify: Automático
- Outros: Configure SSL

### **Rate Limiting**
```javascript
// Adicionar no servidor
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite por IP
});

app.use('/api/', limiter);
```

### **Validação de URLs**
```javascript
// Validar URLs maliciosas
function isSafeUrl(url) {
  const unsafeProtocols = ['javascript:', 'data:', 'vbscript:'];
  return !unsafeProtocols.some(protocol => 
    url.toLowerCase().startsWith(protocol)
  );
}
```

## 📊 Monitoramento

### **Logs**
- Vercel: Dashboard integrado
- Render: Logs em tempo real
- Heroku: `heroku logs --tail`

### **Métricas**
- Uptime: UptimeRobot
- Performance: Google Analytics
- Erros: Sentry

## 🚨 Troubleshooting

### **Erro 404 no Vercel**
- Verifique `vercel.json`
- Confirme rotas configuradas

### **CORS Errors**
- Verifique headers nas funções
- Teste com Postman

### **Banco não conecta**
- Verifique variáveis de ambiente
- Teste conexão local

## 📞 Suporte

- **Vercel**: [docs.vercel.com](https://docs.vercel.com)
- **Netlify**: [docs.netlify.com](https://docs.netlify.com)
- **Render**: [render.com/docs](https://render.com/docs)

---

**💡 Dica:** Para produção real, use Render/Railway com banco de dados real! 