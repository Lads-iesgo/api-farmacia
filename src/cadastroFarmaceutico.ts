interface Farmaceutico {
  nome: string
  crf: string
  email: string
  telefone: string
  especialidade: string
}

class CadastroFarmaceutico {

  private form: HTMLFormElement

  constructor(formId: string) {
    const formElement = document.getElementById(formId)

    if (!formElement) {
      throw new Error("Formulário não encontrado")
    }

    this.form = formElement as HTMLFormElement
    this.init()
  }

  private init(): void {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault()

      const dados = this.obterDadosFormulario()

      if (this.validarDados(dados)) {
        this.salvarFarmaceutico(dados)
      }
    })
  }

  private obterDadosFormulario(): Farmaceutico {

    const nome = (document.getElementById("nome") as HTMLInputElement).value
    const crf = (document.getElementById("crf") as HTMLInputElement).value
    const email = (document.getElementById("email") as HTMLInputElement).value
    const telefone = (document.getElementById("telefone") as HTMLInputElement).value
    const especialidade = (document.getElementById("especialidade") as HTMLInputElement).value

    return {
      nome,
      crf,
      email,
      telefone,
      especialidade
    }
  }

  private validarDados(dados: Farmaceutico): boolean {

    if (!dados.nome || !dados.crf || !dados.email || !dados.telefone || !dados.especialidade) {
      alert("Preencha todos os campos obrigatórios.")
      return false
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailValido.test(dados.email)) {
      alert("Digite um e-mail válido.")
      return false
    }

    return true
  }

  private salvarFarmaceutico(dados: Farmaceutico): void {

    console.log("Farmacêutico cadastrado:", dados)

    alert("Farmacêutico cadastrado com sucesso!")

    this.form.reset()

  }

}

new CadastroFarmaceutico("formFarmaceutico")