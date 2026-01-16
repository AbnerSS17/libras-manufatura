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

  try {
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
  } catch (e) {
    listaPalavrasEl.innerHTML = "<li>Erro ao carregar palavras</li>";
  }
}

async function carregarPalavra(nome) {

  // LIMPA TUDO ANTES DE CARREGAR A NOVA PALAVRA
  conteudoResultadoEl.innerHTML = "";
  modal.style.display = "none";
  modalVideo.pause();

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

gerarAlfabeto();
