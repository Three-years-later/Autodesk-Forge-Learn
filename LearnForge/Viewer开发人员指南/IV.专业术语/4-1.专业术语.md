# 专业术语

术语|定义
:-:|:-:|
access token|访问令牌(有时只是“令牌”或“承载者令牌”)是应用程序用来访问API的凭据。身份验证API在成功的身份验证流程结束时返回访问令牌。查看器要求访问令牌的范围为**viewable：read**。有关更多信息，请参见Authentication API基础知识和范围部分。
canvas|一个HTML元素，用作渲染Forge Viewer的目标
dbid|将其链接到属性数据库中其元数据的对象的ID。还需要dbid来调用Forge Viewer方法。例如，用于在模型中隐藏对象的函数希望使用dbid列表作为其参数。
document|您要加载的模型文件。该文档提供了对根的访问权限，并提供了一种通过id查找元素的方法。要了解更多信息，请参阅Document。
extensions|一段JavaScript代码，可以选择在运行时加载，以扩展或修改Forge Viewer的行为。一些扩展与Forge Viewer捆绑在一起，开发人员可以针对特定用例编写自己的扩展。
fragID|Forge Viewer模型的单个片段的ID。
fragment|具有特定几何形状和材料的物体的一部分；单个对象由一个或多个片段组成。例如，门物体可以由门把手(黄铜材料)和门框(木质材料)组成。
geometry node|Forge Viewer中模型的最小可选元素(例如，门)。这也称为对象。
ghosting|使模型中选定节点透明的功能，使其他节点更加突出。
headless|没有UI元素的Forge Viewer；仅3D渲染canvas(画布)。
highlighting|更改对象绘制方式以使其突出的行为。当对象被选中并且用户将鼠标悬停在对象上时，Forge Viewer将突出显示对象。主题化是突出显示可用于应用程序的对象的另一种方法。
markup|注释可见内容的扩展。
manifest|翻译过程的结果，是Forge Viewer使用的结构化资源（例如模型几何，缩略图，摄像机视图）的集合。使用[GET：urn / manifest](https://forge.autodesk.com/en/docs/model-derivative/v2/reference/http/urn-manifest-GET/)端点获取清单。Forge Viewer只能渲染可见对象。
measure|用于测量模型表面上两点之间距离的扩展。
orbit|允许用户上下左右移动摄像机的功能。
overlay|允许您向加载的模型添加自定义几何的功能。要了解更多信息，请参阅“ 添加自定义几何”教程。
profile|Forge Viewer中的一组首选项和扩展名。开发人员可以创建自己的自定义配置文件，并且Forge Viewer中提供了内置的配置文件，以带来与Navisworks和Revit等Autodesk桌面产品相同的用户体验。
property database|与可视化及其部分相关联的元数据。财产数据库可能包含每个几何节点的元数据。
scene|放置更多模型的环境。可以在环境的坐标系中定位或变换模型，照相机和灯光。
search|用于搜索可见元数据的功能称为*属性数据库*。
section(ing)|用于剪切3D模型并在其中查看的扩展。用于剪切3D模型并在其中查看的扩展。
seed file|您要在Forge Viewer中可视化的原始文件。
selection|允许用户选择模型中的节点的功能。您可以使用选择指定用户可以选择并跟踪所选节点的节点。
theming|通过更改对象颜色来突出显示对象的方法。
viewable|清单引用的3D模型或2D图纸。
viewcube|可用于3D模型的工具，可帮助用户确定相机的位置。
viewer state|基于摄像头系统眼睛位置的模型的当前视图。
