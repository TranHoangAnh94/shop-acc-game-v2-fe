import { FaGamepad } from "react-icons/fa";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { RxColorWheel } from "react-icons/rx";
interface HeaderlineType {
    title: string;
    url?: string;
    customHeading?: string;
    type?: "account" | "group" | "" | "service";
}
export default function HeadLine({ title, customHeading = "", type = "" }: HeaderlineType) {
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
        </div>
    );
}
