import {mapState} from "vuex";
mapState('user', ['username'])
export const USER_INFO_LIST = [
  {
    title: "办公室邮箱",
    content: "Account@xx.com",
  },
  {
    title: "座位",
    content: "T32F 012",
  },
  {
    title: "管理主体",
    content: "xxx",
  },
  {
    title: "直属上级",
    content: "xxxx",
  },
  {
    title: "职位",
    content: "xxxx",
  },
  {
    title: "入职时间",
    content: "2023-12-01",
  },
  {
    title: "所属团队",
    content: "xxx",
    span: 6,
  },
]

export const TEAM_MEMBERS = [
  {
    avatar: "https://avatars.githubusercontent.com/Wen1kang",
    title: "xxxx",
    description: "xxxx",
  },
  {
    avatar: "https://avatars.githubusercontent.com/pengYYYYY",
    title: "xxxx",
    description: "xxxx",
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/24469546?s=96&v=4",
    title: "xxxx",
    description: "xxxx",
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/88708072?s=96&v=4",
    title: "xxxx",
    description: "xxxx",
  },
]

export const PRODUCT_LIST = ["a", "b", "c", "d"]
