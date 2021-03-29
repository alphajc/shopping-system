FROM node:14.16.0-buster

LABEL maintainer=Jerry<jerry@mydream.ink>
ENV LANG C.UTF-8
ENV TZ Asia/Shanghai
RUN sed -i 's/\w*.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list \
    && npm config set registry https://registry.npm.taobao.org

COPY package.json /app/

WORKDIR /app

RUN npm install
ADD . /app
RUN npm run build \
    && cd build \
    && npm ci --production

WORKDIR /app/build

CMD npm start
