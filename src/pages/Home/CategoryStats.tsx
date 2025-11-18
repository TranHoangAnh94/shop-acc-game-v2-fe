import type { IconType } from "react-icons/lib";

interface CategoryStatsType {
    name: string;
    value: string;
    Icon: IconType;
}
export default function CategoryStats({ Icon, name, value }: CategoryStatsType) {
    return (
        <span className="bg-gray-light ht-flex-center w-fit gap-x-1 rounded-full px-3 py-2">
            <Icon />
            {name}  
            <span className="text-primary font-semibold">{value}</span>
        </span>
    );
}
