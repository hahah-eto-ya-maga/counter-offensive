FROM node:latest

WORKDIR /code

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install --frozen-lockfile

CMD if [ -e ./build/index.html ]; then echo "Build already created"; else yarn run build; fi