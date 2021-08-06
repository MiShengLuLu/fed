import { RouteLocationNormalizedLoaded } from 'vue-router'

export interface Route {
  name: string;
  breadcrumbName: string;
  children?: Array<{
    name: string;
    breadcrumbName: string
  }>
}

const routes = [
  {
    name: 'role',
    breadcrumbName: '角色管理',
    children: [
      {
        name: 'allocMenu',
        breadcrumbName: '分配菜单'
      },
      {
        name: 'allocResource',
        breadcrumbName: '分配资源'
      }
    ]
  },
  {
    name: 'menu',
    breadcrumbName: '菜单管理',
    children: [
      {
        name: 'menuCreate',
        breadcrumbName: '新增菜单'
      },
      {
        name: 'menuEdit',
        breadcrumbName: '编辑菜单'
      }
    ]
  },
  {
    name: 'resource',
    breadcrumbName: '资源管理',
    children: [
      {
        name: 'category',
        breadcrumbName: '资源分类'
      }
    ]
  },
  {
    name: 'course',
    breadcrumbName: '课程管理',
    children: [
      {
        name: 'courseAdd',
        breadcrumbName: '新增课程'
      },
      {
        name: 'courseEdit',
        breadcrumbName: '编辑课程'
      },
      {
        name: 'lesson',
        breadcrumbName: '内容管理'
      },
      {
        name: 'videoUpload',
        breadcrumbName: '视频上传'
      }
    ]
  },
  {
    name: 'user',
    breadcrumbName: '用户管理'
  }
]

export function matchRoute (v: RouteLocationNormalizedLoaded) {
  const routeCom: {
    [i: number]: Route[]
  } = {}
  let index = 0

  routes.forEach(($x, $i) => {
    routeCom[$i] = [$x]
    if ($x.name === v.name) {
      index = $i
      return
    }

    $x.children && $x.children.length && $x.children.forEach($y => {
      if ($y.name === v.name) {
        index = $i
        routeCom[$i].push($y)
      }
    })
  })
  return routeCom[index]
}
