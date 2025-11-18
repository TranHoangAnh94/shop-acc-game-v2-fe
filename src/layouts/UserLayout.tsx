import { Outlet, type LayoutRouteProps } from "react-router-dom";
import Footer from "~/components/Footer";
import Header from "~/components/Header";

const UserLayout: React.FC<LayoutRouteProps> = () => {
    return (
        <div className="flex min-h-screen flex-col justify-between">
            <div>
                {/* <Head>
                    <title>Trang chủ</title>
                </Head> */}
                <Header />
                <div className="container-content">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UserLayout;
