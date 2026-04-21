export interface Usuario { // criacao do molde do que um usuario deve ter
    name: string;
    email: string;
    birthDate: string;
    gender: string;
}

// class responsavel pela criacao dos usuarios
// contendo os metodos de adicao das informacoes
export class UsuarioBuilder {
    private usuario: Partial<Usuario>;

    constructor() {
        // inicializacao do objeto vazio
        this.usuario = {};
    }

    public adicionarNome(nome: string) {
        this.usuario.name = nome;
        return this;
    }

    public adicionarEmail(email: string) {
        this.usuario.email = email;
        return this;
    }

    public adicionarDataNascimento(data: string) {
        this.usuario.birthDate = data;
        return this;
    }

    public adicionarGenero(genero: string) {
        this.usuario.gender = genero;
        return this;
    }

    // o metodo construir, faz a validacao e devolve o objeto pronto
    public construir(): Usuario {
        if (!this.usuario.name || !this.usuario.email || !this.usuario.birthDate || !this.usuario.gender) {
            throw new Error("Todos os campos são obrigatórios para a criação do usuário.");
        }

        const usuarioPronto = { ...this.usuario } as Usuario; // o "{ ...this.usuario }" é pra criar uma copia do objeto, evitando que ele altere o usuario antigo por engano
        return usuarioPronto; // caso o builder seja usado novamente
    }
}