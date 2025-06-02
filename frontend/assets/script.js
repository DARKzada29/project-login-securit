// Atualizar a URL da API para apontar para o servidor real
const API_URL = 'https://project-login-securit-demo.onrender.com/api';

// Elementos DOM
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginToggle = document.getElementById('login-toggle');
const signupToggle = document.getElementById('signup-toggle');
const loginMessage = document.getElementById('login-message');
const signupMessage = document.getElementById('signup-message');

// Variáveis para validação
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordMinLength = 6;

// Função para criar partículas de fundo
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Tamanho aleatório
        const size = Math.random() * 5 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Posição aleatória
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        
        // Cor aleatória (variações de azul e roxo)
        const colors = ['#00a8ff', '#9c27b0', '#00e676', '#3d5afe'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = randomColor;
        
        // Duração aleatória da animação
        const duration = Math.random() * 20 + 10;
        particle.style.animationDuration = `${duration}s`;
        
        // Atraso aleatório da animação
        const delay = Math.random() * 10;
        particle.style.animationDelay = `${delay}s`;
        
        container.appendChild(particle);
    }
}

// Alternar entre formulários
function toggleForms() {
    loginToggle.addEventListener('click', () => {
        loginToggle.classList.add('active');
        signupToggle.classList.remove('active');
        loginForm.classList.add('active-form');
        signupForm.classList.remove('active-form');
        clearMessages();
        clearErrors();
    });
    
    signupToggle.addEventListener('click', () => {
        signupToggle.classList.add('active');
        loginToggle.classList.remove('active');
        signupForm.classList.add('active-form');
        loginForm.classList.remove('active-form');
        clearMessages();
        clearErrors();
    });
}

// Limpar mensagens
function clearMessages() {
    loginMessage.textContent = '';
    loginMessage.className = 'form-message';
    signupMessage.textContent = '';
    signupMessage.className = 'form-message';
}

// Limpar erros
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}

// Mostrar erro em campo específico
function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Validar formulário de login
function validateLoginForm() {
    let isValid = true;
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    // Validar email
    if (!email) {
        showError('login-email', 'Email é obrigatório');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showError('login-email', 'Email inválido');
        isValid = false;
    }
    
    // Validar senha
    if (!password) {
        showError('login-password', 'Senha é obrigatória');
        isValid = false;
    }
    
    return isValid;
}

// Validar formulário de cadastro
function validateSignupForm() {
    let isValid = true;
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    // Validar nome
    if (!name) {
        showError('signup-name', 'Nome é obrigatório');
        isValid = false;
    }
    
    // Validar email
    if (!email) {
        showError('signup-email', 'Email é obrigatório');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showError('signup-email', 'Email inválido');
        isValid = false;
    }
    
    // Validar senha
    if (!password) {
        showError('signup-password', 'Senha é obrigatória');
        isValid = false;
    } else if (password.length < passwordMinLength) {
        showError('signup-password', `Senha deve ter pelo menos ${passwordMinLength} caracteres`);
        isValid = false;
    }
    
    // Validar confirmação de senha
    if (!confirmPassword) {
        showError('signup-confirm-password', 'Confirmação de senha é obrigatória');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('signup-confirm-password', 'As senhas não coincidem');
        isValid = false;
    }
    
    return isValid;
}

// Função para fazer login
async function login(email, password) {
    try {
        loginMessage.textContent = 'Conectando...';
        loginMessage.className = 'form-message';
        
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erro ao fazer login');
        }
        
        // Armazenar token JWT
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Exibir mensagem de sucesso
        loginMessage.textContent = 'Login realizado com sucesso! Redirecionando...';
        loginMessage.className = 'form-message success';
        
        // Redirecionar para página do tesouro
        setTimeout(() => {
            window.location.href = 'tesouro.html';
        }, 1500);
        
    } catch (error) {
        loginMessage.textContent = error.message;
        loginMessage.className = 'form-message error';
    }
}

// Função para cadastrar
async function signup(name, email, password) {
    try {
        signupMessage.textContent = 'Cadastrando...';
        signupMessage.className = 'form-message';
        
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erro ao cadastrar');
        }
        
        // Exibir mensagem de sucesso
        signupMessage.textContent = 'Cadastro realizado com sucesso! Você já pode fazer login.';
        signupMessage.className = 'form-message success';
        
        // Limpar formulário
        document.getElementById('signup-form').reset();
        
        // Armazenar token JWT se o backend retornar
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirecionar para página do tesouro
            setTimeout(() => {
                window.location.href = 'tesouro.html';
            }, 1500);
        } else {
            // Alternar para o formulário de login após alguns segundos
            setTimeout(() => {
                loginToggle.click();
            }, 2000);
        }
        
    } catch (error) {
        signupMessage.textContent = error.message;
        signupMessage.className = 'form-message error';
    }
}

// Eventos de formulário
function setupFormEvents() {
    // Evento de login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();
        
        if (validateLoginForm()) {
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            
            await login(email, password);
        }
    });
    
    // Evento de cadastro
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();
        
        if (validateSignupForm()) {
            const name = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const password = document.getElementById('signup-password').value;
            
            await signup(name, email, password);
        }
    });
}

// Verificar se o usuário já está autenticado
function checkAuth() {
    const token = localStorage.getItem('token');
    
    if (token) {
        // Redirecionar para a página do tesouro
        window.location.href = 'tesouro.html';
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    toggleForms();
    setupFormEvents();
    checkAuth();
});
app.use(cors({
    origin: 'https://seu-frontend.netlify.app',
    credentials: true
  } ));
  
