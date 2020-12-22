import { useMemo, useRef } from "react";
import useOntology from "./useOntology";

const useEvaluation = (article) => {
    const resources = useOntology();
    const trustingResources = useRef([]);
    const distrustingResources = useRef([]);

    const trustValue = useMemo(() => {
        if (article) {
            trustingResources.current = [];
            distrustingResources.current = [];
            return resources.reduce((cumTrustValue, resource) => {
                if (resource.trustedSources.find((source) => source === article.source)) {
                    trustingResources.current.push(resource);
                    return cumTrustValue + 1;
                }
                if (resource.distrustedSources.find((source) => source === article.source)) {
                    distrustingResources.current.push(resource);
                    return cumTrustValue - 1;
                }
                return trustValue;
            }, 0);
            return -1; 
        }
        return 0;
    }, [article]);

    return {
        trustingResources: trustingResources.current,
        distrustingResources: distrustingResources.current,
        trustValue
    }
};

export default useEvaluation;