
#
# MKS - Back-end Challenge
![Badge em Desenvolvimento](http://img.shields.io/static/v1?label=STATUS&message=EM%20PRODUÇÃO&color=blue&style=for-the-badge)  ![Badge Versão](https://img.shields.io/badge/VERSION-1.0.0-blue?style=for-the-badge) 

## Índice

* [Descrição](#descrição)
* [Como utilizar](#como-utilizar)
* [Tecnologias utilizadas](#tecnologias-utilizadas)
* [Autor](##autor)

## 🚀 Descrição

Projeto desenvolvido para o MKS Challenge Back-end. O **Movies Catalog** tem o intuito de realizar a catalogação de filmes, indicando seu nome e gênero.

## 📄 Como utilizar

Endpoint para o consumo da API:

    https://dc-movies-catalog.herokuapp.com/

> Para vizualizar todos os end-points da API acesse a [Documentação
> Completa](https://dc-movies-catalog.herokuapp.com/api#)

Para realizar a instalação você precisa primeiramente clonar este repositório digitando o comando abaixo no terminal:

    https://github.com/dchueri/movies-catalog.git

Em seguida, acesse a página do projeto:

    cd movies-catalog

Caso você queira utilizar o Docker (recomendado) basta inserir o comando a seguir:

    docker compose -up --build
Ou caso contrário, acesse a pagina *movies-server* e inicie a aplicação:

    cd movies-server
    npm install    
    

**Para ter acesso a documentação completa acesse no seu navegador:**

    http://localhost:3000/api#/


## 🛠️ Construído com

* `TypeScript` - Utilizado buscando aproveitar ao máximo o seu diferencial se comparado com o NodeJS, a tipagem;
* `NestJs` - Framework back-end que fornece um ótimo auxílio para a criação da API. Nele foi respeitada a arquitetura sugerida pela própria documentação. Tanto no gerenciamento dos módulos, quanto na autenticação de usuários e até mesmo nos testes;
* `Docker` - Foi disponibilizado o arquivo docker-compose para execução da aplicação em containers (de forma mais estável);
* `TypeORM` - Utilizado para o gerenciamento de repositórios e entidades. Fazendo a coneção da aplicação com os bancos de dados;
* `PostgreSQL` - Banco de dados relacional utilizado para o armazenamento de dados;
* `Redis` - Banco de dados "NoSQL" o qual armazena seus dados em memória. Com isso, foi utilizado para evitar pesquisas recorrentes no PostgreSQL. Guardando o retorno de todos os filmes por 5 minutos a cada pesquisa do usuário; e 
* `Swagger` - Utilizado para a confecção da documentação da API.

## ✒️ Autor

| [<img src="https://avatars.githubusercontent.com/u/84249430?s=400&u=b789830e57ccc23a4d4d758542785461dd656b5f&v=4" width=115><br><sub>Diego  Chueri</sub>](https://github.com/dchueri) | 
| :---: |
