let dicionario = [];

// ELEMENTOS DA PÁGINA
const listaAlfabetoEl = document.getElementById("lista-alfabeto");
const listaPalavrasEl = document.getElementById("lista-palavras");
const campoBuscaEl = document.getElementById("campo-busca");
const botaoBuscarEl = document.getElementById("botao-buscar");
const tituloPalavraEl = document.getElementById("titulo-palavra");
const conteudoResultadoEl = document.getElementById("conteudo-resultado");

// MODAL
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalVideo = document.getElementById("modal-video");
const fecharModal = document.getElementById("fechar-modal");

// CARREGA DADOS DO JSON E INICIALIZA
fetch("dados.json")
  .then(res => res.json())
  .then(data => {
    dicionario = data;
    gerarAlfabeto();
    configurarBusca();
  });

// GERA BOTÕES DO ALFABETO (A - B - C - ...)
function gerarAlfabeto() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  letras.forEach(letra => {
    const btn = document.createElement("button");
    btn.textContent = letra;
    btn.addEventListener("click", () => selecionarLetra(letra, btn));
    listaAlfabetoEl.appendChild(btn);
  });
}

// CONFIGURA A BUSCA
function configurarBusca() {
  botaoBuscarEl.onclick = () => {
    const palavra = campoBuscaEl.value;
    if (!palavra) return;
    mostrarResultado(palavra);
  };

  campoBuscaEl.addEventListener("keyup", e => {
    if (e.key === "Enter") {
      const palavra = campoBuscaEl.value;
      if (!palavra) return;
      mostrarResultado(palavra);
    }
  });
}

// QUANDO CLICA EM UMA LETRA
function selecionarLetra(letra, botao) {
  document.querySelectorAll(".lista-alfabeto button").forEach(b => b.classList.remove("ativo"));
  botao.classList.add("ativo");

  const palavras = dicionario.filter(item => item.letra === letra);
  atualizarListaPalavras(palavras);
}

// ATUALIZA LISTA DE PALAVRAS DA LETRA
function atualizarListaPalavras(lista) {
  listaPalavrasEl.innerHTML = "";

  if (lista.length === 0) {
    tituloPalavraEl.textContent = "Nenhuma palavra encontrada";
    conteudoResultadoEl.innerHTML = `
      <div class="nao-encontrado">
        <h3>Ops...</h3>
        <p>Não há palavras cadastradas com essa letra.</p>
      </div>
    `;
    return;
  }

  lista.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.palavra;
    li.addEventListener("click", () => mostrarResultado(item.palavra));
    listaPalavrasEl.appendChild(li);
  });
}

// MOSTRA RESULTADO (VÍDEO + IMAGEM + MINIATURAS + TEXTO)
function mostrarResultado(palavraBuscada) {
  const palavraUpper = palavraBuscada.toUpperCase().trim();
  const item = dicionario.find(p => p.palavra === palavraUpper);

  if (!item) {
    mostrarNaoEncontrado(palavraBuscada);
    return;
  }

  tituloPalavraEl.textContent = item.palavra;

  conteudoResultadoEl.innerHTML = `
    <video class="video-grande" src="${item.video}" autoplay loop muted></video>

    <img class="imagem-grande" src="${item.imagemPrincipal}" alt="Imagem principal de ${item.palavra}">

    <div class="miniaturas">
      ${item.imagens.map(img => `<img src="${img}" alt="Imagem de ${item.palavra}">`).join("")}
    </div>

    <p class="descricao">${item.texto}</p>
  `;

  // EVENTOS PARA MODAL
  document.querySelector(".video-grande").onclick = () => abrirModalVideo(item.video);
  document.querySelector(".imagem-grande").onclick = () => abrirModalImagem(item.imagemPrincipal);

  document.querySelectorAll(".miniaturas img").forEach(img => {
    img.onclick = () => abrirModalImagem(img.src);
  });
}

// MENSAGEM DE PALAVRA NÃO ENCONTRADA (BUSCA)
function mostrarNaoEncontrado(palavraBuscada) {
  tituloPalavraEl.textContent = "Palavra não encontrada";

  conteudoResultadoEl.innerHTML = `
    <div class="nao-encontrado">
      <h3>Ops...</h3>
      <p>A palavra <strong>"${palavraBuscada}"</strong> não está cadastrada.</p>
      <p>Verifique se a palavra está correta ou tente outra pesquisa.</p>
    </div>
  `;
}

// MODAL: IMAGEM
function abrirModalImagem(src) {
  modal.style.display = "block";
  modalImg.style.display = "block";
  modalVideo.style.display = "none";
  modalImg.src = src;
}

// MODAL: VÍDEO
function abrirModalVideo(src) {
  modal.style.display = "block";
  modalImg.style.display = "none";
  modalVideo.style.display = "block";
  modalVideo.src = src;
  modalVideo.play();
}

// FECHAR MODAL
fecharModal.onclick = () => {
  modal.style.display = "none";
  modalVideo.pause();
};

window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    modalVideo.pause();
  }
};
