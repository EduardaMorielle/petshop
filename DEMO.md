Guia rápido de demonstração — PetShop Care

Objetivo: apresentar a aplicação full-stack localmente ou em servidor.

Credenciais de demonstração
- admin: admin@petshop.com / admin123

Opções para executar antes da demo

1) Docker Compose (recomendado)

    cd <repo-root>
    docker-compose up --build

A API ficará em: http://localhost:28743/api e o frontend em http://localhost:24743.

2) Maven (apenas backend)

    cd <repo-root>\backend
    mvn spring-boot:run

Depois disso, inicie o frontend (separado):

    cd <repo-root>\frontend
    npm.cmd install
    npm.cmd run start -- --host 127.0.0.1 --port 4201

3) Sem Docker/Maven (apenas frontend local)

    cd <repo-root>\frontend
    npm.cmd install
    node .\node_modules\@angular\cli\bin\ng serve --host 127.0.0.1 --port 4201

Conectar ao servidor UEA
- Se pretende rodar no servidor da UEA, conecte via VPN ou estando na rede da UEA.
- SSH: ssh eduarda@172.25.1.60 e então docker-compose up --build no servidor.

Notas úteis
- Se o PowerShell bloquear a execução de npm por política, execute:
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
