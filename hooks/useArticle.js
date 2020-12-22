import { useEffect, useState } from "react";

const SOURCE_MAP = {
    'nytimes.com': 'New York Times'
};

export class Article {
    constructor(props) {
        this.title = props.title;
        this.source = props.source; 
    }
}

// TODO: get an article from a 'share' on iOS
const useArticle = (url) => {
    const [status, setStatus] = useState('idling');
    const [article, setArticle] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        if (url) {
            setArticle(new Article({
                title: 'Test Article',
                source: 'Fox News'
            }));
        }
    }, [url]);

    return {
        status,
        article,
        error
    }
};

export default useArticle;