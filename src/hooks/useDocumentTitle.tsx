import { useEffect, useRef } from "react";

function useDocumentTitle(title: string) {
    const documentDefined = typeof document !== "undefined";
    const originalTitle = useRef(documentDefined ? document.title : null);

    useEffect(() => {
        if (!documentDefined) return;

        if (document.title !== title) {
            document.title = title;
        }

        return () => {
            if (originalTitle.current !== null) {
                document.title = originalTitle.current;
            }
        };
    }, [title, documentDefined]);
}

export default useDocumentTitle;
