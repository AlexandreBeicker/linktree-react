import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input';
import { FormEvent } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebaseConnection';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (email === '' || password === '') {
      alert('Preencha todos os campos!');
      return;
    }
  
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
  
        // Salve o UID do usuário no localStorage
        localStorage.setItem('uid', user.uid);
  
        // Redirecione para a página dinâmica com base no UID do usuário
        navigate(`/${user.uid}`, { replace: true });
      })
      .catch((error) => {
        console.log('ERRO AO FAZER LOGIN:');
        console.log(error);
        alert('Erro ao fazer login. Verifique suas credenciais.');
      });
  }

  return (
    <div className="flex w-full h-screen items-center justify-center flex-col">
      
        <h1 className="mt-11 text-white mb-7 font-bold text-5xl">
          Dev
          <span className="bg-gradient-to-r from-yellow-500 to-orange-400 bg-clip-text text-transparent">
            Link
          </span>
          <span className="bg-gradient-to-r from-purple-500 to-purple-400 bg-clip-text text-transparent">
            +P3
          </span>
        </h1>
      
      <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col px-3">
        <Input
          placeholder="Digite o seu e-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Digite sua senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="h-9 bg-blue-600 rounded border-0 text-lg font-medium text-white">
          Acessar
        </button>
      </form>

      <Link to="/register" className="text-white mt-4">
        Criar Conta
      </Link>
    </div>
  );
}
