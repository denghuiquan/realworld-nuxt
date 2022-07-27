# realworld-nuxt

Project Url: [https://api.github.com/repos/denghuiquan/realworld-nuxt](https://api.github.com/repos/denghuiquan/realworld-nuxt)

# A popular demo project named RealWorld implement by Nuxt
## 1. 使用 Nuxt 实现 RealWorld 全部功能
- [RealWorld 官网](https://realworld-docs.netlify.app/)

- [demo 地址](https://demo.realworld.io/#/)

## 2.相关接口及文档
- [文档说明](https://realworld-docs.netlify.app/docs/specs/backend-specs/endpoints)
  
### 可选用的api接口地址:
  - 官方接口1
    - https://api.realworld.io
    - ( 必须用自己注册的账号 )

  - 官方接口2
    - https://conduit.productionready.io   
    - ( 必须用自己注册的账号 )

  - 拉钩教育的备用接口
    - http://realworld.api.fed.lagounews.com

## 项目功能及演示相关的地址及账号
### 演示账号： 
  - 账号：huiquan@foxmail.com
  - 密码：bbbnnnmmm(希望大家不要去修改，谢谢🙏)

### 实现功能包括: 
- 注册/登录/退出
- 文章发表/修改/列表/分页/标签/详情/点赞/取消点赞
- 个人中心，个人信息更新
---
- 另外：项目实现了实现自动化部署，部署成功的[服务器地址](http://nuxt-realworld.mydomain.com): http://nuxt-realworld.mydomain.com

## 项目的打包与服务器启动及部署
### 本地开发项目启动
```sh
npm run dev
# yarn dev
```

### 生成构建及部署
```sh
npm run build
# yarn build
```
### 构建完成后如何启动服务
```sh
npm run start
# yarn start
```  
服务器的启动是基于上面`npm run build`的打包构建结果的`.nuxt`目录的，不同于`npm run dev`需要在命令运行时进行构建输出`.nuxt`目录的内容，所以`npm run start`启动服务的速度相对会快很多，秒起。

### 项目部署
- 简单的手动部署方式
  - 配置服务器和端口号
    - 可以在`nuxt.config.js`中配置
    ```js
    server:{
      host: '0.0.0.0', // 想让服务对外可以访问的话需要这样配置host，说白了就是要监听所有的网卡地址
      port: 3000 
    }
    ```
  - 压缩上传我们的发布包到服务端（最简单的事Linux的 `scp`命令）
    - 压缩上传的资源包括build后得到的：.nuxt目录、static目录、nuxt.config.js、package.js、以及package-lock.json文件。需要上传package.js主要是因为我们需要在服务器上安装项目的依赖。
  - 在服务器上解压
  - 安装依赖和启动服务
    - `npm install`
    - 使用pm2启动服务：方便管理后台进程运行的node应用
      - 安装：`npm install --global pm2`
      - 启动：`pm2 start node服务器应用脚本路径`
      - pm2常用命令：
        ```bash
        pm2 start name/id/command 启动应用
        pm2 list 查看应用列表
        pm2 stop 停止应用
        pm2 reload 重载应用
        pm2 restart 重启应用
        pm2 delete 删除应用
        ```
  - 如果端口号有不一样，需要做服务请求的代理配置即可
缺点：每次代码更新想要应用服务也及时更新，则需要重复以上的代码构建打包压缩同步传输解压安装依赖运行启动服务等一系列操作。非常的不方便。下面介绍一种项目自动化部署方案。

- 自动化部署方式（CI/CD）
  - 特别是测试环境
  - 其原理非常简单： 
    - 用户本地 -`git push`-> git远程仓库
      -`git clone`-> 
      <-发布`release`-
    -  CI/CD服务 -`deploy hook`-> web服务器
 -  这里我们使用Git Actions来作为我们的CI/CD集成服务工具实现自动部署，当然大家也可以使用其他的例如Jenkins/Gitlab CI/Travics CI/Circle CI等替代。
    -  配置access token as a project secret in your project，此外还有你的CICD发布web服务器的地址和ssh连接的用户信息USERNAME,PASSWORD,HOST,PORT,TOKEN。github actions会登录到这上面帮我们执行部署脚本`main.yml`。（当然这里也是可以使用ssh的配置公私密钥的方式登录的，仅配置ACCESS_TOKEN就可以，不过此时的ACCESS_TOKEN是服务器ssh密钥对的私钥部分；应将服务器公钥部分添加到接收部署的服务器上的authorized_keys文件中。正常情况下，ACCESS_TOKEN是 服务器 ～/.ssh目录下的id_rsa 文件中 的内容。）
    -  在项目根目录下创建一个新的目录：`.github`
    -  再创建`.github`下的`workflows`目录，即`.github/workflows`, github actions回到该目录中进行任务识别，以加载你的文件进行运行
    -  在上面创建的目录下创建main.yml文件
    ```yml
    name: Publish And Deploy Demo
    on:
      push: 
        tags: # 这里表示的是针对提交标签版本，不是每次push，cicd都去自动部署
          - 'v*' 

    jobs:
      build-and-deploy:
        runs-on: ubuntu-latest # 任务运行在 ubuntu系统上（虚拟操作系统）
        steps:

        # 下载源码
        - name: Checkout
          uses: actions/checkout@master

        # 打包构建
        - name: Build
          uses: actions/setup-node@master
        - run: npm install
        - run: npm run build
        - run: tar -zcvf release.tgz .nuxt static nuxt.config.js package.json package-lock.json pm2.config.json # 压缩，打包成 release.tgz

        # 发布 Release
        - name: Create Release
          id: create_release
          uses: actions/create-release@master
          env:
            GITHUB_TOKEN: ${{ secrets.TOKEN }} # TOKEN
          with:
            tag_name: ${{ github.ref }}
            release_name: Release ${{ github.ref }}
            draft: false # 草稿
            prerelease: false # 预发布

        # 上传构建结果到 Release
        - name: Upload Release Asset
          id: upload-release-asset
          uses: actions/upload-release-asset@master
          env:
            GITHUB_TOKEN: ${{ secrets.TOKEN }}  # 用到我们设置的 TOKEN了
          with:
            upload_url: ${{ steps.create_release.outputs.upload_url }}
            asset_path: ./release.tgz
            asset_name: release.tgz
            asset_content_type: application/x-tgz

        # 部署到服务器
        - name: Deploy
          uses: appleboy/ssh-action@master
          with: # 登录远程服务器
            host: ${{ secrets.HOST }}  
            username: ${{ secrets.USERNAME }}
            password: ${{ secrets.PASSWORD }}
            port: ${{ secrets.PORT }}
            # 运行在远程服务器的命令  
            # 下载上传的release到服务器（使用我们自己的github仓库https://github.com/denghuiquan/realworld-nuxt/releases/latest/download/release.tgz） # 解压  # 安装依赖  # 运行pm2（启动了则重启）
            script: |                
              cd /root/www
              cat ${{ steps.create_release.outputs.upload_url }}
              wget ${{ steps.create_release.outputs.upload_url }} -O release.tgz
              tar zxvf release.tgz
              npm install --production
              pm2 reload pm2.config.json
    ```
### 本项目采用MIT开源协议开发，放在 github 个人仓库, 并且实现自动化部署，希望对大家有用。
