# Autodesk Forge Tool

>梁晓冬  发布于 2月16日

Forge的网络应用开发，不仅需要频繁的代码测试，还要测试模型，分析数据等，尤其很多朋友的开发环境是现在流行的Visual Studio Code。今天我们特别介绍一款超便利的Forge测试工具：Autodesk Forge Tool。由我们部门的同事Petr Broz撰写。

这款工具是一个VSCode的扩展库。先通过VSCode市场搜寻Autodesk Forge Tool,然后安装。

![步骤01](https://segmentfault.com/img/bVbDtRo)

安装成功后，左边侧的菜单栏会出现一个Forge的菜单：**先不要点击**。而是先打开一个目录作为【工作空间】。

![步骤02](https://segmentfault.com/img/bVbDtYC)

这时点击Forge的菜单，将出现Forge Tool的测试面板，而VSCode环境右下角出现一个提示，让输入您的Forge ID等信息，点击确认开始。也可以通过快捷键（ macOS的 Cmd+, Windows的 Ctrl+） 来弹出输入框。

![步骤03](https://segmentfault.com/img/bVbDtX2)

按顺序输入**Client ID**, **Client Secret**和**测试用数据放在US还是EMEA**（目前两个数据中心）

![步骤04](https://segmentfault.com/img/bVbDtX4)

![步骤05](https://segmentfault.com/img/bVbDtX6)

![步骤06](https://segmentfault.com/img/bVbDtX7)

最后是给这些变量的环境一个名字。

![步骤07](https://segmentfault.com/img/bVbDtYa)

Forge Tool当前版本提供三组测试，而且内容相当丰富

![步骤08](https://segmentfault.com/img/bVbDtYn)

1. Data & Derivatives： 进行数据管理，模型转换，甚至包括SVF数据包下载。缺省会列出所有该Client ID （app）所拥有的bucket。
2. Webhook： 包括各种支持的Webhook类型设置和调用。缺省会列出Client ID （app）所拥有的Webhook
3. Design Automation：进行云端设计自动化的测试。缺省会列出Client ID （app）的云端自动化有关的资源：appbunddle, activity等。

本文讲解#1的使用方法和测试场景。

* 当前面的环境变量设置好以后，可测试现有bucket内容，也可从创建bucket开始，点击Data & Derivatives 右侧的 + 号，弹出输入框，输入bucket的名字和生存周期。

![步骤09](https://segmentfault.com/img/bVbDtYU)

![步骤10](https://segmentfault.com/img/bVbDtYW)

等待片刻，一个新的bucket创建好，并在列表中出现。右键这个bucket节点，几个菜单供选择，包括查看bucket基本信息 【View Bucket Details】，该命令将调用Forge端口，把返回值显示到右侧的临时文件中。及其方便！

![步骤11](https://segmentfault.com/img/bVbDtZg)

* 点击【Upload Object】，提示选择一个测试模型文件，确定文件名，接着提示选择文件的类型。如果不清楚什么类型，选择**application/octet-stream.**

![步骤12](https://segmentfault.com/img/bVbDtZk)

文件开始上传

![步骤13](https://segmentfault.com/img/bVbDtZn)

文件上传成功后，显示在bucket节点的展开节点中。此时尚未有转换数据，

![步骤14](https://segmentfault.com/img/bVbDtZv)

* 右键此文件节点，出现多个可选菜单。点击【Translate Object】

![步骤15](https://segmentfault.com/img/bVbDtZz)

转换过程开启，状态显示在文件节点下方：

![步骤16](https://segmentfault.com/img/bVbDtZC)

* 转换成功后，出现所有的3D数据和2D数据列表

![步骤17](https://segmentfault.com/img/bVbDtZI)

* 右键某个数据节点，选择【Preview Derivatives】，一个加载数据到Forge Viewer的过程启动！

![步骤18](https://segmentfault.com/img/bVbDtZO)

稍等片刻，右侧的文件窗口中模型加载完毕！很酷！ VSCode中直接看模型😎想看看2D也可同时进行查看：

![步骤19](https://segmentfault.com/img/bVbDt2R)

* 如果想查看模型的层次结构，点击【View Derivatives Tree Json】. 等待片刻，一个json数据文件产生。

![步骤20](https://segmentfault.com/img/bVbDt0y)

同理，点击【view Derivatives Properties Json】将获取构件属性json数据

![步骤21](https://segmentfault.com/img/bVbDt1k)

* 最激动的一个功能，直接下载SVF数据包！选择文件节点的【Download Object Derivatives as SVF/F2D】.选择一个文件夹，所有的SVF数据资源将依次下载。

![步骤22](https://segmentfault.com/img/bVbDt1R)

还有好些其它功能菜单，常见的测试场景全覆盖。相信给各位朋友的开发带来更多帮助。如果您觉得还不够，可以自行拓展源码！Petr分享在他的个人Github中：
<https://github.com/petrbroz/v...>

>本作品系 原创 ， 采用《署名-非商业性使用-禁止演绎 4.0 国际》许可协议
