const painel = document.getElementById("painel");
const botaoPesquisarLateral = document.getElementById("botao-pesquisar-lateral");
const tituloPalavraEl = document.getElementById("titulo-palavra");
const conteudoResultadoEl = document.getElementById("conteudo-resultado");

function emModoVertical() {
  return window.matchMedia("(orientation: portrait)").matches;
}

function mostrarMenu() {
  painel.classList.remove("oculto");
  botaoPesquisarLateral.style.display = "none";
  tituloPalavraEl.textContent = "Selecione uma palavra";
  conteudoResultadoEl.innerHTML = `<p class="mensagem-inicial">Nenhuma palavra selecionada ainda.</p>`;
}

function esconderMenu() {
  painel.classList.add("oculto");
  botaoPesquisarLateral.style.display = "flex";
}

function ajustarEstadoInicial() {
  if (emModoVertical()) {
    mostrarMenu();
  } else {
    painel.classList.remove("oculto");
    botaoPesquisarLateral.style.display = "none";
  }
}

window.addEventListener("resize", ajustarEstadoInicial);

/* ... restante do código de busca, alfabeto, carregamento de palavra, modal ... */

ajustarEstadoInicial();
