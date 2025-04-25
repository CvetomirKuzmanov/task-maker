export const metadata = {
    title: 'Task Manager - Next.js + PostgreSQL App',
    description: 'A well-structured task management application using Next.js and PostgreSQL',
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body className="bg-gray-50 min-h-screen">
          <div className="py-8">
            {children}
          </div>
        </body>
      </html>
    );
  }