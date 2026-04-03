import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

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

