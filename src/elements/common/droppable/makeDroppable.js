import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';

const makeDroppable = ({ dropValidator, onDrop }) => Wrapped => {
    return props => {
        const className = '';
        const [enterLeaveCounter, setEnterLeaveCounter] = useState(0);
        const [canDrop, setCanDrop] = useState(false);
        const [isDragging, setIsDragging] = useState(false);
        const [isOver, setIsOver] = useState(false);
        const droppableRef = useRef(null);

        useEffect(() => {
            const droppableEl = droppableRef.current;
            if (!droppableEl) {
                return;
            }

            const handleDragEnter = event => {
                // This allows onDrop to be fired
                event.preventDefault();

                setEnterLeaveCounter(prevCounter => prevCounter + 1);

                const { dataTransfer } = event;
                // if we don't have a dropValidator, we just default canDrop to true
                const canDropNew = dropValidator ? dropValidator(props, dataTransfer) : true;

                setCanDrop(canDropNew);
                setEnterLeaveCounter(1);
                setIsOver(true);
            };

            const handleDragOver = event => {
                event.preventDefault();

                const { dataTransfer } = event;

                if (!dataTransfer) {
                    return;
                }

                if (!canDrop) {
                    dataTransfer.dropEffect = 'none';
                } else if (dataTransfer.effectAllowed) {
                    // Set the drop effect if it was defined
                    dataTransfer.dropEffect = dataTransfer.effectAllowed;
                }
            };

            const handleDragLeave = event => {
                event.preventDefault();

                setEnterLeaveCounter(prevCounter => prevCounter - 1);
                if (enterLeaveCounter > 0) {
                    return;
                }

                setCanDrop(false);
                setIsDragging(false);
                setIsOver(false);
            };

            const handleDrop = event => {
                event.preventDefault();

                // reset enterLeaveCounter
                setEnterLeaveCounter(0);

                if (canDrop && onDrop) {
                    onDrop(event, props);
                }

                setCanDrop(false);
                setIsDragging(false);
                setIsOver(false);
            };

            droppableEl.addEventListener('dragenter', handleDragEnter);
            droppableEl.addEventListener('dragover', handleDragOver);
            droppableEl.addEventListener('dragleave', handleDragLeave);
            droppableEl.addEventListener('drop', handleDrop);

            // Cleanup function to remove event listeners
            return () => {
                droppableEl.removeEventListener('dragenter', handleDragEnter);
                droppableEl.removeEventListener('dragover', handleDragOver);
                droppableEl.removeEventListener('dragleave', handleDragLeave);
                droppableEl.removeEventListener('drop', handleDrop);
            };
        }, [enterLeaveCounter]);

        const classes = classNames(className, {
            'is-droppable': canDrop,
            'is-over': isOver,
        });

        return (
            // <div ref={droppableRef} style={{ display: 'contents' }}>
            //     <Wrapped canDrop={canDrop} className={classes} isDragging={isDragging} isOver={isOver} {...props}/>
            // </div>
            <Wrapped
                ref={droppableRef}
                canDrop={canDrop}
                className={classes}
                isDragging={isDragging}
                isOver={isOver}
                {...props}
            />
        );
    };
};

export default makeDroppable;
