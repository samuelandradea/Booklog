import { auth, db} from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateEmail,
    updatePassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential
} from "firebase/auth";
  
import { doc, setDoc, getDoc } from "firebase/firestore"

export async function signUp(email: string, senha: string){
    try{
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha)
        return userCredential.user
    }
    catch{
        throw new Error('Email ou senha inválidos');
    }
}

export async function signIn(email: string, senha: string){
    try{
        await signInWithEmailAndPassword(auth, email, senha);
    }
    catch{
        throw new Error('Email ou senha inválidos');
    }
}

export async function logOut(){
    try {
        await signOut(auth);
    } 
    catch (error) {
        throw new Error('Erro ao sair da conta');
    }
}


export async function getPerfil() {
  const user = auth.currentUser
  if (!user) throw new Error("Usuário não autenticado")
  const snap = await getDoc(doc(db, "usuarios", user.uid))
  return snap.exists() ? snap.data() : null
}


export async function salvarPerfil(dados: {
  nome: string
  bio: string
  dataNascimento: string
  genero: string
  email: string
  senha: string
  senhaAtual: string  
}) {
  const user = auth.currentUser
  if (!user) throw new Error("Usuário não autenticado")


  const credencial = EmailAuthProvider.credential(user.email!, dados.senhaAtual)
  await reauthenticateWithCredential(user, credencial)


  if (dados.email !== user.email) await updateEmail(user, dados.email)
  if (dados.senha) await updatePassword(user, dados.senha)


  await setDoc(doc(db, "usuarios", user.uid), {
    nome: dados.nome,
    bio: dados.bio,
    dataNascimento: dados.dataNascimento,
    genero: dados.genero,
    email: dados.email,
  }, { merge: true })
}


export async function excluirConta(senhaAtual: string) {
  const user = auth.currentUser
  if (!user) throw new Error("Usuário não autenticado")
  const credencial = EmailAuthProvider.credential(user.email!, senhaAtual)
  await reauthenticateWithCredential(user, credencial)
  await deleteUser(user)
}