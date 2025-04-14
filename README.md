# CMDB

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
### docker 部署
```
# docker 编译的时候需要修改 default.conf
proxy_pass http://10.241.0.40:8888/backend/  的网关地址
```