# Autodesk Forge 学习简谈

作者：梁晓东(博客：<https://segmentfault.com/a/1190000008577152>)

## 引言

>autodesk-forge    发布于 2017-03-05

国内朋友对Autodesk Forge的热情愈发高涨，这不仅因为Forge紧密契合了现在蓬勃发展的智慧互联，BIM，工业4.0，施工管理，运营管理，VR/AR行业的旺盛需求，解决了诸多痛点，也是因为Forge诞生于流行的技术框架，能够和众多新颖，高效，安全的开发方式结合，产生好用，好看又能持续带来业务价值的网络和移动应用。

在支持国内客户的过程中，频繁会被问及四类问题：

1. 刚刚接触Forge的朋友，想快速入门，材料，教程;
2. 常见场景的代码样例，常见问题的诊断技巧;
3. 一些综合应用的代码解析;
4. 离线模型的下载和部署;
坦言之，目前中文方面的材料还很有限，而英文的资料有些朋友一开始不是特别清楚从哪里着手，因此我们曾整理过一个在线PPT，帮助朋友们熟悉一些材料，包含了Forge的概览，Forge应用的一小部分样例，Forge现有几个服务技术的资料链接，Forge问题全球的正式支持方式，和国内的咨询方式（微信群和SegmentFault论坛）。想必各位都比较熟悉了。

我们中国区团队在不断的增加中文的材料。今年计划做的进一步工作有：

* 制作入门和某些专题的视频课程，以帮助大家快速上手。中英文版本;
* 继续整理一些问答到SegmentFault，方便大家检索;
* 在线不定期1小时的答疑和研讨，帮助大家消化一些需求，方向上的问题;
* 继续根据行业的需求点，写一些模拟样例;
* 继续收集全球的客户应用案例，分享给大家参考;

同时也欢迎各位有兴趣的朋友，分享自己的心得，材料，案例。社区帮助社区，才会让技术的应用生命力更加强大。

对于以上提到的4类常见咨询，将以4篇文章陆续介绍。本系列文章旨在和从事Forge具体编程的朋友分享一点体会。如果您还不了解Forge，或者是产品经理，技术架构师，可通过 Forge技术概览 和 Forge应用案例赏析 做初步的了解。希望此系列能对您Forge的开发历程有些许帮助。

## 刚刚接触Forge的朋友，想快速入门，材料，教程

就引言提到的四类常见咨询内容，本文介绍第一类：刚刚接触Forge的朋友，想快速入门，材料，教程。
>注：本文提及的资源链接若访问不了，请尝试VPN

Forge是云服务集合的平台，云服务都是Restful形式提供的，调用过程大多在网络应用的服务器端完成，所以若您还不了解Restful，请通过网上材料查看一下。无特别推荐，此类信息已经很多了。由于Restful众多开发语言都支持，因此选用您自己擅长或者业务需要的开发方式即可。个人较为推荐Node.js的方式，而使用Node，可以用的工具有[WebStorm](https://www.jetbrains.com/webstorm/) （需要收费），或[Visual Code](https://code.visualstudio.com/) （目前免费）。另外，选用合适业务的方式搭建服务器，部署服务器。现在网上有很多不错的快速部署工具，例如[Heroku](https://www.heroku.com/)，[Appharbor](https://appharbor.com/)。当然还有常见的巨头，[AWS](https://aws.amazon.com/cn/)，[Azure](https://azure.microsoft.com/en-us/)，[阿里云](https://www.aliyun.com/)等。

而通常大家熟悉的[Forge Viewer (网页模型浏览和数据查看，业务对接）](https://devtechchina.github.io/ForgeHelp/#/)是一套JavaScript API，属于客户端的API。也就意味着，您需要熟悉JavaScript的编程。使用Forge Viewer，模型要首先用Forge服务转换浏览器支持的格式，也就是说，后面其实包含了几个服务：[Authentication (OAuth)](https://devtechchina.github.io/ForgeHelp/#/7)，[Data Management API](https://devtechchina.github.io/ForgeHelp/#/7)，[Model Derivative API](https://devtechchina.github.io/ForgeHelp/#/7)。

请使用此【[测试网站](https://models.autodesk.io/)】开始体验，填入自己的client id和secret，点击【Get Access Token】，跳转到一个页面，包括上载模型，启动转换，查看结果，加载模型到网页等，还有token有效期倒计时。

![示例图01](https://segmentfault.com/img/bVbb0YC?w=2394&h=1294)
![示例图02](https://segmentfault.com/img/bVbb0YV?w=1866&h=1820)

在前年的Forge Viewer技术研讨会上，我们的同事罗诗亚做过专门的过程讲解，视频清晰度在优酷上被压缩的厉害，可配合她用到的[在线PPT](http://www.shiyaluo.com/slidedecks/webcast-2016-2-29/)查看。其主要的过程和上面提到的测试体验网站类似。当时Forge Viewer和背后几个技术统称为Viewer and Data。只是名字而已。

![示例图03](https://segmentfault.com/img/bVJ9s2?w=1093&h=950)

通过这些材料，逐步熟悉几个主要的概念：申请app, 开发key & secret, token, bucket, urn, translate, viewer 等。有了这个体会后教学基础后，您就可以开始上手练习了。

如果您已经熟悉模型转换的过程，只是更多关注Forge Viewer客户端的开发，则可以先从我们同事[吴忠的课件](https://github.com/JohnOnSoftware/Forge.Viewer.Classroom.Trainning)开始。其分支包括了Forge Viewer一些常见开发内容的代码，例如自定义工具条，操作对象，实现拓展（extension）等。虽然此课件用的Node.js搭建的服务，但主要用来得到token，假设不熟悉Node.js也不用担心，主要关注客户端，借鉴到您的应用实现。

![示例图04](https://segmentfault.com/img/bVJ9s8?w=403&h=620)

也推荐另外一个类似的[课程系列（全英文）](https://github.com/Autodesk-Forge/forge-boilers.nodejs)，用的Node.js + WebPack进行讲解。涵盖了以下内容:

* viewer-offline将Forge转换的网页浏览数据部署到自己服务器，通常叫做离线查看（offline）进行查看。这属于中级课程，可先略过
* viewer-barebone：无需服务器端代码，需要通过其它工具产生token和模型的urn，填写到JavaScript代码中，实现模型的加载
* viewer+server：服务器端完成token的产生工作，其它内容（例如模型上传，转换）通过其它工具完成，填写到JavaScript代码中，实现模型的加载
* viewer+server+oss: 服务器端完成token的产生和模型上传工作，其它内容（例如模型转换）通过其它工具完成，实现模型的加载
* viewer+server+oss+derivatives: 服务器端完成后端所有工作（token的产生，模型上传，模型转换），客户端实现模型的加载

如果您是想开始Forge其它云服务的过程，例如[云端设计自动化（Design Automation）](https://devtechchina.github.io/ForgeHelp/#/7)，则可以先通过此[在线PPT](https://xiaodongliang.github.io/DA2016/#/)熟悉主要的概念和流程：app，开发key & secret, token，Activity，WorkItem，AppPackage等。此材料链接到了一些英文材料，也可按照指南参考。

其它的服务例如BIM 360， Reality Capture（照片建模）等服务，还在beta阶段。等正式发布了，我们会介绍有关材料。

## 常见场景的代码样例，常见问题的诊断技巧

就引言提到的四类常见咨询内容，本文介绍第二类：常见场景的代码样例，常见问题的诊断技巧。
>注：本文提及的资源链接若访问不了，请尝试VPN

当有了一定Forge基础后，例如Forge Viewer以及背后的转换过程服务，具体的使用中，必然会遇到这样或那样的问题，先看看是后端的问题（例如token，上传，模转换），还是前端（Forge Viewer）的问题和需求。

----

对于后端的问题，首先通过[StackOverflow（SO）](https://stackoverflow.com/), 在[autodesk-forge标签](https://stackoverflow.com/questions/tagged/autodesk-forge)下看看有无相关的讨论。还有细化的标签，例如：

**autodesk-designautomation**：云端设计自动化（DesignAutomation）
**autodesk-data-managemen**：模型上传下载（DataManagement
**autodesk-model-derivative**： 模型转换和数据提取服务（ModelDerivative）

![示例图05](https://segmentfault.com/img/bVJ9uu?w=997&h=871)

在SegmentFault上也有autodesk-forge标签，不方便英文交流的朋友可发帖在这里，我们也会陆续的贴一些常见问题，便于大家中文查询。目前只有一个autodesk-forge标签。

![示例图06](https://segmentfault.com/img/bVJ9xW?w=1045&h=743)

而后端的内容，建议可以使用我们提供的SDK包。现有的SDK包可从这里下载使用：
<https://developer.autodesk.co...>
包括了 Node.js, Ruby, VB.NET, Java,C#
可以避免浪费很多时间在基本的上载，转换过程中。

![示例图07](https://segmentfault.com/img/bVJ9Dj?w=913&h=460)

说到这里，你可以开始尝试用一下新鲜出炉的【[Learn Forge tutorial - 向导式Forge进阶教程](https://segmentfault.com/a/1190000014254696)】，它涵盖了模型网页浏览的所有知识点，而且是一步步带着大家练习，多种语言方式。强力推荐：

![示例图08](https://segmentfault.com/img/bVbb0ZW?w=2188&h=2014)

对于前端，例如Forge Viewer，虽然SO上有[autodesk-viewer标签](https://stackoverflow.com/questions/tagged/autodesk-viewer)，但更建议上[Autodesk-Forge的Github代码库](https://github.com/autodesk-forge)查询已经有的代码样例，看看是否已经有代码实现了您需要的场景。两个工具特别推荐：

----

[Forge Viewer 测试器](https://github.com/Autodesk-Forge/viewer-javascript-debugger.tool)：此代码有对应的[测试网站](http://autodesk-forge.github.io/viewer-javascript-debugger.tool/)。包括了多个基本Viewer操作的场景，例如：改变构件颜色，操作相机，操作视图状态，构件可见性，查找构件等等，更酷的是，对应的代码也直接可以显示出来，方便理解和测试。**注意：此网站不再维护，已无法加载模型进行测试，但其代码样例还是有一定参考作用（部分APIs用法可能在新版已变化）点击右侧的列表，对应的代码就出现在页面下方**

![示例图09](https://segmentfault.com/img/bVJ9vN?w=1163&h=1017)

另外一个代码库是[Viewer 功能扩展包](https://github.com/Autodesk-Forge/library-javascript-viewer-extensions)，这里包含了几十个Viewer的可能需要的应用场景，实现较为综合的功能，例如，变换构件位置（旋转，），导入额外的模型数据，为构件贴图，获取构件的三角面片等等，所以，请务必在这里先查查是否有代码样例了。

为了让这些扩展的功能得以生动体现，我们还部署了一个[测试网站](https://forge-rcdb.autodesk.io/configurator)，大部分可找到对应的源码。[子页面](https://forge-rcdb.autodesk.io/configurator?id=58c7ae474c6d400bfa5aaf37)加载一个模型，右侧有一些常规扩展的测试。[另外一个子页面](https://forge-rcdb.autodesk.io/gallery)提供了一些缺省模型进行测试，也允许客户上传自己的模型，但只保留30天。

![示例图10](https://segmentfault.com/img/bVQwSs?w=1897&h=1020)

假设这些地方没看到样例，或者您是遇到特定的问题，错误了，和上面类似，在SO或SegmentFault上查询。

或者这些都没找到头绪，由于是客户端代码，建议大家可以多分析和调试Viewer3D.js。通常我们引用Viewer的JS库，是用到其压缩版，含有sourcemap，可以在浏览器控制台窗口的Source中直接设置断点进行调试，包括Viewer加载的的Extension代码。

```html
<script src="https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/viewer3D.min.js"></script>
```

也可在引用的时候设置为非压缩版，

```html
<script src="https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/viewer3D.js"></script>
```

![示例图11](https://segmentfault.com/img/bVbiRhB?w=1660&h=1106)

若您发现有些功能有问题，或有不足的地方，可以反馈给Autodesk Forge团队，由开发部进行功能的改进或提供。

## 一些综合应用的代码解析

就引言提到的四类常见咨询内容，本文介绍第三类： 一些综合应用的代码解析。
>注：本文提及的资源链接若访问不了，请尝试VPN

可能您有一些综合的需求，不是三两个功能能够描述，那么先在Forge样例库里这里查看是否有合适的综合样例，这里的样例都有对应的源代码。因为综合，所以很难用简单的描述来讲解怎么搭建这样的需求来满足您的需要。建议找到代码中核心的部分，看看其流程和思路，过滤出一些单元功能模块，函数，慢慢的嫁接到您的应用程序。

![示例图12](https://segmentfault.com/img/bVJ9yM?w=1179&h=817)

有时，可能您是在其他客户的样例中看到某些不错的应用，但没有源码，毕竟这是客户自己的知识产权。对于后端过程，算法，那无法看到。而前端的应用，则可以在浏览器调试窗口看到下载到本地的代码，找到核心部分，分析其思路，再写出自己的代码。友情提醒：**不要随意拷贝拿来用，注意代码的版权声明**。有时Js代码做了压缩或混淆，可以通过一些工具得到略微格式化的代码，便于阅读。例如：<http://tool.oschina.net/codef...> 。这只是个人学习的一点技巧，**请务必查阅权威文档关于这种研究代码方式以及版权的事宜**。

![示例图13](https://segmentfault.com/img/bVJ9yQ?w=1615&h=993)

谈到这，对于Forge Viewer已深入研究的朋友，可以关注一下这个工具网站：<http://lmv.ninja/> 。它不仅包括了一些基本的Viewer功能测试，还可以试用一些不常见的功能，或设定未正式发布的Viewer3D.js版本，来体验和反馈意见。但注意，此工具网站我们不保证一直会存在。

![示例图14](https://segmentfault.com/img/bVJ9zy?w=1172&h=715)

## 离线模型的下载和部署

就引言提到的四类常见咨询内容，本文介绍第四类：离线模型的下载和部署。

这是个经典问题，主要和Forge模型上载，转换，网页查看模型几个API有关，尤其国内朋友最为关心。所以单独提出来介绍。

默认情况下，Forge转换后的数据放在Forge云端（目前在AWS美国），所以就有网络访问性能的考虑。转换后的数据在云端都有唯一的地址，Forge也允许下载，对于obj，stl等格式，下载很直接，这里有两篇文章介绍：

* 转换模型为OBJ并下载
* 转换模型为STL并下载

而挑战是SVF格式，也就支持网页浏览的格式。SVF不是单一文件，是一个数据包，包括了构件几何信息，属性包，有一个*.svf的清单文件（二维模型是.F2D）*。而Forge Viewer的JavaScript库对此数据进行解析和渲染。例如，下图是前面提到的Forge Viewer 课程系列（全英文）中使用到的离线数据包。目前，SVF数据格式并没有文档说明，不过，只要按清单文件下载到这些数据，用Viewer3D.js和其辅助*.js解析加载即可，倒不用一定要知道数据格式。而使用Forge Viewer相关js代码前提是数据包是由Forge的数据提取和转换服务而来。

![示例图15](https://segmentfault.com/img/bVJ9AB)

我们部门也提供了一个示例工具<http://extract.autodesk.io/> ，用来演示上传，下载离线SVF包，而且这个工具还给您搭建了一个很简单的测试框架（Node.js和PHP两种）。

![示例图16](https://segmentfault.com/img/bVJ9Cb)

很多朋友对于这个工具实现的转换下载非常感兴趣，但该工具很综合，流程较为复杂，不太容易弄清楚其逻辑。而由于相关下载过程现在并不是发布的云服务，所以没有文档以说明，所以我们的建议是，如果不能能研究清楚下载逻辑，就直接使用其转换结果即可，不用花太多时间在这上面。等待文档完善，或对应的SDK封装了下载端口，使用就更为方便了。
此工具网站是公开的，请不要上载您的机密模型，假设不慎上载了，可以通过删除按钮及时删掉。更建议把其源代码下载部署，在您的本地端去上载转换，这样。您的模型只需要和Forge云服务通信，保证了只有您能访问这些模型数据,并且在遇到故障的时候，易于调试。
**请注意：Forge Viewer的版权属于Autodesk，使用Forge Viewer客户端的JavaScript代码，必须是从Forge数据提取和转换服务得到的的数据。而且，必须是从Autodesk Forge官网链接引用Viewer相关代码（形如下）。这是使用Forge Viewer的两个重要条款**

![示例图17](https://segmentfault.com/img/bVbsAOL)

在另外一篇文章，我们对<http://extract.autodesk.io/> 做了更多说明。

* **2020年6月更新**

----

【注意！<https://extract.autodesk.io/> 已撤销，请通过其源码工程自行测试。并请注意：extract这个工程也示例了下载viewer相关代码，但这只是为了让大家测试和理解离线的过程，而非正式合规方式，其源码工程Readme中做了特别说明。所以：即便在离线方式下，正确引用viewer代码应遵循上面提到的以下条款规定的方式。如果您的应用在无网络的场景下也需要使用viewer，请参考另外一篇博文 Forge云服务的本地化经验总结与优化实战，有详尽的介绍如何正确使用。】

【而下载离线转换的SVF数据包，推荐使用这个 VSCode工具：
<https://segmentfault.com/a/11...】>
