const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Gerar token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Registrar novo usuário
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    // Verificar se o email já está em uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Este email já está cadastrado'
      });
    }
    
    // Criar novo usuário
    const user = await User.create({
      name,
      email,
      password
    });
    
    // Remover senha da resposta
    user.password = undefined;
    
    // Gerar token
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso',
      token,
      user
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao cadastrar usuário',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login de usuário
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Verificar se email e senha foram fornecidos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça email e senha'
      });
    }
    
    // Verificar se o usuário existe
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }
    
    // Verificar se a senha está correta
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }
    
    // Gerar token
    const token = generateToken(user._id);
    
    // Remover senha da resposta
    user.password = undefined;
    
    res.status(200).json({
      success: true,
      token,
      user
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obter dados do usuário atual
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter dados do usuário',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
