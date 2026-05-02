export class UsuarioBuilder {
    private usuario: any;

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

    // bio e opcional — so e adicionada em atualizacoes de perfil, nao no cadastro
    public adicionarBio(bio: string) {
        this.usuario.bio = bio;
        return this;
    }

    // nova senha e opcional — so e adicionada quando o usuario deseja alterá-la
    public adicionarSenha(senha: string) {
        this.usuario.password = senha;
        return this;
    }

    // metodo que devolve o objeto pronto
    public construir() {
        if (!this.usuario.name || !this.usuario.email) {
            throw new Error("Nome e E-mail são obrigatórios para criar o usuário.");
        }
        return this.usuario;
    }
}