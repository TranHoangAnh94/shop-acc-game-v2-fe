import { FaGamepad } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { RxColorWheel } from "react-icons/rx";
import { Link } from "react-router-dom";
interface HeaderlineType {
    title: string;
    url?: string;
    customHeading?: string;
    type?: "account" | "group" | "" | "service";
}
export default function HeadLine({ title, url = "", customHeading = "", type = "" }: HeaderlineType) {
    const iconMap = {
        account: FaGamepad,
        group: FaGamepad,
        random: GiPerspectiveDiceSixFacesRandom,
        tryYourLuck: RxColorWheel,
    };
    const IconComponent = type ? iconMap[type] : undefined;
    return (
        <div className="flex items-start justify-between">
            <h2
                className={`before:bg-primary relative mb-6 pb-2.5 text-sm font-bold uppercase before:absolute before:bottom-0 before:h-[2.5px] before:w-[60px] before:rounded-lg md:flex md:items-center md:gap-2 md:text-2xl md:before:w-[80px] ${customHeading}`}
            >
                {IconComponent && <IconComponent className="hidden font-bold md:block" />}
                {title}
            </h2>
            {url && (
                <Link
                    to={url}
                    className="text-primary flex items-center gap-2 rounded-full bg-[#0a6aff14] px-4 py-2 text-xs font-medium transition-all duration-200 hover:transform-[translateX(4px)] hover:bg-[#0a6aff26] md:text-sm"
                >
                    Xem tất cả <FaArrowTrendUp />
                </Link>
            )}
        </div>
    );
}
