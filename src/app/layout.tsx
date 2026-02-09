import './globals.css'

export const metadata = {
  title: 'Drinking Tracker',
  description: 'Track your daily drinking habits',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}