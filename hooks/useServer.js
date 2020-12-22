import { useEffect } from "react";

const useServer = ({host, post}) => {

    useEffect(() => {
        // TODO: connect to the server
    }, [host, port]);

    // TODO: create methods to send back specific types of data to the server
    return {
        send: (data) => {}
    };
};

export default useServer;