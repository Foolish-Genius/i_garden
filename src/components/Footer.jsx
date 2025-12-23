function GithubIcon({ className = 'mr-2', size = 20 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.468-2.381 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.804 5.622-5.476 5.921.43.372.814 1.102.814 2.222 0 1.606-.015 2.896-.015 3.286 0 .32.216.694.825.576C20.565 22.092 24 17.592 24 12.297 24 5.67 18.627.297 12 .297z"
      />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-secondary border-t border-gray-800 text-center py-6 mt-12">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4">
        <a 
          href="https://github.com/Foolish-Genius"
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-gray-400 hover:text-accent-primary transition-colors mt-4 sm:mt-0"
        >
          <GithubIcon />
          <span>Made with <span className="text-text-primary">♥</span> by Foolish Genius</span>
        </a>
        <p className="text-gray-400 text-sm">
          © {currentYear} The Interactive Garden. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}