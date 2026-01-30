# 🍽️ 今天吃什么？

一个精美、实用的餐厅随机选择器，帮你解决「今天吃什么」的世界级难题！

**Live Demo**: [Add your Vercel URL here]

## ✨ Features

- 🎨 **精美卡片设计** - 现代化的餐厅卡片，展示评分、价格、等待时间
- 🎲 **智能随机选择** - 4秒闪烁动画，增加选择仪式感
- 🏷️ **自动分类筛选** - 根据餐厅数据自动生成分类筛选器
- 📱 **响应式布局** - 手机、平板、桌面完美适配
- 🍜 **丰富餐厅数据** - 包含品类、价格、评分、等待时间等

## 🚀 Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## 📝 Contributing

想添加新餐厅？编辑 `public/data.json`：

```json
{
  "id": 19,
  "name": "新餐厅",
  "category": "火锅",
  "location": "2层",
  "price": "¥40-60",
  "rating": 4.2,
  "waitTime": "10-15分钟",
  "tags": ["辣", "自助"],
  "image": "🍲",
  "description": "餐厅简介"
}
```

**自动分类筛选**：筛选器会根据 `category` 字段自动生成，按餐厅数量排序。新增品类会自动出现在筛选栏中！

### 品类图标映射

系统内置了常用品类的图标，新增品类会自动使用默认图标 🍽️：

| 品类 | 图标 |
|------|------|
| 快餐 | 🍔 |
| 面食 | 🍜 |
| 米饭 | 🍚 |
| 火锅 | 🍲 |
| 轻食 | 🥗 |
| 日料 | 🍣 |
| 烧腊 | 🦆 |
| 炒菜 | 🥘 |
| 家常菜 | 🍛 |
| 小吃 | 🥟 |
| 冒菜 | 🌶️ |
| 私房菜 | 👨‍🍳 |

## 🌐 Deploy

### Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

### GitHub + Vercel
1. Push to GitHub
2. Import to [vercel.com](https://vercel.com)
3. Deploy!
