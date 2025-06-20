# 构建阶段
FROM node:24-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装生产和开发依赖
RUN npm install

# 复制项目文件
COPY . .

# 执行构建命令
RUN npm run build

# 运行阶段
FROM node:24-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 只安装生产依赖
RUN npm install --production

# 从构建阶段复制构建好的文件
COPY --from=builder /app/dist ./dist

# 暴露端口，根据你的 Vite 配置修改
EXPOSE 3000

# 启动应用
CMD ["npm", "run", "preview"]