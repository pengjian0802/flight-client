# 使用Node.js Alpine基础镜像
FROM node:18-alpine as build

# 安装必要的工具
RUN apk add --no-cache bash

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 确保所有二进制文件有执行权限
RUN chmod -R +x /app/node_modules/.bin

# 使用bash执行构建命令（替代默认的sh）
SHELL ["/bin/bash", "-c"]
RUN /app/node_modules/.bin/tsc -b && /app/node_modules/.bin/vite build

# 使用轻量级的Node.js运行时镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 仅复制构建产物
COPY --from=build /app/dist ./dist

# 安装生产环境依赖
COPY package*.json ./
RUN npm install --production

# 暴露应用端口
EXPOSE 3000

# 添加健康检查
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget -q -O - http://localhost:3000/ || exit 1

# 启动应用
CMD ["npm", "run", "preview"]
