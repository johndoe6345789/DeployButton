# syntax=docker/dockerfile:1
FROM ubuntu:24.04 AS builder

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential cmake git ca-certificates curl \
        python3 python3-pip python3-venv \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --break-system-packages "conan>=2.0,<3.0"

WORKDIR /src

# Cache the (slow) dependency build separately from application code changes.
COPY conanfile.txt CMakeLists.txt ./
RUN conan profile detect --force \
    && conan install . --output-folder=build --build=missing -s build_type=Release

COPY main.cc ./
COPY db ./db
COPY controllers ./controllers
COPY engine ./engine
COPY repositories ./repositories
COPY config.json ./

RUN cmake -S . -B build \
        -DCMAKE_TOOLCHAIN_FILE=build/conan_toolchain.cmake \
        -DCMAKE_BUILD_TYPE=Release \
    && cmake --build build -j"$(nproc)"

FROM ubuntu:24.04 AS runtime

ENV DEBIAN_FRONTEND=noninteractive

# Runtime shared libs for the binary itself, plus the tools the workflow
# engine's steps shell out to: git (git_pull), node/npm (npm_install/npm_build),
# and the docker CLI (docker_build / talking to the host daemon via a mounted socket).
RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates libssl3 zlib1g libuuid1 libc-ares2 libsqlite3-0 \
        git curl nodejs npm docker.io \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /src/build/deploybutton_backend ./
COPY --from=builder /src/build/config.json ./
COPY --from=builder /src/build/db/schema.sql ./db/schema.sql

RUN mkdir -p /app/data

EXPOSE 8080

CMD ["./deploybutton_backend"]
