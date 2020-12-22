export class Resource {
    name;
    trustedSources = [];
    distrustedSources = [];

    // TODO: load from local json file for dev
    // TODO: load from datagotchi.net for prod
    constructor({name, trustedSources, distrustedSources}) {
        if (name) {
            this.name = name;
        }

        if (trustedSources) {
            this.trustedSources = trustedSources;
        }

        if (distrustedSources) {
            this.distrustedSources = distrustedSources;
        }
    }
}

// TODO: consider a different data structure to support weighted scoring, etc.
const EXAMPLE_CONNECTIONS = [
    new Resource({name: 'Resource1', trustedSources: ['New York Times']}),
    new Resource({name: 'Resource2', trustedSources: ['New York Times'], distrustedSources: ['Fox News']}),
    new Resource({name: 'Resource3', trustedSources: ['Fox News']}),
];

const useOntology = () => {
    return EXAMPLE_CONNECTIONS;
};

export default useOntology;