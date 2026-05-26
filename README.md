# 🌐 Personal Portfolio — Vishal

A modern, animated personal portfolio built with **React**, **Tailwind CSS**, and **Framer Motion**. Designed to showcase projects, skills, journey, and a contact form — with a clean, minimal aesthetic and smooth user experience.

---

## ✨ Features

- **Animated intro screen** — plays once per session using `sessionStorage`
- **Custom cursor** — interactive cursor component for desktop
- **Dark / Light theme** — theme context with toggle support
- **Smooth section animations** — powered by Framer Motion
- **Active section tracking** — navbar highlights the visible section
- **Contact form** — integrated with EmailJS for real email delivery
- **Fully responsive** — mobile-first design with Tailwind CSS
- **Project showcase** — cards with live demo links and tech stack tags
- **Skills grid** — icon-based skill display with brand colors
- **Journey timeline** — chronological milestones from 2022 to present

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── CustomCursor/       # Animated cursor
│   ├── Footer/             # Site footer
│   ├── HelloIntro/         # Session intro animation
│   └── Navbar/             # Responsive nav with active section
├── context/
│   ├── ThemeContext.jsx     # Theme context definition
│   └── ThemeProvider.jsx   # Theme state & toggle logic
├── data/
│   ├── journey.js          # Timeline milestones
│   ├── nav.js              # Navigation links
│   ├── projects.js         # Project metadata
│   └── skills.js           # Tech stack with icons & colors
├── hooks/
│   ├── useActiveSection.js # IntersectionObserver-based active section
│   └── useScrollY.js       # Scroll position hook
├── layouts/
│   └── RootLayout/         # Main layout wrapper
├── sections/
│   ├── About/              # About section
│   ├── Beyond/             # Personal interests
│   ├── Contact/            # EmailJS contact form
│   ├── Hero/               # Hero / landing section
│   ├── Journey/            # Timeline section
│   └── Projects/           # Project cards
├── ui/
│   ├── Card/               # Reusable card component
│   ├── Container/          # Layout container
│   ├── PillButton/         # Pill-style CTA button
│   ├── SectionTitle/       # Consistent section headers
│   └── Tag/                # Tech stack badge
└── utils/
    ├── cn.js               # clsx utility wrapper
    └── variants.js         # Framer Motion animation variants
```

---

## 🛠️ Tech Stack

| Category       | Technology                          |
|----------------|--------------------------------------|
| Framework      | React 18                            |
| Build Tool     | Vite                                |
| Styling        | Tailwind CSS                        |
| Animation      | Framer Motion                       |
| Icons          | React Icons, Lucide React           |
| Email          | EmailJS (`@emailjs/browser`)        |
| Utilities      | clsx                                |
| Deployment     | Vercel                              |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder, ready for deployment.

---

## 📧 EmailJS Setup

The contact form uses [EmailJS](https://www.emailjs.com/) to send emails directly from the browser.

1. Create a free account at emailjs.com
2. Set up a **Service**, **Template**, and get your **Public Key**
3. In `src/sections/Contact/index.jsx`, update:

```js
emailjs.sendForm(
  'YOUR_SERVICE_ID',
  'YOUR_TEMPLATE_ID',
  formRef.current,
  'YOUR_PUBLIC_KEY'
)
```

---

## 📁 Public Assets

Place the following images in the `/public` folder:

| File              | Used In               |
|-------------------|-----------------------|
| `avatar.png`      | Hero / About section  |
| `Helplink.png`    | Projects — HelpLink   |
| `Unicare.png`     | Projects — UniCare+   |
| `CivicLink.png`   | Projects — CivicLink  |
| `signature.png`   | Hero section          |
| `title_logo.png`  | Navbar logo           |
| `Vishal_Resume.pdf` | Downloadable resume |

---

## 🎨 Customization

- **Projects**: Edit `src/data/projects.js`
- **Skills**: Edit `src/data/skills.js`
- **Timeline**: Edit `src/data/journey.js`
- **Navigation links**: Edit `src/data/nav.js`
- **Colors & theme**: Tailwind config in `tailwind.config.js`
- **Animations**: Variants in `src/utils/variants.js`

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙋‍♂️ Author

**Vishal**  
[GitHub](https://github.com/your-username) · [LinkedIn](https://linkedin.com/in/your-profile)