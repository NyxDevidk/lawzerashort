# 🔗 LawzeraShort - Lawzera Dev

Um encurtador de URLs moderno e eficiente, desenvolvido com Node.js, Express, MongoDB Atlas e Netlify.

## ✨ Funcionalidades

- **Encurtamento Rápido**: Transforme URLs longas em links curtos instantaneamente
- **Interface Moderna**: Design responsivo e elegante
- **Analytics**: Acompanhe o número de cliques em cada URL
- **Validação**: Verificação automática de URLs válidas
- **Cópia Fácil**: Botão para copiar URLs encurtadas
- **Histórico**: Visualize todas as URLs encurtadas
- **Responsivo**: Funciona perfeitamente em desktop e mobile
- **Persistência Real**: Dados salvos no MongoDB Atlas
- **Deploy Serverless**: Hospedado no Netlify

## 🚀 Como Funciona

1. **Input**: O usuário insere uma URL longa
2. **Geração**: O sistema gera um código único de 6 caracteres
3. **Armazenamento**: URL original e código são salvos no MongoDB Atlas
4. **Output**: URL curta é fornecida ao usuário
5. **Redirecionamento**: Quando acessada, redireciona para a URL original

## 📦 Instalação

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn
- Conta no MongoDB Atlas
- Conta no Netlify

### Passos

1. **Clone ou baixe o projeto**
```bash
git clone <url-do-repositorio>
cd lawzerashort
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure MongoDB Atlas**
   - Siga o guia em [MONGODB_SETUP.md](./MONGODB_SETUP.md)
   - Crie um cluster gratuito
   - Obtenha a connection string

4. **Configure variáveis de ambiente**
```bash
# Crie um arquivo .env.local
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lawzerashort?retryWrites=true&w=majority
NODE_ENV=development
```

5. **Teste localmente**
```bash
npm run dev
```

6. **Deploy no Netlify**
   - Faça push para GitHub
   - Conecte no Netlify
   - Configure a variável `MONGODB_URI`
   - Deploy automático

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js + Express
- **Banco de Dados**: MongoDB Atlas
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Deploy**: Netlify (Serverless Functions)
- **Geração de IDs**: nanoid
- **Ícones**: Font Awesome

## 📁 Estrutura do Projeto

```
lawzerashort/
├── api/                 # Funções serverless do Netlify
│   ├── shorten.js      # Encurtar URLs
│   ├── urls.js         # Listar URLs
│   ├── redirect.js     # Redirecionamento
│   └── test.js         # Função de teste
├── lib/                # Configurações
│   └── mongodb.js      # Conexão MongoDB
├── public/             # Arquivos estáticos
│   ├── index.html      # Página principal
│   ├── style.css       # Estilos CSS
│   └── script.js       # JavaScript do frontend
├── server.js           # Servidor local (desenvolvimento)
├── netlify.toml        # Configuração Netlify
├── package.json        # Dependências e scripts
└── README.md           # Este arquivo
```

## 🔧 API Endpoints

### POST `/api/shorten`
Encurta uma URL.

**Body:**
```json
{
  "originalUrl": "https://exemplo.com/url-muito-longa"
}
```

**Response:**
```json
{
  "originalUrl": "https://exemplo.com/url-muito-longa",
  "shortUrl": "https://lawzerashort.netlify.app/abc123",
  "shortCode": "abc123"
}
```

### GET `/api/redirect?shortCode=abc123`
Redireciona para a URL original.

### GET `/api/urls`
Lista todas as URLs encurtadas.

### GET `/api/test`
Testa se a API está funcionando.

## 🗄️ Banco de Dados

### MongoDB Atlas
- **Database**: `lawzerashort`
- **Collection**: `urls`
- **Documento**:
```javascript
{
  _id: ObjectId,
  originalUrl: String,
  shortCode: String,
  createdAt: Date,
  clicks: Number
}
```

### Índices
```javascript
// Índice único no shortCode
db.urls.createIndex({ "shortCode": 1 }, { unique: true })

// Índice na data de criação
db.urls.createIndex({ "createdAt": -1 })
```

## 🎨 Características do Design

- **Gradiente Moderno**: Background com gradiente roxo/azul
- **Cards Elevados**: Interface com sombras e bordas arredondadas
- **Animações Suaves**: Transições e efeitos hover
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Feedback Visual**: Loading, notificações e estados de erro

## 🔒 Segurança

- Validação de URLs no frontend e backend
- Sanitização de inputs
- Conexão segura com MongoDB Atlas
- CORS configurado adequadamente
- Variáveis de ambiente protegidas

## 📊 Funcionalidades Avançadas

- **Contador de Cliques**: Cada redirecionamento incrementa o contador
- **Auto-refresh**: Lista de URLs atualiza automaticamente
- **Truncamento**: URLs longas são truncadas na exibição
- **Formatação de Data**: Datas formatadas no padrão brasileiro
- **Feedback de Cópia**: Confirmação visual quando URL é copiada
- **Persistência Real**: Dados salvos permanentemente no MongoDB

## 🚀 Deploy

### Netlify (Recomendado)
1. Faça push para GitHub
2. Conecte no Netlify
3. Configure `MONGODB_URI`
4. Deploy automático

### Outras Plataformas
Veja [DEPLOY.md](./DEPLOY.md) para outras opções.

## 💰 Custos

### Gratuito
- **MongoDB Atlas**: 512MB storage, 500 conexões
- **Netlify**: 100GB bandwidth/mês, 125k function invocações/mês

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Lawzera Dev**

## 📚 Documentação Adicional

- [Configuração MongoDB Atlas](./MONGODB_SETUP.md)
- [Guia de Deploy](./DEPLOY.md)

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório! 