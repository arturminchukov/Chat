import React from 'react';
import { ConnectedPictures } from '../Pictures/Pictures';
import { ConnectedHeader } from '../Header/Header';
import { connect } from 'react-redux';
import './StickersStore.css';
import fetchPictures from '../../actions/fetchPictures';

const stateToProps = state => ({
    select: state.pictures.select
});

export class StickerStore extends React.Component{

    constructor(props){
      	super(props);
      	this.state = {
      	    select: this.props.select,
            searchTerm:'',
      	};
        this.resetSearch = this.resetSearch.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.changeSelect = this.changeSelect.bind(this);
        this.timer=0;
    }


    handleSearch(event){
        if(this.timer)
            clearTimeout(this.timer);

        const searchQuery = event.target.value.toLowerCase();
        this.setState({
            searchTerm: searchQuery,
        });
        const fetch = this.props.dispatch,
            select = this.state.select;
        this.timer = setTimeout(()=>
            fetch(fetchPictures(select,searchQuery))
        ,500);
    }


    resetSearch(){
        this.setState({
            searchTerm: '',
        });
    }

    changeSelect(element){
        let newSelect = element.currentTarget.innerText;
        if(newSelect!== this.state.select) {
            this.setState({
                select: newSelect,
            });
            this.props.dispatch(fetchPictures(newSelect,this.state.searchTerm));
        }
    }

    render() {
        const gifsClass = this.state.select==='gifs'?'StickersStore__ChangeSelect_active':'';
        const stickersClass = this.state.select==='stickers'?'StickersStore__ChangeSelect_active':'';
        return (<div>
            <section className='StickerStore__header'>
                <ConnectedHeader buttonBack={true} changeSelect={true} buttonSearch searchIsOn={this.state.searchTerm}
                                 resetSearch={this.resetSearch}
                                 handleSearch={this.handleSearch} buttonSettings={false} contentType='store'/>
            </section>
            <section className='StickerStore_pictures'>
                <ConnectedPictures/>
            </section>
            <section className='StickersStore__footer'>
                <button onClick={this.changeSelect} className={'StickersStore__ChangeSelect ' +gifsClass}>gifs</button>
                <button onClick={this.changeSelect} className={'StickersStore__ChangeSelect '+stickersClass}>stickers</button>
        </section>
    </div>)
        ;
    }
}


export const ConnectedStickerStore = connect(stateToProps)(StickerStore);