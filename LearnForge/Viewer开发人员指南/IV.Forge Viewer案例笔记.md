# Viewer V7

## 开发人员指南

### 总览

#### 什么是Viewer

Autodesk Forge Viewer是用于3D和2D模型渲染的基于WebGL的客户端JavaScript库。使用Viewer，您可以在Web上查看和共享来自众多产品的设计模型，这些产品包括 AutoCAD，Fusion 360，Revit等。

#### Viewer工具栏

查看器的默认工具栏位于页面底部。某些工具特定于3D或2D模型，并且仅在适合您正在查看的模型时显示。

<font color=gray size=5>3D模型</font>

![示例图01](https://developer.doc.autodesk.com/bPlouYTd/264/_images/design3d5.jpg)

工具栏上的某些工具（例如section和explode）特定于3D模型。查看3D模型时，您还将拥有ViewCube，该工具可帮助在模型上定向相机视图。

<font color=gray size=5>2D模型</font>

![示例图02](https://developer.doc.autodesk.com/bPlouYTd/264/_images/design2d5.jpg)

当查看器显示2D模型时，工具栏将包含适用于2D模型的工具。请注意，显示2D模型时，ViewCube不可见。

#### 自定义Viewer

Viewer具有许多默认设置，工具栏仅是一个示例。开发人员可以使用扩展程序自定义Viewer的外观和行为。签出此沙箱以查看查看器的自定义版本：<https://viewer-rocks.autodesk.io/>。

#### Viewer入门

在显示模型之前，必须将模型（也称为种子文件）转换为SVF格式。您将需要两个其他的Forge API来完成此工作。

* Model Derivative API使用户能够以不同格式表示和共享其设计。Viewer与Model Derivative API进行本地通信，以获取模型数据，并遵守其授权和安全要求。有关更多信息，请参见[Model Derivative API](https://forge.autodesk.com/en/docs/model-derivative/v2/developers_guide/overview/)的“[为查看器准备文件](https://forge.autodesk.com/en/docs/model-derivative/v2/tutorials/prep-file4viewer/)”教程。
* 为了使用模型衍生产品，需要身份验证（OAuth）。Model Derivative教程将指导您完成获取访问令牌的过程。您也可以参考[验证文档](https://forge.autodesk.com/en/docs/oauth/v2/developers_guide/overview/)。

#### 浏览器要求

Viewer需要与WebGL-canvas兼容的浏览器

* Chrome 50+
* Firefox 45+
* Opera 37+
* Safari 9+
* Microsoft Edge 20+
* Internet Explorer 11

#### 使用限制

查看器只能用于查看由Autodesk Forge服务生成的文件。必须从Autodesk托管URL交付Autodesk Forge Viewer JavaScript。

### Viewer要点

#### 将Viewer添加到HTML页面

以下HTML代码段为覆盖整个HTML页面的Viewer实例设置了阶段

```html
<head>
  <meta name="viewport" content="width=device-width, minimum-scale=1.0, initial-scale=1, user-scalable=no" />
  <meta charset="utf-8">

  <link rel="stylesheet" href="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css" type="text/css">
  <script src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js"></script>

  <style>
      body {
          margin: 0;
      }
      #forgeViewer {
          width: 100%;
          height: 100%;
          margin: 0;
          background-color: #F0F8FF;
      }
  </style>
</head>
<body>

  <div id="forgeViewer"></div>

</body>

```

该div标识符forgeViewer将初始化一个Viewer实例。要了解如何初始化查看器实例，请参见第2部分：初始化查看器。

>注意： Viewer对Three.js R71有严格的依赖性。

##### Bundle Size

Viewer JavaScript库不小。我们建议您\<script>尽可能晚地添加标记，以允许浏览器首先呈现所有静态HTML内容。

##### Viewer版本

该\<script>标记指定浏览器的JavaScript代码的位置，以及该版本的库来下载。在上面的示例HTML中，指定的版本为7.*，它将拉出主要版本7可用的最新次要版本。

例如，如果版本7.0，7.1并7.2可用，则请求浏览器版本7.*检索版本7.2。

同样，指定的版本也可以包含次要号或补丁号。以下URL均有效：

```html
<!-- 准确获取版本7.0.0 -->
<script src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.0.0/viewer3D.min.js"></script>

<!-- 获取7.0的最新补丁程序版本 -->
<script src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.0.*/viewer3D.min.js"></script>

<!-- 同时获取7.0的最新补丁版本 -->
<script src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.0/viewer3D.min.js"></script>

<!-- 获取7.0的最新次要版本 -->
<script src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js"></script>

```

##### LMV_VIEWER_VERSION

您可以借助[全局变量LMV_VIEWER_VERSION](https://forge.autodesk.com/en/docs/viewer/v7/reference/globals/LMV_VIEWER_VERSION/)验证获取的查看器版本。

#### 初始化Viewer

初始化是一个两步过程：

1. 使用function初始化页面Autodesk.Viewing.Initializer()。
2. 创建一个Viewer实例并验证WebGL支持是否可用。

##### Example

```js
var viewer;
var options = {
  env: 'AutodeskProduction',
  api: 'derivativeV2',  // for models uploaded to EMEA change this option to 'derivativeV2_EU'
  getAccessToken: function(onTokenReady) {
      var token = 'YOUR_ACCESS_TOKEN';
      var timeInSeconds = 3600; // Use value provided by Forge Authentication (OAuth) API
      onTokenReady(token, timeInSeconds);
  }
};

Autodesk.Viewing.Initializer(options, function() {

  var htmlDiv = document.getElementById('forgeViewer');
  viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv);
  var startedCode = viewer.start();
  if (startedCode > 0) {
      console.error('Failed to create a Viewer: WebGL not supported.');
      return;
  }

  console.log('Initialization complete, loading a model next...');

});
```

##### 初始化器

初始化函数只需运行一次。在继续操作之前，请确保所有子系统都在运行。有关所支持的值的详细信息，请参阅[初始化方法](https://forge.autodesk.com/en/docs/viewer/v7/reference/Viewing/#initializer-options-callback)下列出的参数options。

##### 创建Viewer实例

调用Initializer回调后，我们将继续创建Viewer的新实例。

```js
var htmlDiv = document.getElementById('forgeViewer');
viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv, {});
```

您viewer.start()只需调用一次该方法。从那里开始，在继续加载模型之前，验证浏览器是否支持WebGL 。

##### 销毁Viewer实例

当页面上不再需要查看器时，请使用以下方法取消初始化并要求回存：

```js
viewer.finish();
viewer = null;
Autodesk.Viewing.shutdown();
```

#### 加载模型

加载模型是一个两步过程。

1. 从Model Derivative API获取清单JSON 。
2. 指示查看器加载清单JSON引用的模型之一。

##### 开始之前

加载模型之前，必须使用Model Derivative API 的POST作业终结点来启动转换作业，该转换作业会将模型转换为SVF格式。转换作业会生成一个称为清单的JSON文件。清单提供了翻译作业所产生的资源的详细信息（例如，模型几何，缩略图，摄像机视图）。

有关更多信息，请参见Model Derivative API文档中的“[为查看器准备文件](https://forge.autodesk.com/en/docs/model-derivative/v2/tutorials/prep-file4viewer/)”教程。

为了使用Model Derivative API，您必须有一个**ACCESS_TOKEN**。使用Forge[身份验证](https://forge.autodesk.com/en/docs/oauth/v2/reference/http/)API获取访问令牌。Viewer支持2-legged和3-legged标记。

##### Step 1: 提取清单

清单是包含转换工作结果的JSON文档。随着此过程的进行，JSON文档中的内容将更新以反映翻译作业的进度。转换过程完成后，JSON文档将包含对所有可用派生工具的引用，其中一些是可以加载到Viewer中的模型。

Viewer库提供了一种静态方法，用于获取指定的URN字符串值的清单。

```js
var documentId = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bXktYnVja2V0L215LWF3ZXNvbWUtZm9yZ2UtZmlsZS5ydnQ';
Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);

function onDocumentLoadSuccess(viewerDocument) {
  // viewerDocument is an instance of Autodesk.Viewing.Document
}

function onDocumentLoadFailure() {
  console.error('Failed fetching Forge manifest');
}
```

Notes:

* documentId是已翻译模型的URN的字符串值。
* 必须将URN编码为未填充的Base64字符串。有关Base64编码的更多信息，请参见Model Derivative API文档中的“为查看器准备文件”教程。
* 分配给documentId的值必须以字符串urn开头：
* 如果要重复使用上面显示的代码段，请使用您自己的翻译作业中的URN替换documentId的值。
* 在某些情况下，您可能需要确定URN是来自EMEA还是US。 从对URN进行base64解码开始，然后检查它是否包含urn：adsk.wipemea：xxx（对于EMEA）或urn：adsk.wipprod：xxx（对于US）。 有关更多信息，请参见有关“欧洲数据中心支持” _的博客。

成功获取清单后，将调用回调onDocumentLoadSuccess。 回调接收自变量viewerDocument，它是[Autodesk.Viewing.Document](https://forge.autodesk.com/en/docs/viewer/v7/reference/Viewing/Document/)的实例。

##### Step 2: 在清单中加载模型

以下代码段假定viewer实例可用。请参阅“ 初始化查看器”页面以了解如何完成。

您可以选择加载默认模型，或从清单中所有模型的列表中进行选择。

要在清单中加载默认模型：

```js
var defaultModel = viewerDocument.getRoot().getDefaultGeometry();
viewer.loadDocumentNode(viewerDocument, defaultModel);
```

要选择其他模型，请检索所有模型的列表，并使用自定义代码来决定加载哪个模型：

```js
var viewables = viewerDocument.getRoot().search({'type':'geometry'});
viewer.loadDocumentNode(viewerDocument, viewables[0]);

```

##### 放在一起

在这一点上，开发人员应该具有如下代码：

```js
var documentId = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bXktYnVja2V0L215LWF3ZXNvbWUtZm9yZ2UtZmlsZS5ydnQ';
Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);

function onDocumentLoadSuccess(viewerDocument) {
  var defaultModel = viewerDocument.getRoot().getDefaultGeometry();
  viewer.loadDocumentNode(viewerDocument, defaultModel);
}

function onDocumentLoadFailure() {
  console.error('Failed fetching Forge manifest');
}
```

#### 创建扩展

##### 什么是扩展

扩展是JavaScript代码，用于扩展或修改Viewer的行为。当某些扩展程序与Viewer捆绑在一起时，您可以创建自己的扩展程序。

最好用一个例子来解释扩展的创建。下面显示的示例用来创建一个名为MyAwesomeExtension的Viewer扩展。

将有两个与添加的扩展交互的HTML按钮。它们将放置在“Viewer”画布的下方和外部。

其中一个按钮将用于锁定相机。 锁定后，您将无法绕轨道（旋转），平移或缩放。 下一个按钮将用于解锁相机，重新启用鼠标和触摸交互。

##### Step 1: 引入扩展文件

在定义了Viewer的所有核心类之后，必须定义扩展。 本示例使用名为my-awesome-extension.js的文件，下面的代码片段显示了如何将其包括在HTML中。

```js
<script src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js"></script>
<script src="my-awesome-extension.js"></script>
```

##### Step 2: 编辑扩展代码

扩展包含以下几个接口点：

* 继承自**Autodesk.Viewing.Extension**。
* 定义返回一个布尔值的方法**load()**。
* 定义方法**unload()**，该方法还返回一个布尔值。
* 用唯一的字符串ID注册自己。

```js
// “ my-awesome-extension.js”的内容

function MyAwesomeExtension(viewer, options) {
Autodesk.Viewing.Extension.call(this, viewer, options);
}

MyAwesomeExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
MyAwesomeExtension.prototype.constructor = MyAwesomeExtension;

MyAwesomeExtension.prototype.load = function() {
alert('MyAwesomeExtension is loaded!');
return true;
};

MyAwesomeExtension.prototype.unload = function() {
alert('MyAwesomeExtension is now unloaded!');
return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('MyAwesomeExtension', MyAwesomeExtension);
```

仅当**load()**返回true时，扩展程序才能成功加载到Viewer的生命周期中。 同样，如果**unload()**返回true，则扩展将成功卸载。

请注意，**registerExtension()**中使用的字符串'**MyAwesomeExtension**'不需要与函数名称声明匹配。

>注意：刷新HTML页面时不会加载扩展。

##### Step 3: 加载扩展功能

指示Viewer实例加载扩展：

```js
var config3d = {
  ...
  extensions: ['MyAwesomeExtension'],
  ...
};
var htmlDiv = document.getElementById('forgeViewer')
viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv, config3d);
viewer.start();
...
viewer.loadModel(...);
```

刷新HTML页面会显示在扩展程序的**load()**方法中找到的**alert()**消息。

##### Step 4: 添加HTML按钮

在查看器div后面添加两个简单的HTML按钮：

```html
<div id="forgeViewer"></div>
<button id="MyAwesomeLockButton">Lock it!</button>
<button id="MyAwesomeUnlockButton">Unlock it!</button>
```

##### Step 5: 添加按钮处理程序

为了增强扩展程序的**load()**方法来处理HTML按钮的单击事件：请注意，我们的扩展程序具有**this.viewer**属性，这是Viewer大部分功能和自定义设置的主要访问点。

```js
MyAwesomeExtension.prototype.load = function() {
  // alert('MyAwesomeExtension is loaded!');

  var viewer = this.viewer;

  var lockBtn = document.getElementById('MyAwesomeLockButton');
  lockBtn.addEventListener('click', function() {
    viewer.setNavigationLock(true);
  });

  var unlockBtn = document.getElementById('MyAwesomeUnlockButton');
  unlockBtn.addEventListener('click', function() {
    viewer.setNavigationLock(false);
  });

  return true;
};
```

注意：扩展属性**this.viewer**是Viewer大部分功能和自定义设置的主要访问点。

重新加载HTML并使用鼠标来移动相机。 然后单击**Lock it!**并注意如何无法再用鼠标修改摄像机。您会注意到一些UI按钮也被隐藏了。

现在单击**Unlock it!**按钮再次启用相机互动。

##### Step 6: 卸载时清理

卸载扩展程序时，最好删除添加到DOM元素的事件监听器。

要在unload方法中执行所有清理操作：

```js
function MyAwesomeExtension(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);

  // Preserve "this" reference when methods are invoked by event handlers. 当事件处理程序调用方法时，保留“ this”引用。
  this.lockViewport = this.lockViewport.bind(this);
  this.unlockViewport = this.unlockViewport.bind(this);
}

MyAwesomeExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
MyAwesomeExtension.prototype.constructor = MyAwesomeExtension;

MyAwesomeExtension.prototype.lockViewport = function() {
  this.viewer.setNavigationLock(true);
};

MyAwesomeExtension.prototype.unlockViewport = function() {
  this.viewer.setNavigationLock(false);
};

MyAwesomeExtension.prototype.load = function() {
  // alert('MyAwesomeExtension is loaded!');

  this._lockBtn = document.getElementById('MyAwesomeLockButton');
  this._lockBtn.addEventListener('click', this.lockViewport);

  this._unlockBtn = document.getElementById('MyAwesomeUnlockButton');
  this._unlockBtn.addEventListener('click', this.unlockViewport);

  return true;
};

 MyAwesomeExtension.prototype.unload = function() {
  // alert('MyAwesomeExtension is now unloaded!');

  if (this._lockBtn) {
    this._lockBtn.removeEventListener('click', this.lockViewport);
    this._lockBtn = null;
  }

  if (this._unlockBtn) {
      this._unlockBtn.removeEventListener('click', this.unlockViewport);
      this._unlockBtn = null;
  }

  return true;
};
```

##### Step 7: 测试扩展

要完全测试该扩展程序是否按预期工作，可以手动强制加载和卸载该扩展程序。

在浏览器的控制台中，键入以下内容以检查扩展程序是否已加载。 此时，应加载扩展，函数调用应返回**true**：

```js
NOP_VIEWER.isExtensionLoaded('MyAwesomeExtension');
```

请注意使用全局变量NOP_VIEWER，该变量由开发人员在创建Viewer实例后由Viewer SDK定义。

现在键入以下内容以卸载(unload)扩展程序：

```js
NOP_VIEWER.unloadExtension('MyAwesomeExtension');
```

如果一切正常，添加的按钮将不再起作用。 单击它们进行验证。

然后，您可以通过调用再次加载扩展程序

```js
NOP_VIEWER.loadExtension('MyAwesomeExtension');
```

现在，添加的按钮将再次按预期工作。

#### 对事件作出响应

事件是一种机制，用于通知第三方代码有关Viewer中的更改。 查看器实际上侦听其自己的事件以更新UI状态。 有关可用事件的列表，请参见API参考的“[查看命名空间](https://forge.autodesk.com/en/docs/viewer/v7/reference/Viewing/#escape-event)”主题。

本主题演示如何为Autodesk.Viewing.SELECTION_CHANGED_EVENT和Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT添加侦听器。 我们将更改HTML内容以显示当前选择了多少元素以及当前设置了什么导航工具。

![示例图03](https://developer.doc.autodesk.com/bPlouYTd/264/_images/events_tutorial5.png)

##### 开始之前

我们建议将本示例中的代码封装在[extension](https://forge.autodesk.com/en/docs/viewer/v7/developers_guide/viewer_basics/extensions/)中。

##### Step 1: 将选择计数器添加到HTML

首先，添加一个HTML元素，该元素显示当前选中的节点数。 在查看器的div之后添加HTML块。

```html
<div class="my-custom-ui">
  <div>Items selected: <span id="MySelectionValue">0</span></div>
<div>
```

添加以下样式。

```css
<style>
  .my-custom-ui {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 5;
      margin: .3em;
      padding: .3em;
      font-size: 3em;
      font-family: sans-serif;
      background-color: rgba(255, 255, 255, 0.85);
      border-radius: 8px;
  }
  .my-custom-ui span {
      color: red;
  }
</style>
```

每当触发Autodesk.Viewing.SELECTION_CHANGED_EVENT时，＃MySelectionValue的内容都会更改。

##### Step 2: 监听并响应事件

事件是通过Viewer3D实例调度的。 现在，我们添加一个函数来处理选择更改事件。 我们还将在扩展程序的**load()**函数上调用**addEventListener()**，并在扩展程序的**unload()**函数上调用**removeEventListener()**。

```js
// Event hanlder for Autodesk.Viewing.SELECTION_CHANGED_EVENT
EventsTutorial.prototype.onSelectionEvent = function(event) {
  var currSelection = this.viewer.getSelection();
  var domElem = document.getElementById('MySelectionValue');
  domElem.innerText = currSelection.length;
};

EventsTutorial.prototype.load = function() {
  this.onSelectionBinded = this.onSelectionEvent.bind(this);
  this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionBinded);
  return true;
};

EventsTutorial.prototype.unload = function() {
  this.viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionBinded);
  this.onSelectionBinded = null;
  return true;
};
```

我们使用**bind()**在**onSelectionEvent()**中保留对**this**的引用。

此时，每次选择节点时，计数器将更改为该数字。 通过使用键盘上的**ESC**删除选择。 您可以通过使用**Shift-Click**或**Ctrl-Click**选择其他节点。 请注意，您还可以使用这些命令切换选择。

##### Step 3: 另一个事件

查看器的工具栏具有可更改当前导航工具的按钮。工具负责将用户输入转换为操作。导航工具尤其涉及在场景中导航摄像机。

![示例图04](https://developer.doc.autodesk.com/bPlouYTd/264/_images/toolbar_navigation5.png)

现在，我们来监听Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT并在屏幕上显示该工具的名称。 首先按如下所示修改最初添加的HTML。

```html
<div class="my-custom-ui">
  <div>Items selected: <span id="MySelectionValue">0</span></div>
  <div>Navigation tool: <span id="MyToolValue">Unknown</span></div>
<div>
```

我们还需要添加事件处理程序并修改**load()**和**unload()**方法。

```js
// New event for handling Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT
// Follows a similar pattern
EventsTutorial.prototype.onNavigationModeEvent = function(event) {
  var domElem = document.getElementById('MyToolValue');
  domElem.innerText = event.id;
};

EventsTutorial.prototype.load = function() {
  this.onSelectionBinded = this.onSelectionEvent.bind(this);
  this.onNavigationModeBinded = this.onNavigationModeEvent.bind(this);
  this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionBinded);
  this.viewer.addEventListener(Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT, this.onNavigationModeBinded);
  return true;
};

EventsTutorial.prototype.unload = function() {
  this.viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionBinded);
  this.viewer.removeEventListener(Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT, this.onNavigationModeBinded);
  this.onSelectionBinded = null;
  this.onNavigationModeBinded = null;
  return true;
};
```

注意，对于这个新事件，我们实际上正在使用**id**属性并将其分配为**innerText**。 调度的大多数事件都具有与之关联的数据。 也可以从**Viewer**实例中提取相同的数据。 可以通过调用**this.viewer.getActiveNavigationTool()**从查看器获取相同的**id**值。

```js
// Alternative handler for Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT
EventsTutorial.prototype.onNavigationModeEvent = function(event) {
  var domElem = document.getElementById('MyToolValue');
  domElem.innerText = this.viewer.getActiveNavigationTool(); // same value as event.id
};
```

现在事件已挂载，请尝试单击查看器工具栏中的导航按钮。 您会发现事件处理程序将接管工具更换事件！

#### 自定义工具栏

通过查看示例可以最好地说明如何自定义工具栏。

本示例在Viewer画布上创建带有两个按钮的自定义工具栏。每个按钮都有其自己的工具提示，并对单击事件做出反应。单击一个按钮显示环境背景，而单击另一个按钮将其隐藏。

![示例图05](https://developer.doc.autodesk.com/bPlouYTd/264/_images/custom_toolbar5.jpg)

##### 开始之前

编译逻辑代码实现扩展。

```js
function ToolbarExtension(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);
}

ToolbarExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
ToolbarExtension.prototype.constructor = ToolbarExtension;

ToolbarExtension.prototype.load = function() {
  // Set background environment to "Infinity Pool"
  // and make sure the environment background texture is visible
  this.viewer.setLightPreset(6);
  this.viewer.setEnvMapBackground(true);

  // Ensure the model is centered
  this.viewer.fitToView();

  return true;
};

ToolbarExtension.prototype.unload = function() {
  // nothing yet
};

Autodesk.Viewing.theExtensionManager.registerExtension('ToolbarExtension', ToolbarExtension);
```

##### Step 1: 检测工具栏

在自定义扩展中，重写method方法**onToolbarCreated**。 工具栏可用于扩展程序时，查看器将调用此方法。

```js
ToolbarExtension.prototype.onToolbarCreated = function(toolbar) {
  alert('TODO: customize Viewer toolbar');
};
```

##### Step 2: 添加按钮

要创建一个子工具栏并添加几个按钮：

```js
ToolbarExtension.prototype.onToolbarCreated = function(toolbar) {
  // alert('TODO: customize Viewer toolbar');

  var viewer = this.viewer;

  // Button 1
  var button1 = new Autodesk.Viewing.UI.Button('show-env-bg-button');
  button1.onClick = function(e) {
      viewer.setEnvMapBackground(true);
  };
  button1.addClass('show-env-bg-button');
  button1.setToolTip('Show Environment');

  // Button 2
  var button2 = new Autodesk.Viewing.UI.Button('hide-env-bg-button');
  button2.onClick = function(e) {
      viewer.setEnvMapBackground(false);
  };
  button2.addClass('hide-env-bg-button');
  button2.setToolTip('Hide Environment');

  // SubToolbar
  this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('my-custom-toolbar');
  this.subToolbar.addControl(button1);
  this.subToolbar.addControl(button2);

  toolbar.addControl(this.subToolbar);
};
```

注意，上面的代码调用method方法**addClass()**，该方法添加了一个CSS类来控制自定义按钮的外观。

在此示例中，我们将样式定义添加到HTML文件中：

```html
<style>
  .show-env-bg-button {
    background: red;
  }
  .hide-env-bg-button {
    background: blue;
  }
</style>
```

刷新HTML页面时，将显示按钮。将鼠标悬停在它们上方会显示工具提示。单击以触发他们的动作。

##### Step 3: 清理

扩展应删除添加的所有DOM元素和事件。 在这种情况下，仅必须删除this.subToolbar。

```js
ToolbarExtension.prototype.unload = function() {
  if (this.subToolbar) {
      this.viewer.toolbar.removeControl(this.subToolbar);
      this.subToolbar = null;
  }
};
```

如编写扩展程序中所述，可以通过手动调用viewer.loadExtension（'ToolbarExtension'）和viewer.unload（'ToolbarExtension'）方法来验证扩展程序是否按预期工作。

#### 为大型模型分配内存


查看器将始终尝试在加载模型时根据需要分配尽可能多的内存。但是，某些模型可能包含太多细节，以致浏览器无法为其分配足够的内存。

Autodesk.MemoryLimited扩展打开了一个内存管理子系统，该子系统允许Viewer加载非常大的模型。

##### 启用内存管理

Autodesk.MemoryLimited扩展与其他扩展挂钩的方式有所不同。方法如下：

```js
var config3d = {
    ...
    loaderExtensions: { svf: "Autodesk.MemoryLimited" }
    ...
};
var htmlDiv = document.getElementById('forgeViewer');
viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv, config3d);
viewer.start();
...
viewer.loadModel(...);
```

开发人员和用户可以通过验证左下方的加载栏显示为蓝色而不是绿色来验证该功能是否有效。

##### 调试

希望对扩展程序的性能进行微调的开发人员可能希望研究扩展程序Autodesk.Viewing.MemoryLimitedDebug，它为面板提供了统计信息和调试UI。

```js
viewer.loadExtension('Autodesk.Viewing.MemoryLimitedDebug');
```

通过单击“设置”工具栏按钮打开调试面板，导航到“配置”选项卡，然后向下滚动并单击“内存管理器”按钮。

### 高级选项

#### 添加自定义几何

使用Viewer，您可以使用viewer.overlay API将小型自定义几何图形添加到场景中。

使用此功能可以将其他数据叠加到加载的模型上。即使启用渐进式渲染，添加到叠加场景中的每个自定义几何图形也会在每帧上进行渲染。

当过多的自定义几何图形添加到叠加场景中时，帧速率将下降。

自定义几何图形使用主场景深度缓冲区进行深度测试，从而允许自定义几何图形出现在加载的模型中。

[SceneBuilder](https://forge.autodesk.com/en/docs/viewer/v7/developers_guide/advanced_options/scene-builder/) API可用于添加可以逐渐渲染的对象

##### Step 1: 创建自定义几何

Viewer捆绑了three.js库的版本71，并通过全局变量**THREE**公开了其功能。 让我们用它来创建一个红色的球体。

```js
var geom = new THREE.SphereGeometry(10, 8, 8);
var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
var sphereMesh = new THREE.Mesh(geom, material);
sphereMesh.position.set(1, 2, 3);
```

##### Step 2: 创建叠加场景

自定义几何必须添加到叠加场景中。多个自定义几何可以共存于同一场景中。场景是通过名称创建和标识的。确保选择一个与查看器创建的场景不冲突的名称。

```js
if (!viewer.overlays.hasScene('custom-scene')) {
  viewer.overlays.addScene('custom-scene');
}
```

##### Step 3: 将自定义几何图形添加到叠加场景

需要将自定义几何添加到特定的叠加场景中。 在此示例中，我们将自定义几何体**sphereMesh**添加到名为“ custom-scene”的场景中。

```js
viewer.overlays.addMesh(sphereMesh, 'custom-scene');
```

##### Step 4: 从叠加场景中删除自定义几何

您可以使用**removeMesh()**和**removeScene()**删除自定义几何图形和叠加场景。

```js
viewer.overlays.removeMesh(sphereMesh, 'custom-scene');
viewer.overlays.removeScene('custom-scene');
```

查看器不会处理自定义几何图形所使用的几何图形或材质。应用程序开发人员可以释放内存。

```js
// 一旦材质和几何图形不再被其他任何网格物体使用，则需要对其进行处置，以避免内存泄漏。
material.dispose();
geom.dispose();
```

>请查看OverlayManager API文档页面以查看所有可用方法。

#### 查询属性数据库

[属性数据库](https://forge.autodesk.com/en/docs/viewer/v7/reference/globals/PropertyDatabase/)包含构造模型的所有BIM数据，或制造模型的制造详细信息。 属性数据库保存在专用的[Web工作者](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)上，并通过异步消息进行访问。

##### Step 1: 编译自定义查询功能

查询函数必须命名为userFunction。 首先，编写一个简单的查询功能。

```js
function userFunction(pdb) {
    return 42;
}
```

普通查询功能尚未与**pdb**（属性数据库）交互。 我们将在第3步中详细介绍其实现，但现在，它返回的固定值为**42**。

##### Step 2: 执行自定义查询功能

使用**viewer.model.getPropertyDb().executeUserFunction(userFunction)**返回一个**Promise**，该**Promise**使用**userFunction**的返回值进行解析。

```js
var thePromise = viewer.model.getPropertyDb().executeUserFunction( userFunction );
thePromise.then(function(retValue){
  console.log('retValue is: ', retValue); // prints 'retValue is: 42'
}).catch(function(err){
  console.log("Something didn't go right...")
  console.log(err);
});
```

执行上述代码段后，您将在浏览器的开发人员控制台中看到消息retValue为：42。

##### Step 3: 查询属性数据库

此时修改**userFunction**属性，使其与属性数据库进行交互。

自定义查询功能的目的是返回模型中最大部分的ID。 为此，我们将迭代模型中的所有部件ID，并检查其*Mass*属性值。

由于属性数据库的数据布局，我们首先需要确定“质量”属性的索引。 更新自定义查询函数，如下所示：

```js
function userFunction(pdb) {

  //return 42;

  var attrIdMass = -1;

  // 遍历所有属性并找到我们需要的索引
  pdb.enumAttributes(function(i, attrDef, attrRaw){

      var name = attrDef.name;

      if (name === 'Mass') {
          attrIdMass = i;
          return true; // 停止遍历其余属性。
      }
  });
}
```

如果**attrIdMass**的值不同于-1，则说明模型的属性数据库包含其零件的"Mass"数据。 接下来，我们将对所有零件及其属性进行迭代，以找出最大的零件。

```js
function userFunction(pdb) {

  //return 42;

  var attrIdMass = -1;

  // 遍历所有属性并找到我们需要的索引
  pdb.enumAttributes(function(i, attrDef, attrRaw){

    var name = attrDef.name;

    if (name === 'Mass') {
      attrIdMass = i;
      return true; // 停止遍历其余属性。
    }
  });

  // 较早返回是模型不包含"Mass"数据。
  if (attrIdMass === -1)
    return null;

  // 现在遍历所有部分以找出最大的部分。
  var maxValue = 0;
  var maxValId = -1;
  pdb.enumObjects(function(dbId){

    // 对于每个部分，对其属性进行迭代。
    pdb.enumObjectProperties(dbId, function(attrId, valId){

      // 仅处理"Mass"属性。
    // 单词"Property"和"Attribute"可互换使用。
      if (attrId === attrIdMass) {

        var value = pdb.getAttrValue(attrId, valId);

        if (value > maxValue) {
          maxValue = value;
          maxValId = dbId;
        }

        // 找到"Mass"后，停止迭代其他属性。
        return true;
      }
    });
  });

  // Return results
  return {
    id: maxValId,
    mass: maxValue
  }
}
```

最后，步骤2中Promise的**resolve**功能也必须进行更新。 在这种情况下，我们将让观看者选择并聚焦（缩放）最大的部分。

```js
var thePromise = viewer.model.getPropertyDb().executeUserFunction( userFunction );
thePromise.then(function(retValue){

  //if (retValue === 42) {
  //  console.log('We got the expected value back.');
  //}

  if (!retValue) {
    console.log("Model doesn't contain property 'Mass'.");
    return;
  }

  var mostMassiveId = retValue.id;
  viewer.select(mostMassiveId);
  viewer.fitToView([mostMassiveId]);
  console.log('Most massive part is', mostMassiveId, 'with Mass:', retValue.mass);
});
```

##### 最后总结

编译自己的userFunction时，请确保避免引用超出函数范围的对象。 这是因为该函数在发送给Web Worker消息时被序列化。

#### Profiles(如何使用配置文件API)

通过Profile API，您可以指定要在Viewer中加载或卸载的*首选项*值和*扩展名*。

>本教程将介绍以下内容：
>
>* 使用内置配置文件将设置应用于查看器。
>* 创建自定义配置文件。
>* 用特定文件类型注册自定义配置文件。
>* 用自定义配置文件覆盖默认配置文件。

##### 使用内置配置文件

Viewer提供内置的即用型配置文件，这些配置文件提供与Navisworks和Revit等台式机产品相同的用户体验。

有关更多信息，请参考：[ProfileSettings](https://forge.autodesk.com/en/docs/viewer/v7/reference/ProfileSettings/)

以下代码片段显示了如何使用Navisworks配置文件。

```js
const profileSettings = Autodesk.Viewing.ProfileSettings.Navis;
const profile = new Autodesk.Viewing.Profile(profileSettings);
viewer.setProfile(profile);
```

以下代码显示了如何使用AEC配置文件

```js
const profileSettings = Autodesk.Viewing.ProfileSettings.AEC;
const profile = new Autodesk.Viewing.Profile(profileSettings);
viewer.setProfile(profile);
```

##### 创建自定义配置文件

也可以设置自定义配置文件。自定义配置文件可以覆盖现有首选项，卸载/加载特定扩展并将首选项设置为持久性。

有关更多信息，请参考：[Profile](https://forge.autodesk.com/en/docs/viewer/v7/reference/Viewing/Profile/)

以下代码段覆盖了两个首选项，添加了新的首选项，卸载了两个扩展名，并将一些首选项设置为在浏览器会话之间保持不变。

```js
const customProfileSettings = {
settings: {
  reverseMouseZoomDir: true, // 覆盖现有
  reverseHorizontalLookDirection: true, // 覆盖现有
  customSettingOne: true, // new preference
  customSettingTwo: 2, // new preference
  customSettingThree: 'test' // new preference
},
extensions: {
    unload: ['Autodesk.ViewCubeUi', 'Autodesk.BimWalk']
}
};
const customProfile = new Autodesk.Viewing.Profile(customProfileSettings);
// 更新封装在配置文件中的查看器设置。
// 此方法还将加载和卸载配置文件引用的扩展。
viewer.setProfile(customProfile);
```

可以从现有配置文件设置中克隆自定义配置文件。在以下代码段中，配置文件设置是从AEC配置文件设置中克隆的。除了AEC配置文件设置外，选择对象时还将打开属性面板，并且将关闭渐进式渲染。

```js
const aecProfileSettings = Autodesk.Viewing.ProfileSettings.AEC;
// 自定义配置文件设置是从AEC配置文件设置中克隆的。
const customProfileSettings = Autodesk.Viewing.ProfileSettings.clone(aecProfileSettings);
// 关闭渐进式渲染
customProfileSettings.settings.progressiveRendering = false;
// 选择对象时，打开属性面板。
customProfileSettings.settings.openPropertiesOnSelect = true;

const customProfile = new Autodesk.Viewing.Profile(customProfileSettings);
viewer.setProfile(customProfile);
```

##### 注册特定文件类型的自定义配置文件

使用ProfileManager(viewer.profileManager)注册具有特定文件类型的自定义配置文件。

有关更多信息，请参考：[ProfileManager](https://forge.autodesk.com/en/docs/viewer/v7/reference/Viewing/ProfileManager/)

要使用注册的文件配置文件，请确保设置以下配置标志：

```js
const config3d = {
  useFileProfile: true
};
const viewer = new Autodesk.Viewing.GuiViewer3D(viewerElement, config3d);
```

在初始化期间，使用dwf文件类型注册自定义配置文件。

```js
Autodesk.Viewing.Initializer(initOptions, function() {
  const profileSettings = {
    name: 'DWF',
    settings: {
      // 关闭渐进式渲染
      progressiveRendering: false,
      // 选择对象时，打开属性面板。
      openPropertiesOnSelect: true
    }
  };
  viewer.profileManager.registerProfile('dwf', profileSettings);
  viewer.start();
  // 应该是从dwf模型派生的气泡节点。
  Autodesk.Viewing.Document.load(urn, (lmvDocument) => {
    const geometryItems = lmvDocument.getRoot().search({ type: 'geometry' });
    const defaultItem = geometryItems[0];
    viewer.loadDocumentNode(lmvDocument, defaultItem, config3d);
  });
});
```

##### 无论加载的文件类型如何，都使用自定义配置文件

您可以将自定义配置文件设为任何文件类型的默认配置文件。下面的代码示例演示了如何使用自定义配置文件覆盖默认配置文件。

```js
viewer.profileManager.registerProfile('default', profileSettings);
```

##### 恢复默认配置文件

以下代码段将还原查看器中可用的默认配置文件。

```js
// 获取注册的默认配置文件
const defaultProfile = viewer.profileManager.getProfileOrDefault();
// 设置默认配置文件
viewer.setProfile(defaultProfile);
```

#### Scene Builder(使用Scene Builder添加自定义几何)

使用Scene Builder扩展，您可以创建模型并将自己的对象添加到Forge Viewer。 这些对象的处理方式与来自下载模型的数据一样，但有一些限制：

* 仅支持3D对象，包括3D线和其他几何图形。
* 只能使用THREE.BufferGeometry对象。
* 线不使用THREE.Line对象渲染。 您必须在BufferGeometry上设置**isLine：true**属性。
* 相同的BufferGeometry不能用于直线和三角形。
* 类似地，使用BufferGeometry属性**isPoint：true**绘制点。
* 该模型没有属性数据库。您可以分配数据库ID，它们可以用于一起收集多个对象，但是* 不会与这些对象关联任何属性。
* 该模型是平面的，没有实例树。
* 可以与Scene Builder一起使用的唯一材质是MeshPhong，MeshBasic，LineBasic和Prism。

使用SceneBuilder添加的对象将像下载的模型一样呈现，因此，与使用叠加层不同，不会影响帧速率。 渲染许多对象将需要更长的时间才能完全渲染模型。 此外，尚未为Scene Builder模型实现空间加速器。

在本教程结束时，您将能够：

* 加载Scene Builder扩展，它使您可以访问ModelBuilder API。
* 使用ModelBuilder API创建自定义模型。
* 向模型添加自定义几何。

##### Step 1: 加载扩展功能

像其他任何扩展一样，使用loadExtension加载Scene Builder扩展。

```js
await viewer.loadExtension('Autodesk.Viewing.SceneBuilder');
```

加载扩展后，您可以使用getExtension获得扩展。

```js
ext = viewer.getExtension('Autodesk.Viewing.SceneBuilder');
```

##### Step 2: 创建模型

加载扩展后，您需要创建一个模型来保存要显示的对象。 扩展方法addNewModel用于执行此操作。 此方法创建模型，并返回可用于更新模型的ModelBuilder API。

```js
modelBuilder = await ext.addNewModel({
    conserveMemory: false,
    modelNameOverride: 'My Model Name'
});
```

注意addNewModel的两个可选参数，conserveMemory和modelNameOverride。 这是参数对新模型的影响：

* conserveMemory：更改LMV存储网格的方式。 默认值为false，将其设置为true会导致lmv通过为模型中的所有片段共享单个网格对象来节省内存。如果将其设置为true，则**addMesh()**方法不能用于添加片段。
* modelNameOverride：设置要在模型浏览器面板中显示的名称。如果您未设置此选项，则LMV将生成一个名称-**Scene Builder Model n**-其中n是新模型的模型ID。

##### Step 3: 将自定义图形添加到模型

LMV使用其属性数据库ID标识对象。 每个对象可以包含多个**fragments**。 每个片段都有一些几何图形，材质和变换以将几何图形定位为3D。

使用ModelBuilder可以通过三种方式添加图形。

* 您可以分别使用三个创建和添加材料和几何，然后使用材料名称和几何ID添加片段。
* 您可以使用三个对象来创建材质和几何图形，并使用javascript对象添加片段。
* 您可以创建三个网格并使用三个网格对象添加片段。

您可以根据需要一起使用不同的方式。需要材料的ModelBuilder上的方法将接受添加到模型中的材料的名称或三种材料。如果尚未将这三种材料添加到模型中。类似地，几何ID或三个几何对象可以互换使用。

<font color=gray size=4>3.1 分别添加图形</font>

将材料添加到模型时，将为其分配名称。如果名称已被使用或材料已添加到其他模型，则操作将无法添加材料。

```js
purple = new THREE.MeshPhongMaterial({
    color: new THREE.Color(1, 0, 1)
});
modelBuilder.addMaterial('purple', purple);
```

将几何图形添加到模型时，ModelBuilder会分配并返回几何图形的ID。但是，如果已将几何图形添加到模型中，则该操作将失败。

```js
box = new THREE.BufferGeometry().fromGeometry(new THREE.BoxGeometry(10, 10, 10));
let id = modelBuilder.addGeometry(box);
```

添加材料和几何图形后，您可以使用材料名称和几何图形ID添加片段。

```js
const transform = new THREE.Matrix4().compose(
    new THREE.Vector3(-15, 0, 0),
    new THREE.Quaternion(0, 0, 0, 1),
    new THREE.Vector3(1, 1, 1)
);
modelBuilder.addFragment(1, 'purple', transform);
```

**addFragment**方法将返回一个ID，您可以使用该ID删除或更改片段的显示。

<font color=gray size=4>3.2 使用THREE objects添加图形</font>

添加图形的另一种机制是使用THREE objects。ModelBuilder将检查是否已添加对象，如果尚未添加，则添加它们。如果将任何对象添加到其他模型，则该操作将失败。您不能在模型之间共享THREE objects。 添加材料时，ModelBuilder会生成一个要使用的名称。生成的名称是**!!mtl-n**，其中n是材料的**id**属性的值。

```js
red = new THREE.MeshPhongMaterial({
  color: new THREE.Color(1, 0, 0)
});
torus = new THREE.BufferGeometry().fromGeometry(new THREE.TorusGeometry(10, 2, 32, 32));

const transform = new THREE.Matrix4().compose(
  new THREE.Vector3(19, 0, 0),
  new THREE.Quaternion(0, 0, 0, 1),
  new THREE.Vector3(1, 1, 1)
);
modelBuilder.addFragment(torus, red, transform);
```

<font color=gray size=4>3.3 使用THREE Mesh添加图形</font>

使用THREE Mesh添加图形类似于使用THREE objects添加图形，并且相同的限制适用于两者。当您要在THREE Mesh中保留所有THREE objects时，使用THREE Mesh是一个不错的选择。仅当调用新模型时conserveMemory方法不存在或设置为false时，此选项才有效。

```js
mesh = new THREE.Mesh(torus, purple);
mesh.matrix = new THREE.Matrix4().compose(
  new THREE.Vector3(0, 12, 12),
  new THREE.Quaternion(0, 0, 0, 1),
  new THREE.Vector3(1, 1, 1)
);
mesh.dbId = 100;    // Set the database id for the mesh
modelBuilder.addMesh(mesh);
```

#### 设置Edit2D

Edit2D扩展提供了用于在Forge Viewer中显示和编辑2D图形的工具。这是四个教程的第一个，它们演示了Edit2D扩展的工作方式。本教程的末尾链接了有关使用Edit2D，自定义Edit2D以及使用JavaScript手动绘制Edit2D图形的其他教程。

在本教程中，您将学习：

* 如何加载Edit2D扩展
* 如何将您的应用程序与Edit2D连接

##### Step 1: 载入扩展功能

要开始使用Edit2D，首先需要加载扩展。 在此示例中，我们将注册Edit2D的默认工具栏。您可以在Customize Edit2D教程中学习如何创建自己的工具栏以及其他[自定义](https://forge.autodesk.com/en/docs/viewer/v7/developers_guide/advanced_options/edit2d-customize/)项。

```js
// 加载Edit2D扩展
const options = {
  // 如果为true，则PolygonTool将创建路径，而不仅仅是多边形。这允许将线段更改为圆弧。
  enableArcs: true
};

const edit2d = await viewer.loadExtension('Autodesk.Edit2D');

// 在默认配置中注册所有标准工具
edit2d.registerDefaultTools();
```

##### Step 2: 将您的应用程序与Edit2D连接

现在，您已经加载了扩展，您将需要确保Edit2D工具栏能够响应您的Forge Viewer应用程序。您可以通过设置Edit2D上下文并配置事件处理来实现。

<font color=gray size=4>2.1 设置Edit2D上下文</font>

注册默认工具将设置一个**Edit2DContext**，其中包含一个编辑层，工具以及该工具需要工作的所有内容。

```js
// 代码遵循上面的示例

const ctx = edit2d.defaultContext;

// {EditLayer}编辑包含您的图形的图层
ctx.layer

// {EditLayer} 工具用来显示临时图形的附加层（例如，用于捕捉的虚线等）
ctx.gizmoLayer

// {UndoStack} 管理所有修改并跟踪撤消/重做历史
ctx.undoStack

// {Selection} 控制选择和悬停突出显示
ctx.selection

// {Edit2DSnapper} Edit2D捕捉器
ctx.snapper
```

<font color=gray size=4>2.2 配置事件处理</font>

大多数Edit2D类都支持Forge Viewer EventListener接口。您可以通过几种不同的方式将应用程序UI和数据模型与Edit2D连接起来。在此步骤中，我们包括了两个示例：

* 同步数据模型
* 同步选择

<font color=black size=2>**同步数据模型**</font>

在您的应用程序中，图形可能具有Edit2D未知的特定于应用程序的含义。这意味着，当您使用Edit2D工具或撤消/重做修改图层时，特定于应用程序的数据模型将保持不变。为了使数据模型与对图层所做的更改保持同步，可以在**UndoStack**中注册事件侦听器。这样，无论修改是由工具，撤消还是重做引起的，都将使您得到一致的通知。将以下行之一添加到您的代码中，具体取决于您是希望在执行操作之前还是之后收到通知。

```js
// 作用前
ctx.undoStack.addEventListener(Autodesk.Edit2D.UndoStack.BEFORE_ACTION, beforeAction);

// 作用后
ctx.undoStack.addEventListener(Autodesk.Edit2D.UndoStack.BEFORE_ACTION, afterAction);
```

<font color=black size=2>**同步选择**</font>

您还可以使用**edit2d.context.selection**与UI中的某些项目的Edit2D同步选择。

一种方法是注册处理程序。处理程序确保如果选择更改，则通知应用程序。

在以下示例中，我们将处理程序设置为监听鼠标单击。

```js
// 注册您的处理程序
ctx.selection.addEventListener(Autodesk.Edit2D.SELECTION_CHANGED, onSelectionChanged);
```

同样，您可以将处理程序设置为同步鼠标悬停：

```js
// 悬停更改时更新UI状态
ctx.selection.addEventListener(Autodesk.Edit2D.SELECTION_HOVER_CHANGED, onHoverChanged);
```

默认情况下，选择和鼠标悬停突出显示由Edit2D工具自动控制。但是，您还可以通过直接访问ctx.selection来从应用程序中修改选择和悬停突出显示：

```js
// 从UI应用您的选择
ctx.selection.selectOnly(myItem.shape);

// 在UI悬停事件上同步Edit2D状态
ctx.selection.setHoverID(shape.id);
```

##### Next

既然您已经设置了Edit2D，请查看以下教程：

* [使用Edit2D工具栏](https://forge.autodesk.com/en/docs/viewer/v7/developers_guide/advanced_options/edit2d-use/)
* [手动绘制Edit2D图形](https://forge.autodesk.com/en/docs/viewer/v7/developers_guide/advanced_options/edit2d-manual/)
* [自定义Edit2D](https://forge.autodesk.com/en/docs/viewer/v7/developers_guide/advanced_options/edit2d-customize/)

#### 使用Edit2D工具栏

现在，您已经将Edit2D与应用程序集成在一起，可以开始使用Edit2D工具创建图形了。

在本教程中，您将学习：

如何使用各种Edit2D工具
如何显示和更改标签
如何使用捕捉
本教程中有一些代码示例，但是大部分内容演示了将Edit2D加载到Forge Viewer应用程序后如何为最终用户工作。您将需要Google Chrome浏览器才能完成本教程。

这是有关Edit2D的四个教程之一。到目前为止，您应该已经完成​​了Set Edit2D教程。其余的教程（它们教您如何自定义Edit2D和使用JavaScript手动绘制Edit2D图形）在本教程的末尾链接。

##### Step 1: 运行Edit2D Playground

对于本教程，您需要设置Edit2D Playground。 Edit2D Playground对于调试Edit2D和测试其功能很有用。要设置Playground，请将以下代码段复制到您的Chrome DevTools代码段集合中并运行它：

```js
// 方便访问扩展和层
window.edit2d = NOP_VIEWER.getExtension('Autodesk.Edit2D');
window.layer  = edit2d.defaultContext.layer;
window.tools  = edit2d.defaultTools;

// 方便的功能，用于每个控制台的工具切换。例如,startTool（tools.polygonTool）
var startTool = function(tool) {

  var controller = NOP_VIEWER.toolController;

  // 检查当前活动的工具是否来自Edit2D
  var activeTool = controller.getActiveTool();
  var isEdit2D = activeTool && activeTool.getName().startsWith("Edit2");

  // 停用任何先前的edit2d工具
  if (isEdit2D) {
      controller.deactivateTool(activeTool.getName());
      activeTool = null;
  }

  // 停止编辑工具
  if (!tool) {
      return;
  }

  controller.activateTool(tool.getName());
}
```

设置Edit2D Playground可使您快速访问某些Edit2D功能。请注意，由于这些功能是用于测试的机制，因此不应将其用于生产代码或环境。我们在本教程中使用它们来向您展示Edit2D扩展程序在加载到您的应用程序后如何工作。

##### Step 2: 使用Edit2D工具绘制图形

此步骤演示如何使用四个Edit2D工具：

* PolygonTool 多边形工具
* PolylineTool 折线工具
* PolygonEditTool 多边形编辑工具
* InsertSymbolTool 插入符号工具

当您调用registerDefaultTools()时，这些工具将可用，在加载扩展时我们在教程“设置Edit2D”中进行了操作。我们会将这些工具加载到控制台中，以演示每个工具的工作原理。

<font color=gray size=4>2.1 PolygonTool：绘制多边形和矩形</font>

要开始使用PolygonTool，请在控制台中键入以下内容：

```js
startTool(tools.PolygonTool);
```

鼠标光标将变为十字形。

![示例图06](https://developer.doc.autodesk.com/bPlouYTd/264/_images/PolygonTool.jpg)

激活**PolygonTool**后，您可以：

1. 单击以开始一个新的多边形。
2. 再次单击以将顶点添加到多边形。
3. Backspace(退格键)可删除最近添加的顶点。
4. ESC放弃新的多边形。
5. 按住Shift可禁用捕捉。默认情况下，快照功能处于活动状态。
6. 双击以添加多边形的最终顶点。完成多边形的键盘快捷键是Enter和c键。

使用PolygonTool，您还可以单击并拖动以绘制矩形：

1. 按住鼠标选择矩形的起点。
2. (可选)按住Shift键可将矩形强制为正方形。
3. 拖动鼠标确定矩形的长度和宽度。
4. 释放鼠标以完成矩形。

![示例图07](https://developer.doc.autodesk.com/bPlouYTd/264/_images/RectangleTool.jpg)

<font color=gray size=4>2.2 PolylineTool：绘制折线</font>

要绘制折线，请启动``PolylineTool：

```js
startTool(tools.polylineTool)
```

**PolylineTool**的工作方式与**PolygonTool**相似，允许您逐点单击以绘制折线。您可以使用一次拖动交互来绘制简单的线条。

![示例图08](https://developer.doc.autodesk.com/bPlouYTd/264/_images/PolylineTool.jpg)

<font color=gray size=4>2.3 PolygonEditTool：修改多边形和路径</font>

要编辑多边形，请启动PolygonEditTool。

```js
startTool(tools.polygonEditTool);
```

现在，图层中的图形应在鼠标悬停时具有较高的填充不透明度。现在，您可以单击要编辑的图形。

使用**PolygonEditTool**，您可以执行以下操作：

* 通过拖动来**移动图形(Move a shape)**。
* 通过拖动顶点小控件来**移动顶点(Move vertices)**。

![示例图09](https://developer.doc.autodesk.com/bPlouYTd/264/_images/MoveVertex.jpg)

* 按住**Shift**键可**禁用捕捉(disable snapping)**。默认情况下，快照功能处于活动状态。
* 通过拖动边缘小控件来**移动边缘(Move edges)**。 移动边缘时，相邻边缘将变大或变小。

![示例图10](https://developer.doc.autodesk.com/bPlouYTd/264/_images/MoveEdge.jpg)

* 通过拖动边缘来**创建凸起(Create Protrusions)**。如果移动的边缘与其相邻的边缘在同一条线上，则系统会添加一个额外的角。此功能可用于快速编辑具有直角图形的突起。

![示例图11](https://developer.doc.autodesk.com/bPlouYTd/264/_images/MoveEdgeSpecial.jpg)

* 使用**Esc**键**取消拖动交互(Cancel dragging interaction)**。
* 右键单击边缘以**插入新顶点(Insert new vertex)**。这将拉出上下文菜单。

![示例图12](https://developer.doc.autodesk.com/bPlouYTd/264/_images/ContextMenuAddVertex.jpg)

* 通过单击顶点Gizmo并按**Backspace删除顶点(Remove vertices)**。 您也可以右键单击顶点Gizmo以拉出上下文菜单。
* 使用**Ctrl-C/Ctrl-V**复制/粘贴图形。粘贴多次将创建多个重复项。

![示例图13](https://developer.doc.autodesk.com/bPlouYTd/264/_images/CopyPaste.jpg)

* 通过右键单击一条边并在上下文菜单中选择“**更改为弧段(Change to Arc Segment)**”，将**线更改为贝塞尔曲线(Change lines to Bezier arcs)**。 作为快捷方式，您可以选择边缘并按**a**。
* 使用弧段的上下文菜单将弧**变回直线(Change arcs back to lines)**。 作为快捷方式，您可以选择边缘并按**l**。

![示例图14](https://developer.doc.autodesk.com/bPlouYTd/264/_images/ChangeToLine.jpg)

* 通过拖动选定弧边的切线小控件来**编辑曲线线段(Edit tangents of curve segments)**的切线。

![示例图15](https://developer.doc.autodesk.com/bPlouYTd/264/_images/TangentGizmos.jpg)

* 使用上下文菜单**将线段更改为椭圆弧(Change segments into ellipse arcs)**。

![示例图16](https://developer.doc.autodesk.com/bPlouYTd/264/_images/ContextMenuEllipseArc.jpg)

* 通过选择一条边并在弧的中心拖动紫色Gizmo来**编辑椭圆弧(Edit ellipse arcs)**。

![示例图17](https://developer.doc.autodesk.com/bPlouYTd/264/_images/EditEllipseArc.jpg)

<font color=gray size=4>2.4 InsertSymbolTool</font>

使用InsertSymbolTool，可以单击以在鼠标位置插入图形实例。

```js
startTool(tools.insertSymbolTool);
```

默认图形是圆形。您可以通过更改工具的symbol属性来替换默认值。在以下示例中，我们将更改**InsertSymbolTool**，以使其创建以鼠标位置为中心的长度为1的水平线：

```js
let line = new Autodesk.Edit2D.Polyline().makeLine(-1, -1, 1, 1);
tools.insertSymbolTool.symbol=line;
```

##### Step 3: Display Labels(显示标签)

设置好一些基本图形后，让我们通过创建标签为图形添加含义。标签可以指定图形的长度和面积，也可以说出所需的内容。

<font color=gray size=4>3.1 面积和长度标签</font>

**PolygonTool**和**PolygonEditTool**都有显示区域（多边形）和各自长度（折线）的选项。

要显示正在编辑的多边形的区域，请调用以下命令：

```js
tools.polygonTool.setAreaLabelVisible(true);
```

![示例图18](https://developer.doc.autodesk.com/bPlouYTd/264/_images/PolygonToolLabel.jpg)

同样，您可以显示新折线的长度：

```js
tools.polygonTool.setLengthLabelVisible(true);
```

![示例图19](https://developer.doc.autodesk.com/bPlouYTd/264/_images/PolylineToolLabel.jpg)

您可以在PolygonEditTools中使用相同的功能来显示图形的面积和长度。

```js
tools.polygonEditTool.setAreaLabelVisible(true);
tools.polygonEditTool.setLengthLabelVisible(true);
```

<font color=gray size=4>3.2 面积和长度单位</font>

Edit 2D使用与MeasureExtension相同的单位和长度校准。您可以使用MeasureExtension的校准面板为Edit2D图形指定单位和校准。

![示例图20](https://developer.doc.autodesk.com/bPlouYTd/264/_images/UnitsCalibration.jpg)

如果使用不带MeasureExtension的Edit2D，它将以模型单位显示所有坐标。您可以通过修改或替换**DefaultUnitHandler**来自定义单位。更多信息可在Customize Edit2D教程中获得。

<font color=gray size=4>3.3 创建自定义标签</font>

您也可以给图形自定义文本标签。以下示例将自定义文本标签附加到图层中的第一个图形。

```js
var poly = layer.shapes[0];
var label = new Autodesk.Edit2D.ShapeLabel(poly, layer);
label.setText('MyLabel');
```

同样，您可以将自定义标签粘贴到图形的边缘。

```js
var poly = layer.shapes[0];
var label = new Autodesk.Edit2D.EdgeLabel(layer);
label.attachToEdge(poly, 0);
label.setText('My Edge Label');
```

如果您不再需要标签，则可以将其删除。

```js
label.dtor();
```

<font color=gray size=4>3.4 将标签应用于多个图形</font>

您可以使用**ShapeLabelRule**轻松将标签应用于整个图形。**ShapeLabelRule**将定义如何应用标签的规则。

**ShapeLabelRule**具有一些默认设置。您可以配置或替换任何这些设置。

* 标签在添加图形时创建，在删除图形时删除。
* 仅针对大于5像素的可见图形创建标签。
* 当图形小于5像素时，标签会平滑淡出。

使用**ShapeLabelRule**，您还可以定义：

* *Filter(过滤器 )*：确定应标记哪些图形。
* *Text rule(文本规则 )*：确定每个图形的文本。
* *Style rule(样式规则 )*：(可选)确定如何样式化标签。

一个简单的示例是创建一个显示图形属性的**ShapeLabelRule**。在此示例中，我们将使用其类别名称标记每个图形。

```js
// 用其className标记每个图形
var classRule = new Autodesk.Edit2D.ShapeLabelRule(layer, shape => shape.constructor.name);
```

![示例图21](https://developer.doc.autodesk.com/bPlouYTd/264/_images/ShapeLabelRule.jpg)

##### Step 4: Snapping(捕捉)

绘制新图形或移动顶点时，**PolygonTool**和**PolylgonEditTool**支持许多类型的捕捉。

* 捕捉到图纸几何
* 捕捉以编辑图层几何
* 捕捉角度
* 捕捉到上述类型的组合。

默认情况下，快照是活动的，但可以通过按住**Shift**来抑制。几何捕捉和捕捉指示符在Edit2D中的工作方式与Measure扩展相同。当前仅由Edit2D支持捕捉到相交和角度。

<font color=gray size=4>4.1 几何捕捉</font>

有两种类型的几何捕捉。

* **Point-Snap(点捕捉)**：捕捉到唯一点。这可以是线顶点，圆中点或线相交。Edit2D显示一个正方形，指示您正在创建点捕捉。
![示例图22](https://developer.doc.autodesk.com/bPlouYTd/264/_images/SnapToVertex.jpg)

* **Segment-Snap(分段捕捉)**：对齐分段(例如直线或圆弧)。该位置未完全对齐，但被限制在某个段中。Edit2D显示了三行的十字准线，表明您正在创建段快照。
![示例图23](https://developer.doc.autodesk.com/bPlouYTd/264/_images/SnapToLine.jpg)

<font color=gray size=4>4.2 角度捕捉</font>

当使用**PolygonTool**或通过**PolygonEditTool**移动顶点时，角度捕捉由红色虚线表示。
![示例图24](https://developer.doc.autodesk.com/bPlouYTd/264/_images/AngleSnapping.jpg)

默认情况下，我们捕捉到45°倍数的角度。您可以通过更改**AngleSnapper**中的捕捉角度表来更改此行为。

```js
edit2d.defaultContext.snapper.angleSnapper.snapAngles
```

角度捕捉总是指您当前正在修改的“新”边缘。

* 在**PolygonTool**中，这是指在当前鼠标位置添加下一个顶点时将获得的新边。
* 在**PolyEditTool**中，移动顶点时，它指的是在要移动的顶点处开始/结束的边。

如果新边缘与图形中的任何其他边缘形成捕捉角，则角度捕捉将起作用。您也可以捕捉到另一条边的垂直平分线。
![示例图25](https://developer.doc.autodesk.com/bPlouYTd/264/_images/SnapToBisector.jpg)

<font color=gray size=4>4.3 交叉捕捉</font>

捕捉到某个角度或线段只会将捕捉位置限制到一个线段。如果鼠标位置可以捕捉到多条线，则选择最接近的两个点的交点。

以下情况是可能的：

* 两个几何段之间的相交（每个可以是图纸几何或编辑图层几何）
* 两个角度捕捉线之间的相交
* 角捕捉线和线段之间的交点。

下图显示了第三种情况的示例。垂直平分线(角度捕捉)和图纸上的线段(几何捕捉)的交点。
![示例图26](https://developer.doc.autodesk.com/bPlouYTd/264/_images/SnapToIntersect.jpg)

#### 手动绘制Edit2d图形

在您的应用程序中加载Edit2D后，您可以开始向PDF文件和图纸添加图形。本教程演示了如何使用JavaScript绘制和更改图形，使您可以一窥构成Edit2D扩展的机制。您将需要Google Chrome浏览器才能完成本教程。

在本教程中，您将学习如何：

* 绘制多边形和折线
* 添加和删​​除图形样式
* 绘制贝塞尔曲线和椭圆弧
* 将您的Edit2D图形与SVG相互转换

这是有关Edit 2D的四个教程之一。到目前为止，您应该已经完成​​了Set Edit2D的设置。本教程的末尾链接了其余的使用和自定义Edit2D教程。

##### Step 1: 运行 Edit2D Playground

对于本教程，您需要设置Edit2D Playground。Edit2D Playground对于调试Edit2D和测试其功能很有用。要设置Playground，请将以下代码段复制到您的Chrome DevTools代码段集合中并运行它：

```js
// 方便访问扩展和层
window.edit2d = NOP_VIEWER.getExtension('Autodesk.Edit2D');
window.layer  = edit2d.defaultContext.layer;
window.tools  = edit2d.defaultTools;

// 方便的功能，用于每个控制台的工具切换。例如,startTool（tools.polygonTool）
var startTool = function(tool) {

  var controller = NOP_VIEWER.toolController;

  // 检查当前活动的工具是否来自Edit2D
  var activeTool = controller.getActiveTool();
  var isEdit2D = activeTool && activeTool.getName().startsWith("Edit2");

  // 停用任何先前的edit2d工具
  if (isEdit2D) {
      controller.deactivateTool(activeTool.getName());
      activeTool = null;
  }

  // 停止编辑工具
  if (!tool) {
      return;
  }

  controller.activateTool(tool.getName());
}
```

设置Edit2D Playground可使您快速访问某些Edit2D功能。请注意，由于这些功能是用于测试的机制，因此不应将其用于生产代码或环境。在本教程中，我们已使用它们来向您展示Edit2D扩展一旦在您的应用程序中加载后如何工作。

##### Step 2: 检查图纸坐标

在以下步骤中，我们提供了代码片段，可让您绘制图形，直线和圆弧。但是，您将需要更改这些代码段中的坐标，以使这些项目在图纸的可见范围内。默认情况下，Edit2D使用与基础图纸相同的坐标系。要找出图纸的可见区域，可以选中模型的边界框：

```js
var box = NOP_Viewer.model.getBoundingBox();
```

您现在可以使用**box.min**和**box.max**检查x/y值。

##### Step 3: 绘制多边形和折线

首先绘制一个多边形。输入以下代码段，将三角形添加到工作表中。请记住要调整坐标，以使三角形在PDF或图纸上可见。

```js
// 创建简单的三角形
var poly = new Autodesk.Edit2D.Polygon([
    {x: 53, y: 24},
    {x: 62, y: 24},
    {x: 57, y: 34}
]);

// 展示下
layer.addShape(poly);
```

您也可以使用类似的代码创建折线：

```js
//创建折线
var polyline = new Autodesk.Edit2D.Polyline([
    {x: 54, y: 30},
    {x: 54, y: 35},
    {x: 62, y: 35},
    {x: 62, y: 30}
]);

// Show it
layer.addShape(polyline);
```

##### Step 4: 添加图形样式

所有Edit2D图形均具有配置其外观的**样式(style)**。让我们修改我们创建的多边形的样式。

```js
// 配置图形样式
var style = poly.style;
style.fillColor = 'rgb(255,0,0)';
style.fillAlpha = 0.3;
style.lineWidth = 1.0;
style.lineStyle = 11;

// show changes
layer.update();
```

注意，您必须使用layer.update()显示更改。这是因为编辑层知道它显示的图形，但是图形不知道哪个编辑层正在使用它。如果已经显示了要修改的图形(如本例所示)，则必须更新图层。

##### Step 5: 撤销更改

<font color=gray size=4>5.1 移除图形</font>

要清除图形，可以使用**layer.removeShape(poly)**删除单个图形，也可以使用**layer.clear()**清除整个图层。

<font color=gray size=4>5.2 使用Undo(撤销)/Redo(重做)</font>

为简单起见，我们在示例中直接操作了该层。如果您在应用程序中使用Edit2D工具，则它们会跟踪撤消/重做历史。将此与手动修改混合会导致撤消历史记录与实际层状态之间的不一致。

为确保在撤消/重做历史记录中跟踪您的手动更改，您可以将所做的修改包装到操作中。

如果您使用的是Edit2D的默认工具栏，则**Edit2DContext**提供了用于跟踪您的手动更改的快捷方式。

```js
edit2d.defaultContext.clearLayer();
edit2d.defaultContext.addShape(poly);
edit2d.defaultContext.removeShape(poly);
```

通常，您可以通过在undoStack上调用run来执行操作。这是以这种方式添加多个图形的示例：

```js
const action = new Actions.AddShapes(this.layer, shapes);
this.undoStack.run(action);
```

##### Step 6: 绘制Bezier Arcs(贝赛尔曲线)

多边形和折线只能包含直线段。若要创建完全或部分平滑的图形，可以使用路径图形。路径图形使您可以将直线段更改为贝塞尔弧线。

此示例演示如何创建多路径：

```js
// 创建简单的PolygonPath
var path = new Autodesk.Edit2D.PolygonPath([
    {x: 53, y: 24}, // a
    {x: 62, y: 24}, // b
    {x: 57, y: 34}  // c
]);

// 将线段(a,b)从直线更改为弧线
path.setBezierArc(
    0,              // 段索引(=其起始顶点的索引)
    54.72, 20.54,   // 定义起始切线的控制点
    60.53, 20.34    // 定义终点切线的控制点
);

// Show it
layer.addShape(path);
```

弧段由4个控制点P0，P1，P2，P3指定；

* P0和P3定义起点和终点。这些点是通过边线顶点的开始和结束位置预先指定的。
* P1和P2是控制弧的开始和结束切线的附加点。

如前所述，您需要**layer.update()**用于已经可见的图形，以显示调用**setBezierArc(..)**的更改。

创建折线路径类似于调用多边形路径。

```js
// 创建简单的PolylinePath
var path = new Autodesk.Edit2D.PolylinePath([
    {x: 53, y: 24}, // a
    {x: 62, y: 24}, // b
    {x: 57, y: 34}, // c
    {x: 53, y: 24}, // d = a (repeated to close the triangle)
]);

// 将线段(a,b)从直线更改为弧线
path.setBezierArc(0, 54.72, 20.54, 60.53, 20.34);

// Show it
layer.addShape(path);
```

请注意，当折线路径仅需要3时，折线路径需要4个顶点。这是因为使用多边形路径时，会自动添加从c到a的闭合线段。为了使用折线路径创建相同的闭合图形，您需要在终点处重复顶点a。通常，请注意，多边形的有效线段索引数是折线的**vertexCount-1**和**vertexCount-2**。

##### Step 7: 绘制椭圆弧

下面的示例显示如何指定椭圆弧。所有椭圆参数与SVG标准中的1：1匹配。

```js
// 创建简单的PolygonPath
var path = new Autodesk.Edit2D.PolygonPath([
    {x: 53, y: 24}, // a
    {x: 62, y: 24}, // b
    {x: 57, y: 34}  // c
]);

// 将段0更改为椭圆弧
var params = new Autodesk.Edit2D.EllipseArcParams();

// 沿椭圆x/y轴的椭圆半径
params.rx = 4;
params.ry = 6;

// x/y轴的cw旋转度数。
// 旋转 0 表示 椭圆x轴 = (1,0)
params.rotation = 0;

// 是否在椭圆上使用较短或较长的路径。
params.largeArcFlag = false;

// 从startAngle逆时针(true)还是顺时针(false)。
params.sweepFlag = true;

path.setEllipseArc(0, params);

layer.addShape(path);
```

##### Step 8: 将Edit2D图形与SVG图形相互转换

可将Edit2D图形与SVG图形相互转换。

<font color=gray size=4>8.1 导入SVG图形</font>

下面的示例演示如何导入单个SVG图形并将其转换为Edit2D图形。

```js
// 从SVG字符串创建Edit 2D图形
const svgString = '<path d="M 12.79,21.51 H 18.70 V 18.56 H 12.79 Z"/>';
const shape2    = Autodesk.Edit2D.Shape.fromSVG(svgString);
```

您也可以将Edit2D图形导出为SVG图形。

```js
// 从图形获取SVG字符串表示形式
shape.toSVG();
```

在以下示例中，我们将Edit2D图层的全部内容转换为SVG，并在弹出窗口中显示结果，

```js
function showSvgPopup() {

  // 窗口大小
  const width = 400;
  const height = 400;

  // 将pixel-scope定义为box2
  const pixelBox = new THREE.Box2();
  pixelBox.min.set(0, 0);
  pixelBox.max.set(width, height);

  // 将图层转换为svg元素
  const svg = Autodesk.Edit2D.Svg.createSvgElement(
      layer.shapes,
      { dstBox: pixelBox } // 重新缩放以适合pixelBox[0,400]^2
  );

  // 在弹出窗口中显示
  const w = window.open('', '', `width=${width},height=${height}`);
  w.document.body.appendChild(svg);
  w.document.close();
  };

  showSvgPopup();
```

从Edit2D导出时，可以选择添加样式属性。

```js
shape.toSVG({exportStyle: true});
```

**示例输出**：\<path d =” M 12.79,21.51 H 18.7 V 18.56 H 12.79 Z” stroke =” rgb（0,0,128）” fill =” rgb（0,0,128）” stroke-width =“ 3” fill-opacity =“ 0.2” />

您还可以将Edit2D的图层内容1：1序列化为xml文件并下载。

```js
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function downloadLayerAsSvg() {

  // 将pixel-scope定义为box2
  var pixelBox = new THREE.Box2();
  pixelBox.min.set(0, 0);
  pixelBox.max.set(400, 400);

  // 获取图层内容作为svg dom元素
  var svgElem = Autodesk.Edit2D.Svg.createSvgElement(layer.shapes, {dstBox: pixelBox});

  // 序列化为字符串并下载
  var serializer = new XMLSerializer();
  var xmlText = serializer.serializeToString(svg);

  download('test.svg', xmlText);
};
```

#### 自定义Edit2D

Edit2D定义了几个默认值以便立即可用。在“ 设置Edit2D教程”中，您研究了运行某些默认值的应用程序，包括Edit2D的默认工具栏和上下文。您可以通过多种方式自定义Edit2D行为。本教程将引导您完成其中的一些步骤。

在本教程中，您将能够：

* 定制单位
* 自定义您的工具栏
* 自定义上下文菜单
* 添加更多层
* 自定义选择和悬停的外观

在完成本教程之前，您应该熟悉如何在应用程序中设置和使用Edit2D。请参考设置Edit2D教程，以熟悉这些概念。本教程的末尾链接了有关Edit2D的其他教程，包括如何使用Edit2D以及如何使用JavaScript手动绘制Edit2D形状。

##### Step 1: Customize Units(自定义单位)

默认情况下，Edit2D的单位处理与Forge Viewer中的**Measure**扩展配置相同。如果“**Measure**”扩展名不可用，则值将以1：1的形式显示在图层坐标中，而没有单位。

Edit2D使用**DefaultUnitHandler**设置标签文本的默认格式。默认单位处理程序定义如何将层中的度量转换为标签中显示的文本。这包括：-单位名称-层坐标中的长度和面积转换为显示值的方式-标签中显示的位数。

您可以通过替换默认的单位处理程序来定义自己的格式。 请注意，您需要在指定工具之前设置**unitHandler**。

```js
const unitHandler = new Autodesk.Edit2D.SimpleUnitHandler(viewer);
unitHandler.layerUnit    = 'in';
unitHandler.displayUnits = 'cm';
unitHandler.digits       = 4;

// 定义unitHandler后注册您的工具
```

##### Step 2: 自定义工具栏

在上一教程中，我们使用registerDefaultTools()方法使用默认工具栏设置了Edit2D。此方法为您完成了一些步骤，以便快速设置Edit2D：

* 创建一个单层和小控件层
* 创建所有可用工具
* 在ToolController中注册工具

只要可以确保您是唯一在应用程序中使用Edit2D的人，那么使用默认工具集通常就足够了。但是，Edit2D也可以由同一应用程序中的不同软件组件使用。例如，如果在另一个Forge Viewer扩展中使用Edit2D，可能会发生这种情况。在这种情况下，如果不同的组件都访问相同的工具和EditLayer，则会产生冲突。

您可以通过注册自己的工具集来避免冲突。首先，您需要注册您的工具，为您的工具集指定一个唯一的名称给您的应用程序。

```js
edit2d.registerTools(MyToolSetName);
```

注册工具后，需要定义工具集，上下文和工具。

```js
const toolSet = edit2d.getToolSet(MyToolSetName);
const context = toolSet.context;
const tools   = toolSet.tools;
```

##### Step 3: 自定义上下文菜单

加载Edit2D的默认工具集时，它会自动注册一个具有**addVertex**和**removeVertex**等功能的上下文菜单。您可以通过注册**contextMenuCallback**添加特定于应用程序的项目。更新Edit2D上下文菜单后，需要注册回调。这是因为当用户点击Edit2D形状时，Edit2D上下文菜单会替换Forge Viewer的默认上下文菜单。

```js
const myItem = {
  title: 'My extra menu item',
  target : ()=> {console.log('Hello new item);}
};

const cb = (menu) => {
  menu.push(item);
}

//构建contextMenu时，让Forge Viewer触发回调
viewer.registerContextMenuCallback('MyOwnItems', cb);
```

您也可以完全删除Edit2D contextMenu。

```js
const toolset = edit2d.getToolSet(MyToolSetName);
toolset.contextMenu.unregister();
```

##### Step 4: 自定义选择和悬停的外观

默认情况下，当用户将鼠标悬停或选择时，显示的形状样式会略有不同。例如，当用户选择形状时，该形状将显示增加的线宽和填充不透明度。这些响应不会更改您正在编辑的形状的实际样式。而是，Edit2D使用样式修饰符。样式修饰符是一种回调，它临时用另一个形状替代图形的显示样式。

在以下示例中，我们将用自定义突出显示替换默认的样式修改行为，该行为将影响通过过滤器功能**(shapeId)=> bool**的所有形状。

```js
// 关闭默认突出显示行为
const selection = edit2d.defaultContext.selection;
layer.removeStyleModifier(selection.modifier);

// 定义自定义样式修改器
const myModifier = (shape, style) => {

  // 如果形状未通过过滤器，则样式不受影响
  if (!myFilter(shape.id)) {
      return undefined;
  }

  // 返回修改后的样式副本
  const modified = style.clone();
  modified.fillColor = 'rgb(255, 0, 0)';
  return modified;
};

layer.addStyleModifier(myModifier);
```

自定义突出显示可以但不必替换默认突出显示。图层支持按添加顺序应用的多个样式修饰符。

>注意：样式参数可以是原始多边形样式，也可以是先前应用的样式修改器返回的样式。确保创建修改后的副本，而不是更改样式本身。

##### Step 5: 添加更多图层

当您注册工具时，Edit2D将为您的工具创建一个单独的**EditLayer**以便在**context.layer**上运行，并为临时叠加层创建一个EditLayer(**context.gizmoLayer**)。您可以将其他图层添加到默认设置。

```js
// 建立新图层
const anotherLayer = new Autodesk.Edit2d.EditLayer(viewer);
```

创建图层后，您可以选择显示方式。默认情况下，其他图层表示为叠加层。

```js
this.viewer.impl.addOverlay(OvelayName, layer.scene)
```

更一般而言，**layer.scene**是具有三角形形状的**Three.Scene**，您可以使用任何方式使用它。

### 专业术语

## API参考

### Viewing

### UI用户界面

### 扩展名

### Snapping

### 共同测量

### 私人的

### 错误代码

### 个人资料设置

### 全球

![示例图01]()
