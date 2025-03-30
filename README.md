<div style="text-align: center">
    <h1>CourseInstructor</h1>
    Serviço completo para uma plataforma de curso, modular e com preferencias proprias.
</div>

## Pré-requisitos:

💠 Bun `1.2.4`

💠 TypeScript `5.7.2`

💠 Node `22.14.0`

💠 Docker `28.0.1(windows)`

💠 PgSql `Usado no container docker em dev mode`

💠 Redis Server `Usado na aplicação(container docker) para cache e reduzir o tempo de resposta do servidor`

Alguns requisitos são opcionais dependendo da preferencia: NodeJS ou Bun.

Caso não queira ou não possua o Docker, use o [SupaBase](https://supabase.com) para o banco de dados.

Ou utilize um [servidor postgres](https://www.postgresql.org/download/) local.

## Dependencias
[i18next](https://www.i18next.com)

[expressjs](https://expressjs.com)

[jsonwebtoken](https://jwt.io)

[passport](https://passportjs.org)

[@courseinstructor-utils](https://github.com/cainhooow/courseinstructor-utils)

## Configuração

Para Bun:

### Instalação de dependencias

```sh
bun install
```

Para NodeJS

```sh
npm install
```

### Migrations

Configure o pgsql connection no .env local:

`postgresql://{pguser}:{pgpass}@{pghost}:5432/{pgdb}`

```env
DATABASE_URL=...
```

Para gerar os types dos modelos

```sh
prisma generate
```

Para iniciar as migrations e criar as tabelas:

```sh
prisma migration dev

- Nome da migration: nome de preferencia
```

Caso já tenha o banco de dados configurado e apenas quer enviar as novas alterações:

```sh
prisma db push
```

Caso já tenha o banco de dados porem sem o `schema.prisma`

```sh
prisma db pull
```

#### Seed

Para semear o banco de dados com as configurações padrões do sistema, flags, categorias padrões...

```sh
bun run seed
```
