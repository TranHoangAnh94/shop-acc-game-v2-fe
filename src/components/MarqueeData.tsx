import { FaShoppingCart } from "react-icons/fa";
import { subString } from "../utils/functions";

export default function MarqueeData({
    histories,
    custom = "",
}: {
    histories: { id: number; username: string; action: string }[];
    custom?: string;
}) {
    return (
        <div
            className={`mb-12 flex items-center rounded-lg bg-white px-3 py-3 shadow-[0_10px_20px_rgba(0,0,0,0.05)] ${custom}`}
        >
            <FaShoppingCart className="ht-icon mr-2 text-gray-800" />
            <marquee>
                {histories.map((item) => (
                    <span key={`${item.username}-${item.action}`} className="pl-5">
                        <b>{subString(item.username)}</b> {item.action}
                    </span>
                ))}
            </marquee>
        </div>
    );
}
