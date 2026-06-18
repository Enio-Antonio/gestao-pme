## Rotas
### api/
* __GET__: retorna todos os usuários.
* __POST__: cria um usuário.
```json
{
    "username": "",
    "email": "",
    "first_name": "",
    "password": ""
}
```

### api/\[:id]
* __GET__: retorna o usuário com o id especificado.
* __PATCH__: delete o usuário com o id especificado.
* __PUT__: atualiza todas as informações do usuário com o id especificado.
```json
{
    "username": "",
    "email": "",
    "first_name": "",
    "password": ""
}
```

### api/login/
* __POST__: retorna o token de login.
```json
{
    "username": "",
    "email": "",
    "first_name": "",
    "password": ""
}
```
