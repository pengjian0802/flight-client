# 使用官方 Node.js 运行时作为基础镜像
FROM node:18-alpine as build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 查看项目文件
RUN whoami
RUN ls -l
RUN ls -l node_modules/.bin/
RUN ls -l node_modules/typescript/bin

# 构建应用
RUN npm run build

# 使用轻量级的 Node.js 运行时镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 仅复制构建产物
COPY --from=build /app/dist ./dist

# 安装生产环境依赖（如果需要运行时依赖）
COPY package*.json ./
RUN npm install --production

# 暴露应用端口
EXPOSE 3000

# 启动应用
CMD ["npm", "run", "preview"]