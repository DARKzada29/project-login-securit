const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar autenticação
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Verificar se o token existe no header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      // Verificar se o token existe nos cookies
      token = req.cookies.token;
    }
    
    // Verificar se o token existe
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acesso não autorizado. Faça login para acessar esta rota.'
      });
    }
    
    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Verificar se o usuário ainda existe
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'O usuário associado a este token não existe mais.'
        });
      }
      
      // Adicionar usuário à requisição
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido ou expirado. Faça login novamente.'
      });
    }
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro no servidor durante autenticação'
    });
  }
};
