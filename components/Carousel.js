import React, { useRef, useState } from 'react';

const Carousel = ({children, onChange}) => {
    const currentChildIndex = useRef(0);
    const [currentChild, setCurrentChild] = useState(children[currentChildIndex.current]);

    // TODO: enable swiping to change 
    return <currentChild />;
}

export default Carousel;