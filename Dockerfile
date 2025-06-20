# 使用官方 Node.js 运行时作为基础镜像
FROM node:18-alpine as build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装所有依赖（包括开发依赖）
RUN npm install

# 复制项目文件
COPY . .

# 构建应用（使用完整路径执行本地命令）
RUN /app/node_modules/.bin/tsc -b && /app/node_modules/.bin/vite build

# 使用轻量级的 Node.js 运行时镜像
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
  CMD curl -f http://localhost:3000/ || exit 1

# 启动应用
CMD ["npm", "run", "preview"]
