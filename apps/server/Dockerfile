FROM node:18.18.0-slim

ENV PNPM_VERSION=8.6.6

# Install pnpm
RUN apt-get update && apt-get install -y curl openssl && rm -rf /var/lib/apt/lists/*
ENV SHELL=/bin/bash
RUN curl -fsSL https://get.pnpm.io/install.sh | sh -
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app

# Install dependencies
COPY ./ /app/
RUN pnpm install
# RUN pnpm -F @toggle-sketch/orm exec prisma generate schema.prisma

# TODO: ここは修正する
RUN pnpm add -g rimraf
RUN pnpm add -g esbuild

# deploy app
RUN pnpm -F @photo-sharing/server build

EXPOSE ${PORT}

CMD ["pnpm", "-F", "@photo-sharing/server", "start"]