# 🎓 Dot School API

Uma API REST desenvolvida com AdonisJS para gerenciamento de cursos, turmas, usuários e temas educacionais.

## 🚀 Como Rodar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

### 1. Descompacte o arquivo Zip
Arquivo .env com variáveis iniciais já estará incluso

### 2. Instale as dependências

```bash
npm install
```

### 4. Execute as migrações do banco de dados:

```bash
node ace migration:run
```

### 5. (Recomendado para a demonstração) Execute os seeders para popular o banco com dados de exemplo:

```bash
node ace db:seed
```

### Executando a aplicação

#### Modo desenvolvimento:

```bash
npm run dev
```

#### Modo produção:

```bash
npm run build
npm run start
```

#### Executando testes:

```bash
npm run test
```

A API estará disponível em `http://localhost:3333` por padrão.

## 📚 Documentação da API

### Base URL

```
http://localhost:3333/api
```

### 👥 Usuários

#### Listar todos os usuários

```http
GET /api/users
```

#### Criar usuário

```http
POST /api/users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com"
}
```

#### Buscar usuário por ID

```http
GET /api/users/{id}
```

#### Atualizar usuário

```http
PUT /api/users/{id}
Content-Type: application/json

{
  "name": "João Santos",
  "email": "joao.santos@example.com"
}
```

#### Deletar usuário

```http
DELETE /api/users/{id}
```

#### Listar cursos dos usuários

```http
GET /api/users/courses
```

**Parâmetros de Query:**

- `search` (opcional): Busca por nome ou email do usuário

**Exemplo:**

```http
GET /api/users/courses?search=joão
```

### 📚 Cursos

#### Listar todos os cursos

```http
GET /api/courses
```

#### Listar cursos disponíveis

```http
GET /api/courses/available
```

**Parâmetros de Query:**

- `title` (opcional): Busca por título do curso
- `themes` (opcional): Array de IDs dos temas para filtrar cursos

**Exemplos:**

```http
GET /api/courses/available?title=javascript
GET /api/courses/available?themes=1,2
GET /api/courses/available?title=web&themes=1
```

#### Criar curso

```http
POST /api/courses
Content-Type: application/json

{
  "title": "Introdução ao JavaScript",
  "description": "Curso básico de JavaScript para iniciantes",
  "imgUrl": "https://example.com/image.jpg",
  "themes": [1, 2]
}
```

#### Buscar curso por ID

```http
GET /api/courses/{id}
```

#### Atualizar curso

```http
PUT /api/courses/{id}
Content-Type: application/json

{
  "title": "JavaScript Avançado",
  "description": "Curso avançado de JavaScript",
  "imgUrl": "https://example.com/new-image.jpg",
  "themes": [1, 3]
}
```

#### Deletar curso

```http
DELETE /api/courses/{id}
```

### 🎓 Turmas

#### Listar todas as turmas

```http
GET /api/classes
```

#### Criar aula

```http
POST /api/classes
Content-Type: application/json

{
  "title": "Variáveis e Tipos de Dados",
  "description": "Aprenda sobre variáveis em JavaScript",
  "date": "2024-02-15T10:00:00.000Z",
  "courseId": 1
}
```

#### Buscar aula por ID

```http
GET /api/classes/{id}
```

#### Atualizar aula

```http
PUT /api/classes/{id}
Content-Type: application/json

{
  "title": "Variáveis, Tipos e Operadores",
  "description": "Aprenda sobre variáveis e operadores em JavaScript",
  "date": "2024-02-15T14:00:00.000Z",
  "courseId": 1
}
```

#### Deletar aula

```http
DELETE /api/classes/{id}
```

#### Associar usuário à aula

```http
POST /api/classes/{classId}/users
Content-Type: application/json

{
  "email": "email@example.com"
}
```

### 🏷️ Temas

#### Listar todos os temas

```http
GET /api/themes
```

#### Criar tema

```http
POST /api/themes
Content-Type: application/json

{
  "title": "Tecnologia"
}
```

#### Buscar tema por ID

```http
GET /api/themes/{id}
```

#### Atualizar tema

```http
PUT /api/themes/{id}
Content-Type: application/json

{
  "title": "Inovação Tecnológica"
}
```

#### Deletar tema

```http
DELETE /api/themes/{id}
```

## 🗄️ Banco de Dados

O projeto utiliza SQLite como banco de dados padrão, configurado em `config/database.ts`. O arquivo do banco é criado em `tmp/db.sqlite3`.

### Modelos principais:

- **User**: Usuários do sistema
- **Course**: Cursos disponíveis
- **Class**: Turmas pertencentes aos cursos
- **Theme**: Temas/categorias dos cursos

## 🧪 Testes

O projeto inclui testes funcionais. Execute com:

```bash
npm run test
```

Os testes estão localizados em `tests/functional` e incluem:

- Validação de dados de entrada
- Casos de sucesso e erro
- Relacionamentos entre entidades

## 📋 Observações

- A API utiliza o padrão REST com recursos (`apiOnly()`)
- Todas as respostas são em formato JSON
- O sistema inclui validação automática usando VineJS
- Os timestamps são gerenciados automaticamente (created_at, updated_at)
- O projeto segue as convenções do AdonisJS v6

## 🛠️ Scripts Disponíveis

```bash
npm run build      # Compila o projeto
npm run start      # Inicia em modo produção
npm run dev        # Inicia em modo desenvolvimento
npm run test       # Executa os testes
```

## 🔄 Status das Turmas

O sistema inclui um enum `ClassStatus` para controlar o status das turmas:

- `AVAILABLE`: Turma disponível
- `FINISHED`: Turma encerrada

## 🚀 Comandos Úteis

### Migrações

```bash
# Executar todas as migrações
node ace migration:run

# Reverter última migração
node ace migration:rollback

# Reiniciar banco de dados
node ace migration:refresh

# Reiniciar banco e executar seeders
node ace migration:refresh --seed
```

### Seeders

```bash
# Executar todos os seeders
node ace db:seed
```

### Desenvolvimento

```bash
# Modo watch para desenvolvimento
npm run dev

# Verificar tipos TypeScript
npm run typecheck

# Executar linting
npm run lint
```
