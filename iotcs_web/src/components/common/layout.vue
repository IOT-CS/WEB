<template>
  <div class="layout">
    <div
      class="left"
      style="background: rgb(50, 115, 242)"
      :class="{ 'l-close': coll }"
    >
      <div class="logo" @click="$link('table')" :class="{ logo_s: coll }"></div>
      <div class="menu">
        <el-menu
          class="el-menu-demo"
          :default-active="act"
          :collapse="coll"
          :unique-opened="false"
          :collapse-transition="false"
        >
			<template v-for="menu_0 in menuList">
				<el-submenu v-if="menu_0.child" :index="menu_0.index" :key="menu_0.index" v-waves>
					<template slot="title"><i :class="menu_0.icon"></i>{{menu_0.title}}</template>
					<template v-for="menu_1 in menu_0.child">
						<el-submenu v-if="menu_1.child" :index="menu_1.index" :key="menu_1.index" v-waves>
							<template slot="title"><i :class="menu_1.icon"></i>{{menu_1.title}}</template>
							<template v-for="menu_2 in menu_1.child">
								<el-menu-item :index="menu_2.index" :key="menu_2.index" @click="tabClick(menu_2)" v-waves>{{menu_2.title}}</el-menu-item>
							</template>
						</el-submenu>
						<el-menu-item v-else :index="menu_1.index" :key="menu_1.index" @click="tabClick(menu_1)" v-waves><i :class="menu_1.icon"></i>{{menu_1.title}}</el-menu-item>
					</template>
				</el-submenu>
				<el-menu-item v-else :index="menu_0.index" :key="menu_0.index" v-waves @click="tabClick(menu_0)"><i :class="menu_0.icon"></i>{{menu_0.title}}</el-menu-item>
			</template>

        </el-menu>
      </div>
      <div class="footer">
        <footer>
          <p>&copy;2022</p>
        </footer>
      </div>
    </div>
    <div class="right" :class="{ 'r-close': coll }">
      <div class="view-head" style="height: 70px">
        <!-- <i @click="coll = !coll":class="!coll ? 'el-icon-s-fold' : 'el-icon-s-unfold'"></i><span>首页</span> -->
        <div class="userbox">
          <div class="userName" >{{ UserName }}</div>
          <div class="avatar"></div>
          <div class="dropdown">
            <p @click="changeMeum(1)">修改密码</p>
            <p @click="changeMeum(2)">退出登录</p>
          </div>
        </div>
      </div>
      <div
        class="view-nav"
        style="
          background-color: #fff;
          margin: 10px 30px;
          box-shadow: 0 0 10px #ddd;
        "
      >
        <el-tabs
          v-model="act"
          closable="closable"
          @tab-click="clickTab"
          @tab-remove="clickRemove"
          @contextmenu.prevent.native="openContextMenu($event)"
        >
          <el-tab-pane
            v-for="(item, idx) in tabList"
            :key="idx"
            :label="item.title"
            :name="item.name"
            @addTab="addTab"
          ></el-tab-pane>
        </el-tabs>
      </div>
       <ul
              v-show="contextMenuVisible"
              :style="{left:left+'px',top:top+'px'}"
              class="contextmenu"
            >
              <li @click="closeAllTabs">关闭所有</li>
            </ul>
      <div class="view-con" style="top: 150px; margin: 0px 30px 10px">
        <transition name="display">
          <router-view></router-view>
        </transition>
      </div>
    </div>
    <el-dialog
      :title="meumType == 1 ? '修改登录密码' : '提示'"
      :visible.sync="dialogVisible"
      width="25%"
      :close-on-click-modal="false"
      ><span v-if="meumType == 2">确定是否退出登录?</span>
      <el-form label-width="90px" v-else>
        <el-form-item label="原密码">
          <el-input
            v-model="option.lodpwd"
            placeholder="请输入原密码"
            clearable="clearable"
            type="password"
            show-password="show-password"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input
            v-model="option.newpwd"
            placeholder="请输入新密码"
            clearable="clearable"
            type="password"
            show-password="show-password"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input
            v-model="option.confirmpwd"
            placeholder="请确认新密码"
            clearable="clearable"
            type="password"
            show-password="show-password"
          ></el-input>
        </el-form-item> </el-form
      ><span class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            dialogVisible = false;
            $store.dispatch('clearAll');
          "
          v-if="meumType == 2"
          >确 定
        </el-button>
        <el-button type="primary" @click="confirm" v-else>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  components: {},
  data() {
    return {
      coll: false,
      contextMenuVisible:false,
      left:0,
      top:0,
      menuList: [
        {
          index: "home",
          title: "首页",
          path: "home",
          icon: "el-icon-s-home",
        },
        {
          index: "groupmanager",
          title: "采集配置",
          icon: "el-icon-s-tools",
          child: [
            {
              index: "manager/drivemanager",
              title: "驱动管理",
			        path:"manager/drivemanager",
              icon: "el-icon-setting",
            },
            {
              index: "manager/equipmentmanager",
              title: "设备管理",
              path: "manager/equipmentmanager",
              icon: "el-icon-document-copy",
            },
            {
              index: "manager/nodemanager",
              title: "设备变量配置",
              path: "manager/nodemanager",
              icon: "el-icon-menu",
            },
          ],
        },
        {
          index: "ruleengine",
          title: "规则引擎",
          icon: "el-icon-s-operation",
          child: [
            {
              index: "rule/ruleform",
              title: "规则列表",
              path: "rule/ruleform",
              icon: "el-icon-s-order",
            },
            {
              index: "rule/resform",
              title: "资源管理",
              path: "rule/resform",
              icon: "el-icon-s-grid",
            },
          ],
        },
        {
          index: "equipmentlog",
          title: "设备日志",
          icon: "el-icon-tickets",
          child: [
            {
              index: "log/diagnoseinfo",
              title: "诊断信息",
              path: "log/diagnoseinfo",
              icon: "el-icon-s-data",
            },
            {
              index: "log/subscribe",
              title: "数据订阅",
              path: "log/subscribe",
              icon: "el-icon-s-promotion",
            },
          ],
        },
         {
          index: "user",
          title: "用户管理",
          icon: "el-icon-user-solid",
          child: [
            {
              index: "user/usermanager",
              title: "用户信息",
              path: "user/usermanager",
              icon: "el-icon-s-check",
            }
          ],
        },
      ],
      act: "/home",
      tabList: this.$getItem("tabList") ? this.$getItem("tabList") : [],
       routePath: this.$route.path,
      dialogVisible: false,
      meumType: 1,
      option: {}
    };
  },
  computed: {
    ...mapGetters(["bgColor"]),
    UserName() {
      // return 'admin'
      const getInfo = this.$store.getters.getInfo
      let uName
      if (typeof getInfo === 'string') {
        uName = JSON.parse(getInfo)
      }
      return uName["DisplayName"]
    }
  },
  watch: {
    $route(to, from, next) {
      this.routePath = to.path;
      this.filterMenu();
    },
    contextMenuVisible(value) {
      if (this.contextMenuVisible) {
        document.body.addEventListener("click", this.closeContextMenu);
      } else {
        document.body.removeEventListener("click", this.closeContextMenu);
      }
    }
  },
  mounted() {

    // console.log(this.getInfo);
    this.filterMenu();
    if (!localStorage.getItem("tabList")) {
      console.log(this.$route.path)
      this.tabList = [
        {
          title: this.$route.name,
          name: this.$route.path.substring(1, this.$route.path.length),
        },
      ];
      this.$setItem("tabList", this.tabList);
    }
  },
  methods: {
     closeAllTabs() {
      this.tabList.splice(1)
      this.$setItem("tabList", this.tabList)
      this.contextMenuVisible = false;
      this.$router.push("/home")
    },
      changeMeum(meumType){
      this.meumType = meumType;
      this.dialogVisible = true;
      this.option = { }
    },
    // 关闭contextMenu
    closeContextMenu() {
      this.contextMenuVisible = false;
    },
    openContextMenu(e) {
      //console.log(e.srcElement);
      if (e.srcElement.id) {
        let currentContextTabId = e.srcElement.id.split("-")[1];
        this.contextMenuVisible = true;
        this.$store.commit("saveCurContextTabId", currentContextTabId);
        this.left = e.clientX - 210;
        this.top = e.clientY + 10;
      }
    },
    tabClick(it) {
      this.$nextTick(()=>{
        this.$link("/" + it.path);
        this.tabList.push({
          title: it.title,
          name: it.path,
        });
        this.tabList = this.sort(this.tabList);
        this.$setItem("tabList", this.tabList);
      })
    },
    filterMenu() {
      this.act = this.routePath.substring(1, this.routePath.length);
    },
    clickTab(targetName) {
      this.$link("/" + targetName.name);
    },
    addTab(data) {
      this.tabList.push(data);
    },
    clickRemove(targetName) {
      let el = this.tabList.length;
      this.tabList.forEach((item, inx) => {
        if (item.name == targetName && inx > 0) {
          if (this.act == targetName) {
            this.act = this.tabList[inx - 1].name;
            this.$link("/" + this.act);
          }
          this.tabList.splice(inx, 1);
          this.$setItem("tabList", this.tabList);
        }
      });
    },
    //对象去重
    sort(arr) {
      let temp = arr.map((item) => {
        return JSON.stringify(item);
      });
      temp = Array.from(new Set(temp));
      return temp.map((item) => {
        return JSON.parse(item);
      });
    },
    confirm() {
      const getInfo = this.$store.getters.getInfo
      let uName
      if (typeof getInfo === 'string') {
        uName = JSON.parse(getInfo)
      }
      this.$post("user/data/changepwd", {
              UserName:uName["UserName"],
							OldPassword: this.option.lodpwd,
              Password:this.option.newpwd
						}).then(res => {
							if (res.Successful) {
                this.dialogVisible = false;
								this.$Message.success({message: "更新成功", duration: 800});
							} else {
								this.$Message.error({message:res.ErrorMessage, duration: 800});
							}
						});
    }
  }
};
</script>

<style>
.view-head {
  background-size: 100% 100%;
  background-image: url("../../assets/images/head.png");
}
.footer {
  position: absolute;
  color: #fff;
  bottom: 0;
  width: 100%;
  font-size: 12px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: rgb(50, 115, 242);
}

.footer p {
  color: #fff;
}
.el-tabs__item.is-active {
  font-weight: 900;
}
.layout .left .el-menu-item.is-active,
.layout .left .el-menu-item.is-active:hover{
	background-color: rgba(245, 245, 245, 1);
	color: #3273f2;
}
.layout .left .el-submenu__title:hover,
.layout .left .el-menu-item:hover {
  background-color: rgba(30, 95, 222, 1);
}
.contextmenu {
  width: 100px;
  margin: 0;
  border: 1px solid #ccc;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.2);
}
.contextmenu li {
  margin: 0;
  padding: 7px 16px;
}
.contextmenu li:hover {
  background: #f2f2f2;
  cursor: pointer;
}
</style>
