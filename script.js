
const jogosIniciais=[
{id:1,nome:"Monster Hunter Wilds",genero:"Ação / RPG",plataforma:"PC",status:"Jogando",nota:9,descricao:"Caçadas contra monstros gigantes em um mundo dinâmico.",imagem:"imagens/wilds.jpg",},
{id:2,nome:"Monster Hunter World",genero:"Ação / RPG",plataforma:"PC",status:"Zerado",nota:9,descricao:"Uma grande aventura de caça com dezenas de monstros.",imagem:"imagens/mh world.jpg",},
{id:3,nome:"Monster Hunter Rise",genero:"Ação / RPG",plataforma:"PC",status:"Zerado",nota:9,descricao:"Caçadas rápidas com o Amicão e o conteúdo Sunbreak.",imagem:"imagens/mh rise.jpg",},
{id:4,nome:"Clair Obscur: Expedition 33",genero:"RPG",plataforma:"PC",status:"Jogando",nota:10,descricao:"RPG por turnos com elementos em tempo real.",imagem:"imagens/clair obscur.jpg",},
{id:5,nome:"Sekiro: Shadows Die Twice",genero:"Ação",plataforma:"PC",status:"Jogando",nota:9,descricao:"Ação intensa focada em parry, postura e exploração.",imagem:"imagens/sekiro.jpg",},
{id:6,nome:"Resident Evil 4",genero:"Terror / Ação",plataforma:"PC",status:"Zerado",nota:9,descricao:"Leon Kennedy enfrenta uma ameaça biológica.",imagem:"imagens/re4 remake.jpg",},
{id:7,nome:"The Forest",genero:"Sobrevivência",plataforma:"PC",status:"Jogando",nota:8,descricao:"Sobreviva em uma floresta misteriosa.",imagem:"imagens/the forest.jpg",},
{id:8,nome:"League of Legends",genero:"MOBA",plataforma:"PC",status:"Jogando",nota:8,descricao:"MOBA competitivo com dezenas de campeões.",imagem:"imagens/lol.jpg",},
{id:9,nome:"Dragon's Dogma 2",genero:"RPG",plataforma:"PC",status:"Backlog",nota:9,descricao:"RPG de ação com exploração e batalhas gigantes.",imagem:"imagens/dragon dogma7.jpg",},
{id:10,nome:"Crimson Desert",genero:"Ação / RPG",plataforma:"PC",status:"Wishlist",nota:9,descricao:"Aventura de ação em mundo aberto.",imagem:"imagens/crimson desert.jpg",}
];

let jogos=JSON.parse(localStorage.getItem("kayelJogos"));
if(!jogos){jogos=jogosIniciais;salvarJogos()}
let favoritos=JSON.parse(localStorage.getItem("kayelFavoritos"));
if(!favoritos){favoritos=[]}

const app=document.querySelector("#app");
const botoesMenu=document.querySelectorAll(".menu button");

function salvarJogos(){localStorage.setItem("kayelJogos",JSON.stringify(jogos))}
function salvarFavoritos(){localStorage.setItem("kayelFavoritos",JSON.stringify(favoritos))}

function marcarMenuAtivo(rota){
  botoesMenu.forEach(botao=>botao.classList.toggle("ativo",botao.dataset.rota===rota));
}

function irPara(rota){
  marcarMenuAtivo(rota);
  if(rota==="inicio")mostrarInicio();
  if(rota==="catalogo")mostrarCatalogo();
  if(rota==="cadastro")mostrarCadastro();
  if(rota==="favoritos")mostrarFavoritos();
  if(rota==="sobre")mostrarSobre();
}

function mostrarInicio(){
  const jogando=jogos.filter(jogo=>jogo.status==="Jogando").length;
  app.innerHTML=`
    <section class="hero">
      <h1>Seu catálogo de jogos.</h1>
      <p>Organize seus jogos, pesquise títulos, favorite seus jogos e cadastre novos jogos com capas do seu próprio PC.</p>
      <div class="acoes">
        <button class="botao" id="btnCatalogo">Explorar catálogo</button>
        <button class="botao secundario" id="btnCadastrar">Cadastrar jogo</button>
      </div>
    </section>
    <div class="secao-titulo"><h2>Resumo</h2></div>
    <div class="grade">
      <div class="card"><div class="card-conteudo"><h3>${jogos.length}</h3><p>Jogos cadastrados</p></div></div>
      <div class="card"><div class="card-conteudo"><h3>${jogando}</h3><p>Jogos que estou jogando</p></div></div>
      <div class="card"><div class="card-conteudo"><h3>${favoritos.length}</h3><p>Jogos favoritos</p></div></div>
    </div>`;
  document.querySelector("#btnCatalogo").addEventListener("click",()=>irPara("catalogo"));
  document.querySelector("#btnCadastrar").addEventListener("click",()=>irPara("cadastro"));
}

function mostrarCatalogo(){
  app.innerHTML=`
    <div class="secao-titulo"><h1>Catálogo</h1><span>${jogos.length} jogos</span></div>
    <div class="filtros">
      <input id="pesquisa" type="text" placeholder="🔎 Pesquisar jogo...">
      <select id="filtroGenero">
        <option value="todos">Todos os gêneros</option>
        <option value="Ação / RPG">Ação / RPG</option><option value="RPG">RPG</option>
        <option value="Ação">Ação</option><option value="Terror / Ação">Terror / Ação</option>
        <option value="Sobrevivência">Sobrevivência</option><option value="MOBA">MOBA</option>
      </select>
    </div>
    <div id="listaJogos" class="grade"></div>`;
  renderizarJogos();
  document.querySelector("#pesquisa").addEventListener("input",renderizarJogos);
  document.querySelector("#filtroGenero").addEventListener("change",renderizarJogos);
}

function renderizarJogos(){
  const lista=document.querySelector("#listaJogos");
  if(!lista)return;
  const pesquisa=document.querySelector("#pesquisa").value.toLowerCase();
  const genero=document.querySelector("#filtroGenero").value;
  const filtrados=jogos.filter(jogo=>{
    return jogo.nome.toLowerCase().includes(pesquisa)&&(genero==="todos"||jogo.genero===genero);
  });
  if(filtrados.length===0){lista.innerHTML=`<div class="vazio">Nenhum jogo encontrado.</div>`;return}
  lista.innerHTML=filtrados.map(criarCard).join("");
  adicionarEventosCards();
}

function criarCard(jogo){
  const estaFavorito=favoritos.includes(jogo.id);
  const capa=jogo.imagem?`<img src="${jogo.imagem}" alt="Capa de ${jogo.nome}">`:jogo.icone;
  return `
    <article class="card">
      <div class="capa">${capa}</div>
      <div class="card-conteudo">
        <h3>${jogo.nome}</h3>
        <span class="tag">${jogo.genero}</span><span class="tag">${jogo.status}</span>
        <p>${jogo.descricao}</p><strong>Nota: ${jogo.nota}/10</strong>
        <div class="card-acoes">
          <button class="detalhes-btn" data-id="${jogo.id}">Detalhes</button>
          <button class="favorito" data-id="${jogo.id}">${estaFavorito?"★":"☆"}</button>
        </div>
      </div>
    </article>`;
}

function adicionarEventosCards(){
  document.querySelectorAll(".detalhes-btn").forEach(botao=>{
    botao.addEventListener("click",()=>mostrarDetalhes(Number(botao.dataset.id)));
  });
  document.querySelectorAll(".favorito").forEach(botao=>{
    botao.addEventListener("click",()=>alternarFavorito(Number(botao.dataset.id)));
  });
}

function alternarFavorito(id){
  const posicao=favoritos.indexOf(id);
  if(posicao===-1)favoritos.push(id);else favoritos.splice(posicao,1);
  salvarFavoritos();
  mostrarCatalogo();
}

function mostrarDetalhes(id){
  const jogo=jogos.find(jogo=>jogo.id===id);
  if(!jogo)return;
  const capa=jogo.imagem?`<img src="${jogo.imagem}" alt="Capa de ${jogo.nome}">`:jogo.icone;
  app.innerHTML=`
    <div class="detalhes">
      <div class="capa">${capa}</div><h1>${jogo.nome}</h1>
      <span class="tag">${jogo.genero}</span><span class="tag">${jogo.status}</span>
      <div class="info"><div><strong>Plataforma:</strong> ${jogo.plataforma}</div><div><strong>Nota:</strong> ${jogo.nota}/10</div></div>
      <p>${jogo.descricao}</p>
      <div class="acoes"><button class="botao" id="voltar">← Voltar</button></div>
    </div>`;
  document.querySelector("#voltar").addEventListener("click",()=>irPara("catalogo"));
}

function mostrarFavoritos(){
  const jogosFavoritos=jogos.filter(jogo=>favoritos.includes(jogo.id));
  app.innerHTML=`<div class="secao-titulo"><h1>Favoritos</h1></div><div id="listaFavoritos" class="grade"></div>`;
  const lista=document.querySelector("#listaFavoritos");
  if(jogosFavoritos.length===0){lista.innerHTML=`<div class="vazio">Você ainda não adicionou nenhum jogo aos favoritos.</div>`;return}
  lista.innerHTML=jogosFavoritos.map(criarCard).join("");
  adicionarEventosCards();
}

function mostrarCadastro(){
  app.innerHTML=`
    <h1>Cadastrar jogo</h1><p>Adicione um novo jogo e escolha uma imagem do seu PC para a capa.</p>
    <form id="formJogo">
      <div class="campo"><label for="nome">Nome do jogo</label><input id="nome" type="text" placeholder="Ex: Elden Ring" required></div>
      <div class="campo"><label for="genero">Gênero</label><select id="genero" required><option value="">Selecione um gênero</option><option>Ação / RPG</option><option>RPG</option><option>Ação</option><option>Terror / Ação</option><option>Sobrevivência</option><option>MOBA</option></select></div>
      <div class="campo"><label for="plataforma">Plataforma</label><input id="plataforma" type="text" placeholder="Ex: PC" required></div>
      <div class="campo"><label for="status">Status</label><select id="status" required><option value="">Selecione o status</option><option>Jogando</option><option>Zerado</option><option>Backlog</option><option>Wishlist</option></select></div>
      <div class="campo"><label for="nota">Nota</label><input id="nota" type="number" min="0" max="10" step="0.1" placeholder="Ex: 9" required></div>
      <div class="campo"><label for="descricao">Descrição</label><input id="descricao" type="text" placeholder="Digite uma descrição" required></div>
      <div class="campo"><label for="icone">Emoji (se não usar imagem)</label><input id="icone" type="text" placeholder="Ex: 🎮" maxlength="2"></div>
      <div class="campo"><label for="imagem">Capa do jogo</label><input id="imagem" type="file" accept="image/*"><div class="preview" id="preview">Nenhuma imagem selecionada</div></div>
      <button class="botao" type="submit">Cadastrar jogo</button><div id="mensagem"></div>
    </form>`;
  document.querySelector("#imagem").addEventListener("change",previsualizarImagem);
  document.querySelector("#formJogo").addEventListener("submit",cadastrarJogo);
}

let imagemSelecionada="";

function previsualizarImagem(evento){
  const arquivo=evento.target.files[0];
  if(!arquivo)return;
  const leitor=new FileReader();
  leitor.onload=function(){imagemSelecionada=leitor.result;document.querySelector("#preview").innerHTML=`<img src="${imagemSelecionada}" alt="Prévia da capa">`};
  leitor.readAsDataURL(arquivo);
}

function cadastrarJogo(evento){
  evento.preventDefault();
  const nome=document.querySelector("#nome").value.trim();
  const genero=document.querySelector("#genero").value;
  const plataforma=document.querySelector("#plataforma").value.trim();
  const status=document.querySelector("#status").value;
  const nota=Number(document.querySelector("#nota").value);
  const descricao=document.querySelector("#descricao").value.trim();
  const icone=document.querySelector("#icone").value.trim()||"🎮";

  const novoJogo={id:Date.now(),nome,genero,plataforma,status,nota,descricao,imagem:imagemSelecionada,icone};
  jogos.push(novoJogo);
  try{
    salvarJogos();
    document.querySelector("#mensagem").innerHTML=`<div class="mensagem">Jogo cadastrado com sucesso! 🎮</div>`;
    evento.target.reset();imagemSelecionada="";document.querySelector("#preview").innerHTML="Nenhuma imagem selecionada";
  }catch(erro){
    jogos.pop();
    document.querySelector("#mensagem").innerHTML=`<div class="mensagem">A imagem é muito grande para o armazenamento do navegador. Tente uma imagem menor.</div>`;
  }
}

function mostrarSobre(){
  app.innerHTML=`<h1>Sobre o projeto</h1><div class="detalhes">
    <p>O Kayel Games é um projeto de estudo criado com HTML, CSS e JavaScript.</p>
    <p>O projeto utiliza uma estrutura de SPA, onde o conteúdo muda sem recarregar o navegador.</p>
    <p>Também são utilizados arrays, objetos, funções, eventos, formulários, filtros, manipulação do DOM, FileReader e localStorage.</p>
  </div>`;
}

botoesMenu.forEach(botao=>botao.addEventListener("click",()=>irPara(botao.dataset.rota)));
document.querySelector(".logo").addEventListener("click",evento=>{evento.preventDefault();irPara("inicio")});
mostrarInicio();
