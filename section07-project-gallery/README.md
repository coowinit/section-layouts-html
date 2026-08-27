# Section 07：工程案例图库与详情弹窗

这是一个面向企业官网、建材品牌站、工程项目站和 B2B 产品网站的独立工程案例 Section。

组件采用 **HTML + 原生 CSS + 原生 JavaScript + 本地 Swiper** 实现：

- 默认显示工程案例卡片；
- 点击案例后以 Modal 弹窗查看项目详情；
- 弹窗左侧为项目图片轮播；
- 右侧显示产品参数、项目名称和项目说明；
- 当前静态版本使用 `<template>` 保存每个案例的详情内容；
- 后期迁移到 WordPress 后，仍然可以继续保留 `<template>`，无需改成 AJAX。

本组件的核心设计原则是：

> **内容数据属于 HTML / WordPress，JavaScript 只负责交互。**

---

## 目录结构

```text
section07-project-gallery/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   └── app.js
├── images/
└── vendor/
    └── swiper/
        ├── swiper-bundle.min.css
        └── swiper-bundle.min.js
```

Swiper 已保存到本地，不依赖 CDN。

后期复制组件到其他项目时，只需要连同 `vendor/swiper/` 一起复制，即可独立运行。

---

# 一、当前静态版结构

每个工程案例由两部分组成：

```text
.project
├── a.item            # 列表卡片 / 真实详情入口
└── template.detail   # 当前案例的详情内容
```

结构示意：

```html
<article class="project">

    <a
        class="item"
        href="project-01.html"
        data-modal-open
    >
        ...
    </a>

    <template class="detail">
        ...
    </template>

</article>
```

JavaScript 不保存项目名称、型号、颜色、尺寸、图片或描述等业务数据。

`app.js` 只负责：

1. 监听案例卡片点击；
2. 找到当前 `.project`；
3. 读取当前项目的 `<template>`；
4. 将模板内容复制到 Modal；
5. 初始化弹窗中的 Swiper；
6. 处理关闭、Esc、滚动锁定和焦点恢复。

因此：

```text
项目数据
    ↓
HTML / WordPress
    ↓
<template>
    ↓
Modal
```

而不是：

```text
项目数据
    ↓
JavaScript 数组
```

这使组件更容易维护，也更方便迁移到 WordPress。

---

# 二、为什么使用 `<template>`

`<template>` 是标准 HTML 元素，非常适合保存“暂时不显示，但点击后需要使用”的结构化内容。

当前静态版本中：

```html
<template class="detail">
    ...
</template>
```

用于保存：

- 项目图库；
- 产品名称；
- 型号；
- 颜色；
- 尺寸；
- 产品图片；
- 项目名称；
- 项目描述。

JavaScript 点击案例后，只需要复制当前 `<template>` 的内容并放进 Modal。

优点是：

- 不需要把业务数据写进 JS；
- 不需要额外 JSON 文件；
- 不需要 AJAX；
- 不需要额外接口；
- 每个案例的数据和卡片保持在一起；
- GitHub Pages 可以直接运行；
- 后期 WordPress 仍然可以继续使用同一套结构。

---

# 三、WordPress 中可以继续保留 `<template>`

后期迁移到 WordPress 后，**不需要把 `<template>` 替换掉**。

区别只是：

### 静态 HTML

```html
<h3>实心木塑户外地板</h3>
<p>型号：CD-01</p>
```

### WordPress

由 PHP 动态输出：

```php
<template class="detail">

    <div class="detail-layout">

        <div class="content">

            <h2>
                <?php the_title(); ?>
            </h2>

            <p>
                型号：
                <?php
                echo esc_html(
                    get_post_meta(
                        get_the_ID(),
                        'project_model',
                        true
                    )
                );
                ?>
            </p>

        </div>

    </div>

</template>
```

因此整体流程仍然保持：

```text
WordPress 数据库
      ↓
PHP
      ↓
输出 <template>
      ↓
JavaScript
      ↓
Modal
```

**Section 07 的 Modal、Swiper 和 JavaScript 核心逻辑都可以继续保留。**

---

# 四、为什么本项目不需要 AJAX

对于本项目的实际使用场景，工程案例通常采用：

```text
每页 12 个案例
+
数字分页
```

因此，一个列表页最多只需要输出大约 12 份 `<template>` 详情内容。

这种规模下，为了 Modal 再增加 AJAX 并没有明显收益，反而会增加维护成本。

如果采用 AJAX，还需要额外处理：

```text
点击案例
    ↓
发送请求
    ↓
WordPress 接口
    ↓
查询 Project
    ↓
生成 HTML
    ↓
返回数据
    ↓
插入 Modal
    ↓
初始化 Swiper
```

还需要考虑：

- AJAX / REST 路由；
- PHP callback；
- nonce；
- loading 状态；
- 请求失败；
- 错误处理；
- 接口权限；
- 缓存；
- 前后端数据同步。

而保留 `<template>` 后：

```text
点击案例
    ↓
读取当前 <template>
    ↓
打开 Modal
```

更简单，也更符合企业官网长期维护需求。

因此本项目默认方案确定为：

> **数字分页 + 每页 12 个案例 + `<template>` + 原生 Modal，不使用 AJAX。**

只有未来项目真的发展成几十甚至上百个案例，并且单页需要一次加载大量详情数据时，再考虑 AJAX / REST 也不迟。

---

# 五、推荐的 WordPress 数据模型

工程案例建议建立独立 Custom Post Type：

```text
project
```

可根据项目需要增加分类法：

```text
project_cat
```

典型字段：

| 数据 | WordPress 建议来源 |
|---|---|
| 项目名称 | `post_title` |
| 列表封面 | Featured Image |
| 项目图库 | Attachment IDs / Gallery |
| 产品名称 | Post Meta |
| 型号 | Post Meta |
| 颜色 | Post Meta |
| 尺寸 | Post Meta |
| 产品图片 | Attachment ID / Post Meta |
| 项目描述 | `post_content`、Excerpt 或 Post Meta |
| 项目分类 | `project_cat` |

字段可以使用：

- WordPress 原生 Meta API；
- 自定义内容模型插件；
- ACF；
- Meta Box；
- 其他字段方案。

Section 07 前端组件本身不依赖某一种字段管理方式。

---

# 六、推荐的 WordPress 列表结构

WordPress 循环中，一个 Project 对应：

```text
Project Post
│
├── 列表卡片
│
└── <template class="detail">
    └── 当前项目详情
```

例如：

```php
<?php while ( have_posts() ) : the_post(); ?>

    <article class="project">

        <a
            class="item"
            href="<?php the_permalink(); ?>"
            data-modal-open
        >

            <?php the_post_thumbnail(); ?>

            <h3 class="name">
                <?php the_title(); ?>
            </h3>

        </a>

        <template class="detail">

            <!--
            当前项目的：
            Gallery
            Product
            Model
            Color
            Size
            Description
            -->

        </template>

    </article>

<?php endwhile; ?>
```

JavaScript 无需知道当前 Project 的 ID，也无需发起网络请求。

---

# 七、为什么卡片仍然保留真实 `permalink`

虽然普通点击会打开 Modal，但仍然建议：

```php
href="<?php the_permalink(); ?>"
```

而不是：

```html
href="#"
```

或者只使用：

```html
<button>
```

这样可以同时满足：

### JavaScript 正常

```text
点击案例
↓
preventDefault()
↓
打开 Modal
```

### JavaScript 不可用

```text
点击案例
↓
进入真实详情页
```

同时还支持：

- 搜索引擎抓取独立项目 URL；
- 用户复制项目链接；
- Ctrl / Command + 点击新窗口打开；
- 直接访问项目详情页；
- 后期分享单个工程案例。

因此推荐：

> **Modal 是快速预览方式，真实 permalink 是稳定的详情入口。**

---

# 八、`single-project.php` 是否还需要

建议保留。

`<template>` 解决的是：

> 列表页中快速查看项目详情。

而：

```text
single-project.php
```

解决的是：

> 项目的独立 URL 和完整详情页。

两者并不冲突。

推荐结构：

```text
archive-project.php
        │
        ├── 项目列表
        ├── 数字分页
        └── 每个 Project 自带 <template>

single-project.php
        │
        └── 独立项目详情页
```

这样：

```text
普通点击
→ Modal

直接访问 URL
→ single-project.php
```

既方便浏览，也保留完整网站结构。

---

# 九、是否需要 `detail.php`

**不是必须。**

最简单的方案可以直接：

```text
archive-project.php
└── <template>
    └── 直接输出详情 HTML
```

然后：

```text
single-project.php
└── 单独输出详情页
```

如果以后发现 Modal 与 Single 页面中有大量重复 PHP，可以再进一步抽离：

```text
template-parts/
└── project/
    └── detail.php
```

然后：

```php
<template class="detail">
    <?php
    get_template_part(
        'template-parts/project/detail'
    );
    ?>
</template>
```

`single-project.php` 也可以调用：

```php
get_template_part(
    'template-parts/project/detail'
);
```

这样：

```text
                    ┌── <template> → Modal
Project 数据 → detail.php
                    └── single-project.php
```

但这是代码复用层面的优化，并不是 Section 07 正常运行的必要条件。

第一阶段完全可以保持简单。

---

# 十、数字分页建议

工程案例列表建议：

```text
每页：12 个
分页：WordPress 数字分页
```

典型查询思路：

```php
$paged = max(
    1,
    get_query_var( 'paged' )
);

$query = new WP_Query(
    array(
        'post_type'      => 'project',
        'post_status'    => 'publish',
        'posts_per_page' => 12,
        'paged'          => $paged,
    )
);
```

分页可以继续使用 WordPress 原生：

```php
echo paginate_links(
    array(
        'total'   => $query->max_num_pages,
        'current' => $paged,
    )
);
```

这样每一个页面最多只有：

```text
12 个列表卡片
+
12 个 <template>
```

页面规模可控，也没有必要为了详情弹窗增加 AJAX。

---

# 十一、当前静态版维护方法

## 新增一个工程案例

复制一个完整：

```html
<article class="project">
    ...
</article>
```

然后修改：

1. 列表图片；
2. 案例名称；
3. `href`；
4. `<template>` 内的图库；
5. 产品名称；
6. 型号；
7. 颜色；
8. 尺寸；
9. 产品图片；
10. 项目名称；
11. 项目描述。

**不需要修改 `app.js`。**

---

## 更换详情图库

结构：

```html
<div class="gallery swiper">

    <div class="swiper-wrapper">

        <figure class="swiper-slide">
            ...
        </figure>

        <figure class="swiper-slide">
            ...
        </figure>

    </div>

</div>
```

增加或删除：

```html
.swiper-slide
```

即可。

Swiper 会根据实际图片数量自动工作。

---

# 十二、响应式策略

## 桌面端

```text
3 列 Project Grid

Modal
├── 左侧：Swiper Gallery
└── 右侧：项目详情
```

## 平板端

```text
2 列 Project Grid

Modal
├── 上方：Gallery
└── 下方：详情
```

## 手机端

```text
1 列 Project Grid

Modal
├── 上方：Gallery
└── 下方：详情
```

---

# 十三、Modal 交互

当前弹窗支持：

- Swiper 左右滑动；
- 上一张 / 下一张按钮；
- 分页圆点；
- 点击遮罩关闭；
- 右上角关闭；
- `Esc` 关闭；
- 打开时锁定页面滚动；
- 关闭后恢复触发卡片焦点。

轮播箭头：

```text
默认
→ 中性背景 + 紫色箭头

Hover
→ 紫色背景 + 白色箭头
```

---

# 十四、修改 Section ID

当前组件：

```text
section07
```

正式项目如果需要改成：

```text
project-gallery
```

可以全局批量替换：

```text
section07
↓
project-gallery
```

HTML、CSS 和 JavaScript 中的组件作用域会一起更新。

---

# 十五、长期维护原则

Section 07 最重要的不是 Modal 本身，而是保持各层职责清晰：

```text
Project 数据
    ↓
WordPress / HTML

列表卡片
    ↓
.item

详情数据
    ↓
<template>

图库轮播
    ↓
Swiper

Modal 打开 / 关闭
    ↓
JavaScript

组件外观
    ↓
#section07 CSS
```

尽量不要：

```text
Project 数据
↓
JavaScript 数组
```

也不要为了一个普通企业案例列表过早增加：

```text
AJAX
REST
复杂前端状态
额外 JSON
```

---

# 最终推荐方案

对于常见企业官网，Section 07 推荐采用：

```text
WordPress Project CPT
        ↓
每页 12 个案例
        ↓
数字分页
        ↓
每个案例输出
.card + <template>
        ↓
点击卡片
        ↓
原生 JavaScript
        ↓
Modal
        ↓
本地 Swiper Gallery
```

同时保留：

```text
真实 permalink
+
single-project.php
```

因此最终可以同时实现：

```text
列表快速浏览 → Modal

单个项目访问 → Single Page
```

在这种规模和应用场景下：

> **保留 `<template>` 比引入 AJAX 更简单、更稳定，也更符合长期维护需求。**

只有未来项目规模明显扩大、单页数据量变得非常大时，再考虑把详情内容升级为 AJAX / REST 动态加载。
