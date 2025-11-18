import { FaFire } from "react-icons/fa";
import { formatNumber } from "../utils/functions";
import { HiShoppingCart } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function AccountItem({ account }) {
    return (
        <Link
            to="/"
            className={`relative flex flex-col overflow-hidden rounded-lg border border-[#f0f0f0] shadow-[0_10px_20px_rgba(0,0,0,0.05)] duration-200 hover:transform-[translateY(-4px)] hover:bg-[#e8f0ff] hover:shadow-[0_10px_25px_rgba(10,106,255,0.12)]`}
        >
            <span className="bg-primary absolute top-2 left-2 z-10 hidden rounded-lg px-[10px] py-[5px] text-xs font-medium text-white md:block">
                MS: #123456
            </span>
            <img
                src="https://shopgame247.com/uploads/accounts/tai-khoan-lien-quan-mobile-74437_5933127.png"
                className="aspect-video w-full object-cover transition-all duration-200"
                alt="Acc Game Có 500 robux"
            />
            <div className="ht-flex-center h-full flex-col justify-between bg-white px-2 pt-3 pb-5 text-xs md:mt-0 md:p-5 md:px-4 md:text-sm">
                <span className="text-primary mb-3 text-center text-xs font-bold md:hidden">MS: #123456</span>
                <div className="ht-flex-center mb-3 w-full flex-col rounded-sm bg-gradient-to-br from-[#ff7e5f] to-[#feb47b] px-2 py-1 text-[0.625rem] text-white sm:text-xs md:gap-1 lg:flex-row lg:py-2">
                    <span className="flex items-center font-bold">
                        <FaFire />
                        <span className="pl-[2px]">Giảm 20%</span>
                    </span>
                    <span className="text-center italic">Tiết kiệm: {formatNumber(560000)}đ</span>
                </div>
                <div className="ht-flex-center w-full flex-col text-black lg:flex-row">
                    <div className="flex w-full flex-col py-3">
                        <div className="mb-2 flex w-full items-center justify-between md:mb-3">
                            <span>Tướng:</span>
                            <span className="font-bold">88</span>
                        </div>
                        <div className="mb-2 flex w-full items-center justify-between md:mb-3">
                            <span>Trang phục:</span>
                            <span className="font-bold">4</span>
                        </div>

                        <div className="mb-2 flex w-full items-center justify-between md:mb-3">
                            <span>Hạng:</span>
                            <span className="font-bold">Đồng</span>
                        </div>
                        <div className="mb-2 flex w-full items-center justify-between md:mb-3">
                            <span>Thông tin:</span>
                            <span className="font-bold">Trắng thông tin</span>
                        </div>
                    </div>
                </div>

                <div className="flex w-full flex-col items-center justify-between md:flex-row md:items-end">
                    <div className="flex w-fit flex-col items-start text-gray-600">
                        <span className="text-xs font-bold text-gray-400 line-through">{formatNumber(2800000)}đ</span>
                        <span className="text-sm font-bold text-red-600 md:text-base">{formatNumber(2240000)}đ</span>
                    </div>
                    <Button variant={"primary"} className="mt-2 w-full md:mt-0 md:w-fit">
                        <HiShoppingCart />
                        <span>Mua</span>
                    </Button>
                </div>
            </div>
        </Link>
    );
}
