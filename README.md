#Storage.js

Storage.js是一个基于HTML5 Web本地存储的扩展解决方案，由于IE早期版本不支持本地存储(localStorage),幸运的是，我们可以通过userData来支持Web客户端存储更多的数据。同时由于传统本地存储cookie本身的不可替代性，Storage.js也封装了对cookie的处理。

在介绍API之前，关于localStorage，userData，cookie有些特性需要说明一下：

- cookie会随着HTTP请求的头报文发送到服务端，而localStorage,userData则不会
- 三者可存储数据大小有区别
- localStorage本身没有失效时间，Storage.js对其添加了失效时间的扩展
- userData只能读取和存储当前Path下的数据，为了方便其他Path访问本地数据，Storage.js将数据存储在当前域下

###使用范围

Storage.js是WEB端本地存储的解决方案，所以在做Web开发时，如果需要将数据存储到客户端，都可以使用Storage.js，当然一定要考虑两点：这些数据存储到客户端是否安全；本地可存储数据的大小。同时Storage.js还支持CommonJS和AMD标准规范，所以我们能够很方便的调用。

###语法

    Storage.set(name,value,expires); //添加本地存储数据，有效期是expries(单位秒)
    Storage.get(name); //获取本地存储数据
    Storage.add(name,value,expires); //给本地数据name添加值，如果本地没有name，那么创建name，值为value，有效期为expires(单位秒)
    Storage.remove(name,value); //删除本地数据,如果value为空，则删除name所有数据

    //以下是对cookie的处理

    Storage.cookie.set(name,value,seconds,domain,path);
    Storage.cookie.add(name,value,seconds,domain,path);
    Storage.cookie.get(name);
    Storage.cookie.remove(name,value);

### 许可协议

Copyright (c) 2013 Hongbo Yang <abcrun@gmail.com>

The MIT License
