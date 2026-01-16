/* ELEMENTOS PRINCIPAIS */
const painel = document.getElementById("painel");
const botaoPesquisarLateral = document.getElementById("botao-pesquisar-lateral");
const tituloPalavraEl = document.getElementById("titulo-palavra");
const conteudoResultadoEl = document.getElementById("conteudo-resultado");

const listaAlfabetoEl = document.getElementById("lista-alfabeto");
const listaPalavrasEl = document.getElementById("lista-palavras");
const campoBuscaEl = document.getElementById("campo-busca");
const botaoBuscarEl = document.getElementById("botao-buscar");

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalVideo = document.getElementById("modal-video");
const fecharModal = document.getElementById("fechar-modal");

/* DETECTA MODO VERTICAL */
function emModoVertical() {
  return window.matchMedia("(orientation: portrait)").matches;
}

/* MOSTRAR PAINEL (MODO VERTICAL) */
function mostrarMenu() {
  painel.classList.remove("oculto");
  botaoPesquisarLateral.style.display = "none";

  tituloPalavraEl.textContent = "Selecione uma palavra";
  conteudoResultadoEl.innerHTML = `
    <p class="mensagem-inicial">Nenhuma palavra selecionada ainda.</p>
  `;
}

/* ESCONDER PAINEL (MODO VERTICAL) */
function esconderMenu() {
  painel.classList.add("oculto");
  botaoPesquisarLateral.style.display = "flex";
}

/* AJUSTE INICIAL */
function ajustarEstadoInicial() {
  if (emModoVertical()) {
    painel.classList.remove("oculto");
    botaoPesquisarLateral.style.display = "none";
    tituloPalavraEl.textContent = "Selecione uma palavra";
    conteudoResultadoEl.innerHTML = `
      <p class="mensagem-inicial">Nenhuma palavra selecionada ainda.</p>
    `;
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
    listaAlfabetoEl.appendChild(btn);
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
  listaPalavrasEl.innerHTML = "";

  try {
    const resposta = await fetch(`dados/${letra}.json`);

    if (!resposta.ok) {
      listaPalavrasEl.innerHTML = "<li>Nenhuma palavra cadastrada</li>";
      return;
    }

    const lista = await resposta.json();

    lista.forEach(p => {
      const li = document.createElement("li");
      li.textContent = p;
      li.onclick = () => carregarPalavra(p);
      listaPalavrasEl.appendChild(li);
    });

  } catch (e) {
    listaPalavrasEl.innerHTML = "<li>Erro ao carregar palavras</li>";
  }
}

/* CARREGA PALAVRA */
async function carregarPalavra(nome) {
  conteudoResultadoEl.innerHTML = "";
  modal.style.display = "none";
  modalVideo.pause();

  if (emModoVertical()) {
    esconderMenu();
  }

  try {
    const resposta = await fetch(`dados/${nome}.json`);

    if (!resposta.ok) {
      tituloPalavraEl.textContent = nome;
      conteudoResultadoEl.innerHTML = `
        <p class="mensagem-erro">Palavra não encontrada no dicionário.</p>
      `;
      return;
    }

    const dados = await resposta.json();

    tituloPalavraEl.textContent = nome;

    conteudoResultadoEl.innerHTML = `
      <div class="galeria">
        <video src="${dados.video}" autoplay loop muted></video>
        ${dados.imagens.map(img => `
          <img src="${img}" alt="${nome}">
        `).join("")}
      </div>

      <div class="descricao-box">
        ${dados.texto}
      </div>
    `;

    const videoEl = document.querySelector(".galeria video");
    if (videoEl) {
      videoEl.onclick = () => abrirModalVideo(dados.video);
    }

    document.querySelectorAll(".galeria img").forEach(img => {
      img.onclick = () => abrirModalImagem(img.src);
    });

  } catch (e) {
    tituloPalavraEl.textContent = nome;
    conteudoResultadoEl.innerHTML = `
      <p class="mensagem-erro">Erro ao carregar os dados da palavra.</p>
    `;
  }
}

/* MODAL DE IMAGEM */
function abrirModalImagem(src) {
  modal.style.display = "block";
  modalImg.style.display = "block";
  modalVideo.style.display = "none";
  modalImg.src = src;
}

/* MODAL DE VÍDEO */
function abrirModalVideo(src) {
  modal.style.display = "block";
  modalImg.style.display = "none";
  modalVideo.style.display = "block";
  modalVideo.src = src;
  modalVideo.play();
}

/* FECHAR MODAL */
fecharModal.onclick = () => {
  modal.style.display = "none";
  modalVideo.pause();
};

window.onclick = e => {
  if (e.target === modal) {
    modal.style.display = "none";
    modalVideo.pause();
  }
};

/* BUSCA */
botaoBuscarEl.onclick = () => {
  const palavra = campoBuscaEl.value.trim().toUpperCase();
  if (!palavra) return;
  carregarPalavra(palavra);
};

campoBuscaEl.addEventListener("keyup", e => {
  if (e.key === "Enter") {
    const palavra = campoBuscaEl.value.trim().toUpperCase();
    if (!palavra) return;
    carregarPalavra(palavra);
  }
});

/* INICIALIZAÇÃO */
gerarAlfabeto();
ajustarEstadoInicial();
