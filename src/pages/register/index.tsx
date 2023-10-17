import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input';
import { FormEvent } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebaseConnection';
import { db } from '../../services/firebaseConnection';
import { doc, setDoc } from 'firebase/firestore';


export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');  // Adicionado o estado para o nome
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (email === '' || password === '' || name === '') {
      alert('Preencha todos os campos!');
      return;
    }
  
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Salve o nome do usuário no Firestore
        const userRef = doc(db, 'users', user.uid);
        setDoc(userRef, {
          name,
          email: user.email,
        });
  
        alert('Usuário cadastrado com sucesso!');
        navigate('/login', { replace: true });
      })
      .catch((error) => {
        console.log('Erro ao cadastrar usuário:', error);
        alert('Erro ao cadastrar usuário. Verifique suas credenciais.');
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
          placeholder="Digite o seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <button
          type="submit"
          className="h-9 bg-blue-600 rounded border-0 text-lg font-medium text-white"
        >
          Cadastrar
        </button>
      </form>
      <Link to="/login" className="text-white mt-4">
        Voltar para Login
      </Link>
    </div>
  );
}
