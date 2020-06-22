$(document).ready(function () {
  $(document).on('DOMNodeInserted', function (e) {
    if ($(e.target).hasClass('orbit-gizmo')) {
      // to make sure we get the viewer, let's use the global var NOP_VIEWER 为确保获得观看者，我们使用全局变量NOP_VIEWER
      if (NOP_VIEWER === null || NOP_VIEWER === undefined) return;
      new Dashboard(NOP_VIEWER, [
        // new BarChart('Material'),
        // new PieChart('Material'),
        new BarChart('Category'),
        new PieChart('Category')
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