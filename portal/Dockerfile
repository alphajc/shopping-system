FROM node:14.16.0-buster
RUN  npm config set registry https://registry.npm.taobao.org
COPY package.json /build/
WORKDIR /build
RUN npm install
ADD . /build
RUN npm run build


FROM nginx:1.19.8-alpine
LABEL maintainer=Jerry<jerry@mydream.ink>
ENV LANG C.UTF-8
ENV TZ Asia/Shanghai
COPY --from=0 /build/dist /site
