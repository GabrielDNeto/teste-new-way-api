## Descrição

App [Nest](https://github.com/nestjs/nest) para gestão de tarefas, com cadastro de usuário, autenticação JWT e integração com PostgreSQL via Prisma.

## Rodando a aplicação com Docker Compose

### Pré-requisitos

- [Docker](https://www.docker.com/get-started) e [Docker Compose](https://docs.docker.com/compose/) instalados

### Passos

1. **Clone o repositório e acesse a pasta do projeto:**

   ```bash
   git clone https://github.com/GabrielDNeto/teste-new-way-api.git
   cd api teste-new-way-api
   ```

2. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

   ```env
   DATABASE_PORT=5432
   DATABASE_HOST="localhost"
   DATABASE_USER=db_user
   DATABASE_PASSWORD=db_password
   DATABASE_NAME=db_name

   DATABASE_URL="postgresql://db_user:db_password@localhost:5432/db_name"

   JWT_SECRET="dXecSoJUmhs1cI2ipGIxwjbHlY0X5q4oVK3NTqX8o53eS7yxh1"
   PORT=3001
   ```

   Ajuste os dados conforme desejar.

3. **Suba os containers:**

```bash
docker-compose up -d #-d para rodar destacado do terminal e não trava-lo
```

Isso irá:

- Subir um container do PostgreSQL
- Subir a aplicação NestJS já conectada ao banco
- Executar as migrations do Prisma automaticamente
- Executar seed com usuário padrão

```bash
#user
admin@mail.com

#senha
admin@123
```

4. **Acesse a API:**

   - A aplicação estará disponível em: [http://localhost:3001/api](http://localhost:3001/api)
   - O banco de dados estará disponível em: `localhost:5432` (usuário: postgres, senha: postgres, banco: appdb)

5. **Parar os containers:**
   ```bash
   docker-compose down
   ```

---

## Recursos úteis

- [Documentação NestJS](https://docs.nestjs.com)
- [Documentação Prisma](https://www.prisma.io/docs)
- [Documentação Docker Compose](https://docs.docker.com/compose/)
