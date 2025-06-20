# 使用非Alpine的Node.js基础镜像
FROM node:18 as build

# 创建非root用户
RUN groupadd -r appgroup && useradd -r -g appgroup -m -d /app appuser

# 设置工作目录并赋予权限
WORKDIR /app
RUN chown -R appuser:appgroup /app

# 切换到非root用户
USER appuser

# 复制package.json和package-lock.json（确保正确的所有者）
COPY --chown=appuser:appgroup package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件（确保正确的所有者）
COPY --chown=appuser:appgroup . .

# 构建应用
RUN npm run build

# 使用轻量级的Node.js运行时镜像
FROM node:18-slim

# 创建相同的非root用户
RUN groupadd -r appgroup && useradd -r -g appgroup -m -d /app appuser

# 设置工作目录
WORKDIR /app

# 仅复制构建产物（从构建阶段并保持所有者）
COPY --from=build --chown=appuser:appgroup /app/dist ./dist

# 安装生产环境依赖
COPY --chown=appuser:appgroup package*.json ./
RUN npm install --production

# 暴露应用端口
EXPOSE 3000

# 添加健康检查
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# 以非root用户身份启动应用
USER appuser
CMD ["npm", "run", "preview"]
