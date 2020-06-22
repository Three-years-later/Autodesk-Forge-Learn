# BIMPOP前端项目结构

## Project setup 项目设置

### Run project installation dependencies 运行项目安装依赖
```
npm install
```

### Compiles and hot-reloads for development 编译和热更新以进行开发
```
npm run serve
```

### Compiles and minifies for production 编译并最小化生产
```
npm run build
```

### Run your unit tests 运行单元测试
```
npm run test:unit
```

### Lints and fixes files 整理和修复文件
```
npm run lint // 修复错误的配置
```

### Customize configuration 自定义配置
See [Configuration Reference](https://cli.vuejs.org/config/).

## 项目目录文件(以及文件作用作出的解释)

—script
  --template.js 全局组件、页面模板
  --generateComponent.js 生成全局组件，在终端输入npm run new:comp，存放src/components/global
  --generateView.js 生成全局页面，在终端输入npm run new:view，存放src/views
—src
  |—api
   --index.js axios请求设置以及请求拦截器、响应拦截器，错误处理
   --user.js 账号登录token绑定以及退出登录清除token
  |—assets 静态资源
    |—bimmodel
      --model
    |—images 图片资源
      --logo.png
  |—common
    |—libs
      --tools.js
    |—style
      --function.less
      --media.css
    |—user
      --index.js 利用Cookies封装用户登录退出方法
    |—util
      --index.js 关于获取天数、时间差、周几的方法封装
  |—components 全局组件
    |—global 组件存放位置
    --index.js 自动注册global下的全局组件
  |—mixins
    --workers-mixin.js
  >组件在引用之后相当于在父组件内开辟了一块单独的空间，来根据父组件props过来的值进行相应的操作，单本质上两者还是泾渭分明，相对独立。
  >而mixins则是在引入组件之后，则是将组件内部的内容如data等方法、method等属性与父组件相应内容进行合并。相当于在引入后，父组件的各种属性方法都被扩充了。
  >单纯组件引用：
    父组件 + 子组件 >>> 父组件 + 子组件
  >mixins：
    父组件 + 子组件 >>> new父组件
  >作用：多个组件可以共享数据和方法，在使用mixin的组件中引入后，mixin中的方法和属性也就并入到该组件中，可以直接使用。钩子函数会两个都被调用，mixin中的钩子首先执行。

  |—router 路由
    --index.js 自动导入子项目路由
  |—store vuex全局状态管理
    --index.js
  |—utils
    --auth.js Cookies获取、保存和删除token方法封装
    --dateUtil.js 关于时间的方法封装
    --myCharts.js 关于图表的方法封装
    --postExcel.js 利用axios封装post方法获取表格文件的方法
    --Receipt.js 
—tests
  |—unit
    --.eslintrc.js 指定环境，mocha - 添加所有的 Mocha 测试全局变量。
    --example.spec.js
—.browserslistrc 设置浏览器的兼容
  >对于部分配置参数做一些解释:
  >" >1%" :代表着全球超过1%人使用的浏览器
  >“last 2 versions” : 表示所有浏览器兼容到最后两个版本
  >“not ie <=8” :表示IE浏览器版本大于8（实则用npx browserslist 跑出来不包含IE9 ）
  >“safari >=7”:表示safari浏览器版本大于等于7

—.editorconfig 编辑器的配置文件以及编码等信息
  >root = true // 让这个文件生效
  >
  >[*] // 对所有文件都生效
  >charset = utf-8 // 编码
  >indent_style = space // 缩进'tabs键',如果习惯用空格可以设为'space'
  >indent_size = 2 // 缩进的尺寸
  >end_of_line = lf // 换行符格式(开发系统差异)
  >insert_final_newline = true // 是否在文件的最后插入一个空行
  >trim_trailing_whitespace = true // 是否删除行尾的空格
  >————————————————
  >版权声明：本文为CSDN博主「tjh0001」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
  >原文链接：https://blog.csdn.net/qq_39748755/article/details/105661935

—.eslintrc.js ESlint配置文件
  >配置参数
  >版权声明：本文为CSDN博主「Joyin-Love」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
  >原文链接：https://blog.csdn.net/weixin_38606332/article/details/80864381

—.gitignore 多人开发vue项目，git中.gitignore忽略文件的添加和使用
  >作者：CoderZb
  >链接：https://www.jianshu.com/p/40b1a184cf8c
  >来源：简书
  >著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

—babel.config.js 
  >在webpack 中，默认只能处理 一部分 ES6 的新语法，一些更高级的ES6语法或者 ES7 语法，webpack 是处理不了的；这时候就需要 借助于第三方的 loader，来帮助webpack 处理这些高级的语法，当第三方loader 把 高级语法转为 低级的语法之后，会把结果交给 webpack 去打包到 bundle.js 中通过 Babel ，可以帮我们将 高级的语法转换为 低级的语法
  >————————————————
  >版权声明：本文为CSDN博主「马早的博客」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
  >原文链接：https://blog.csdn.net/Funny_Ma/article/details/99936315

—package.json 当我们创建一个node项目，意味着创建一个module模块，这个模块的描述文件，叫package.json。
  >原文链接:https://www.jianshu.com/p/ad6220f69bfb

—postcss.config.js postcss-pxtorem是PostCSS的插件，用于将像素单元生成rem单位。
—vue.config.js Vue Cli 3生成的项目结构，没有build、config目录，而是使用vue.config.js来进行配置
  >原文链接：https://www.cnblogs.com/sea-breeze/p/11310856.html

## 项目技术栈

### Vue.js渐进式框架

* **vue**

  * 独立构建和运行时构建

    有两种构建方式，独立构建和运行构建。它们的区别在于前者包含模板编译器而后者不包含。

    模板编译器的职责是将模板字符串编译为纯JavaScript的渲染函数。如果你想要在组件中使用template选项，你就需要编译器。

  * 生命周期
  * 计算(computed)属性
    模板内的表达式不应该包含太多的逻辑，对于任何复杂逻辑，都应当使用计算属性

    computed属性和methods不同的是计算属性是基于它们的依赖进行缓存的。

    computed属性和computed属性，通常更好的想法是使用computed属性而不是命令式的watch回调。虽然计算属性在大多数情况下更合适，但有时也需要一个自定义的watcher。当你想要在数据变化响应时，执行异步操作或开销较大的操作，这是很有用的。

  * 数组更新检测
  * 
    数组的变异方法(mutation method，会改变被这些方法调用的原始数组)会触发视图更新，有以下七个：
    ```
    push()
    pop()
    shift()
    unshift()
    splice()
    sort()
    reverse()
    ```
    当使用非变异方法时，可以用新数组替换旧数组，或者使用Vue.set方法。

  * 对象更新

    可以用新对象替换旧对象，或者使用Vue.set方法
    ```
    Vue.set(vm.someObject, 'foo', 'bar')
    this.someObject = Object.assign({}, this.someObject, { a:1, b:2 })
    ```
  * 事件处理器

    Vue.js为v-on提供了事件修饰符和按键修饰符

  * 表单控件绑定

    可以用v-model指令在表单控件元素上创建双向数据绑定。常见修饰符有.lazy、.number、.trim。

    也可以使用自定义事件的表单输入组件。

  * 组件

    Vue组件的API来自三部分：props,events和slots：

      >Props允许外部环境传递数据给组件
      >Events允许组件触发外部环境的副作用
      >Slots允许外部环境将额外的内容组合在组件中。

    1. 组件的data属性必须是函数

    2. 父子组件

    在Vue.js中，父子组件的关系可以总结为 props down, events up 。父组件通过props向下传递数据给子组件，子组件通过events给父组件发送消息。

    prop是单向绑定的：当父组件的属性变化时，将传导给子组件，但是不会反过来。这是为了防止子组件无意修改了父组件的状态——这会让应用的数据流难以理解。

    另外，每次父组件更新时，子组件的所有prop都会更新为最新值。这意味着你不应该在子组件内部改变prop。如果你这么做了，Vue会在控制台给出警告。

    为什么我们会有修改prop中数据的冲动呢？通常是这两种原因：

    (1) prop作为初始值传入后，子组件想把它当作局部数据来用；

    (2) prop作为初始值传入，由子组件处理成其它数据输出。

    对这两种原因，正确的应对方式是：

    (1) 定义一个局部变量，并用prop的值初始化它：
    ```
    props: ['initialCounter'],
    data: function () {
      return { counter: this.initialCounter }
    }
    ```
    (2) 定义一个计算属性，处理prop的值并返回。
    ```
    props: ['size'],
    computed: {
      normalizedSize: function () {
        return this.size.trim().toLowerCase()
      }
    }
    ```
    **注意在JavaScript中对象和数组是引用类型，指向同一个内存空间，如果prop是一个对象或数组，在子组件内部改变它会影响父组件的状态。**

    3. 非父子组件

    有时候两个组件也需要通信(非父子关系)。在简单的场景下，可以使用一个空的Vue实例作为中央事件总线。在复杂的情况下，我们应该考虑使用专门的状态管理模式。

    4. .sync修饰符

    在一些情况下，我们可能会需要对一个prop进行『双向绑定』。

    2.0中移除了.sync，Vue2.3.0+又将其添加回来了，但是这次它只是作为一个编译时的语法糖存在，它会被扩展为一个自动更新父组件属性的v-on侦听器。如下代码
    ```
    <comp :foo.sync="bar"></comp>
    ```
    会被扩展为：
    ```
    <comp :foo="bar" @update:foo="val => bar = val"></comp>
    ```
    当子组件需要更新foo的值时，它需要显式地触发一个更新事件：
    ```
    this.$emit('update:foo', newValue)
    ```
    5. 使用slot进行内容分发

    作用域插槽：接收从子组件中传递的prop对象。作用域插槽更具代表性的用例是列表组件，允许组件自定义应该如何渲染列表每一项

    6. 动态组件、is特性和keep-alive指令

    7. 子组件索引

    尽管有props和events，但是有时仍然需要JavaScript中直接访问子组件。为此可以使用ref为子组件指定一个索引ID。

  * 异步更新队列

    >虽然 Vue.js 通常鼓励开发人员沿着“数据驱动”的方式思考，避免直接接触 DOM，但是有时我们确实要这么做。为了在数据变化之后等待 Vue 完成更新 DOM ，可以在数据变化之后立即使用 Vue.nextTick(callback) 。这样回调函数在 DOM 更新完成后就会调用。

  * 过渡效果

    Vue在插入、更新或者移除DOM时，提供多种不同方式的应用过渡效果。包括以下工具：

    >在CSS过渡和动画中自动应用class
    >可以配合使用第三方CSS动画库，如Animate.css
    >在过渡钩子函数中使用JavaScript直接操作DOM
    >可以配合使用第三方JavaScript动画库，如Velocity.js

    1. 单元素/组件的过渡

    Vue提供了transition的封装组件，在下列情形中，可以给任何元素和组件添加过渡

    >条件渲染（使用v-if）
    >条件展示（使用v-show）
    >动态组件
    >组件根节点

    2. 多个元素的过渡

    对于原生标签可以使用 v-if/v-else

    3. 多个组件的过渡

    多个组件的过渡我们可以使用动态组件。

    4. 列表过渡

  * Render函数和JSX
  * 混合

    混合是一种灵活的分布式复用Vue组件的方式。混合对象可以包含任意组件选项。以组件使用混合对象时，所有混合对象的选项将被混入该组件本身的选项。

  * 插件

    1. 创建插件

    Vue.js的插件应当有一个公开方法install。这个方法的第一个参数是Vue构造器 , 第二个参数是一个可选的选项对象。

    2. 使用插件

    通过全局方法Vue.use()使用插件:
    ```
    // 调用 `MyPlugin.install(Vue)`
    Vue.use(MyPlugin)
    ```
    也可以传入一个选项对象:
    ```
    Vue.use(MyPlugin, { someOption: true })
    ```
* **vue-router**
  * 两种导航方式

    1. router-link声明式导航
    ```
    <router-link to="/foo">Go to Foo</router-link>
    ```
    router-link对应的路由匹配成功，将自动设置class属性值.router-link-active。

    2. 编程式导航
    ```
    // 字符串
    router.push('home')

    // 对象
    router.push({ path: 'home' })

    // 命名的路由
    router.push({ name: 'user', params: { userId: 123 }})

    // 带查询参数，变成 /register?plan=private
    router.push({ path: 'register', query: { plan: 'private' }})
    ```
  * 重命名(redirect)和别名(alias)
  * 两种路由模式
  * 导航钩子
  * 路由meta
  * 过渡动效
  * 滚动行为(scrollBehavior)
  * 路由懒加载
  * router-link
  * Router构造配置
  * 对组件注入
* **vuex**
  * state
  * getters
  * mutations
  * actions
  * Modoles
  * 插件
  * 严格模式
  * 表单处理
  * 测试
  * 热重载

>原文链接：https://www.cnblogs.com/ang-/p/7082291.html
