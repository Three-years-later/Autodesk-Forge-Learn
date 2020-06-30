![ForgeVuer](assets/images/forgeVuerLogo.png)

# ForgeVuer <!-- omit in toc -->

Vue.js组件可为Vue.js上的Autodesk Forge Viewer 提供易于设置的，几乎“即插即用”的体验

- [Getting Started 入门](#getting-started-入门)
  - [Prerequisites 先决条件](#prerequisites-先决条件)
  - [Installing 安装](#installing-安装)
- [TL;DR](#tldr)
- [Setup 建立](#setup-建立)
  - [Access Token 访问令牌](#access-token-访问令牌)
- [Properties 属性](#properties-属性)
- [Events 事件](#events-事件)
  - [Forge Viewer Events](#forge-viewer-events)
  - [ForgeVuer Events](#forgevuer-events)
- [Custom Extensions (6.*)](#custom-extensions-6)
- [Custom Extensions (7.*)](#custom-extensions-7)
- [Detailed implementation note 详细的实施说明(nuxt.js, 2 legged authtication, OSS bucket approch)](#detailed-implementation-note-详细的实施说明nuxtjs-2-legged-authtication-oss-bucket-approch)
- [Versioning 版本控制](#versioning-版本控制)
- [License](#license)

## Getting Started 入门

这些说明将使您开始了解如何安装，使用和自定义**ForgeVuer**组件。

### Prerequisites 先决条件

- 一个使用组件的最小**Vue**应用程序。
- html`head`分引用了最新的Autodesk Forge Viewer**版本7**样式和javascript文件。

```html
<head>
  [...]
  <!-- Autodesk Forge Viewer files -->
  <link rel="stylesheet" href="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css" type="text/css">
  <script src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js"></script>
  [...]
</head>
```

### Installing 安装

```
npm install forge-vuer
```

## TL;DR

SPA应用程序上的最小工作设置：

```html
<!-- App.vue-->
<template>
  <div id="app">
    <forge-vuer
      :getAccessToken="myGetTokenMethodAsync"
      :urn="myObjectUrn"
    />
  </div>
</template>

<script>
import ForgeVuer from 'forge-vuer'

export default {
  name: 'app',
  components: { ForgeVuer },
  data: () => {
    return {
      myToken: '{A VALID, NON_EXPIRED TOKEN CAN BE USE FOR TESTING PURPOSES}',
      myObjectUrn: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c2Rhc2Rhc2QvYnVubnkub2Jq',
    }
  },
  methods: {
    myGetTokenMethodAsync: async function (onSuccess) {
      // 应该在此处完成API调用以检索有效令牌。
      // 可能需要实现后端服务。

      // 出于测试目的，可以对有效令牌进行硬编码，但最多可持续1小时（3600秒）。
      let token = this.myToken
      let expireTimeSeconds = 3599
      onSuccess(token, expireTimeSeconds)
    },
  }
}
</script>
```

## Setup 建立

但是，为了获得安全和稳定的体验，它需要某种程度的设置。

### Access Token 访问令牌

Forge Viewer需要与有效的Forge应用程序关联，这是通过使用使用应用程序的**CLIENT_SECRET**和**CLIENT_ID**凭据检索的**访问令牌**来实现的。

这些凭据**不得**在前端的暴露：
- 为您的Forge应用程序带来安全风险。
- 从前端调用Forge API可能会返回**Cross Origin**错误。

相反，应该实现后端服务，以便它安全地返回有效令牌和到期时间。为此，使用**Express.js**和**Axios**的端点示例：

```javascript
// 后端 API
let app = new Express();

app.use("/api/token", async (req, res, next) => {
  return axios.post (
    'https://developer.api.autodesk.com/authentication/v1/authenticate', {
      client_id: "YOUR CLIENT_ID",
      client_secret: "YOUR CLIENT_SECRET",
      grant_type: "client_credentials&",
      scopes: "data:read"
  })
})
```
```html
<!-- SPA -->
<template>
  <forge-vuer
    [...]
    @getAccessToken="handleAccessToken"
  />
</template>

<script>

export default{
  [...]

  methods: {
    handleAccessToken: async function (onSuccess) {
      axios.get(`/api/token`)
      .then(response => {
        onSuccess(response.data.access_token, response.data.expires_in);
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  [...]
}

</script>
```


## Properties 属性

该组件具有一些配置和自定义它的属性。

| Prop             | Type       | Default      | Required | Description                                                                                                                                                                                                                                                                                                   |
| ---------------- | ---------- | ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`             | `String`   | `forge-vuer` | `false`  | 这定义了将操作Viewer的DOM元素的`id`属性。                                                                                                                                                                                                                                  |
| `getAccessToken` | `Function` | -            | `true`   | 该函数将通过调用**onSuccess**回调向Viewer提供有效的访问令牌。                                                                                                                                                                                                            |
| `urn`            | `String`   | -            | `false`  | 要加载文件的Urn. 确保文件已经被[翻译](https://forge.autodesk.com/en/docs/model-derivative/v2/tutorials/prepare-file-for-viewer/).                                                                                                                                         |
| `options`        | `Object`   | -            | `false`  | 用于[初始化](https://forge.autodesk.com/en/docs/viewer/v6/reference/Viewing/Initializer/#new-initializer-options-callback)Viewer实例的选项。 唯一不会使用的属性是`getAccessToken`，因为它将被作为组件属性传递的相应函数替换。 |
| `headless`       | `Boolean`  | `false`      | `false`  | 此属性定义查看器是否打算在[headless](https://forge.autodesk.com/en/docs/viewer/v6/tutorials/headless/)中使用 mode.                                                                                                                                                                  |
| `extensions`     | `Object`   | -            | `false`  | 包含自定义扩展名的对象。有关更多详细信息，请参见[自定义扩展名](#custom-extensions.)                                                                                                                                                                                                         |



## Events 事件

该组件公开了两种可以订阅的事件：原始Forge Viewer事件和自定义事件。

### Forge Viewer Events

如Forge Viewer [API文档](https://autodeskviewer.com/viewers/latest/docs/Autodesk.Viewing.html#events)中所述, viewer提供了多个事件，如 `SELECTION_CHANGED_EVENT`, `PROGRESS_UPDATE_EVENT`等, 该组件允许使用熟悉的vue语法 `v-on:` 或 `@` 按照约定无缝地订阅这些事件:

- 原始事件的名称相同，但全部为小写。
- 下划线`_`由连字符/破折号代替`-`

As an example:

| Original Event            | Subscribed on component   |
| ------------------------- | ------------------------- |
| `SELECTION_CHANGED_EVENT` | `@selection-change-event` |
| `PROGRESS_UPDATE_EVENT`   | `@progress-update-event`  |

在内部，创建时它将尝试将组件的事件映射到Viewer上的相应事件，从而提供一个易于订阅任何原始事件的界面。
与事件可能返回的任何关联数据都封装在单个对象上，以实现自动映射。 这意味着您的订阅函数将只有一个输入参数，其中包含该事件传递的所有参数。

```html
<!-- SPA -->
<template>

  <forge-vuer
    [...]

    @progress-update-event="handleProgressUpdated"
  />
</template>

<script>

export default{
  [...]

  methods: {
    handleProgressUpdated: function(eventData){
      console.log(`Progress: ${eventData.percentage}%`)
    }
  }

  [...]
}

</script>
```


### ForgeVuer Events

此外，该组件还提供了一些其他事件，这些事件允许在组件执行期间发生某些操作时执行操作。

| Name 名称                | Arguments 类型          | Description 描述                                                                                                                                                                                                                                       |
| ------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `error`             | `Error`             | 每当未通过其他任何方式处理的错误时（在Forge内部发出其事件或其他一些自定义事件），都会触发此事件。触发后，此事件将以实际引发的错误为输入。 |
| `documentLoading`   | -                   | 提供新的`urn`并启动加载其关联文档的过程时触发该事件。                                                                                                                                          |
| `documentLoadError` | `Error`             | 当Forge无法加载文档时触发。如果没有函数订阅该事件，则将抛出默认的`Error`事件。作为参数传递的`Error`包含伪造的`errorCode`参考。*                                        |
| `viewerStarted`     | `Viewer3D` 实例 | 初始化Viewer3D并将此实例作为函数参数传递时触发事件。                                                                                                                                                    |
| `modelLoading`      | -                   | 与文档关联的模型开始加载时触发。                                                                                                                                                                                  |
| `modelLoaded`       | `model`             | 成功加载模型后触发。 参数是[Model](https://forge.autodesk.com/en/docs/viewer/v6/reference/Viewing/Model/) 实例。                                                                                          |
| `modelLoadError`    | `Error`             | 当Forge无法加载模型时触发。如果没有函数订阅该事件，则将抛出默认的`Error`事件。作为参数传递的`Error`包含伪造的`errorCode`参考。*                                            |

> *有关Forge错误代码及其含义的详细列表，请访问[此博客文章](https://forge.autodesk.com/cloud_and_mobile/2016/01/error-codes-in-view-and-data-api.html)

## Custom Extensions (6.*)

Autodesk Forge Viewer最强大的功能之一就是能够通过**Extensions**添加自定义功能。只需通过`extensions`组件属性即可将自定义扩展注册到该组件的Viewer实例。与发现的常见[示例](https://forge.autodesk.com/en/docs/viewer/v6/tutorials/extensions/)的唯一区别是，扩展实现必须包装在一个函数中，以便组件可以在运行时注册它们。

这将是自定义扩展的一个简单示例：

```js
// 来自<https://forge.autodesk.com/en/docs/viewer/v6/tutorials/extensions/#step-2-write-the-extension-code>的示例
// my-awesome-extension.js

export default function (AutodeskViewing) {
  function MyAwesomeExtension(viewer, options) {
    AutodeskViewing.Extension.call(this, viewer, options);
  }

  MyAwesomeExtension.prototype = Object.create(AutodeskViewing.Extension.prototype);
  MyAwesomeExtension.prototype.constructor = MyAwesomeExtension;

  MyAwesomeExtension.prototype.load = function () {
    alert('MyAwesomeExtension is loaded!');
    return true;
  };

  MyAwesomeExtension.prototype.unload = function () {
    alert('MyAwesomeExtension is now unloaded!');
    return true;
  };

  // 不需要隐式注册扩展，因为扩展是由组件处理的。
  // Autodesk.Viewing.theExtensionManager.registerExtension('MyAwesomeExtension', MyAwesomeExtension);

  // IMPORTANT to return the extension function itself. 重要说明返回扩展函数本身。
  return MyAwesomeExtension;

}
```

如果您感到舒适并且能够使用ES6类，那么扩展也可以编写为：

```js
// 来自<https://forge.autodesk.com/en/docs/viewer/v6/tutorials/toolbar-button/#step-1-detect-the-toolbar>的示例
// my-custom-toolbar.js

export default function (AutodeskViewing) {
  return class ToolbarExtension extends AutodeskViewing.Extension {
    viewer;
    options;
    subToolbar;

    constructor(viewer, options) {
      super(viewer, options);
      this.viewer = viewer;
      this.options = options;
    }
        
    load = function () {
            
      if (this.viewer.toolbar) {
        // 工具栏已经可用，创建UI
        this.createUI();
      } else {
        // 尚未创建工具栏，请等到收到有关创建它的通知
        this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
        this.viewer.addEventListener(AutodeskViewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
      }

      return true;
    }

    unload = function () {
      this.viewer.toolbar.removeControl(this.subToolbar);
      return true;
    };

    onToolbarCreated = function() {
      this.viewer.removeEventListener(AutodeskViewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
      this.onToolbarCreatedBinded = null;
      this.createUI();
    };

    createUI = function() {
      var viewer = this.viewer;

      // Button 1
      var button1 = new AutodeskViewing.UI.Button('my-view-front-button');
      button1.onClick = function() {
        viewer.setViewCube('front');
      };
      button1.addClass('my-view-front-button');
      button1.setToolTip('View front');

      // Button 2
      var button2 = new AutodeskViewing.UI.Button('my-view-back-button');
      button2.onClick = function() {
        viewer.setViewCube('back');
      };
      button2.addClass('my-view-back-button');
      button2.setToolTip('View Back');

      // SubToolbar
      this.subToolbar = new AutodeskViewing.UI.ControlGroup('my-custom-view-toolbar');
      this.subToolbar.addControl(button1);
      this.subToolbar.addControl(button2);

      viewer.toolbar.addControl(this.subToolbar);
    };
  }

}
```

然后，在组件实现中，我们只需要将`extension`属性设置为一个对象，其中`keys`将是扩展的已注册`id`，并指定导入函数的值。

```html
<!-- SPA -->
<template>
  <forge-vuer
    [...]

    extensions="{
      'myAwesomeExtension': myAwesomeExtension,
      'myCustomToolbar': myCustomToolbar,
      }"
  />
</template>

<script>
import myAwesomeExtension from './path/to/my-awesome-extension.js';
import myCustomToolbar from './path/to/my-custom-toolbar.js';

export default{
  [...]
}

</script>
```

## Custom Extensions (7.*)

从6.*开始，发生了[重大更改](https://forge.autodesk.com/blog/breaking-change-forge-viewerloadextension)。另外，您需要[CSS classes](https://forge.autodesk.com/blog/what-icons-are-provided-viewer-stylesheet)来设置按钮的图标。

```js
// 来自<https://forge.autodesk.com/en/docs/viewer/v6/tutorials/toolbar-button/#step-1-detect-the-toolbar>的示例
// my-custom-toolbar.js

export default function (AutodeskViewing) {

  return class ToolbarExtension extends AutodeskViewing.Extension {
    viewer;
    options;
    subToolbar;

    constructor(viewer, options) {
      super(viewer, options);
      this.viewer = viewer;
      this.options = options;
    }

    load = function () {
      if (this.viewer.toolbar) {
        // 工具栏已经可用，创建UI
        this.createUI();
      } else {
        // 尚未创建工具栏，请等到收到有关创建它的通知
        this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
        this.viewer.addEventListener(AutodeskViewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
      }

      return true;
    }

    unload = function () {
      this.viewer.toolbar.removeControl(this.subToolbar);
      return true;
    };

    onToolbarCreated = function () {
      this.viewer.removeEventListener(AutodeskViewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
      this.onToolbarCreatedBinded = null;
      this.createUI();
    };

    createUI = async function () {
      let viewer = this.viewer;
      const vC = await viewer.loadExtension('Autodesk.ViewCubeUi');

      // Button 1
      let button1 = new AutodeskViewing.UI.Button('my-view-front-button');
      button1.onClick = function () {
        vC.setViewCube('front');
      };
      button1.addClass('my-view-front-button');
      button1.setToolTip('View front');
      button1.setIcon('adsk-icon-first'); 

      // Button 2
      let button2 = new AutodeskViewing.UI.Button('my-view-back-button');
      button2.onClick = function () {
        vC.setViewCube('back');
      };
      button2.addClass('my-view-back-button');
      button2.setToolTip('View Back');
      button2.setIcon('adsk-icon-second');

      // SubToolbar
      this.subToolbar = new AutodeskViewing.UI.ControlGroup('my-custom-view-toolbar');
      this.subToolbar.addControl(button1);
      this.subToolbar.addControl(button2);

      viewer.toolbar.addControl(this.subToolbar);
    };
  }
}
```

Moreover, the function for checking load module has been changed (See ):此外，检查加载模块的功能已更改(请参阅`/services/Utils.js`)：
```js
        // 如果扩展已经注册
if (AutodeskViewing.theExtensionManager.isAvailable(name)) {
  registeredExtensions.push(name);
  continue;
}
```

## Detailed implementation note 详细的实施说明(nuxt.js, 2 legged authtication, OSS bucket approch)

请注意，集线器方法需要3 legged的oauth。如果您不打算实现重定向和用户管理，则可以改用OSS存储桶方法。

遵循会话**访问令牌(Access Token)**并执行在线2 legged or 3 legged身份验证。

如果您正在使用集线器方法，请遵循[本指南](https://github.com/Autodesk-Forge/forge-derivatives-explorer)在[此处](https://derivatives.autodesk.io/)、[a360](https://a360.autodesk.com/drive/app/)或[another viewer](https://viewer.autodesk.com/)上传文件。

如果您使用Bucket(存储桶)方法，请遵循[本指南](https://forge.autodesk.com/en/docs/data/v2/tutorials/app-managed-bucket/)。如果您感到困惑，请阅读[此文章](https://forge.autodesk.com/blog/oss-manager-migrated-autodeskio-server)，然后将文件手动上传到他们的[新网站中](https://oss-manager.autodesk.io/)。

如果您使用的是普通Vue，`/sample/index.html`将足以满足您的需求。将其托管在虚拟主机上，托管域必须与forge web控制台中的应用程序匹配。

如果您使用的是SSR框架(例如[Nuxt](https://nuxtjs.org/)), 则建议您将`/src`中的源代码直接复制到`/components`中，甚至使用内部文件夹(例如`/components/forge`)。可以省略`/src/index.js`，因为nuxt会处理它。然后将其包装到插件中(例如`/plugins/forge-vuer.js`)：

```js
import Vue from 'vue';
//import ForgeVuer from 'forge-vuer';
import ForgeVuer from '~/components/forge/ForgeVuer'

Vue.component('forge-vuer', ForgeVuer);
```

由于您在head会话中没有直接访问权限，因此可以使用`head()`告诉nuxt添加它们。([Article](https://nuxtjs.org/api/pages-head/))将它们添加到vue页面将使效果最小化。扩展名可以是k-v map, e.g. `/pages/forge.vue`:

```vue
<template> 
  <no-ssr placeholder="Loading...">
    <forge-vuer
      :getAccessToken="handleAccessToken"
      :urn="myObjectUrn"
      @progress-update-event="updateProgress"
      @selection-changed-event="spamLog"
      @viewerStarted="spamLog"
      @error="errorLog"
      :style="mapStyle"
      :extensions="extensions"
    />
  </no-ssr>
</template>

<script>
import myAwesomeExtension from "~/components/forge/extensions/myAwesomeExtension";
import myCustomToolbar from "~/components/forge/extensions/myCustomToolbar";
...
export default {
  head() {
    return {
      script: [
        {
          src: "https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js"
        } //defer: true
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css"
        }
      ]
    };
  },
  data() {
    return {
      tokenPkg: {},
      treeNodePkg: {},
      modelProgress: 0,
      extensions: { 
        myAwesomeExtension, 
        myCustomToolbar 
      }
    };
  }
  ...
}
<script/>
```

最后，告诉nuxt在禁用SSR的情况下加载插件 (`nuxt.config.js`):

```js
  /*
  ** 在安装App之前先加载插件
  */
  plugins: [
    //'@/plugins/vuetify',
    //...
    { src: '@/plugins/forge-vuer', ssr: false },
  ],
```

## Versioning 版本控制

我们使用[SemVer](http://semver.org/)进行版本控制。

## License 

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
