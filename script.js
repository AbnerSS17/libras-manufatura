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
  tituloPalavraEl.textContent = "Sele
