import { useState, FormEvent, useEffect } from 'react';
import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { db } from '../../services/firebaseConnection';
import { getAuth } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';

export function Networks() {
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");

  useEffect(() => {
    function loadLinks() {
      const user = getAuth().currentUser;
      if (user) {
        const docRef = doc(db, "social", user.uid);
        getDoc(docRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data();
              setFacebook(data?.facebook);
              setInstagram(data?.instagram);
              setLinkedin(data?.linkedin);
            }
          });
      }
    }

    loadLinks();
  }, []);

  function handleRegister(e: FormEvent) {
    e.preventDefault();
    const user = getAuth().currentUser;
    if (!user) {
      console.log("Usuário não autenticado.");
      return;
    }

    setDoc(doc(db, "social", user.uid), {
      facebook: facebook,
      instagram: instagram,
      linkedin: linkedin
    })
      .then(() => {
        console.log("Links salvos com sucesso!");
      })
      .catch((error) => {
        console.log("Erro ao salvar os links:", error);
      });
  }

  return (
    <div className="flex items-center flex-col min-h-screen pb-7 px-2">
      <Header />

      <h1 className="text-white text-2xl font-medium mt-8 mb-4">Minhas redes sociais</h1>

      <form className="flex flex-col max-w-xl w-full" onSubmit={handleRegister}>
        <label className="text-white font-medium mt-2 mb-2">Link do Facebook</label>
        <Input
          type="url"
          placeholder="Digite a url do facebook..."
          value={facebook}
          onChange={ (e) => setFacebook(e.target.value) }
        />

        <label className="text-white font-medium mt-2 mb-2">Link do Instagram</label>
        <Input
          type="url"
          placeholder="Digite a url do instagram..."
          value={instagram}
          onChange={ (e) => setInstagram(e.target.value) }
        />

        <label className="text-white font-medium mt-2 mb-2">Link do Linkedin</label>
        <Input
          type="url"
          placeholder="Digite a url do linkedin..."
          value={linkedin}
          onChange={ (e) => setLinkedin(e.target.value) }
        />

        <button
          type="submit"
          className="h-10 text-white rounded-md items-center justify-center flex mb-7 font-medium"
          style={{ backgroundColor: '#43418e' }}
        >
          Salvar links
        </button>
      </form>
    </div>
  );
}