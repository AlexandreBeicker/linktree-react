import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { Social } from '../../components/Social';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { db } from '../../services/firebaseConnection';
import {
  getDocs,
  collection,
  orderBy,
  query,
  doc,
  getDoc
} from 'firebase/firestore';
import { onAuthStateChanged, getAuth, User } from 'firebase/auth';

interface LinkProps {
  id: string;
  name: string;
  url: string;
  bg: string;
  color: string;
}

interface SocialLinksProps {
  facebook: string;
  linkedin: string;
  instagram: string;
}

export function Home() {
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinksProps | null>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    function loadLinks() {
      const user = getAuth().currentUser;
      if (user) {
        const linksRef = collection(db, "users", user.uid, "links");
        const queryRef = query(linksRef, orderBy("created", "asc"));
    
        getDocs(queryRef).then((snapshot) => {
          const lista = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as LinkProps[];
    
          setLinks(lista);
        });

        const userDocRef = doc(db, 'users', user.uid);
        getDoc(userDocRef).then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.data();
            setUserName(userData?.name || '');
          }
        });
      }
    }

    loadLinks();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        const docRef = doc(db, 'social', user.uid);

        getDoc(docRef).then((snapshot) => {
          if (snapshot.exists()) {
            setSocialLinks(snapshot.data() as SocialLinksProps);
          }
        });
      } else {
        setSocialLinks(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-col w-full py-4 items-center justify-center">
      <Header />
      <h1 className="md:text-4xl text-3xl font-bold text-white mt-20">
        {userName}
      </h1>
      <span className="text-gray-50 mb-5 mt-3">Veja meus links 👇</span>

      <main className="flex flex-col w-11/12 max-w-xl text-center">
        {links.map((link) => (
          <section
            style={{ backgroundColor: link.bg }}
            key={link.id}
            className="bg-white mb-4 w-full py-2 rounded-lg select-none transition-transform hover:scale-105 cursor-pointer"
          >
            <a href={link.url} target="_blank">
              <p className="text-base md:text-lg" style={{ color: link.color }}>
                {link.name}
              </p>
            </a>
          </section>
        ))}

        {socialLinks && (
          <footer className="flex justify-center gap-3 my-4">
            <Social url={socialLinks.facebook}>
              <FaFacebook size={36} color="#FFF" />
            </Social>

            <Social url={socialLinks.linkedin}>
              <FaLinkedin size={36} color="#FFF" />
            </Social>

            <Social url={socialLinks.instagram}>
              <FaInstagram size={36} color="#FFF" />
            </Social>
          </footer>
        )}
      </main>
    </div>
  );
}
