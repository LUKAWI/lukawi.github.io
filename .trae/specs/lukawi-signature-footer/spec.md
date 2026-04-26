# LUKAWI 签名标签 Spec

## Why
根据用户要求，需要参考 trae.cn 网站最底部标签的视觉形态和展开交互方式，在当前项目中创建风格一致的 LUKAWI 签名组件。当前已有基础的 BottomBanner 组件，但需要增强视觉效果和交互功能以匹配目标网站的设计。

## What Changes
- **增强 LUKAWI 文本的视觉样式**：采用更精致的渐变填充、描边效果和阴影
- **添加 Three.js 3D 背景效果**：创建柔和的粒子或波浪动画背景
- **实现展开/收起交互**：点击标签时可展开显示更多信息，再次点击收起
- **添加平滑动画过渡**：包括尺寸变化、背景动效和文本效果
- **响应式适配**：确保在不同屏幕尺寸下都有良好的显示效果

## Impact
- 受影响组件：BottomBanner.jsx
- 受影响样式：globals.css（可能需要添加新的动画和样式类）
- 新增依赖：使用现有的 three.js（已在项目中安装）
- 用户体验：增强底部视觉吸引力和交互性

## ADDED Requirements
### Requirement: 视觉形态匹配
系统 SHALL 提供与 trae.cn 网站底部一致的 LUKAWI 签名标签视觉效果：
- 使用大号字体（text-8xl 级别）
- 字重 900（超粗体）
- 字母间距 0.3em
- 全文本大写
- 渐变填充（使用项目主色调）
- 透明文本填充配合背景裁剪
- 微妙的文本阴影和描边效果

#### Scenario: 成功加载
- **WHEN** 页面加载完成
- **THEN** LUKAWI 签名标签以完整的视觉效果显示在页面底部

### Requirement: 3D 背景动效
系统 SHALL 提供柔和的 Three.js 3D 背景动画：
- 使用 canvas 元素渲染
- 粒子或波浪效果
- 动效柔和、不抢眼
- 与主色调协调（橙黄色渐变）

#### Scenario: 动画运行
- **WHEN** 组件挂载
- **THEN** Three.js 背景动画平滑启动
- **AND** 动画持续运行，性能良好

### Requirement: 展开/收起交互
系统 SHALL 提供点击展开/收起功能：
- 默认状态：收起状态（最小高度 300px）
- 点击标签：展开显示更多内容
- 再次点击：收起回原始状态
- 动画过渡时长：300-500ms
- 使用缓动函数：cubic-bezier(0.34, 1.56, 0.64, 1)

#### Scenario: 展开交互
- **WHEN** 用户点击 LUKAWI 标签
- **THEN** 标签平滑展开到更大尺寸
- **AND** 可能显示额外信息或装饰元素

### Requirement: 响应式表现
系统 SHALL 在不同屏幕尺寸下保持一致的显示效果：
- 桌面端（>1024px）：完整效果
- 平板端（768px-1024px）：适度调整尺寸
- 移动端（<768px）：优化显示，保持可读性

#### Scenario: 屏幕尺寸变化
- **WHEN** 浏览器窗口大小改变
- **THEN** LUKAWI 标签自适应调整尺寸
- **AND** 始终保持视觉美感和可读性

## MODIFIED Requirements
### Requirement: BottomBanner 组件
BottomBanner 组件将从静态展示组件升级为交互式 3D 签名标签组件：
- 添加 Three.js 场景、相机、渲染器
- 添加粒子系统或波浪几何体
- 添加点击事件处理
- 添加展开/收起状态管理
- 添加动画过渡效果

## REMOVED Requirements
无

## 技术实现要点
1. **Three.js 集成**：使用 React  refs 和 useEffect 钩子管理 Three.js 生命周期
2. **动画性能**：使用 requestAnimationFrame，注意清理和内存管理
3. **响应式**：监听窗口 resize 事件，动态调整 canvas 尺寸
4. **交互反馈**：添加 hover 效果和点击反馈
5. **优雅降级**：考虑 Web 动画 API 或 CSS 动画作为备选方案

## 设计原则
- 动效柔和，不喧宾夺主
- 保持与项目整体设计语言一致
- 使用项目现有的 CSS 变量和工具类
- 代码简洁、可维护
