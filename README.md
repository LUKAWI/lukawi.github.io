# Portfolio Website

A modern, visually stunning personal portfolio built with React, Vite, and GSAP. Features smooth animations, responsive design, and an orange-yellow gradient theme.

## 🚀 Features

- **6 Sections**: About, Projects, Blog, Experience, Thinking, Contact
- **L2 Animations**:
  - Scroll reveal effects on all cards and titles
  - Parallax scrolling in Hero section
  - Magnetic buttons (CTA)
  - Heatwave ripple effect on project cards
  - Scroll progress indicator (color thermometer navigation)
  - Typewriter effect for Thinking section title
- **Modern Design**:
  - Orange-yellow gradient theme (#FF9A00 → #FFD700)
  - Blue-green accents (#00CED1)
  - Inter + Noto Sans SC fonts
  - Bento grid layout for projects
  - 3D card flip effect (optional)
- **Fully Responsive**: Mobile-first design with breakpoints at 768px
- **Performance Optimized**: Lazy loading, will-change, reduced motion support

## 📁 Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Projects.jsx
│   │   ├── Blog.jsx
│   │   ├── Contact.jsx
│   │   ├── Experience.jsx
│   │   ├── Thinking.jsx
│   │   └── Footer.jsx
│   ├── hooks/
│   │   ├── useMagnetic.js
│   │   ├── useScrollProgress.js
│   │   └── useIntersectionObserver.js
│   ├── styles/
│   │   └── globals.css
│   ├── data/
│   │   └── content.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **GSAP** - Animation library (ScrollTrigger, Typewriter)
- **Lucide React** - Icon library
- **CSS Variables** - Design system tokens

## 📦 Installation & Setup

### Prerequisites
- Node.js >= 18.x
- npm or yarn

### Steps

1. **Clone or navigate to project directory**
   ```bash
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:3000

4. **Build for production**
   ```bash
   npm run build
   ```
   Output will be in `dist/` folder

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🌐 GitHub Pages Deployment

### Option 1: Automatic Deployment with gh-pages (Recommended)

1. **Install gh-pages package**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update `package.json`**
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview",
       "deploy": "npm run build && gh-pages -d dist"
     },
     "homepage": "https://<username>.github.io/<repo-name>"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

### Option 2: Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Push `dist/` folder to `gh-pages` branch**
   ```bash
   # Using git subtree
   git subtree push --prefix dist origin gh-pages

   # Or manually copy dist/ contents to gh-pages branch
   ```

3. **Enable GitHub Pages in repository settings**
   - Go to Settings → Pages
   - Set source to "Deploy from a branch"
   - Select `gh-pages` branch and `/ (root)` folder

### GitHub Pages Base URL Configuration

If your repository name is NOT `username.github.io`, you need to set the `base` property in `vite.config.js`:

```javascript
export default defineConfig({
  base: '/<repo-name>/',  // e.g., '/portfolio/'
  // ...
});
```

## 🎨 Customization

### Updating Content

All content is stored in `src/data/content.js`. Edit this file to update:

- Navigation links
- Hero section text and CTAs
- About section (bio, skills, image)
- Projects (title, description, images, GitHub links)
- Blog posts
- Experience timeline
- Thinking quotes and ideas
- Contact information

### Changing Colors

Color variables are defined in `src/styles/globals.css` under `:root`. Key variables:

```css
--color-primary-500: #F97316;  /* Main orange */
--color-gold-500: #FBBF24;      /* Gold/yellow */
--color-accent: #00CED1;        /* Blue-green accent */
--gradient-primary: linear-gradient(135deg, var(--color-primary-500), var(--color-gold-500));
```

### Adding New Sections

1. Create component in `src/components/`
2. Add route/section ID to `src/App.jsx`
3. Add navigation link in `src/data/content.js`
4. Update global styles if needed

## 🎬 Animations

### Scroll Reveal
All elements with `.reveal` class automatically animate when scrolled into view.

### Parallax (Hero)
Configured in `Hero.jsx` using GSAP ScrollTrigger with `scrub: true`.

### Magnetic Buttons
Apply `btn-magnetic` class and use `useMagnetic` hook.

### Typewriter Effect
Implemented in `Thinking.jsx` using `useState` and `setTimeout`.

## 📱 Responsive Design

Breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Mobile optimizations:
- Hamburger menu navigation
- Single column grid layouts
- Reduced animation complexity
- Larger touch targets (44×44px minimum)

## ♿ Accessibility

- Semantic HTML elements
- Keyboard navigation support
- Focus visible styles
- Reduced motion support (`prefers-reduced-motion`)
- Color contrast ratios meet WCAG AA standards
- ARIA labels on interactive elements

## 🐛 Troubleshooting

### Build fails with "process is not defined"
This is an ESLint issue. Update `.eslintrc.js` or disable the rule for Vite-specific code.

### GitHub Pages shows blank page
1. Check `vite.config.js` has correct `base` path
2. Ensure `homepage` field in `package.json` is set
3. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Images not loading on GitHub Pages
Use absolute URLs or import images. For local images, place in `public/` folder and reference as `/image.jpg`.

### Animations not working
Ensure GSAP and ScrollTrigger are properly imported and registered:
```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

## 📝 License

MIT License - feel free to use this template for your own portfolio!

## 🙏 Credits

Design inspired by Awwwards and modern portfolio trends.
Built with ❤️ using React, Vite, and GSAP.

---

**Made by Turing** | 2026
