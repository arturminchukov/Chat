import React from 'react';
import { ConnectedPictures } from '../Pictures/Pictures';
import { ConnectedHeader } from '../Header/Header';
import { connect } from 'react-redux';
import './StickersStore.css';
import fetchPictures from '../../actions/fetchPictures';


const stateToProps = state => ({
});

export class StickerStore extends React.Component{

    constructor(props){
      	super(props);
      	this.state = {
      	    select:'gifs',
            searchTerm:'',
      	};
        this.resetSearch = this.resetSearch.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.changeSelect = this.changeSelect.bind(this);
    }


    handleSearch(event){
        const searchQuery = event.target.value.toLowerCase();

        this.setState({
            searchTerm: searchQuery,
        });
        this.props.dispatch(fetchPictures(this.state.select,searchQuery));
    }

    resetSearch(){
        this.setState({
            searchTerm: '',
        });
    }

    changeSelect(element){
        let newSelect = element.currentTarget.innerText;
        console.log('change selector ',element);
        if(newSelect!== this.state.select) {
            this.setState({
                select: newSelect,
            });
            this.props.dispatch(fetchPictures(newSelect));
        }
    }

    render() {
        const gifsClass = this.state.select==='gifs'?'StickersStore__ChangeSelect_active':'';
        const stickersClass = this.state.select==='stickers'?'StickersStore__ChangeSelect_active':'';
        return (<div>
            <section className="GroupChatSettings__section">
                <ConnectedHeader buttonBack={true} changeSelect={true} buttonSearch searchIsOn={this.state.searchTerm}
                                 resetSearch={this.resetSearch}
                                 handleSearch={this.handleSearch} buttonSettings={false} contentType='store'/>
            </section>
            <ConnectedPictures/>
            <section className='StickersStore__footer'>
                <button onClick={this.changeSelect} className={'StickersStore__ChangeSelect ' +gifsClass}>gifs</button>
                <button onClick={this.changeSelect} className={'StickersStore__ChangeSelect '+stickersClass}>stickers</button>
        </section>
    </div>)
        ;
    }
}

export const ConnectedStickerStore = connect(stateToProps)(StickerStore);