# zm-kid-client

掌门少儿客户端
主要技术：react + dva + scss
采用parcel进行打包
项目启动：npm start

开发约束：
    1.所有静态资源：图片放在src/statics/images文件夹下,images里按页面划分。
    2.以路由为单位，一个路由一个页面，放在src/pages文件夹下。
    3.每个页面的文件夹下有index.js(展示的类容), model.js(页面获取数据源的地方), style.scss(页面样式), 
      service.js(后端请求接口), constants.js(用于存放常量), 其他的根据情况而定。
    4.常用组件放在src/components文件夹下。
    5.公用方法放在src/utils下。