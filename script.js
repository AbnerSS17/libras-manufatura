let palavrasPorLetra = {};
let letraAtual = null;

const listaAlfabetoEl = document.getElementById("lista-alfabeto");
const listaPalavrasEl = document.getElementById("lista-palavras");
const campoBuscaEl = document.getElementById("campo-busca");
const botaoBuscarEl = document.getElementById("botao-buscar");
const tituloPalavraEl = document.getElementById("titulo-palavra");
const conteudoResultadoEl = document.getElementById("conteudo-resultado");

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalVideo = document.getElementById("modal-video");
const fecharModal = document.getElementById("fechar-modal");

function gerarAlfabeto() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  letras.forEach(letra => {
    const btn = document.createElement("button");
    btn.textContent = letra;
    btn.onclick = () => selecionarLetra(letra, btn);
    listaAlfabetoEl.appendChild(btn);
  });
}

function selecionarLetra(letra, botao) {
  letraAtual = letra;
  document.querySelectorAll(".lista-alfabeto button").forEach(b => b.classList.remove("ativo"));
  botao.classList.add("ativo");
  carregarListaDePalavras(letra);
}

async function carregarListaDePalavras(letra) {
  listaPalavrasEl.innerHTML = "";
  try {
    const resposta = await fetch(`dados/${letra}.json`);
    if (!resposta.ok) {
      listaPalavrasEl.innerHTML = "<li>Nenhuma palavra cadastrada</li>";
      return;
    }
    const lista = await resposta.json();
    palavrasPorLetra[letra] = lista;
    lista.forEach(p => {
      const li = document.createElement
