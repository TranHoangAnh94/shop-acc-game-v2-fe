import Ranking from "./Ranking";

export default function Hero() {
    return (
        <div className="mb-9 flex flex-col gap-2.5 md:flex-row">
            <div className="order-2 basis-1/3 md:order-1">
                <Ranking />
            </div>
            <div className="order-1 basis-2/3 md:order-2">
                <iframe
                    width="100%"
                    height="350"
                    className="rounded-lg"
                    src="https://www.youtube.com/embed/BJJgY0YrtdE"
                    title="Video Intro"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
}
