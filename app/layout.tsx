export const metadata = {
  title: '今天吃什么？',
  description: '随机选择餐厅',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
