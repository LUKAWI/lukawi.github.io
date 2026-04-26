/**
 * Portfolio Content Data
 * All content for the portfolio website
 * Users can replace this with their actual content
 */

export const content = {
  // Navigation
  nav: {
    logo: 'LUKAWI',
    links: [
      { name: 'About', href: '#about' },
      { name: 'Experience', href: '#experience' },
      { name: 'Blog', href: '#blog' },
      { name: 'Projects', href: '#projects' },
      { name: 'Thinking', href: '#thinking' },
      { name: 'Contact', href: '#contact' },
    ],
  },

  // Hero Section
  hero: {
    title: '我是一名创意开发者',
    subtitle: '用代码与设计打造数字体验',
    cta: {
      primary: { text: '查看项目', href: '#projects' },
      secondary: { text: '联系我', href: '#contact' },
    },
  },

  // About Section
  about: {
    title: 'About Me',
    subtitle: 'Who I Am',
    description: `我是一名充满热情的全栈开发者，对设计有敏锐的洞察力，热爱创造无缝的用户体验。凭借对现代 Web 技术的专业知识，我构建的应用不仅功能强大，而且视觉效果出色。

我相信编写干净、可维护的代码并遵循最佳实践。我的方法将技术卓越与创造性思维相结合，提供超越预期的解决方案。`,
    skills: [
      'React / Vue / Angular',
      'TypeScript / JavaScript',
      'Node.js / Python',
      'GSAP / Framer Motion',
      'UI/UX 设计',
      'AWS / Docker',
    ],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  },

  // Projects Section
  projects: {
    title: 'Featured Projects',
    subtitle: 'My Work',
    items: [
      {
        id: 1,
        title: 'E-Commerce Platform',
        description: '一个现代化的电商平台，基于 React、Node.js 构建，集成 Stripe 支付。功能包括实时库存管理、用户认证和精美的产品展示。',
        tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        github: 'https://github.com/example/ecommerce',
        image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=400&fit=crop',
        featured: true,
      },
      {
        id: 2,
        title: 'Task Management App',
        description: '协作式任务管理应用，支持实时更新、拖拽功能和团队协作特性。',
        tech: ['Vue.js', 'Firebase', 'Vuex'],
        github: 'https://github.com/example/taskapp',
        image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop',
        featured: false,
      },
      {
        id: 3,
        title: 'Portfolio Generator',
        description: 'AI 驱动的个人作品集生成器，根据用户数据创建精美的个人网站。包含可定制模板和一键部署功能。',
        tech: ['Next.js', 'OpenAI API', 'Vercel'],
        github: 'https://github.com/example/portfolio-gen',
        image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop',
        featured: true,
      },
      {
        id: 4,
        title: 'Real-time Chat App',
        description: '可扩展的实时消息平台，支持端到端加密、文件分享和视频通话功能。',
        tech: ['React', 'Socket.io', 'WebRTC', 'Redis'],
        github: 'https://github.com/example/chat-app',
        image: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=600&h=400&fit=crop',
        featured: false,
      },
      {
        id: 5,
        title: 'Analytics Dashboard',
        description: '综合性数据分析仪表板，包含交互式图表、自定义小部件和自动化报告功能。',
        tech: ['TypeScript', 'D3.js', 'Express'],
        github: 'https://github.com/example/analytics',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
        featured: false,
      },
      {
        id: 6,
        title: 'AI Image Editor',
        description: '基于浏览器的图片编辑器，具备 AI 智能去背景、滤镜和批量处理功能。',
        tech: ['Canvas API', 'TensorFlow.js', 'Web Workers'],
        github: 'https://github.com/example/ai-editor',
        image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600&h=400&fit=crop',
        featured: true,
      },
    ],
  },

  // Blog Section
  blog: {
    title: 'Latest Thoughts',
    subtitle: 'Blog & Articles',
    posts: [
      {
        id: 1,
        title: 'Building Scalable React Applications',
        excerpt: '学习如何构建大型 React 应用的结构，实现可维护性和性能优化。',
        date: '2025-04-15',
        readTime: '8 min read',
        category: 'Development',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
      },
      {
        id: 2,
        title: 'The Art of UI Animation',
        excerpt: '探索精心设计的动画如何提升用户体验，让界面更加生动。',
        date: '2025-03-28',
        readTime: '6 min read',
        category: 'Design',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop',
      },
      {
        id: 3,
        title: 'Mastering TypeScript',
        excerpt: '高级 TypeScript 模式和技巧，用于构建类型安全的应用程序。',
        date: '2025-03-10',
        readTime: '12 min read',
        category: 'Tutorial',
        image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop',
      },
    ],
  },

  // Experience Section
  experience: {
    title: 'Experience & Future Plans',
    subtitle: 'My Journey',
    timeline: [
      {
        id: 1,
        role: 'Zhejiang University',
        company: 'Electronic Information Engineering',
        period: '2025 - Present',
        description: '就读于浙江大学电气工程学院，正努力冲击爱迪生班。',
        skills: ['Electrical Engineering', 'Electronics', 'Circuit Design'],
      },
      {
        id: 2,
        role: 'Koala Studio',
        company: 'Technical Department',
        period: '2026.3 - Present',
        description: '正在学习单片机知识和电机控制，为后续竞赛和科研训练作准备。',
        skills: ['8051 MCU', 'STM32', 'Motor Control', 'C Programming'],
      },
      {
        id: 3,
        role: 'Labs，Experiments & SRTP',
        company: 'University Research',
        period: 'To be Continued...',
        description: '规划在本科二年级开始接触科研项目，进行科研训练。',
        skills: ['Research Methods', 'Data Analysis', 'Experimental Design', 'Technical Writing'],
      },

    ],
  },

  // Thinking Section
  thinking: {
    title: 'Thinking & Ideas',
    subtitle: 'Musings on Artificial Intelligence',
    quote: '思想证明我的存在',
    ideas: [
      {
        id: 1,
        title: 'AI+EE',
        content: 'AI时代的电气工程师，何必只是电气工程师',
      },
      {
        id: 2,
        title: 'The Future of AI Agent',
        content: 'XXclaw，是玩具还是未来？',
      },
      {
        id: 3,
        title: 'AI & Me',
        content: '当新生的芦苇遇见狂风......',
      },
    ],
    aiEeIdeas: [
      {
        id: 1,
        title: 'AI 辅助电路设计',
        content: '利用机器学习算法优化 PCB 布局布线，自动识别信号完整性问题并提供改进建议。',
        detailedContent: '传统的 PCB 设计依赖工程师的经验，而 AI 可以通过学习大量优秀设计案例，自动优化元器件布局、走线路径，减少电磁干扰，提高信号完整性。这不仅能缩短设计周期，还能帮助新手工程师快速提升设计水平。',
      },
      {
        id: 2,
        title: '智能嵌入式系统',
        content: '在 MCU 中集成轻量级 AI 模型，实现边缘智能控制。',
        detailedContent: '随着 TinyML 技术的发展，我们可以在资源受限的单片机上运行神经网络模型。这使得嵌入式系统能够进行本地推理，实现智能电机控制、异常检测、语音识别等功能，而无需依赖云端，大大降低了延迟和带宽需求。',
      },
      {
        id: 3,
        title: 'AI 驱动的电子实验助手',
        content: '基于计算机视觉的电路调试辅助系统，实时识别电路连接和故障。',
        detailedContent: '通过摄像头捕捉实验台上的电路连接，AI 可以识别元器件类型、引脚连接关系，并与原理图进行对比，快速发现接线错误。同时可以监测示波器、万用表等仪器读数，提供故障诊断建议。',
      },
      {
        id: 4,
        title: '神经网络硬件加速器',
        content: '使用 FPGA 实现定制化神经网络加速器，提升 AI 推理性能。',
        detailedContent: '通用 CPU/GPU 在执行特定神经网络时效率不高。通过 FPGA 可以设计专用的硬件架构，针对特定网络结构进行优化，实现更高的吞吐量和更低的功耗。这对于边缘 AI 应用尤为重要。',
      },
      {
        id: 5,
        title: 'AI 赋能的信号处理',
        content: '深度学习在传统信号处理领域的应用，如滤波、调制识别等。',
        detailedContent: '传统的数字信号处理方法基于数学模型，而深度学习可以从数据中自动学习特征。在复杂电磁环境下的信号检测、自适应滤波、调制方式识别等任务中，AI 方法展现出了超越传统算法的潜力。',
      },
      {
        id: 6,
        title: '智能电源管理系统',
        content: '基于 AI 的电池健康状态预测和能耗优化。',
        detailedContent: '通过分析电池的充放电曲线、温度、内阻等参数，AI 可以准确预测电池的剩余寿命和健康状态。在系统层面，AI 还可以根据负载预测动态调整电源策略，最大化续航时间。',
      },
    ],
  },

  // Contact Section
  contact: {
    title: 'Get In Touch',
    subtitle: 'Let\'s Work Together',
    emails: ['lukawi519@gmail.com', '3250101790@zju.edu.cn'],
    location: '浙江杭州',
    social: [
      { name: 'GitHub', url: 'https://github.com/example', icon: 'github' },
    ],
    guestbook: {
      title: '留言板',
      subtitle: '留下你的想法，与我分享',
      nameLabel: '昵称',
      messageLabel: '留言内容',
      submitButton: '发布留言',
      successMessage: '留言发布成功！',
      errorMessage: '发布失败，请重试',
      viewAllButton: '查看全部留言',
      collapseButton: '收起留言',
    },
  },

  // Footer
  footer: {
    copyright: `© ${new Date().getFullYear()} LUKAWI. All rights reserved.`,
    builtWith: 'Built with React, Vite & GSAP',
  },
}

export default content
