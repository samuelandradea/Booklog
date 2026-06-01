# 📚 BookLog — Conectando leitores, transformando hábitos

## 🎯 Sobre o Projeto

O BookLog nasce para enfrentar um dos maiores desafios da era digital: a preservação do hábito da leitura. Em um cenário dominado por conteúdos curtos e estímulos rápidos, a leitura profunda muitas vezes perde espaço por ser tratada como uma atividade solitária e sem incentivos imediatos.

Nossa plataforma é um ecossistema criado com foco social para transformar a leitura em uma experiência compartilhada, engajadora e gamificada.

---

## ✨ Funcionalidades Principais

👥 **Social Experience**
- **Feed Dinâmico**: Acompanhe o que seus amigos estão lendo e suas avaliações em tempo real
- **Perfis Personalizados**: Exiba sua estante virtual, metas e conquistas literárias
- **Compartilhamento**: Discuta obras e troque recomendações diretamente na plataforma

🎮 **Gamificação e Incentivo**
- **Desafios Literários**: Participe de metas individuais
- **Sistema de Pontuação**: Ganhe reconhecimento à medida que avança em suas leituras

🧠 **Inteligência e Curadoria**
- **Busca Estruturada**: Encontre novos títulos de forma rápida e intuitiva

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem**: [TypeScript](https://www.typescriptlang.org/) — segurança com tipagem estática
- **Framework**: [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/) — multiplataforma iOS/Android
- **Autenticação**: [Firebase Authentication](https://firebase.google.com/docs/auth) — login seguro
- **Backend**: API REST própria deployada no [Railway](https://railway.app/)

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [Expo Go](https://expo.dev/go) no smartphone ou emulador Android/iOS configurado
- Conta no [Firebase](https://firebase.google.com/) com um projeto Web criado

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

Crie um arquivo `.env` na raiz do projeto. Use o `.env.example` como base:

```bash
cp .env.example .env
```

Preencha as variáveis com os seus valores:

```env
# URL do backend deployado no Railway
EXPO_PUBLIC_API_URL=https://pisi3-production.up.railway.app

# Firebase Web — chaves do seu projeto Firebase
# Acesse: Firebase Console → Configurações do projeto → Seus aplicativos → App Web
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=000000000000
EXPO_PUBLIC_FIREBASE_APP_ID=1:000000000000:web:xxxxxxxxxxxxxx
```

> ⚠️ Nunca commite o `.env` no repositório. As chaves do Firebase Web são necessárias para o login funcionar.

#### Como obter as chaves do Firebase Web

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione (ou crie) seu projeto
3. Vá em **Configurações do projeto** (ícone de engrenagem) → **Seus aplicativos**
4. Clique em **Adicionar app** → escolha **Web** (`</>`)
5. Registre o app e copie as chaves exibidas na tela

> 💡 O backend (Supabase, Firestore e SendGrid) já está rodando no Railway — você não precisa configurar nada disso localmente.

### 4. Inicie o servidor de desenvolvimento

```bash
npx expo start
```

Escaneie o QR code com o Expo Go ou pressione `a` para abrir no emulador Android / `i` para iOS.

---

## 👥 Time

Projeto desenvolvido para a disciplina de **DSI / PISI3 / ESSI1** — UFRPE.

| Membro | GitHub |
|--------|--------|
| Clara Helena | [@clarahelena](https://github.com/clarahelena) |
| Gabryel Gomes | [@GabryelSouzazz](https://github.com/GabryelSouzazz) |
| Maria Eduarda | [@mmaria-alves](https://github.com/mmaria-alves) |
| Matheus Cintra | [@CintraMatheus](https://github.com/CintraMatheus) |
| Samuel Andrade | [@samuelandradea](https://github.com/samuelandradea) |
