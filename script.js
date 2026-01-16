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

  document.querySelectorAll(".lista-alfabeto button")
    .forEach(b => b.classList.remove("ativo"));
  botao.classList.add("ativo");

  carregarListaDePalavras(letra);
}

async function carregarListaDePalavras(letra) {
  listaPalavrasEl.innerHTML = "";

  const resposta = await fetch(`dados/${letra}.json`);
  if (!resposta.ok) {
    listaPalavrasEl.innerHTML = "<li>Nenhuma palavra cadastrada</li>";
    return;
  }

  const lista = await resposta.json();
  palavrasPorLetra[letra] = lista;

  lista.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p;
    li.onclick = () => carregarPalavra(p);
    listaPalavrasEl.appendChild(li);
  });
}

async function carregarPalavra(nome) {
  const resposta = await fetch(`dados/${nome}.json`);
  const dados = await resposta.json();

  tituloPalavraEl.textContent = nome;

  conteudoResultadoEl.innerHTML = `
    <video class="video-grande" src="${dados.video}" autoplay loop muted></video>

    <div class="galeria">
      ${dados.imagens.map(img => `
        <img src="${img}" alt="${nome}">
      `).join("")}
    </div>

    <p class="descricao">${dados.texto}</p>
  `;

  document.querySelector(".video-grande").onclick = () => abrirModalVideo(dados.video);

  document.querySelectorAll(".galeria img").forEach(img => {
    img.onclick = () => abrirModalImagem(img.src);
  });
}

function abrirModalImagem(src) {
  modal.style.display = "block";
  modalImg.style.display = "block";
  modalVideo.style.display = "none";
  modalImg.src = src;
}

function abrirModalVideo(src) {
  modal.style.display = "block";
  modalImg.style.display = "none";
  modalVideo.style.display = "block";
  modalVideo.src = src;
  modalVideo.play();
}

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

botaoBuscarEl.onclick = () => {
  const palavra = campoBuscaEl.value.trim().toUpperCase();
  if (palavra) carregarPalavra(palavra);
};

campoBuscaEl.addEventListener("keyup", e => {
  if (e.key === "Enter") {
    const palavra = campoBuscaEl.value.trim().toUpperCase();
    if (palavra) carregarPalavra(palavra);
  }
});

gerarAlfabeto();
