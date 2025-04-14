FROM node:14.17.4-alpine3.12  AS build-stage-node

## 配置 apk包加速镜像为阿里
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

## 安装 一些基础包
RUN apk update \
  && apk upgrade \
  && apk add git \
  && apk add bash 

# ## 设置 操作系统时区
RUN rm -rf /etc/localtime \
  && ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

WORKDIR /app

# 安装 项目依赖
COPY . .
# RUN npm config set registry https://registry.npmmirror.com \
#   && npm set sass_binary_site=https://npm.taobao.org/mirrors/node-sass/ \
#   && npm install \
#   && npm run build
RUN npm install \
  && npm run build

FROM rockylinux:9.1
# 设置编码
ENV LANG C.UTF-8

# 同步时间
ENV TZ=Asia/Shanghai

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

ADD default.conf /etc/nginx/conf.d/
#ADD nginx.repo /etc/yum.repos.d/
RUN yum install -y nginx 1>/dev/null && \
  mkdir -p /data/h5/ /data/logs/ && \
  chmod -R a+x /data/h5/ 

COPY --from=build-stage-node /app/dist/ /data/h5/

EXPOSE 80
CMD ["/usr/sbin/nginx", "-g","daemon off;"]

### docker build . -t codo-cmdb-f