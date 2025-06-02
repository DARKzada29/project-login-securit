// Atualizar a URL da API para apontar para o servidor real
const API_URL = 'https://project-login-securit-demo.onrender.com/api';


// Elementos DOM
const userNameElement = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');
const tesouroChest = document.getElementById('tesouro-chest');

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

// Verificar autenticação
async function checkAuth() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        // Redirecionar para a página de login se não estiver autenticado
        window.location.href = 'index.html';
        return;
    }
    
    try {
        // Verificar se o token é válido fazendo uma requisição para a API
        const response = await fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            // Se o token for inválido, fazer logout
            logout();
            return;
        }
        
        // Exibir informações do usuário
        const data = await response.json();
        const user = data.user;
        
        if (user && user.name) {
            userNameElement.textContent = user.name;
        } else {
            // Usar dados do localStorage como fallback
            const localUser = JSON.parse(localStorage.getItem('user'));
            if (localUser && localUser.name) {
                userNameElement.textContent = localUser.name;
            }
        }
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // Em caso de erro, tentar usar dados do localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.name) {
            userNameElement.textContent = user.name;
        }
    }
}

// Função para fazer logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Criar partículas do tesouro
function createTreasureParticles() {
    const particleCount = 20;
    const container = document.querySelector('.chest-particles');
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('treasure-particle');
        
        // Tamanho aleatório
        const size = Math.random() * 8 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        container.appendChild(particle);
    }
}

// Animar partículas do tesouro
function animateTreasureParticles() {
    const particles = document.querySelectorAll('.treasure-particle');
    const chestRect = tesouroChest.getBoundingClientRect();
    
    particles.forEach((particle, index) => {
        // Posição inicial aleatória dentro do baú
        const startX = Math.random() * chestRect.width;
        const startY = chestRect.height * 0.3;
        
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        
        // Animação
        particle.style.animation = `particleRise ${Math.random() * 2 + 1}s ease-out`;
        particle.style.animationDelay = `${index * 0.1}s`;
        
        // Reiniciar animação quando terminar
        particle.addEventListener('animationend', () => {
            particle.style.opacity = '0';
            setTimeout(() => {
                const newX = Math.random() * chestRect.width;
                particle.style.left = `${newX}px`;
                particle.style.top = `${startY}px`;
                
                // Reiniciar animação
                particle.style.animation = 'none';
                particle.offsetHeight; // Forçar reflow
                particle.style.animation = `particleRise ${Math.random() * 2 + 1}s ease-out`;
                particle.style.opacity = '1';
            }, 100);
        });
    });
}

// Abrir o baú do tesouro
function openTreasureChest() {
    tesouroChest.classList.add('open');
    animateTreasureParticles();
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    checkAuth();
    createTreasureParticles();
    
    // Evento de logout
    logoutBtn.addEventListener('click', logout);
    
    // Evento de clique no baú
    tesouroChest.addEventListener('click', openTreasureChest);
    
    // Abrir o baú automaticamente após alguns segundos
    setTimeout(openTreasureChest, 2000);
});
