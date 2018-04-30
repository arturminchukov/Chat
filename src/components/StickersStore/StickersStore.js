import React from 'react';
import { ConnectedPictures } from '../Pictures/Pictures';
import { ConnectedHeader } from '../Header/Header';

export function StickersStore() {
    const resetSearch = clearSearch.bind(this),
        handleSearch = findStickers.bind(this);
    return (<div>
        <section className="GroupChatSettings__section">
            <ConnectedHeader buttonBack={true} buttonSearch searchIsOn={''} resetSearch={resetSearch}
                             handleSearch={handleSearch} buttonSettings={false} contentType="store"/>
        </section>
            <ConnectedPictures/>
        </div>);
}

function clearSearch(){
    console.log('reset stickers search');
}

function findStickers(){
    console.log('find stickers');
}