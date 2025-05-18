const Footer = () => {
  return (
    <footer className="mt-auto bottom-0 border-t text-xs flex items-center justify-between p-2">
      <div className="text-sm">
        Protected by reCAPTCHA - Google's
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline ml-1"
        >
          Privacy Policy
        </a>
        {' and '}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Terms
        </a>
      </div>

      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="HAG Softwares Logo" className="w-8 h-8" />
        <a
          href="https://hgsoftwares.net"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          © 2025 HG SOFTWARES
        </a>
      </div>
    </footer>
  );
}

export default Footer;