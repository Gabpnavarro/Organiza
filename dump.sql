create database organiza;

create table perfil (
	id serial primary key,
	nome text 
);

create table categorias (
	id serial primary key,
    descricao text
);

create table sub_categorias (
	id serial primary key,
	descricao text,
    categoria_id integer references categorias(id)
);

create table usuarios (
    id serial primary key,
    nome text,
    email text unique,
    senha text not null
);

create table financeiro (
    id serial primary key, 
    descricao text,
    valor integer,
    data date,
    categoria_id integer references categorias(id),
    usuario_id integer references usuarios(id)
);
  
create table instituicoes_financeiras (
	id serial primary key,
    nome text
);

insert into categorias
    (descricao)
values
    ('Investimento'),
    ('Despesas'),
    ('Receita');

insert into sub_categorias 
    (descricao, categoria_id)
values
    ('Poupança', 1), 
    ('Certificados de Depósito Bancário (CDB)', 1), 
    ('Fundos de Renda Fixa Conservadora', 1),
    ('Títulos do Tesouro Direto', 1),
    ('Depósitos a Prazo', 1),
    ('Fundo de Pensão Conservador', 1),
    ('Fundos Multimercado', 1),
    ('Fundos de Investimento em Ações Diversificadas', 1),
    ('Fundos Imobiliários', 1),
    ('Investimento em Empresas Estabelecidas', 1),
    ('Fundos de Desenvolvimento de Startups', 1),
    ('Investimento em Títulos Corporativos', 1),
    ('Ações de Tecnologia', 1),
    ('Investimento em Startups de Alto Crescimento', 1),
    ('Investimento em Criptomoedas', 1),
    ('Ações de Empresas em Crescimento', 1),
    ('Fundos de Venture Capital', 1),
    ('Commodities e Futuros', 1),
    ('Renda Fixa Conservadora', 1),
    ('Fundos de Renda Fixa', 1),
    ('Títulos do Governo', 1),
    ('Alimentação', 2),
    ('Assinaturas e Serviços', 2),
    ('Casa', 2),
    ('Mercado', 2),
    ('Cuidados Pessoais', 2),
    ('Educação', 2),
    ('Família', 2),
    ('Lazer', 2),
    ('Pets', 2),
    ('Presentes', 2),
    ('Roupas', 2),
    ('Saúde', 2),
    ('Transporte', 2),
    ('Outras Despesas', 2),
    ('Salário', 3),
    ('Bônus', 3),
    ('Aluguel de Propriedades', 3),
    ('Outras Receitas', 3);

insert into perfil
    (nome)
values
    ('Conservador'),
    ('Moderado'),
    ('Arrojado');

insert into instituicoes_financeiras
    (nome)
values
    ('Banco do Brasil'),
    ('Itaú Unibanco'),
    ('Bradesco'),
    ('Santander'),
    ('Caixa Econômica Federal'),
    ('Banco do Nordeste'),
    ('Banco do Estado do Rio Grande do Sul'),
    ('Banco do Estado de São Paulo'),
    ('Banco Inter'),
    ('Nubank'),
    ('Banco Original'),
    ('Banco Pan'),
    ('Banco BMG'),
    ('Banco Pine'),
    ('Banco Safra');