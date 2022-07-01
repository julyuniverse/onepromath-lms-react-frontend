const ScrollToTopButton = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    return (
        <div className="fixed z-[1000] right-7 bottom-7">
            <div>
                <div
                    className={
                        "flex justify-center items-center bg-[#ffffff] rounded-full shadow cursor-pointer select-none transition hover:scale-125 w-11 h-11" + " " +
                        "lg:w-16 lg:h-16"
                    }
                    onClick={scrollToTop}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 lg:h-10 lg:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default ScrollToTopButton;