import axios from "axios";
import env from "../../build/env";
import semver from "semver";
import packjson from "../../package.json";

let util = {};
util.title = function(title) {
  title = title || "黄土高原水土保持试验站后台管理系统";
  window.document.title = title;
};

const ajaxUrl =
  env === "development"
    ? "http://127.0.0.1:8888"
    : env === "production" ? "https://www.url.com" : "https://debug.url.com";

util.ajax = axios.create({
  baseURL: ajaxUrl,
  timeout: 30000
});

util.inOf = function(arr, targetArr) {
  let res = true;
  arr.map(item => {
    if (targetArr.indexOf(item) < 0) {
      res = false;
    }
  });
  return res;
};

util.oneOf = function(ele, targetArr) {
  if (targetArr.indexOf(ele) >= 0) {
    return true;
  } else {
    return false;
  }
};

util.showThisRoute = function(itAccess, currentAccess) {
  if (typeof itAccess === "object" && itAccess.isArray()) {
    return util.oneOf(currentAccess, itAccess);
  } else {
    return itAccess === currentAccess;
  }
};

util.getRouterObjByName = function(routers, name) {
  let routerObj = {};
  routers.forEach(item => {
    if (!item.children) {
      return;
    }
    if (item.name === "otherRouter") {
      item.children.forEach((child, i) => {
        if (child.name === name) {
          routerObj = item.children[i];
        }
      });
    } else {
      if (item.children.length === 1) {
        if (item.children[0].name === name) {
          routerObj = item.children[0];
        }
      } else {
        item.children.forEach((child, i) => {
          if (child.name === name) {
            routerObj = item.children[i];
          }
        });
      }
    }
  });
  return routerObj;
};

util.handleTitle = function(vm, item) {
  return item.title;
};

util.filterRouterRecursion = function(item, name, pathArr) {
  pathArr = pathArr || [];
  if (item.name === name) {
    pathArr.push(item);
    return true;
  } else if (item.children) {
    for (let child of item.children) {
      let result = util.filterRouterRecursion(child, name, pathArr);
      if (result) {
        pathArr.push(item);
        return result;
      }
    }
  } else {
    return false;
  }
};

util.setCurrentPath = function(vm, name) {
  let title = "";
  let isOtherRouter = false;
  vm.$store.state.app.routers.forEach(item => {
    if (!item.children) {
      return;
    }
    if (item.children.length === 1) {
      if (item.children[0].name === name) {
        title = util.handleTitle(vm, item);
        if (item.name === "otherRouter") {
          isOtherRouter = true;
        }
      }
    } else {
      item.children.forEach(child => {
        if (child.name === name) {
          title = util.handleTitle(vm, child);
          if (item.name === "otherRouter") {
            isOtherRouter = true;
          }
        }
      });
    }
  });
  let currentPathArr = [];
  if (name === "home_index") {
    currentPathArr = [
      {
        title: util.handleTitle(
          vm,
          util.getRouterObjByName(vm.$store.state.app.routers, "home_index")
        ),
        path: "",
        name: "home_index"
      }
    ];
  } else if (
    (name.indexOf("_index") >= 0 || isOtherRouter) &&
    name !== "home_index"
  ) {
    currentPathArr = [
      {
        title: util.handleTitle(
          vm,
          util.getRouterObjByName(vm.$store.state.app.routers, "home_index")
        ),
        path: "/home",
        name: "home_index"
      },
      {
        title: title,
        path: "",
        name: name
      }
    ];
  } else {
    let currentPathObj = vm.$store.state.app.routers.filter(item => {
      let reuslt = util.filterRouterRecursion(item, name);
      return reuslt ? true : false;
    })[0];
    if (!currentPathObj || !currentPathObj.children) {
      return currentPathArr;
    }
    if (currentPathObj.children.length <= 1 && currentPathObj.name === "home") {
      currentPathArr = [
        {
          title: "首页",
          path: "",
          name: "home_index"
        }
      ];
    } else {
      let childObjArr = [];
      let pathArr = [];
      util.filterRouterRecursion(currentPathObj, name, childObjArr);
      currentPathArr = [];
      for (let childObj of childObjArr) {
        // pathArr.push(childObj.path)
        currentPathArr.unshift({
          title: childObj.title,
          path: pathArr.join("/"),
          name: childObj.name
        });
      }
      currentPathArr.unshift({
        title: "首页",
        path: "/home",
        name: "home_index"
      });
    }
  }
  vm.$store.commit("setCurrentPath", currentPathArr);

  return currentPathArr;
};

util.openNewPage = function(vm, name, argu, query) {
  let pageOpenedList = vm.$store.state.app.pageOpenedList;
  let openedPageLen = pageOpenedList.length;
  let i = 0;
  let tagHasOpened = false;
  while (i < openedPageLen) {
    if (name === pageOpenedList[i].name) {
      // 页面已经打开
      vm.$store.commit("pageOpenedList", {
        index: i,
        argu: argu,
        query: query
      });
      tagHasOpened = true;
      break;
    }
    i++;
  }
  if (!tagHasOpened) {
    let tag = vm.$store.state.app.tagsList.filter(item => {
      if (item.children) {
        return name === item.children[0].name;
      } else {
        return name === item.name;
      }
    });
    tag = tag[0];
    if (tag) {
      tag = tag.children ? tag.children[0] : tag;
      if (argu) {
        tag.argu = argu;
      }
      if (query) {
        tag.query = query;
      }
      vm.$store.commit("increateTag", tag);
    }
  }
  vm.$store.commit("setCurrentPageName", name);
};

util.toDefaultPage = function(routers, name, route, next) {
  let len = routers.length;
  let i = 0;
  let notHandle = true;
  while (i < len) {
    if (routers[i].name === name && routers[i].redirect === undefined) {
      route.replace({
        name: routers[i].children[0].name
      });
      notHandle = false;
      next();
      break;
    }
    i++;
  }
  if (notHandle) {
    next();
  }
};

util.fullscreenEvent = function(vm) {
  // 权限菜单过滤相关
  vm.$store.commit("updateMenulist");
};

export default util;
