<template>
  <div class="viewer">
    <!-- Fixed navbar by Bootstrap: https://getbootstrap.com/examples/navbar-fixed-top/ -->
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container-fluid">
        <ul class="nav navbar-nav left">
          <li>
            <a href="http://developer.autodesk.com" target="_blank">
              <img
                alt="Autodesk Forge"
                src="//developer.static.autodesk.com/images/logo_forge-2-line.png"
                height="20"
              />
            </a>
          </li>
        </ul>
      </div>
    </nav>
    <!-- End of navbar -->
    <div class="container-fluid fill">
      <div class="row fill">
        <div class="col-sm-4 fill">
          <div class="panel panel-default fill">
            <div class="panel-heading" data-toggle="tooltip">
              目录
              <span
                id="refreshBuckets"
                class="glyphicon glyphicon-refresh"
                style="cursor: pointer"
                @click="onAppBuckets"
              ></span>
              <button
                class="btn btn-xs btn-info"
                style="float: right"
                id="showFormCreateBucket"
                data-toggle="modal"
                data-target="#createBucketModal"
              >
                <span class="glyphicon glyphicon-folder-close"></span> 新文件夹
              </button>
            </div>
            <div id="appBuckets">树状图</div>
          </div>
        </div>
        <div class="col-sm-8 fill">
          <div id="forgeViewer"></div>
        </div>
      </div>
    </div>
    <form id="uploadFile" method="post" enctype="multipart/form-data">
      <input id="hiddenUploadField" type="file" name="theFile" style="visibility:hidden" />
    </form>
    <!-- Modal Create Bucket -->
    <div
      class="modal fade"
      id="createBucketModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myModalLabel"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Cancel">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title" id="myModalLabel">创建新文件</h4>
          </div>
          <div class="modal-body">
            <input type="text" id="newBucketKey" class="form-control" v-model="buckerKey"/>
            出于演示目的，对象（文件）不会自动转换。上传后，右键单击该对象，然后选择“翻译”。存储桶密钥的格式必须为 [-_.a-z0-9]{3,128}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button
              type="button"
              class="btn btn-primary"
              id="createNewBucket"
              @click="createNewBucket"
            >继续，创建桶</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      buckerKey: ''
    }
  },
  methods: {
    onAppBuckets () {
      console.log('+++++')
    },
    createNewBucket () {
      const bucketKey = this.buckerKey
      axios.post({
        url: '/api/forge/oss/buckets',
        contentType: 'application/json',
        data: JSON.stringify(bucketKey)
      })
        .then(res => {
          console.log('====', res)
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../style/main.css';
.viewer{
  width: 100%;
  height: 100%;
}

</style>
