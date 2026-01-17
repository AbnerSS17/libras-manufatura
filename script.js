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

function estadoInicial() {
  tituloPalavraEl.textContent = "Selecione uma palavra";
  conteudoResultadoEl.innerHTML = `
    <p class="mensagem-inicial">Nenhuma palavra selecionada ainda.</p>
  `;
}

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
      <div class="descricao-box">
        ${dados.texto || ""}
      </div>

      <div class="galeria">
        ${dados.videos ? dados.videos.map(v => `
          <video src="${v}" autoplay loop muted></video>
        `).join("") : ""}
        ${dados.imagens ? dados.imagens.map(img => `
          <img src="${img}" alt="${nome}">
        `).join("") : ""}
      </div>
    `;

    document.querySelectorAll("video").forEach(v => {
      v.muted = true;
      v.volume = 0;
      v.onclick = () => abrirModalVideo(v.src);
    });

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
  modalVideo.muted = true;
  modalVideo.volume = 0;
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

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("video").forEach(v => {
    v.muted = true;
    v.volume = 0;
  });
});

function aplicarMuteFullscreen() {
  const fullscreenEvents = [
    "fullscreenchange",
    "webkitfullscreenchange",
    "mozfullscreenchange",
    "msfullscreenchange"
  ];

  fullscreenEvents.forEach(eventName => {
    document.addEventListener(eventName, () => {
      const video =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;

      if (video && video.tagName === "VIDEO") {
        video.muted = true;
        video.volume = 0;
      }
    });
  });
}

aplicarMuteFullscreen();
gerarAlfabeto();
estadoInicial();
