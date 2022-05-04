interface Veiculo {
  nome: string;
  placa: string;
  entrada: Date | string;
}

(function () {
  const $ = (query: string): HTMLInputElement | null =>
    document.querySelector(query);

  function patio() {
    function ler(): Veiculo[] {
      return localStorage.patio ? JSON.parse(localStorage.patio) : [];
    }

    function salvar(veiculos: Veiculo[]) {
      localStorage.setItem("patio", JSON.stringify(veiculos));
    }

    function adicionar(veiculo: Veiculo, salva?: boolean) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${veiculo.nome}</td>
        <td>${veiculo.placa}</td>
        <td>${veiculo.entrada}</td>
        <td>
        <button class='delete' data-placa='${veiculo.placa}'>X</button>
        </td>
        `;

      row.querySelector(".delete")?.addEventListener("click", function () {
        remover(this.dataset.placa);
      });

      $("#patio")?.appendChild(row);

      if (salva) {
        salvar([...ler(), veiculo]);
      }
    }

    function calcTempo(mil: number) {
      const min = Math.floor(mil / 60000);
      const sec = Math.floor((mil % 60000) / 1000);

      return `${min}: minutos e ${sec}: segundos`;
    }

    function remover(placa: string) {
      const { entrada, nome } = ler().find((v) => v.placa === placa);

      const tempo = calcTempo(
        new Date().getTime() - new Date(entrada).getTime()
      );

      if (
        !confirm(`O veiculo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)
      )
        return;
      salvar(ler().filter((v) => v.placa !== placa));
      render();
    }

    function render() {
      $("#patio")!.innerHTML = "";
      const patio = ler();

      if (patio.length) {
        patio.forEach((veiculo) => {
          adicionar(veiculo);
        });
      }
    }

    return { adicionar, ler, remover, salvar, render };
  }

  patio().render();

  $("#cadastrar")?.addEventListener("click", () => {
    const nome = $("#nome")?.value;
    const placa = $("#placa")?.value;

    if (!nome || !placa) {
      alert("Preencha todos os campos!");
      return;
    }

    patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
  });
})();
