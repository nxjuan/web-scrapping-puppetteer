FROM postgres:latest

COPY init.sql /docker-entrypoint-initdb.d/

ENV POSTGRES_DB=meu_banco
ENV POSTGRES_USER=usuario
ENV POSTGRES_PASSWORD=senha

# RUN npx ts-node main.ts