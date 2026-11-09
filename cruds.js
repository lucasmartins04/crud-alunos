const BASE_URL = 'https://lion-school-phbo.onrender.com/alunos';

const getAlunos = async () => {
  const response = await fetch(BASE_URL);
  const data = await response.json();
  return data;
};
/*
  Uso: A função não recebe parâmetros e retorna uma Promise com a lista de todos os alunos.
  Basta chamar a função e tratar o retorno conforme a necessidade da sua aplicação.
*/

const getAluno = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  const data = await res.json();
  return data;
};
/*
  Uso: A função recebe o ID do aluno como parâmetro e retorna uma Promise com os dados desse aluno específico.
*/


const postAluno = async (aluno) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(aluno)
  };

  const response = await fetch(BASE_URL, options);
  const data = await response.json();
  return data;
};
/*
  Uso: Para usar, basta criar um objeto com os dados do novo aluno (sem o ID, pois o backend gera) 
  e enviá-lo como argumento para a função.

  const novoAluno = {
    nome: "Cleyde Gomes da Silva",
    email: "cleydegomes@gmail.com",
    celular: "1199988888",
    logradouro: "rua sem fim",
    bairro: "Sem nome",
    cidade: "Barueri",
    estado: "SP",
    cep: "18135300"
  };
  
  createAluno(novoAluno);
*/


const putAluno = async (aluno) => {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(aluno)
  };

  const response = await fetch(`${BASE_URL}/${aluno.id}`, options);
  const data = await response.json();
  return data;
};
/*
  Uso: Para usar, crie um objeto contendo obrigatoriamente a propriedade 'id' e os campos que deseja atualizar.
  Envie esse objeto como argumento para a função.

  const alunoAtualizado = {
    id: "5",
    nome: "Cleyde Gomes da Silva",
    email: "cleydegomes@gmail.com"
  };
  
  putAluno(alunoAtualizado);
*/

const deleteAluno = async (id) => {
  const options = {
    method: 'DELETE'
  };

  const res = await fetch(`${BASE_URL}/${id}`, options);
  const data = await res.json();
  return data;
};
/*
  Uso: A função recebe apenas o ID do aluno que deseja remover como parâmetro.
  
  deleteAluno(5);
*/

const mostrarAlunos = async () => {

    const alunos = await getAlunos();

    const tabela = document.getElementById('tabelaAlunos');

    tabela.innerHTML = '';

    alunos.forEach(aluno => {
      

        tabela.innerHTML += `
            <tr>
                <td class="aluno-info">
                    <img src="${aluno.foto || 'https://i.pravatar.cc/300'}" alt="Foto do aluno">
                    ${aluno.nome}
                </td>

                <td>${aluno.email || 'Não informado'}</td>
                <td>${aluno.celular || 'Não informado'}</td>
                <td>${aluno.cidade || 'Não informado'} / ${aluno.estado || ''}</td>
                <td>${aluno.cep || 'Não informado'}</td>

                <td>
                    <button onclick="editarAluno(${aluno.id})">Editar</button>
                    <button onclick="excluirAluno(${aluno.id})">Excluir</button>
                </td>
            </tr>
        `;

    });

};


mostrarAlunos();

const formulario = document.getElementById('cadastroForm');

let idEditando = null;

formulario.addEventListener('submit', async (event) => {

    event.preventDefault();

    const aluno = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        celular: document.getElementById('telefone').value,
        cidade: document.getElementById('Cidade').value,
        estado: document.getElementById('estado').value,
        cep: document.getElementById('cep').value
    };

    const resposta = await postAluno(aluno);

console.log(resposta);

formulario.reset();

mostrarAlunos();

});

const editarAluno = async (id) => {

    const aluno = await getAluno(id);

    idEditando = id;

    document.getElementById('nome').value = aluno.nome;
    document.getElementById('email').value = aluno.email || '';
    document.getElementById('telefone').value = aluno.celular || '';
    document.getElementById('Cidade').value = aluno.cidade || '';
    document.getElementById('estado').value = aluno.estado || '';
    document.getElementById('cep').value = aluno.cep || '';

    document.getElementById('submitButton').style.visibility = 'hidden';
document.getElementById('atualizarButton').style.visibility = 'visible';
};

const atualizarButton = document.getElementById('atualizarButton');

atualizarButton.addEventListener('click', async () => {

    const aluno = {
        id: idEditando,
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        celular: document.getElementById('telefone').value,
        cidade: document.getElementById('Cidade').value,
        estado: document.getElementById('estado').value,
        cep: document.getElementById('cep').value
    };

    const resposta = await putAluno(aluno);

    console.log(resposta);

    formulario.reset();

    idEditando = null;

    document.getElementById('submitButton').style.visibility = 'visible';
    document.getElementById('atualizarButton').style.visibility = 'hidden';

    mostrarAlunos();

});

const excluirAluno = async (id) => {

    const confirmar = confirm('Tem certeza que deseja excluir este aluno?');

    if (confirmar) {

        await deleteAluno(id);

        mostrarAlunos();

    }

};

const campoPesquisa = document.getElementById('search');

campoPesquisa.addEventListener('input', async () => {

    const alunos = await getAlunos();

    const pesquisa = campoPesquisa.value.toLowerCase();

    const alunosFiltrados = alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(pesquisa)
    );

    const tabela = document.getElementById('tabelaAlunos');

    tabela.innerHTML = '';

    alunosFiltrados.forEach(aluno => {

        tabela.innerHTML += `
            <tr>
                <td class="aluno-info">
                    <img src="${aluno.foto || 'https://i.pravatar.cc/300'}">
                    ${aluno.nome}
                </td>

                <td>${aluno.email || 'Não informado'}</td>
                <td>${aluno.celular || 'Não informado'}</td>
                <td>${aluno.cidade || 'Não informado'} / ${aluno.estado || ''}</td>
                <td>${aluno.cep || 'Não informado'}</td>

                <td>
                    <button onclick="editarAluno(${aluno.id})">Editar</button>
                    <button onclick="excluirAluno(${aluno.id})">Excluir</button>
                </td>
            </tr>
        `;

    });

});

