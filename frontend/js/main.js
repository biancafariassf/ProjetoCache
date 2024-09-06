document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  const userForm = document.getElementById('userForm'); 

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nome = document.getElementById('nome').value;
      const idade = document.getElementById('idade').value;
      const sexo = document.getElementById('sexo').value;
      const cep = document.getElementById('cep').value; 
      const senha = document.getElementById('senha').value;

      try {
        const response = await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nome, idade, sexo, cep, senha }) 
        });

        const data = await response.json();
        if (response.ok) {
          alert('Usuário registrado com sucesso!');
          window.location.href = 'login.html';
        } else {
          alert('Error: ' + data.message);
        }
      } catch (error) {
        console.error('Erro ao registrar usuário:', error);
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nome = document.getElementById('nome').value;
      const senha = document.getElementById('senha').value;
    
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nome, senha }) 
        });
    
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('token', data.token); 
          window.location.href = 'index.html';
        } else {
          alert('Error: ' + data.message);
        }
      } catch (error) {
        console.error('Erro ao fazer login:', error);
      }
    });
  }

  if (userForm) {
    document.getElementById('obterEndereco').addEventListener('click', async () => {
      const cep = document.getElementById('cep').value;
      const token = localStorage.getItem('token'); 
    
      try {
        const response = await fetch(`http://localhost:3000/address/${cep}`, { 
          headers: {
            'Authorization': token ? `Bearer ${token}` : '' 
          }
        });
    
        const data = await response.json();
        if (response.ok) {
          document.getElementById('obterEndereco').innerText = `Rua: ${data.logradouro}, Número: ${data.numero || 'N/A'}, Bairro: ${data.bairro}`; 
        } else {
          alert('Error: ' + data.message);
        }
      } catch (error) {
        console.error('Erro ao buscar endereço:', error);
      }
    });
  }
});