# ============================================================
# ARQUIVO: backend/Dockerfile
# O QUE É: Instruções para criar a imagem Docker da API Spring Boot.
#
# ESTRATÉGIA MULTI-STAGE BUILD:
#   O build é dividido em 2 estágios para reduzir o tamanho
#   da imagem final:
#
#   ESTÁGIO 1 (build): usa uma imagem com Maven + JDK (pesada)
#   para compilar o projeto e gerar o .jar
#
#   ESTÁGIO 2 (runtime): usa apenas o JRE (leve) para executar
#   o .jar. A imagem final NÃO contém Maven nem código-fonte —
#   só o .jar e o Java Runtime.
#
#   Resultado: imagem final ~200MB em vez de ~600MB
# ============================================================

# --------------------------------------------------------
# ESTÁGIO 1: Build
# Usa a imagem oficial do Maven com JDK 21 para compilar
# --------------------------------------------------------
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copia só o pom.xml primeiro e baixa as dependências.
# Isso aproveita o cache do Docker: se o pom.xml não mudou,
# o Docker pula este passo no próximo build (muito mais rápido).
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Copia o código-fonte e compila
COPY src ./src
# -DskipTests: pula os testes para acelerar o build
# -q: modo silencioso (menos output no terminal)
RUN mvn package -DskipTests -q

# --------------------------------------------------------
# ESTÁGIO 2: Runtime
# Usa apenas o JRE (menor que o JDK) para executar o .jar
# --------------------------------------------------------
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copia apenas o .jar gerado no estágio anterior
# O *.jar pega qualquer arquivo .jar no diretório target/
COPY --from=build /app/target/*.jar app.jar

# Informa ao Docker que a aplicação escuta na porta 8743
# (apenas documentação — não expõe a porta automaticamente)
EXPOSE 8743

# Comando executado quando o container inicia
ENTRYPOINT ["java", "-jar", "app.jar"]
