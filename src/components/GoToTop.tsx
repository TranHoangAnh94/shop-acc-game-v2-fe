import { useEffect, useState } from "react";
import { BiSolidArrowToTop } from "react-icons/bi";
export default function GoToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Kiểm tra vị trí cuộn
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Cuộn mượt
        });
    };
    return (
        isVisible && (
            <button
                onClick={scrollToTop}
                className="bg-primary hover:text-primary border-primary fixed right-5 bottom-18 z-1000 cursor-pointer rounded-full border p-2.5 text-base text-white duration-200 hover:bg-white md:right-10 md:p-3.5 md:text-xl lg:text-2xl"
            >
                <BiSolidArrowToTop />
            </button>
        )
    );
}
