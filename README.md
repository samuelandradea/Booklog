# 📚 Booklog — Conectando leitores, transformando hábitos

O **Booklog** é um aplicativo mobile que transforma a leitura em uma experiência social e gamificada, permitindo que leitores registrem seus livros, escrevam avaliações, sigam amigos e descubram novos títulos.

---

## 🛠️ Tecnologias

- [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/) — framework mobile multiplataforma
- [TypeScript](https://www.typescriptlang.org/) — tipagem estática
- [Firebase](https://firebase.google.com/) — autenticação de usuários
- [Expo Router](https://expo.github.io/router/) — navegação baseada em arquivos

---

## ✨ Funcionalidades

- 📖 Registre livros lidos e escreva avaliações
- 👥 Siga amigos e acompanhe o feed de leituras
- 🔍 Busque livros, autores e usuários
- 📋 Crie e gerencie listas de leitura personalizadas
- 🗺️ Descubra livrarias e pontos literários no mapa
- 🔑 Recuperação de senha por e-mail

---

## ⚙️ Como rodar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [Expo Go](https://expo.dev/client) instalado no celular **ou** um emulador Android/iOS configurado
- O backend da aplicação rodando (localmente ou via deploy)

### 1. Clone o repositório

```bash
git clone https://github.com/samuelandradea/Booklog.git
cd Booklog
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# URL do backend — use o link do deploy no Railway para rodar em produção,
# ou http://localhost:8000 para rodar o backend localmente
EXPO_PUBLIC_API_URL=https://pisi3-production.up.railway.app

# Firebase — configuração do projeto web
# Acesse: Firebase Console → Configurações do projeto → Seus aplicativos → App da Web
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

> ⚠️ **Nunca commite o `.env` no repositório.** Certifique-se de que ele está no `.gitignore`.

> 💡 **Atenção:** No Expo, todas as variáveis de ambiente que o app precisa acessar devem começar com `EXPO_PUBLIC_`. Variáveis sem esse prefixo não ficam disponíveis no código do app.

### 4. Inicie o servidor de desenvolvimento

```bash
npx expo start
```

- Escaneie o QR code com o app **Expo Go** no celular
- Ou pressione `a` para abrir no emulador Android, `i` para iOS

---

## 🔗 Conexão com o Backend

O app se comunica com a API do Booklog para buscar livros, gerenciar usuários, avaliações e listas.

| Ambiente | URL |
|----------|-----|
| Produção | `https://pisi3-production.up.railway.app` |
| Local | `http://localhost:8000` |

Para alternar entre os ambientes, basta mudar o valor de `EXPO_PUBLIC_API_URL` no `.env` e reiniciar o Expo com `npx expo start --clear`.

> ⚠️ **Testando no celular físico:** Se o backend estiver rodando localmente, substitua `localhost` pelo IP da sua máquina na rede local (ex: `http://192.168.1.100:8000`). O celular e o computador precisam estar na mesma rede Wi-Fi. O `localhost` no celular aponta para o próprio celular, não para o computador.

---

## 🔥 Configuração do Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto → **Configurações do projeto** → **Seus aplicativos**
3. Selecione o app Web (ou crie um novo clicando em `</>`)
4. Copie os valores do objeto `firebaseConfig` para as variáveis `EXPO_PUBLIC_FIREBASE_*` no `.env`

---

## 👥 Time

Projeto desenvolvido para a disciplina de **DSI / PISI3 / ESSI1** — UFRPE.
Clara Helena https://github.com/clarahelena
Gabryel Gomes https://github.com/GabryelSouzazz
Maria Eduarda https://github.com/mmaria-alves
Matheus Cintra https://github.com/CintraMatheus
Samuel Andrade https://github.com/samuelandradea