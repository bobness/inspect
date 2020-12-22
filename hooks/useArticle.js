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
const useArticle = (ShareExtension) => {
    const [status, setStatus] = useState('idling');
    const [article, setArticle] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        if (ShareExtension) {
            try {
                setStatus('active');
                console.log('got data: ', ShareExtension.data());
                setArticle(new Article({
                    title: 'Test Article',
                    source: 'Fox News'
                }));
                ShareExtension.close();
            } catch (err) {
                setError(err);
            } finally {
                setStatus('idling');
            }
        }
    }, [ShareExtension]);

    return {
        status,
        article,
        error
    }
};

export default useArticle;