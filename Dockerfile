# 使用官方 Node.js 运行时作为基础镜像
FROM node:22.16.0 as build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 赋权
RUN chmod +x node_modules/typescript/bin/tsc
RUN chmod +x node_modules/vite/bin/vite.js
RUN chmod +x node_modules/@esbuild/linux-x64/bin/esbuild

# 查看权限
RUN ls -l node_modules/typescript/bin
RUN ls -l node_modules/vite/bin

# 构建应用
RUN npm run build

# 使用轻量级的 Node.js 运行时镜像
FROM node:22.16.0-slim

# 设置工作目录
WORKDIR /app

# 仅复制构建产物
COPY --from=build /app/dist ./dist

# 赋权
RUN chmod +x ./dist/node_modules/typescript/bin/tsc
RUN chmod +x ./dist/node_modules/vite/bin/vite.js
RUN chmod +x ./dist/node_modules/@esbuild/linux-x64/bin/esbuild

# 安装生产环境依赖（如果需要运行时依赖）
COPY package*.json ./
RUN npm install --production

# 暴露应用端口
EXPOSE 3000

# 启动应用
CMD ["npm", "run", "preview"]
