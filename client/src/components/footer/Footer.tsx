function Footer() {
  return (
    <footer className="flex items-center justify-center border-t">
      <div className="flex flex-col items-center justify-center py-2.5 text-sm text-gray-500">
        <span>© 2025 - {new Date().getFullYear()} RNC Products</span>
        <span>Todos los derechos reservados</span>
      </div>
    </footer>
  )
}

export default Footer;