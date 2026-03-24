class CadastroFarmaceutico {
    form;
    constructor(formId) {
        const formElement = document.getElementById(formId);
        if (!formElement) {
            throw new Error("Formulário não encontrado");
        }
        this.form = formElement;
        this.init();
    }
    init() {
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            const dados = this.obterDadosFormulario();
            if (this.validarDados(dados)) {
                this.salvarFarmaceutico(dados);
            }
        });
    }
    obterDadosFormulario() {
        const nome = document.getElementById("nome").value;
        const crf = document.getElementById("crf").value;
        const email = document.getElementById("email").value;
        const telefone = document.getElementById("telefone").value;
        const especialidade = document.getElementById("especialidade").value;
        return {
            nome,
            crf,
            email,
            telefone,
            especialidade
        };
    }
    validarDados(dados) {
        if (!dados.nome || !dados.crf || !dados.email || !dados.telefone || !dados.especialidade) {
            alert("Preencha todos os campos obrigatórios.");
            return false;
        }
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailValido.test(dados.email)) {
            alert("Digite um e-mail válido.");
            return false;
        }
        return true;
    }
    salvarFarmaceutico(dados) {
        console.log("Farmacêutico cadastrado:", dados);
        alert("Farmacêutico cadastrado com sucesso!");
        this.form.reset();
    }
}
new CadastroFarmaceutico("formFarmaceutico");
export {};
