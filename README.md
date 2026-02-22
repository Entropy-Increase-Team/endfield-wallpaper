<div align="center">

<!-- Logo & Title -->
<img src="https://img.shields.io/badge/ENDFIELD-WALLPAPER-black?style=for-the-badge&labelColor=fffa00&color=1a1a1a" alt="Endfield Wallpaper" height="40"/>

# 终末地 Endfield 动态壁纸

**Wallpaper Engine 动态桌面壁纸 | 实时游戏数据监控 | 3D 视差交互**

[![Wallpaper Engine](https://img.shields.io/badge/Wallpaper_Engine-Required-1a1a1a?style=flat-square&logo=steam&logoColor=white)](https://store.steampowered.com/app/431960/Wallpaper_Engine/)
[![License](https://img.shields.io/badge/License-AGPL--3.0-fffa00?style=flat-square)](LICENSE)
[![Bilibili](https://img.shields.io/badge/Bilibili-@SkillyNotFound-00A1D6?style=flat-square&logo=bilibili&logoColor=white)](https://space.bilibili.com/388390866)
[![Team](https://img.shields.io/badge/熵增项目组-Entropy_Increase_Team-333?style=flat-square)](https://github.com/Entropy-Increase-Team)

---

[功能特性](#功能特性) •
[快速开始](#快速开始) •
[账号绑定](#账号绑定) •
[配置选项](#配置选项) •
[技术架构](#技术架构) •
[致谢](#致谢)

</div>

---

## 功能特性

<table>
<tr>
<td width="50%">

### 动态视觉体验
- **多层视差动画** — 基于 Vanilla Tilt 的 3D 倾斜效果
- **高清视频背景** — 支持 1K / 2K / 4K 三档画质
- **循环滚动条纹** — 64 秒无缝循环动画
- **角色动态立绘** — 管理员角色动画

</td>
<td width="50%">

### 实时数据监控
- **理智值** — 实时同步游戏内理智
- **活跃度** — 每日任务完成进度
- **通行等级** — BP 系统等级
- **用户信息** — 头像、昵称、UID

</td>
</tr>
<tr>
<td width="50%">

### 个性化定制
- **浅色 / 深色模式** — 一键切换主题
- **屏幕比例适配** — 16:9 / 16:10 / 21:9
- **动画暂停控制** — 节省系统资源
- **实时时钟显示** — 日期 + 星期

</td>
<td width="50%">

### 双重绑定方式
- **森空岛扫码** — 快速绑定，即扫即用
- **API 授权绑定** — 长期稳定，推荐使用
- **自动数据刷新** — 每 5 分钟静默同步
- **本地凭证存储** — IndexedDB 持久化

</td>
</tr>
</table>

---

## 快速开始

### 前置要求

- [Wallpaper Engine](https://store.steampowered.com/app/431960/Wallpaper_Engine/) (Steam)
- [终末地·协议终端](https://end.shallow.ink) API Key（[获取方式](#方式二api-授权推荐)）

### 安装步骤

```
1. 在 Steam 创意工坊订阅本壁纸
2. 打开 Wallpaper Engine，选择本壁纸
3. 点击壁纸右侧「链接」按钮绑定账号
4. 享受你的专属终末地桌面！
```

---

## 账号绑定

| 方式 | 扫码直绑 | API 授权绑定 |
|:---|:---|:---|
| **速度** | 极快 | 需注册 |
| **稳定性** | 可能断连 | 长期稳定 |
| **推荐度** | 临时使用 | **推荐** |

### 方式一：森空岛扫码

1. 点击壁纸右侧「链接」按钮
2. 打开森空岛 App 扫描二维码
3. 确认授权即可

### 方式二：API 授权（推荐）

1. 访问 [终末地·协议终端](https://end.shallow.ink) 注册账号
2. 绑定你的游戏账号
3. 进入 `开发者` → `API 密钥` → `新建密钥`
4. 复制密钥，粘贴到 Wallpaper Engine 设置面板的「API 密钥」栏
5. 点击壁纸「链接」按钮 → 「申请授权」→ 复制链接到浏览器完成授权

---

## 配置选项

在 Wallpaper Engine 右侧设置面板中可调整以下选项：

| 选项 | 说明 | 默认值 |
|:---|:---|:---:|
| **渲染质量** | 视频源分辨率 (1K / 2K / 4K) | 2K |
| **适配比例** | 屏幕宽高比适配 | 16:9 |
| **颜色模式** | 浅色 / 深色主题 | 浅色 |
| **API 密钥** | 终末地协议终端 API Key | — |

> **提示**：如果感到卡顿，请尝试降低渲染质量；笔记本用户通常需要选择「窄屏 16:10」

---

## 技术架构

```
endfield-wallpaper/
├── index.html          # 主页面入口
├── styles.css          # 全局样式 (CSS Container Queries)
├── project.json        # Wallpaper Engine 配置
│
└── assets/
    ├── js/
    │   ├── auth.js         # 鉴权系统 (IndexedDB + 双模式登录)
    │   ├── data.js         # 数据渲染 & 弹窗逻辑
    │   ├── button.js       # 按钮交互 (暂停/主题切换)
    │   ├── quality.js      # 画质 & 比例适配
    │   ├── time.js         # 实时时钟
    │   ├── listener.js     # Wallpaper Engine 属性监听
    │   └── vanilla-tilt.js # 3D 倾斜效果库
    │
    ├── video/              # 1K / 2K / 4K 视频素材
    ├── image/              # UI 图片资源
    ├── font/               # 阿里妈妈数黑体 + Impact
    └── svg/                # 图标资源
```

### 核心技术栈

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![IndexedDB](https://img.shields.io/badge/IndexedDB-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)

</div>

- **CSS Container Queries** — 响应式布局，基于容器尺寸自适应
- **CSS 3D Transforms** — 多层 `translateZ` 实现深度视差
- **Vanilla Tilt.js** — 鼠标跟随 3D 倾斜效果
- **IndexedDB** — 本地持久化存储 Token 和 API Key
- **Fetch API** — 与终末地协议终端 API 通信

---

## 致谢

| 项目 | 说明 |
|:---|:---|
| 壁纸设计 & 开发 | [@SkillyNotFound](https://space.bilibili.com/388390866)（熵增开发组） |
| API 服务支持 | [终末地·协议终端](https://end.shallow.ink) |
| 游戏素材版权 | [鹰角网络](https://www.hypergryph.com/) / 明日方舟：终末地 |

---

<div align="center">

**如果这个壁纸对你有帮助，欢迎在创意工坊点赞收藏**

<sub>Made with love for Endfield Operators</sub>

[![Bilibili](https://img.shields.io/badge/关注作者-Bilibili-00A1D6?style=for-the-badge&logo=bilibili&logoColor=white)](https://space.bilibili.com/388390866)

</div>
