const Footer = () => {
    return (
        <footer
            className="border-t mt-auto"
            style={{ borderColor: '#E3E3E3', backgroundColor: 'rgba(248, 249, 250, 0.8)' }}
        >
            <div className="container mx-auto px-6 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <p className="text-sm" style={{ color: '#456882' }}>
                            &copy; {new Date().getFullYear()} La boîte à 10%. Tous droits réservés.
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <a
                            href="#"
                            className="text-sm font-medium transition-colors hover:opacity-80"
                            style={{ color: '#456882' }}
                        >
                            À propos
                        </a>
                        <a
                            href="#"
                            className="text-sm font-medium transition-colors hover:opacity-80"
                            style={{ color: '#456882' }}
                        >
                            Documentation
                        </a>
                        <a
                            href="#"
                            className="text-sm font-medium transition-colors hover:opacity-80"
                            style={{ color: '#456882' }}
                        >
                            Support
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
