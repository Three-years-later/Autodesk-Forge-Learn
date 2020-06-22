# 入门向导(熟悉Web开发)

>网址：<https://learnforge.autodesk.io/#/>

## [开始编码之前](https://learnforge.autodesk.io/#/account/)

### 创建伪造账户

转到[Forge Developer Portal(伪造开发人员门户)](https://forge.autodesk.com/)，单击"注册"按钮以创建帐户或"登录"以使用现有帐户。如果创建新帐户，请确保单击将发送给您的验证电子邮件中的链接。

![示例图01](https://learnforge.autodesk.io/_media/forge/dev_portal_home.png)

### 激活订阅

在使用任何付费 API（如模型衍生工具）之前，您需要激活试用版。在右上角，你会看到你的名字。单击以展开菜单并转到"我的订阅"。在打开的页面上，单击"开始免费试用"。就是这样。

![示例图02](https://learnforge.autodesk.io/_media/account/activate_sub.png)

### 创建应用

在右上角，你会看到你的名字。单击以展开菜单并转到"我的应用"。单击"创建应用"按钮。

选择要使用的 API（您可以安全地立即选择所有 API）。输入应用程序名称和说明，然后输入回调 URL：（本教程不会使用此回调，但这是其他 Autodesk Forge 示例中使用的 URL）<http://localhost:3000/api/forge/callback/oauth>

设置应用程序后，您将在新创建的应用页中看到客户端 ID 和客户端机密。您将需要在所有其他OAuth流，并通过扩展，完成这个网站上的所有其他教程！

![示例图03](https://learnforge.autodesk.io/_media/account/create_app.gif)

## 工具

本节说明如何准备机器以使用Autodesk Forge或任何其他云API。如果您已经有了IDE的首选项，则可以跳到[Authentication](https://learnforge.autodesk.io/#/oauth/)。

选择您的语言: Node.js | .NET Framework | .NET Core | Go | PHP | Java

## OAuth

OAuth（特别是OAuth2）是整个Forge平台使用的开放标准，用于基于令牌的身份验证和授权。

### 2-legged vs 3-legged

了解更多关于[2-legged workflow](https://forge.autodesk.com/en/docs/oauth/v2/tutorials/get-2-legged-token/)中使用的[查看你的模型(View your models)](https://learnforge.autodesk.io/#/tutorials/viewmodels)教程，和[3-legged workflow](https://forge.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/)中使用的[视图BIM 360融合模型( View BIM 360 & Fusion models)](https://learnforge.autodesk.io/#/tutorials/viewhubmodels)教程。

### 范围

作用域是在令牌（令牌可以在其中起作用的上下文）上设置的权限。例如，具有data：read范围的令牌被允许在Forge生态系统中读取数据，并且可以在需要该范围的那些端点上使用。没有该范围的令牌将被拒绝访问此类端点。（各个端点参考页列出了所需的范围。）

范围具有两个主要功能：

* **隐私和控制**：在三足鼎立的环境中，它们充当一种机制，用于请求并确保以特定方式代表最终用户的许可。
* **安全性**：在两足和三足的情况下，它们可确保如果您失去对令牌的控制，则不会滥用该令牌来访问其原本不打算使用的资源。

### 公共和内部令牌

本教程将使用两种类型的访问令牌：公共令牌和内部令牌。该**公共令牌**用于它运行，需要在客户端的访问令牌的锻造浏览器。这种情况有一个特殊的范围：viewables：read。

现在在服务器端，我们需要写访问权限，因此**内部令牌**将使用bucket：create，bucket：read，data：read，data：create和data：write范围。

>不知道要遵循哪个教程？
>
>回答这个问题：您要访问和查看的文件在哪里？
>
>如果在您的计算机上或其他地方，请查看模型。如果模型在任何BIM 360（团队，设计或文档）或Fusion Team上，则请查看BIM 360和Fusion模型。
>
>如果要修改模型，则不再赘述，请查看“ 修改模型”教程。

## 查看您的模型

本教程将指导您创建具有以下UI的Web应用程序：左侧的存储桶和对象的列表，以及右侧的3D查看器以查看它们。

![示例图04](https://learnforge.autodesk.io/_media/tutorials/run_sample_viewmodels.gif)

要查看模型，您需要执行以下步骤：

### 创建服务器

><<初次开发者？你应该从这里开始

#### 创建一个服务器

您的客户ID和机密应受到保护，并应保密，因为所有文件都将绑定到您的帐户。对于Web应用程序，请将其保留在服务器上。本节演示如何准备创建本地开发服务器。

#### 创建一个新项目（Node.js）

在计算机上创建一个文件夹，不要使用空格，并避免使用特殊字符。对于本教程，让我们使用forgesample。

打开**Visual Code**，然后转到**文件**菜单，然后选择**打开**（MacOS）或**打开文件夹**（Windows），然后选择新创建的文件夹。

现在我们需要终端，进入菜单View >> Integrated Terminal。窗口应该出现在底部。键入以下命令，然后按照下列步骤操作。为了与其他Forge示例保持一致，在提示您输入切入点：时，请使用start.js。

```node
npm init
```

这将创建package.json文件，该文件定义了我们的项目将使用的软件包。[了解更多](https://docs.npmjs.com/files/package.json)。

##### 安装套件

默认情况下，Node.js项目为空，因此我们需要使用npm install安装一些软件包。让我们从基本的Express服务器，用于文件上传的multer（当然还有Autodesk Forge）开始。

>一次运行一个npm install。

```npm
npm install express --save
npm install multer --save
npm install forge-apis --save
```

>该--save参数指示该模块应作为依赖项包含在package.json文件中。

最后打开package.json并在其中"scripts"添加"start": "node start.js",行。现在您的文件夹应该有一个node_modules文件夹，而package.json应该看起来像这样：

```json
{
  "name": "forgesample",
  "version": "1.0.0",
  "description": "",
  "main": "start.js",
  "scripts": {
    "start": "node start.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.16.2",
    "forge-apis": "^0.4.1",
    "multer": "^1.3.0"
  }
}
```

>版本号（例如forge-apis 0.4.1）可能有所不同，这是创建本教程时的最新版本。

##### 文件和文件夹

要创建新的文件夹或文件，请右键单击左侧的“资源管理器”区域，然后选择“ 新建文件夹”或“ 新文件”。

为所有服务器端文件创建一个/ routes /文件夹，为所有客户端文件创建一个/ public /文件夹。

此时，您的项目应具有以下结构：

![示例图05](https://learnforge.autodesk.io/_media/nodejs/vs_code_explorer.png)

>该包lock.json被创造NPM，不用担心

* launch.json

该文件向Visual Studio Code指示我们应如何运行项目。进入菜单调试 >> 添加配置...并在选择环境窗口，在顶部出现时，选择Node.js的。在创建的/.vscode/launch.json文件中，输入以下内容：

>请注意，您需要在指定的空格处输入您的Forge客户ID和密码。

```json
{
  // 使用IntelliSense了解可能的属性。
  // 悬停以查看现有属性的描述。
  // 有关更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
      {
          "type": "node",
          "request": "launch",
          "name": "Launch Program",
          "program": "${workspaceFolder}/start.js",
          "env": {
              "FORGE_CLIENT_ID": "your id here",
              "FORGE_CLIENT_SECRET": "your secret here",
              "FORGE_CALLBACK_URL": "http://localhost:3000/api/forge/callback/oauth"
          }
      }
  ]
}
```

>将ID＆Secret定义为环境变量很重要，这样我们的项目以后就可以在线部署。稍后在Deployment中对此进行更多介绍。

* start.js

在根文件夹中，创建具有以下内容的start.js文件：

>在某些部署中，文件名区分大小写，例如Heroku。对于本教程，我们使用小写字母。

```js
const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 3000;
const config = require('./config');
if (config.credentials.client_id == null || config.credentials.client_secret == null) {
  console.error('Missing FORGE_CLIENT_ID or FORGE_CLIENT_SECRET env. variables.');
  return;
}

let app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));
app.use('/api/forge/oauth', require('./routes/oauth'));
app.use('/api/forge/oss', require('./routes/oss'));
app.use('/api/forge/modelderivative', require('./routes/modelderivative'));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode).json(err);
});
app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });
```

该文件启动快递服务器，提供静态文件（例如html），并路由API请求。

* config.js

在根文件夹中，创建一个config.js具有以下内容的文件：

```js
// Autodesk Forge configuration
module.exports = {
  // Set environment variables or hard-code here
  credentials: {
      client_id: process.env.FORGE_CLIENT_ID,
      client_secret: process.env.FORGE_CLIENT_SECRET,
      callback_url: process.env.FORGE_CALLBACK_URL
  },
  scopes: {
      // Required scopes for the server-side application
      internal: ['bucket:create', 'bucket:read', 'data:read', 'data:create', 'data:write'],
      // Required scope for the client-side viewer
      public: ['viewables:read']
  }
};
```

我们在这里定义我们的ENV变量。在运行Express服务器时，这些变量的值将用于连接到我们需要的其他Autodesk Forge服务。

最后，我们看到有2个范围定义。内部范围为我们的访问令牌授予了使用Forge Web服务（服务器端）不同服务的正确权限。本教程专用于查看器的使用，我们只需要将“ viewables：read”范围公开即可。

项目准备好了！此时，您的项目应如下所示：

![示例图06](https://learnforge.autodesk.io/_media/nodejs/vs_code_project.png)

下一步：验证

### 认证

#### OAuth 2-legged

在正式的OAuth术语中，在Forge平台上完成两足式身份验证需要您使用“客户端凭据”授予类型。

这意味着您的应用程序直接与Forge平台进行通信以进行身份​​验证和对资源的访问。如果是Web应用程序，则最终用户不会直接知道这些服务器到服务器的通信，因为没有任何通信是通过Web浏览器传递的。[了解更多](https://forge.autodesk.com/en/docs/oauth/v2/developers_guide/basics/)。

访问Forge上的任何资源都需要进行身份验证。一个2条腿的令牌授予访问您的应用程序的信息。

#### 验证（Node.js）

对于基本的OAuth实现，我们需要2个文件。

##### 路由/oauth.js

创建一个routes/oauth.js文件。该文件负责为与OAuth相关的端点创建快速路由器。

```js
const express = require('express');

const { getPublicToken } = require('./common/oauth');

let router = express.Router();

// GET /api/forge/oauth/token - generates a public access token (required by the Forge viewer).
router.get('/token', async (req, res, next) => {
  try {
      const token = await getPublicToken();
      res.json({
          access_token: token.access_token,
          expires_in: token.expires_in,
      });
  } catch(err) {
      next(err);
  }
});

module.exports = router;

```

##### 路线/普通/oauth.js

现在common，在routes文件夹中创建一个子文件夹，并准备一个routes/common/oauth.js实际上将向Forge请求访问令牌的文件。这将在本教程的其他部分中重复使用。

```js
const { AuthClientTwoLegged } = require('forge-apis');

const config = require('../../config');

/**
  * Initializes a Forge client for 2-legged authentication.
  * 初始化用于两足式身份验证的Forge客户端。
  * @param {string[]} scopes List of resource access scopes.scopes资源访问范围的列表。
  * @returns {AuthClientTwoLegged} 2-legged authentication client.两足式身份验证客户端。
  */
function getClient(scopes) {
  const { client_id, client_secret } = config.credentials;
  return new AuthClientTwoLegged(client_id, client_secret, scopes || config.scopes.internal);
}

let cache = {};
async function getToken(scopes) {
  const key = scopes.join('+');
  if (cache[key]) {
      return cache[key];
  }
  const client = getClient(scopes);
  let credentials = await client.authenticate();
  cache[key] = credentials;
  setTimeout(() => { delete cache[key]; }, credentials.expires_in * 1000);
  return credentials;
}

/**
  * Retrieves a 2-legged authentication token for preconfigured public scopes.
  * @returns Token object: { "access_token": "...", "expires_at": "...", "expires_in": "...", "token_type": "..." }.
  */
async function getPublicToken() {
  return getToken(config.scopes.public);
}

/**
  * Retrieves a 2-legged authentication token for preconfigured internal scopes.
  * @returns Token object: { "access_token": "...", "expires_at": "...", "expires_in": "...", "token_type": "..." }.
  */
async function getInternalToken() {
  return getToken(config.scopes.internal);
}

module.exports = {
  getClient,
  getPublicToken,
  getInternalToken
};

```

为了避免为每个最终用户请求获得新的访问令牌，这会增加不必要的延迟，让我们将它们缓存在全局变量中。请注意，我们仍然需要在expires_in几秒钟后刷新令牌。

>用户之间的共享访问令牌仅在所有用户都访问相同信息（两足）的情况下才有效。如果您的应用使用每用户数据（三足），则DOT请勿使用此方法。

下一步：将文件上传到OSS

### 上载到OSS

#### 数据管理（OSS）

在Forge OSS（对象存储服务）中，文件作为对象存储在存储桶中。除了使您的应用程序能够从更广泛的Forge生态系统下载数据之外，它还提供了管理应用程序自己的存储桶和对象（包括创建，列出，删除，上传和下载）的功能。

每个存储桶还具有确定对象保留时间的[保留策略](https://forge.autodesk.com/en/docs/data/v2/developers_guide/retention-policy/)：

* **瞬态**：仅保留24小时的类似缓存的存储，非常适合临时对象。对于本教程，我们使用此策略。
* **临时的**：可保存30天。
* **持久**：持久保存直到被删除的存储。

在本节中，让我们创建一些端点来创建存储桶，上传文件以及列出存储桶和对象。

>本教程代码将为存储桶密钥透明地添加Forge客户端ID，这应避免名称重复。
>
>**请注意，存储桶键的格式必须为[-_。a-z0-9] {3,128}**

#### 将文件上传到OSS（Node.js）

在本节中，我们需要3个功能：

1. 创建桶
2. 列出存储桶和对象（文件）
3. 上载对象（文件）

##### 路由/oss.js

创建一个routes/oss.js具有以下内容的文件：

```js
const fs = require('fs');
const express = require('express');
const multer  = require('multer');
const { BucketsApi, ObjectsApi, PostBucketsPayload } = require('forge-apis');

const { getClient, getInternalToken } = require('./common/oauth');
const config = require('../config');

let router = express.Router();

// Middleware for obtaining a token for each request.
router.use(async (req, res, next) => {
  const token = await getInternalToken();
  req.oauth_token = token;
  req.oauth_client = getClient();
  next();
});

// GET /api/forge/oss/buckets - expects a query param 'id'; if the param is '#' or empty,
// returns a JSON with list of buckets, otherwise returns a JSON with list of objects in bucket with given name.
router.get('/buckets', async (req, res, next) => {
  const bucket_name = req.query.id;
  if (!bucket_name || bucket_name === '#') {
      try {
          // Retrieve buckets from Forge using the [BucketsApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/BucketsApi.md#getBuckets)
          const buckets = await new BucketsApi().getBuckets({ limit: 64 }, req.oauth_client, req.oauth_token);
          res.json(buckets.body.items.map((bucket) => {
              return {
                  id: bucket.bucketKey,
                  // Remove bucket key prefix that was added during bucket creation
                  text: bucket.bucketKey.replace(config.credentials.client_id.toLowerCase() + '-', ''),
                  type: 'bucket',
                  children: true
              };
          }));
      } catch(err) {
          next(err);
      }
  } else {
      try {
          // Retrieve objects from Forge using the [ObjectsApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/ObjectsApi.md#getObjects)
          const objects = await new ObjectsApi().getObjects(bucket_name, {}, req.oauth_client, req.oauth_token);
          res.json(objects.body.items.map((object) => {
              return {
                  id: Buffer.from(object.objectId).toString('base64'),
                  text: object.objectKey,
                  type: 'object',
                  children: false
              };
          }));
      } catch(err) {
          next(err);
      }
  }
});

// POST /api/forge/oss/buckets - creates a new bucket.
// Request body must be a valid JSON in the form of { "bucketKey": "<new_bucket_name>" }.
router.post('/buckets', async (req, res, next) => {
  let payload = new PostBucketsPayload();
  payload.bucketKey = config.credentials.client_id.toLowerCase() + '-' + req.body.bucketKey;
  payload.policyKey = 'transient'; // expires in 24h
  try {
      // Create a bucket using [BucketsApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/BucketsApi.md#createBucket).
      await new BucketsApi().createBucket(payload, {}, req.oauth_client, req.oauth_token);
      res.status(200).end();
  } catch(err) {
      next(err);
  }
});

// POST /api/forge/oss/objects - uploads new object to given bucket.
// Request body must be structured as 'form-data' dictionary
// with the uploaded file under "fileToUpload" key, and the bucket name under "bucketKey".
router.post('/objects', multer({ dest: 'uploads/' }).single('fileToUpload'), async (req, res, next) => {
  fs.readFile(req.file.path, async (err, data) => {
      if (err) {
          next(err);
      }
      try {
          // Upload an object to bucket using [ObjectsApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/ObjectsApi.md#uploadObject).
          await new ObjectsApi().uploadObject(req.body.bucketKey, req.file.originalname, data.length, data, {}, req.oauth_client, req.oauth_token);
          res.status(200).end();
      } catch(err) {
          next(err);
      }
  });
});

module.exports = router;

```

由于我们计划支持[jsTree](https://www.jstree.com/)，因此GET / api / forge / oss / buckets端点需要处理idquerystring参数，将id设置#为时返回所有存储桶，或返回以传递的给定bucketKey中的所有对象id=bucketKey。上载端点使用[multer](https://github.com/expressjs/multer)模块处理文件上载。它将文件保存在我们的服务器上（例如，在/ uploads /文件夹中），以便我们以后可以将其上传到Forge。

请注意，我们如何重用身份验证帮助程序routes/common/oauth.js作为该路由器的中间件。

>可以将文件从客户端（浏览器）直接上传到Autodesk Forge，但是需要向客户端提供一个启用写操作的访问令牌，这不是安全的。

下一步：翻译文件

### 翻译文件

Model Derivative API允许用户以不同的格式表示和共享他们的设计，以及提取有价值的元数据。

![示例图05](https://learnforge.autodesk.io/_media/forge/md_diagram.png)

不确定您的文件是否兼容？检查[支持的翻译](https://forge.autodesk.com/en/docs/model-derivative/v2/developers_guide/supported-translations/)。

在本节中，我们将调用POST Job来开始翻译过程。请注意，此端点是异步的，它启动在后台运行的进程，而不是保持开放的HTTP连接直到完成。

#### 转换模型（Node.js）

要翻译文件，我们只需要一个端点。

##### 路线/modelderivative.js

创建一个routes/modelderivative.js具有以下内容的文件：

```js
const express = require('express');
const {
    DerivativesApi,
    JobPayload,
    JobPayloadInput,
    JobPayloadOutput,
    JobSvfOutputPayload
} = require('forge-apis');

const { getClient, getInternalToken } = require('./common/oauth');

let router = express.Router();

// Middleware for obtaining a token for each request.
router.use(async (req, res, next) => {
    const token = await getInternalToken();
    req.oauth_token = token;
    req.oauth_client = getClient();
    next();
});

// POST /api/forge/modelderivative/jobs - submits a new translation job for given object URN.
// Request body must be a valid JSON in the form of { "objectName": "<translated-object-urn>" }.
router.post('/jobs', async (req, res, next) => {
  let job = new JobPayload();
  job.input = new JobPayloadInput();
  job.input.urn = req.body.objectName;
  job.output = new JobPayloadOutput([
      new JobSvfOutputPayload()
  ]);
  job.output.formats[0].type = 'svf';
  job.output.formats[0].views = ['2d', '3d'];
  try {
      // Submit a translation job using [DerivativesApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/DerivativesApi.md#translate).
      await new DerivativesApi().translate(job, {}, req.oauth_client, req.oauth_token);
      res.status(200).end();
  } catch(err) {
      next(err);
  }
});

module.exports = router;

```

该工作端点接收的对象名和岗位的翻译工作，提取模型的2D和3D视图。

总而言之，此时您的NodeJS项目应如下所示：

![示例图06](https://learnforge.autodesk.io/_media/nodejs/vs_code_allfiles.png)

下一页：在查看器上显示

### 在查看器上显示

Viewer是基于pure HTML5和的客户端库JavaScript。但是，每个服务器端实现都有一些技巧。

#### 客户端文件（Node.js）

我们的Node.js服务器配置为提供文件public夹中的文件。让我们这样组织其内容：

* public/： .html
* public/js： .js
* public/css： .css

下图显示了预期的结构（在下一节中创建文件之后）：

![示例图07](https://learnforge.autodesk.io/_media/nodejs/vs_code_allfiles_ui.png)

##### 查看器（客户端）(<https://learnforge.autodesk.io/#/viewer/2legged/ui)>

让我们在客户端创建我们需要的4个文件。

**index.html** 这是您的应用程序的切入点。在此示例中，我们将使用[jQuery](https://jquery.com/)进行DOM操作，使用[Bootstrap](https://getbootstrap.com/)进行样式设置，并使用[jsTree](https://www.jstree.com/)列出存储桶和对象。所有这些库都来自CDN（内容交付网络）。

**Main.css** CSS是一种描述HTML文档样式的语言。

**ForgeTree.js** 该文件将处理列出所有存储桶的树形视图。

**ForgeViewer.js** 此文件将处理Viewer的初始化。

如果要下载准备使用的项目，请访问以下存储库：

* [**Node.js**](https://github.com/Autodesk-Forge/learn.forge.viewmodels/tree/nodejs)
* [**.NET Framework**](https://github.com/Autodesk-Forge/learn.forge.viewmodels/tree/net)
* [**.NET Core**](https://github.com/Autodesk-Forge/learn.forge.viewmodels/tree/netcore)
* [**Go**](https://github.com/Autodesk-Forge/learn.forge.viewmodels/tree/go)
* [**PHP**](https://github.com/Autodesk-Forge/learn.forge.viewmodels/tree/php)
* [**Java**](https://github.com/Autodesk-Forge/learn.forge.viewmodels/tree/java)

## 运行和调试

### 在本地运行和调试

现在您的应用已准备就绪，该运行它了。在这里我们可以测试并检查可能的错误（通过调试）。并检查提示和技巧。

#### 使用样本

下一节将向您展示如何运行您的应用程序。当它在浏览器中打开时，单击“ 新建存储桶”以创建您的存储桶（名称在所有Forge帐户中应该是唯一的）。

右键单击新创建的存储桶，然后选择上载文件（这将触发OSS上载过程）。

以下是一些用于测试的示例文件：

* [AutoCAD（.dwg）](https://knowledge.autodesk.com/zh-hans/support/autocad/downloads/caas/downloads/downloads/CHS/content/autocad-sample-files.html)
* [AutoCAD Mechanical（.dwg）](https://knowledge.autodesk.com/zh-hans/support/autocad-mechanical/downloads/caas/downloads/downloads/CHS/content/autocad-mechanical-2019-sample-files.html)
* [发明人（.ipt）](https://knowledge.autodesk.com/zh-hans/support/inventor/troubleshooting/caas/downloads/downloads/CHS/content/inventor-sample-files.html)
* [Revit（.rvt）](https://knowledge.autodesk.com/zh-hans/support/revit-products/getting-started/caas/CloudHelp/cloudhelp/2019/CHS/Revit-GetStarted/files/GUID-61EF2F22-3A1F-4317-B925-1E85F138BE88-htm.html)

然后展开存储桶树节点，在文件上单击鼠标右键，选择“ 转换”（这将触发模型导数工作）。片刻之后，文件应准备就绪，再次单击该文件以在查看器中显示它。

![示例图08](https://learnforge.autodesk.io/_media/tutorials/run_sample_viewmodels.gif)

#### 运行与调试（NodeJS）

转到“ 调试”菜单，然后选择“ 开始调试”。“调试控制台”选项卡应显示在底部，如下所示：

![示例图09](https://learnforge.autodesk.io/_media/nodejs/vs_code_debug.png)

打开浏览器，然后转到<http://localhost:3000>。

## 查看器扩展

扩展提供了一种机制，可以编写与Viewer交互的自定义​​代码。每个扩展都应在扩展管理器中注册自己，提供一个唯一的字符串ID，然后在运行时将其用于加载或卸载扩展。

本教程将指导您为Viewer创建扩展。

>对于本教程，您需要一个带有Viewer的应用程序，例如“ 查看模型”或“ View BIM 360＆Fusion模型”教程。无论在何处托管文件，查看器都是相同的。

### 基本骨架

#### 扩展骨架

本教程的这一步骤描述了带有工具栏按钮的扩展的基本框架，该工具栏按钮触发了.onClick函数内部的代码。您可以跳至“ 处理选择”以获得真实样本。

##### 创建MyAwesome扩展

让我们开始吧，每个扩展都应该是一个JavaScript文件，并至少实现.load和.unload功能。在UI文件夹/js/myawesomeextension.js中创建一个文件，然后复制以下内容。

```js
class MyAwesomeExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
    }

    load() {
        console.log('MyAwesomeExtensions已加载');
        return true;
    }

    unload() {
        // 如果我们添加了任何内容，请清理我们的UI元素
        if (this._group) {
            this._group.removeControl(this._button);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
        }
        console.log('MyAwesomeExtensions已卸载');
        return true;
    }

    onToolbarCreated() {
        // 创建一个新的工具栏组（如果不存在）
        this._group = this.viewer.toolbar.getControl('allMyAwesomeExtensionsToolbar');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('allMyAwesomeExtensionsToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        // 将新按钮添加到工具栏组
        this._button = new Autodesk.Viewing.UI.Button('myAwesomeExtensionButton');
        this._button.onClick = (ev) => {
            // Execute an action here在这里执行动作
        };
        this._button.setToolTip('My Awesome Extension');
        this._button.addClass('myAwesomeExtensionIcon');
        this._group.addControl(this._button);
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('MyAwesomeExtension', MyAwesomeExtension);

```

>请注意，上面的代码包含带有Execute an action here注释的占位符，应将其替换为您的自定义代码。

##### MyAwesome工具栏CSS

工具栏按钮使用CSS样式（请参见.addClass代码上的调用）。在/css/main.css中添加以下内容：

```css
.myAwesomeExtensionIcon {
    background-image: url(/img/myAwesomeIcon.png);
    background-size: 24px;
    background-repeat: no-repeat;
    background-position: center;
}

```

>该background-imageURL应针对项目中的现有文件进行调整。查看器使用24px图像。

##### 加载MyAwesome扩展

扩展框架已准备就绪，现在打开/index.html文件并添加以下行（将加载文件）：

```html
<script src="/js/myawesomeextension.js"></script>

```

注意：-确保在加载扩展时 代码，将其加载到ForgeViewer.js下

![示例图10](https://learnforge.autodesk.io/_media/forge/extension_example.png)

最后，我们需要告诉Viewer加载扩展，在/www/js/ForgeViewer.js中找到以下行：

```js
viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'));

```

并替换为：

```js
viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), { extensions: ['MyAwesomeExtension'] });

```

此时应加载扩展，工具栏按钮将显示，但不执行任何操作（请记住，在.onClick功能上仅占位符注释）。这是可用于创建扩展的基本框架。

>创建自己的扩展名时，请确保重命名，名称必须唯一。

### 处理选择(Selection)

本部分使用上一部分的基本框架，但让我们将MyAwesomeExtension重命名为HandleSelectionExtension。

#### 创建HandleSelection扩展

由于每个扩展名应该是一个分离的JavaScript文件，因此请在UI文件夹/js/handleselectionextension.js中创建一个文件，然后复制以下内容（与基本框架相同，但名称不同）：

```js
class HandleSelectionExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
    }

    load() {
        console.log('HandleSelectionExtension has been loaded');
        return true;
    }

    unload() {
        // Clean our UI elements if we added any
        if (this._group) {
            this._group.removeControl(this._button);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
        }
        console.log('HandleSelectionExtension has been unloaded');
        return true;
    }

    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        this._group = this.viewer.toolbar.getControl('allMyAwesomeExtensionsToolbar');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('allMyAwesomeExtensionsToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button('handleSelectionExtensionButton');
        this._button.onClick = (ev) => {
            // Execute an action here
        };
        this._button.setToolTip('Handle Selection Extension');
        this._button.addClass('handleSelectionExtensionIcon');
        this._group.addControl(this._button);
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('HandleSelectionExtension', HandleSelectionExtension);

```

#### HandleSelection工具栏CSS

就像在基本框架中一样，工具栏按钮使用CSS样式。在/css/main.css中添加以下内容：

```css
.handleSelectionExtensionIcon {
    background-image: url(https://github.com/encharm/Font-Awesome-SVG-PNG/raw/master/white/png/24/object-group.png);
    background-size: 24px;
    background-repeat: no-repeat;
    background-position: center;
}

```

>您可以使用自己的图像，也可以使用库中的图像，在这种情况下，让我们使用PNG格式的[Font Awesome](https://fontawesome.com/)图标。

#### 加载HandleSelection扩展

最后，使用与基本框架相同的代码加载扩展（当然，请调整名称）。供您参考，这是需要进行的两项更改：包括on index.html并包括创建查看器时的扩展名：\<script>

打开/index.html文件，并添加以下行：

```html
<script src="/js/handleselectionextension.js"></script>

```

在/www/js/ForgeViewer.js中，找到以下行：

```js
viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'));

```

并替换为：

```js
viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), { extensions: ['HandleSelectionExtension'] });

```

注意：-如果已加载一个扩展名，则可以 在数组中使用逗号（'，'）添加HandleSelectionExtension ：

```js
viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), { extensions['MyAwesomeExtension','HandleSelectionExtension'] });

```

此时，扩展程序应加载有工具栏图标，但它不会执行任何操作。

#### HandleSelection实现.onClick功能

现在是时候替换函数Execute an action here内部的占位符了.onClick。对于此示例，让我们隔离选择。将以下内容复制到函数内的扩展名.js文件中.onClick：

```js
// Get current selection 获取当前选择
const selection = this.viewer.getSelection();
this.viewer.clearSelection();
// Anything selected? 有没有选择？
if (selection.length > 0) {
let isolated = [];
// Iterate through the list of selected dbIds 遍历所选dbIds的列表
selection.forEach((dbId) => {
  // Get properties of each dbId 获取每个dbId的属性
  this.viewer.getProperties(dbId, (props) => {
    // Output properties to console 将属性输出到控制台
    console.log(props);
    // Ask if want to isolate 询问是否要隔离
    if (confirm(`Isolate ${props.name} (${props.externalId})?`)) {
      isolated.push(dbId);
      this.viewer.isolate(isolated);
      }
    });
  });
} else {
  // If nothing selected, restore 如果未选择，请还原
  this.viewer.isolate(0);
}

```

#### HandleSelection结论

此时，扩展程序应加载并显示工具栏按钮。选择一个或多个对象，然后单击按钮，确认要隔离的元素。以下视频演示了其行为。

![示例图11](https://learnforge.autodesk.io/_media/javascript/js_isolate.gif)

>浏览器控制台对于Web开发和调试至关重要。详细了解如何将其用于[Chrome](https://developer.apple.com/safari/tools/)，[Edge](https://docs.microsoft.com/en-us/microsoft-edge/devtools-guide/console)，[Firefox](https://developer.mozilla.org/en-US/docs/Tools/Web_Console/Opening_the_Web_Console)和[Safari](https://developer.apple.com/safari/tools/)。

学习重点：

* .getSelection（）从模型返回一个dbId数组，而.clearSelection（）
* .getProperties（）是一个异步方法，该方法通过回调返回给定dbId的所有属性，该方法在Viewer上广泛使用，[详细了解回调](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)
* .isolate（）方法使所有其他元素透明（“重影”）

其他学习要点：

* .forEach（）遍历一个集合，这是一个JavaScript功能
* .push（）以将项目包含在数组中

### 对接面板

本部分使用上一部分的**基本框架**，但让我们将MyAwesomeExtension重命名为ModelSummaryExtension。

#### 创建ModelSummary扩展

由于每个扩展名应该是一个单独的JavaScript文件，因此请在UI文件夹/js/dockingpanelextension.js中创建一个文件，然后复制以下内容（与基本框架相同，只是名称不同）：

```js
class ModelSummaryExtension extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
    this._group = null;
    this._button = null;
  }

  load() {
    console.log('ModelSummaryExtension has been loaded');
    return true;
  }

  unload() {
    // Clean our UI elements if we added any
    if (this._group) {
      this._group.removeControl(this._button);
      if (this._group.getNumberOfControls() === 0) {
        this.viewer.toolbar.removeControl(this._group);
      }
    }
    console.log('ModelSummaryExtension has been unloaded');
    return true;
  }

  onToolbarCreated() {
    // Create a new toolbar group if it doesn't exist
    this._group = this.viewer.toolbar.getControl('allMyAwesomeExtensionsToolbar');
    if (!this._group) {
      this._group = new Autodesk.Viewing.UI.ControlGroup('allMyAwesomeExtensionsToolbar');
      this.viewer.toolbar.addControl(this._group);
    }

    // Add a new button to the toolbar group
    this._button = new Autodesk.Viewing.UI.Button('ModelSummaryExtensionButton');
    this._button.onClick = (ev) => {
      // Execute an action here
    };
    this._button.setToolTip('Model Summary Extension');
    this._button.addClass('modelSummaryExtensionIcon');
    this._group.addControl(this._button);
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension('ModelSummaryExtension', ModelSummaryExtension);
```

#### ModelSummary工具栏CSS

就像在基本框架中一样，工具栏按钮使用CSS样式（请参见.addClass代码上的调用）。在/css/main.css中添加以下内容：

```css
.modelSummaryExtensionIcon {
  background-image: url(https://github.com/encharm/Font-Awesome-SVG-PNG/raw/master/white/png/24/dashboard.png);
  background-size: 24px;
  background-repeat: no-repeat;
  background-position: center;
}

```

#### ModelSummary加载扩展

最后，使用与**基本框架**相同的代码加载扩展（当然，请调整名称）。供您参考，这是需要进行的**两项**更改：包括on index.html并包括创建查看器时的扩展名：\<script>

```html
<script src="/js/dockingpanelextension.js"></script>

```

```js
viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), { extensions: ['ModelSummaryExtension'] });

```

>请注意extensions数组是如何的，因此您可以加载多个扩展！例如，要加载先前的选择样本以及该样本，只需使用即可['HandleSelectionExtension', 'ModelSummaryExtension']！酷吧？

此时，扩展程序应加载有工具栏图标，但它不会执行任何操作。

#### ModelSummary枚举叶结点

查看器包含模型上的所有元素，包括类别（例如，族或零件定义），因此我们需要枚举叶节点，这意味着模型上的实际实例。以下getAllLeafComponents()函数应添加到我们的扩展类中。这是基于[此博客文章](https://forge.autodesk.com/blog/enumerating-leaf-nodes-viewer)。

```js
getAllLeafComponents(callback) {
  this.viewer.getObjectTree(function (tree) {
    let leaves = [];
      tree.enumNodeChildren(tree.getRootId(), function (dbId) {
        if (tree.getChildCount(dbId) === 0) {
          leaves.push(dbId);
        }
      }, true);
    callback(leaves);
  });
}

```

#### ModelSummary对接面板

该扩展将在Viewer[属性面板](https://forge.autodesk.com/en/docs/viewer/v7/reference/UI/PropertyPanel/)上显示结果。将内容复制到扩展名.js文件（文件中其他任何功能之外的任何位置）。

```js
class ModelSummaryPanel extends Autodesk.Viewing.UI.PropertyPanel {
  constructor(viewer, container, id, title, options) {
    super(container, id, title, options);
    this.viewer = viewer;
  }
}

```

#### ModelSummary实现.onClick功能

现在是时候替换函数Execute an action here内部的占位符了onClick。对于此样本，让我们首先显示属性面板，然后枚举叶子节点，然后获取叶子节点的一组特定属性，最后计算这些属性的出现次数并在面板上显示结果。

>在下面的代码中，您必须调整filteredProps为适用于您的模型的属性名称。例如，由于材料几乎存在于所有模型中，因此您可以尝试const filteredProps = ['Material'];

将以下内容复制到扩展按钮功能内的扩展.js文件中onClick：

```js
// Check if the panel is created or not
if (this._panel == null) {
    this._panel = new ModelSummaryPanel(this.viewer, this.viewer.container, 'modelSummaryPanel', 'Model Summary');
}
// Show/hide docking panel
this._panel.setVisible(!this._panel.isVisible());

// If panel is NOT visible, exit the function
if (!this._panel.isVisible())
    return;

// First, the viewer contains all elements on the model, including
// categories (e.g. families or part definition), so we need to enumerate
// the leaf nodes, meaning actual instances of the model. The following
// getAllLeafComponents function is defined at the bottom
this.getAllLeafComponents((dbIds) => {
    // Now for leaf components, let's get some properties and count occurrences of each value
    const filteredProps = ['PropertyNameA', 'PropertyNameB'];
    // Get only the properties we need for the leaf dbIds
    this.viewer.model.getBulkProperties(dbIds, filteredProps, (items) => {
        // Iterate through the elements we found
        items.forEach((item) => {
            // and iterate through each property
            item.properties.forEach(function (prop) {
                // Use the filteredProps to store the count as a subarray
                if (filteredProps[prop.displayName] === undefined)
                    filteredProps[prop.displayName] = {};
                // Start counting: if first time finding it, set as 1, else +1
                if (filteredProps[prop.displayName][prop.displayValue] === undefined)
                    filteredProps[prop.displayName][prop.displayValue] = 1;
                else
                    filteredProps[prop.displayName][prop.displayValue] += 1;
            });
        });
        // Now ready to show!
        // The PropertyPanel has the .addProperty that receives the name, value
        // and category, that simple! So just iterate through the list and add them
        filteredProps.forEach((prop) => {
            if (filteredProps[prop] === undefined) return;
            Object.keys(filteredProps[prop]).forEach((val) => {
                this._panel.addProperty(val, filteredProps[prop][val], prop);
            });
        });
    });
});

```

#### ModelSummary结论

此时，扩展程序应加载并显示工具栏按钮。单击按钮，面板应出现。以下视频演示了其行为。

![示例图12](https://learnforge.autodesk.io/_media/javascript/js_dockingpanel.gif)

>如前所述，您需要定义适合模型的filteredProps。上面的视频['Material', 'Design Status', 'Type Name'];适用于两种型号。

学习重点：

* .getObjectTree（）提供对模型层次结构的访问权限，并且使用.getChildCount（）和.enumNodeChildren（）可以递归地迭代树
* .getBulkProperties（）是一个异步方法，该方法通过回调返回dbId数组的一组特定属性，该方法广泛用于Viewer
* .addProperty（）面板方法在类别上添加属性（名称，值）

其他学习要点：

* .forEach（）遍历一个集合，这是一个JavaScript功能

## Dashboard(仪表板)

本教程将指导您阅读数据并创建一些图表。

![示例图13](https://learnforge.autodesk.io/_media/tutorials/run_sample_dashboard.gif)

>对于本教程，您需要一个带有Viewer的应用程序，例如“ **查看模型**”或“ **View BIM 360＆Fusion模型**”教程。无论在何处托管文件，查看器都是相同的。

### 调整版面

本教程的此步骤使用应用程序的基本布局，但为图表添加了额外的列。

让我们在下面创建一个新Dashboard文件夹/js/来放置新文件。

#### Dashboard.js

加载模型日期时，此代码将调整页面布局，监视查看器并加载图表。它使用JavaScript类。

在具有以下内容的文件夹下创建一个新的Dashboard.js文件/js/dashboard/：

```js
$(document).ready(function () {
  $(document).on('DOMNodeInserted', function (e) {
    if ($(e.target).hasClass('orbit-gizmo')) {
      // to make sure we get the viewer, let's use the global var NOP_VIEWER 为确保获得观看者，我们使用全局变量NOP_VIEWER
      if (NOP_VIEWER === null || NOP_VIEWER === undefined) return;
      new Dashboard(NOP_VIEWER, [
        new BarChart('Material'),
        new PieChart('Material')
      ])
    }
  });
})

// Handles the Dashboard panels 处理仪表板面板
class Dashboard {
  constructor(viewer, panels) {
    var _this = this;
    this._viewer = viewer;
    this._panels = panels;
    this.adjustLayout();
    this._viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, (viewer) => {
      _this.loadPanels();
    });
  }

  adjustLayout() {
    // this function may vary for layout to layout... 此功能可能因布局而异...
    // for learn forge tutorials, let's get the ROW and adjust the size of the 要了解伪造教程，请获取ROW并调整
    // columns so it can fit the new dashboard column, also we added a smooth transition css class for a better user experience 列，使其适合新的仪表板列，此外，我们还添加了平滑的过渡CSS类，以提供更好的用户体验
    var row = $(".row").children();
    $(row[0]).removeClass('col-sm-4').addClass('col-sm-2 transition-width');
    $(row[1]).removeClass('col-sm-8').addClass('col-sm-7 transition-width').after('<div class="col-sm-3 transition-width" id="dashboard"></div>');
  }

  loadPanels() {
    var _this = this;
    var data = new ModelData(this);
    data.init(function () {
      $('#dashboard').empty();
      _this._panels.forEach(function (panel) {
        // let's create a DIV with the Panel Function name and load it 让我们用面板功能名称创建一个DIV并加载它
        panel.load('dashboard', viewer, data);
      });
    });
  }
}
```

在index.html上\<script>为此新文件添加一个。这应该放在\<head>：

```html
<!-- dashboard files -->
<script src="js/Dashboard/Dashboard.js"></script>

```

#### 调整main.css

我们还要添加几个额外的CSS类来帮助布局。将以下内容添加到您的/css/main.css文件中：

```css
#dashboard{
  overflow: auto;
  height: calc(100vh - 100px);
}

.transition-width {
  transition: width 1s ease-in-out;
}

.dashboardPanel {
  width: 100%;
  padding: 3%;
  display: block;
}

```

### 面板基础 准备数据

查看器包含来自模型的大量数据，但是我们需要过滤并调整到仪表板。以下课程将对此有所帮助。

有多种方法来组织数据，例如Arrays。对于此示例，我们使用JavaScript对象（作为哈希表）。从本质上讲，它将类似于：

```js
var data = {};
data['key'] = someValue;

```

但是我们有多个级别，例如：

```js
var data = {};
data['key'] = {};
data['key']['subkey'] = someValue;

```

使用这种方法，让我们存储属性名称，属性值和具有该值的dblds数组。例如：

```js
data['Category']['Walls'] = [123, 456, 789];

```

以下代码将准备该数据。

#### DashboardPanel.js

让我们重用getAllLeafComponents方法（来自Viewer Extension教程）来查找模型上所有可见的dbId，然后使用getProperties来获取信息。那是原始数据。

在/js/dashboard/文件夹下，创建一个具有以下内容的新DashboardPanel.js：

```js
// Dashboard panel base 仪表板面板底座
class DashboardPanel {
  load(parentDivId, divId, viewer) {
    this.divId = divId;
    this.viewer = viewer;
    $('#' + parentDivId).append('<div id="' + divId + '" class="dashboardPanel"></div>');
  }
}

// Dashboard panels for charts 图表仪表板
class DashboardPanelChart extends DashboardPanel {
  load(parentDivId, divId, viewer, modelData) {
    if (!modelData.hasProperty(this.propertyToUse)) {
      alert('This model does not contain a ' + this.propertyToUse + ' property for the ' + this.constructor.name);
      console.log('These are the properties available on this model: ');
      console.log(Object.keys(modelData._modelData));
      return false;
    }
    divId = this.propertyToUse.replace(/[^A-Za-z0-9]/gi, '') + divId; // div name = property + chart type
    super.load(parentDivId, divId, viewer);
    this.canvasId = divId + 'Canvas';
    $('#' + divId).append('<canvas id="' + this.canvasId + '" width="400" height="400"></canvas>');
    this.modelData = modelData;
    return true;
  }

  generateColors(count) {
    var background = [];
    var borders = [];
    for (var i = 0; i < count; i++) {
      var r = Math.round(Math.random() * 255);
      var g = Math.round(Math.random() * 255);
      var b = Math.round(Math.random() * 255);
      background.push('rgba(' + r + ', ' + g + ', ' + b + ', 0.2)');
      borders.push('rgba(' + r + ', ' + g + ', ' + b + ', 0.2)');
    }
    return {
      background: background,
      borders: borders
    };
  }
}

// Model data in format for charts 图表格式的模型数据
class ModelData {
  constructor(viewer) {
    this._modelData = {};
    this._viewer = viewer;
  }

  init(callback) {
    var _this = this;

    _this.getAllLeafComponents(function (dbIds) {
      var count = dbIds.length;
      dbIds.forEach(function (dbId) {
        viewer.getProperties(dbId, function (props) {
          props.properties.forEach(function (prop) {
            if (!isNaN(prop.displayValue)) return; // let's not categorize properties that store numbers 我们不对存储数字的属性进行分类

            // some adjustments for revit: 对revit的一些调整：
            prop.displayValue = prop.displayValue.replace('Revit ', ''); // remove this Revit prefix 删除此Revit前缀
            if (prop.displayValue.indexOf('<') == 0) return; // skip categories that start with '<' 跳过以<开头的类别

            // ok, now let's organize the data into this hash table 好的，现在让我们将数据组织到该哈希表中
            if (_this._modelData[prop.displayName] == null) _this._modelData[prop.displayName] = {};
            if (_this._modelData[prop.displayName][prop.displayValue] == null) _this._modelData[prop.displayName][prop.displayValue] = [];
            _this._modelData[prop.displayName][prop.displayValue].push(dbId);
          })
          if ((--count) == 0) callback();
        });
      })
    })
  }

  getAllLeafComponents(callback) {
    // from https://learnforge.autodesk.io/#/viewer/extensions/panel?id=enumerate-leaf-nodes
    viewer.getObjectTree(function (tree) {
      var leaves = [];
      tree.enumNodeChildren(tree.getRootId(), function (dbId) {
        if (tree.getChildCount(dbId) === 0) {
          leaves.push(dbId);
        }
      }, true);
      callback(leaves);
    });
  }

  hasProperty(propertyName) {
    return (this._modelData[propertyName] !== undefined);
  }

  getLabels(propertyName) {
    return Object.keys(this._modelData[propertyName]);
  }

  getCountInstances(propertyName) {
    return Object.keys(this._modelData[propertyName]).map(key => this._modelData[propertyName][key].length);
  }

  getIds(propertyName, propertyValue) {
    return this._modelData[propertyName][propertyValue];
  }
}
```

在index.html上\<script>为此新文件添加一个。这应该放在Dashboard.js中\<head>，之后：

```html
<script src="js/Dashboard/DashboardPanel.js"></script>

```

### 添加图表

有很多库可以创建图表，对于这个示例，我们使用[Chart.js](https://cdnjs.com/libraries/Chart.js)，它非常简单但易于使用，并且视觉效果很好。

在index.html处添加下面的\<script>and \<link>样式表，以供Chart.js CDN库参考。这应该放在里面\<head>

```html
<!--Chart JS  packages-->
<script src="//cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js" ></script>
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.css" />

```

#### 条形图

在/js/dashboard/文件夹下，创建一个新的PanelBarChart.js文件，其内容如下：

```js
class BarChart extends DashboardPanelChart {
  constructor(property) {
    super();
    this.propertyToUse = property;
  }

  load(parentDivId, viewer, modelData) {
    if (!super.load(parentDivId, this.constructor.name, viewer, modelData)) return;
    this.drawChart();
  }

  drawChart() {
    var _this = this; // need this for the onClick event

    var ctx = document.getElementById(this.canvasId).getContext('2d');
    var colors = this.generateColors(this.modelData.getLabels(this.propertyToUse).length);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.modelData.getLabels(this.propertyToUse),
        datasets: [{
          data: this.modelData.getCountInstances(this.propertyToUse),
          backgroundColor: colors.background,
          borderColor: colors.borders,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        legend: {
          display: false
        },
        'onClick': function (evt, item) {
          _this.viewer.isolate(_this.modelData.getIds(_this.propertyToUse, item[0]._model.label));
        }
      }
    });
  }
}
```

#### 饼形图

在/js/dashboard/文件夹下，创建一个新的PanelPieChart.js文件，其内容如下：

```js
class PieChart extends DashboardPanelChart {
  constructor(property) {
    super();
    this.propertyToUse = property;
  }

  load(parentDivId, viewer, modelData) {
    if (!super.load(parentDivId, this.constructor.name, viewer, modelData)) return;
    this.drawChart();
  }

  drawChart() {
    var _this = this; // need this for the onClick event

    var ctx = document.getElementById(this.canvasId);
    var colors = this.generateColors(this.modelData.getLabels(this.propertyToUse).length);

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.modelData.getLabels(this.propertyToUse),
        datasets: [{
          data: this.modelData.getCountInstances(this.propertyToUse),
          backgroundColor: colors.background,
          borderColor: colors.borders,
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: true
        },
        'onClick': function (evt, item) {
          _this.viewer.isolate(_this.modelData.getIds(_this.propertyToUse, item[0]._model.label));
        }
      }
    });
  }
}
```

在index.html上\<script>为这些新文件添加2 。这应该放在DashboardPanel.js里面\<head>和之后：

```html
<script src="js/Dashboard/PanelBarChart.js"></script>
<script src="js/Dashboard/PanelPieChart.js"></script>
```

您的仪表板现在可以运行了！启动浏览器，转到 <http://localhost3000> 并选择一个模型。

#### 故障排除

此模型的弹出警报消息不包含 PieChart（或BarChar）的Material属性，只是表明默认的Material属性在当前模型上不可用，因此无法创建饼图或条形图。将显示以下消息。

![示例图14](https://learnforge.autodesk.io/_media/javascript/js_dashboard_propertymissing.png)

要解决此问题，请转到Dashboard.js（在/js/dashboard/文件夹下）第7和8行调整属性名称：

```js
new BarChart('Material'),
new PieChart('Material')
```

**不知道有哪些物业可用？**

当所选属性不可用时，代码将在浏览器控制台上输出所有可用属性的列表。

>浏览器控制台对于Web开发和调试至关重要。详细了解如何将其用于Chrome，Edge，Firefox和Safari。

## 部署方式

这是您的应用程序上线的时间！有几种选择，让我们集中讨论。

### 亚马逊网络服务

Amazon Web Services（AWS）支持许多不同的环境和编程语言，以下是一些选项：
**弹性豆茎**

*只需上传代码，Elastic Beanstalk即可自动处理部署，从容量配置，负载平衡，自动扩展到应用程序运行状况监控。同时，您将完全控制为应用程序提供动力的AWS资源，并可以随时访问基础资源。 [了解更多](https://aws.amazon.com/cn/elasticbeanstalk/)。*

选择您的语言：[.NET Framework](https://learnforge.autodesk.io/#/deployment/aws/net)

### 微软Azure

Azure支持许多不同的环境和编程语言，以下是一些选项：
**应用服务**

*使用完全托管的平台创建功能强大的云应用程序：快速构建，部署和扩展在任何平台上运行的企业级Web，移动和API应用程序。使用完全托管的平台执行基础结构维护时，可以满足严格的性能，可伸缩性，安全性和合规性要求。 [了解更多](https://azure.microsoft.com/en-us/services/app-service/)。*

选择您的语言： Node.js | [.NET Framework或核心](https://learnforge.autodesk.io/#/deployment/azure/net)

#### 带有Azure App Service的Node.js Forge App

这将引导您逐步完成使用[Azure Web Portal](https://azure.microsoft.com/en-us/features/azure-portal/)和[Git](https://git-scm.com/)将Node.js示例Forge App作为Web App部署到Azure App Service的步骤。

对于本教程，我们将使用[前面各章中](https://learnforge.autodesk.io/#/tutorials/viewhubmodels)介绍的ViewHubModels示例。您可以[从我们的Github存储库中](https://github.com/Autodesk-Forge/learn.forge.viewhubmodels/tree/nodejs)检索完整样本。相同的步骤也应适用于View Models教程代码。

在开始之前，[请登录或注册](https://login.microsoftonline.com/common/oauth2/authorize?client_id=8e0e8db5-b713-4e91-98e6-470fed0aa4c2&response_mode=form_post&response_type=code+id_token&scope=openid+profile&state=OpenIdConnect.AuthenticationProperties%3dHknfeK890_eS30v_n3FB4AuBOIBit843AT2OcIaMbSzSeF92pkFjq7tyxyvUeZl-chGQ9oISpR7XUunmGIaEmu0FpBmLYPCQV-UvzzfIIKzT92FYOFLLojNnAlCCcufH&nonce=637280445394430551.YWVkMzhjMzMtYTEwYS00YTk2LTk0OWQtOWVmMDU1MWI1YTZiM2RkYTE3NDItNTczYS00OWY4LWExN2QtOGZiZTlhNDY5MzI4&redirect_uri=https%3a%2f%2fsignup.azure.com%2fapi%2fuser%2flogin&max_age=86400&post_logout_redirect_uri=https%3a%2f%2fsignup.azure.com%2f)为微软[Azure计算平台和服务](https://azure.microsoft.com/zh-cn/)，并创建一个[试用帐户](https://azure.microsoft.com/en-us/free/?cdn=disable)，它包括$ 200的信用和免费为12个月

##### 先决条件

大多数步骤都可以通过Web Portal完成，但是需要Azure CLI。

##### 创建一个Azure Web应用

有两种创建应用程序的方法：使用Web门户和CLI。

1. **使用Web Portal创建一个应用**

   * 创建一个Resource Group和一个Web App
  ![示例图15](https://learnforge.autodesk.io/_media/deployment/azure/create_web_app_1.png)
   * 设置Runtime Stack为NodeJs，然后单击Create
  ![示例图16](https://learnforge.autodesk.io/_media/deployment/azure/create_web_app_node.png)
   * 创建该应用可能需要一段时间，一旦完成，请导航至该应用以查看其设置
  ![示例图17](https://learnforge.autodesk.io/_media/deployment/azure/app_dashboard.png)

2. **使用Azure CLI创建应用**

   * Resource Group使用Web App以下命令创建（或使用现有的）和：

  ```bash
  # login with credentials explicitly or simply use 'azure login' to log in with a browser session or authorisation code
  az login -u <username> -p <password>

  # Create a Resource Group
  az group create --location westus --name myResourceGroup

  # Create an App Service Plan in free tier
  az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku FREE

  # Create a Web App
  az webapp create --name <nameofyourapp> --plan myAppServicePlan --resource-group myResourceGroup

  ```

##### 部署应用

对于本教程，我们将Local Git部署代码。可以使用Web Portal和CLI来完成

1. **使用Web Portal进行部署**

   * 导航至Deployment Center以设置部署设置
  ![示例图18](https://learnforge.autodesk.io/_media/deployment/azure/deployment_settings_1.png)
   * 选择您的构建服务器
  ![示例图19](https://learnforge.autodesk.io/_media/deployment/azure/deployment_settings_kudu.png)
   * 将部署源设置为 Local Git
  ![示例图20](https://learnforge.autodesk.io/_media/deployment/azure/deployment_settings_localgit_1.png)
   * 单击右上角突出显示的按钮以打开Azure CLI，运行az webapp deployment user set --user-name $username --password $password以配置部署凭据并记录生成的Git URL

   * 使用您的Forge App凭据（FORGE_CLIENT_ID和FORGE_CLIENT_SECRET）和回调URL（遵循模式<http://>\<nameofyourapp>.azurewebsites.net/api/forge/callback/oauth） 设置环境变量
  ![示例图21](https://learnforge.autodesk.io/_media/deployment/azure/portalAppSettings.png)

2. **使用CLI进行部署**

```bash
# Set the account-level deployment credentials
az webapp deployment user set --user-name $username --password $password

# Configure local Git and get deployment URL
echo $(az webapp deployment source config-local-git --name <nameofyourapp> --resource-group <nameofyourresourcegroup> --query url --output tsv)

# Set up the environment variables
az webapp config appsettings set -g MyResourceGroup -n <nameofyourapp> --settings FORGE_CLIENT_ID=<yourForgeAppClientID> FORGE_CLIENT_SECRET=<yourForgeAppSecret> FORGE_CLIENT_SECRET=<yourForgeAppSecret> FORGE_CALLBACK_URL=<yourCallbackURL>
```

* 使用Git CLI或您喜欢的Git客户端将本地存储库推送到Azure Web App

```bash
# Add the Azure remote to your local Git respository and push your code
cd /path/to/local/repo
git remote add azure <giturlofyourapp>
git push azure master # use 'git push azure <nameofyourbranch>:master' if you would like to push other local branches than master
```

应用仪表盘应如下所示：
![示例图22](https://learnforge.autodesk.io/_media/deployment/azure/app_dashboard.png)
做完了！打开应用程序网址以查看我们正在运行的应用程序。

3. **其他部署选项**

* [Visual Code](https://azure.microsoft.com/en-us/blog/visual-studio-code-and-azure-app-service-a-perfect-fit/)/[Visual Studio](<https://learnforge.autodesk.io/#/../node>)
* [VSTS](https://docs.microsoft.com/en-us/labs/devops/deployazurefunctionswithvsts/)
* [Github](https://docs.microsoft.com/zh-cn/archive/blogs/benjaminperkins/deploy-github-source-code-repositories-to-an-azure-app-service)
* [BitBucket](https://support.atlassian.com/bitbucket-cloud/docs/deploy-to-microsoft-azure/)
* [FTP](https://docs.microsoft.com/en-us/azure/app-service/deploy-ftp)

##### 演示截屏

观看此截屏展示了截屏是基于猛砸对Azure的门户和CLI（上面的步骤，但涉及到的命令将是相同的Windows CLI和PowerShell的，而且你可以在Windows上运行的Bash！看这还是该为Git的一部分甚至尝试Linux子系统）

### Heroku

*Heroku是基于云的平台即服务（PaaS），基于托管容器系统，用于构建，运行和管理现代应用程序。Heroku的平台，工具，集成服务和生态系统经过精心设计，以支持最佳的开发人员体验。 [了解更多](https://devcenter.heroku.com/articles/git)。*

选择您的语言： [Node.js](https://learnforge.autodesk.io/#/deployment/heroku/nodejs) | [.NET核心](https://learnforge.autodesk.io/#/deployment/heroku/netcore) | [PHP](https://learnforge.autodesk.io/#/deployment/heroku/php)

### AppHarbor

*AppHarbor是一个完全托管的.NET平台即服务。AppHarbor可以将任何标准.NET应用程序部署并扩展到云中。 [了解更多](https://appharbor.com/)。*

选择您的语言： [.NET Framework](https://forge.autodesk.com/blog/deploying-forge-aspnet-samples-appharbor)

## Support & Online resources

### Online Resources

Documentation

* [Developer Portal](https://forge.autodesk.com/) is the "source of truth" on Forge!
Samples

* [Autodesk Forge](https://github.com/Autodesk-Forge/) on Github
Blog

* [Forge Blog](https://forge.autodesk.com/blog)

### Getting help

Questions? Stackoverflow!

[General Forge](https://stackoverflow.com/questions/tagged/autodesk-forge)

Used on this tutorial: [Data Management](https://stackoverflow.com/questions/tagged/autodesk-data-management) | [Model Derivative](https://stackoverflow.com/questions/tagged/autodesk-model-derivative) | [Viewer](https://stackoverflow.com/questions/tagged/autodesk-viewer) | [Design Automation](https://stackoverflow.com/questions/tagged/autodesk-designautomation)

Other APIs: [Webhooks](https://stackoverflow.com/questions/tagged/autodesk-webhooks) | [BIM 360](https://stackoverflow.com/questions/tagged/autodesk-bim360)
