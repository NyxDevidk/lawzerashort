# 🗄️ Configuração MongoDB Atlas + Vercel - LawzeraShort

## 📋 Pré-requisitos

- Conta no [MongoDB Atlas](https://www.mongodb.com/atlas)
- Conta no [Vercel](https://vercel.com)
- Projeto GitHub

## 🚀 Passo a Passo

### 1. Criar Cluster MongoDB Atlas

1. **Acesse MongoDB Atlas**
   - Vá para [cloud.mongodb.com](https://cloud.mongodb.com)
   - Faça login ou crie uma conta

2. **Criar Cluster**
   - Clique em "Build a Database"
   - Escolha "FREE" (M0)
   - Selecione um provedor (AWS, Google Cloud, Azure)
   - Escolha uma região próxima
   - Clique em "Create"

3. **Configurar Segurança**
   - **Database Access**: Crie um usuário
     - Username: `lawzerashort`
     - Password: `sua_senha_segura`
     - Role: `Read and write to any database`
   
   - **Network Access**: Permita acesso de qualquer lugar
     - Clique em "Network Access"
     - "Add IP Address"
     - "Allow Access from Anywhere" (0.0.0.0/0)

### 2. Obter Connection String

1. **No MongoDB Atlas**
   - Clique em "Connect"
   - Escolha "Connect your application"
   - Copie a connection string

2. **Substituir Placeholders**
   ```
   mongodb+srv://lawzerashort:sua_senha_segura@cluster0.xxxxx.mongodb.net/lawzerashort?retryWrites=true&w=majority
   ```

### 3. Configurar Vercel

1. **Variáveis de Ambiente**
   - No Vercel Dashboard
   - Vá para seu projeto
   - Settings → Environment Variables
   - Adicione:
     - **Name**: `MONGODB_URI`
     - **Value**: `sua_connection_string_aqui`
     - **Environment**: Production, Preview, Development

2. **Deploy**
   - Faça push para GitHub
   - Vercel fará deploy automático

### 4. Testar Localmente (Opcional)

1. **Criar arquivo .env.local**
   ```env
   MONGODB_URI=mongodb+srv://lawzerashort:sua_senha@cluster0.xxxxx.mongodb.net/lawzerashort?retryWrites=true&w=majority
   NODE_ENV=development
   ```

2. **Instalar Vercel CLI**
   ```bash
   npm i -g vercel
   ```

3. **Testar**
   ```bash
   vercel dev
   ```

## 🔧 Estrutura do Banco

### Database: `lawzerashort`
### Collection: `urls`
```javascript
{
  _id: ObjectId,
  originalUrl: String,
  shortCode: String,
  createdAt: Date,
  clicks: Number
}
```

### Índices Recomendados
```javascript
// Criar índice único no shortCode
db.urls.createIndex({ "shortCode": 1 }, { unique: true })

// Criar índice na data de criação
db.urls.createIndex({ "createdAt": -1 })
```

## 🛠️ Comandos MongoDB

### Conectar via MongoDB Shell
```bash
mongosh "mongodb+srv://cluster0.xxxxx.mongodb.net/lawzerashort"
```

### Verificar dados
```javascript
// Listar todas as URLs
db.urls.find().sort({createdAt: -1})

// Contar total de URLs
db.urls.countDocuments()

// Ver URLs mais acessadas
db.urls.find().sort({clicks: -1}).limit(10)
```

## 🔒 Segurança

### 1. **IP Whitelist**
- Em produção, restrinja IPs do Vercel
- Adicione IPs específicos no Network Access

### 2. **Database User**
- Use senha forte
- Permissões mínimas necessárias
- Rotacione senhas regularmente

### 3. **Connection String**
- Nunca commite no GitHub
- Use variáveis de ambiente
- Use Vercel Secrets

## 📊 Monitoramento

### MongoDB Atlas
- **Metrics**: Performance do cluster
- **Logs**: Queries e erros
- **Alerts**: Configurar notificações

### Vercel
- **Functions**: Logs das funções serverless
- **Analytics**: Performance da aplicação

## 🚨 Troubleshooting

### Erro de Conexão
```javascript
// Verificar se a URI está correta
console.log(process.env.MONGODB_URI)
```

### Timeout
```javascript
// Aumentar timeout na conexão
const options = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}
```

### Rate Limiting
- MongoDB Atlas Free: 500 conexões simultâneas
- Vercel: 1000 requests/minuto

## 💰 Custos

### MongoDB Atlas Free Tier
- ✅ 512MB storage
- ✅ 500 conexões
- ✅ 0.5GB transferência/mês
- ✅ Sem custo

### Vercel Free Tier
- ✅ 100GB bandwidth/mês
- ✅ 1000 serverless function invocations/dia
- ✅ Sem custo

## 📞 Suporte

- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Node.js**: [docs.mongodb.com/drivers/node](https://docs.mongodb.com/drivers/node)

---

**🎯 Resultado:** LawzeraShort com persistência real no MongoDB Atlas! 🚀 