# 使用非Alpine的Node.js基础镜像（解决musl libc兼容性问题）
FROM node:18 as build

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖（禁用二进制验证以确保权限正确）
RUN npm install --unsafe-perm=true --allow-root

# 复制项目文件
COPY . .

# 确保所有二进制文件有执行权限
RUN chmod -R +x /app/node_modules/.bin

# 构建应用
RUN npm run build

# 使用轻量级的Node.js运行时镜像
FROM node:18-slim

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
