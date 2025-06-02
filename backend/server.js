const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config();

// Importar rotas
const authRoutes = require('./routes/authRoutes');

// Inicializar Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Atlas conectado com sucesso'))
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB Atlas:', err.message);
    process.exit(1);
  });

// Rotas da API
app.use('/api/auth', authRoutes);

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Rota para qualquer requisição que não seja da API
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'index.html'));
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err.stack);
  
  res.status(500).json({
    success: false,
    message: 'Erro no servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Definir porta
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
