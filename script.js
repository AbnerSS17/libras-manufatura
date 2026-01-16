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

/* GERA ALFABETO */
function gerarAlfabeto() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  letras.forEach(letra => {
    const btn = document.createElement("button");
    btn.textContent = letra;
    btn.onclick = () => selecionarLetra(letra, btn);
    document.getElementById("lista-alfabeto").appendChild(btn);
  });
}

/* SELECIONA LETRA */
function selecionarLetra(letra, botao) {
  document.querySelectorAll(".lista-alfabeto button")
    .forEach(b => b.classList.remove("ativo"));
  botao.classList.add("ativo");
  carregarListaDePalavras(letra);
}

/* CARREGA LISTA DE PALAVRAS */
async function carregarListaDePalavras(letra) {
  const listaEl = document.getElementById("lista-palavras");
  listaEl.innerHTML = "";

  try {
    const resposta = await fetch(`dados/${letra}.json`);
    if (!resposta.ok) {
      listaEl.innerHTML = "<li>Nenhuma palavra cadastrada</li>";
      return;
    }

    const lista = await resposta.json();
    lista.forEach(p => {
      const li = document.createElement("li");
      li.textContent = p;
      li.onclick = () => carregarPalavra(p);
      listaEl.appendChild(li);
    });
  } catch {
    listaEl.innerHTML = "<li>Erro ao carregar palavras</li>";
  }
}

/* CARREGA PALAVRA */
async function carregarPalavra(nome) {
  conteudoResultadoEl.innerHTML = "";
  document.getElementById("modal").style.display = "none";
  document.getElementById("modal-video").pause();

  if (emModoVertical()) {
    esconderMenu();
  }

  try {
    const resposta = await fetch(`dados/${nome}.json`);
    if (!resposta.ok) {
      tituloPalavraEl.textContent = nome;
      conteudoResultadoEl.innerHTML = `<p class="mensagem-erro">Palavra não encontrada no dicionário.</p>`;
      return;
    }

    const dados = await resposta.json();
    tituloPalavraEl.textContent = nome;

    conteudoResultadoEl.innerHTML = `
      <div class="galeria">
        <video src="${dados.video}" autoplay loop muted></video>
        ${dados.imagens.map(img => `<img src="${img}" alt="${nome}">`).join("")}
      </div>
      <div class="descricao-box">${dados.texto}</div>
    `;

    document.querySelector(".galeria video").onclick = () => abrirModalVideo(dados.video);
    document.querySelectorAll(".galeria img").forEach(img => {
      img.onclick = () => abrirModalImagem(img.src);
    });

  } catch {
    tituloPalavraEl.textContent = nome;
    conteudoResultadoEl.innerHTML = `<p class="mensagem-erro">Erro ao carregar os dados da palavra.</p>`;
  }
}

/* MODAL */
function abrirModalImagem(src) {
  const modal = document.getElementById("modal");
  modal.style.display = "block";
  document.getElementById("modal-img").style.display = "block";
  document.getElementById("modal-video").style.display = "none";
  document.getElementById("modal-img").src = src;
}

function abrirModalVideo(src) {
  const modal = document.getElementById("modal");
