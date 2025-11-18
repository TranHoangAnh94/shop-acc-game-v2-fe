import { useState } from "react";
import { Link } from "react-router-dom";

export default function Gift() {
    const [isShow] = useState(false);

    return (
        <>
            {isShow && (
                <Link to="/login" title="Click để nhận thưởng!" id="bonus_login">
                    <img src="/images/gift-home.gif" width="500px" className="w-[100%]" />
                </Link>
            )}
        </>
    );
}
