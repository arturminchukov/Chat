import React from 'react';
import { connect } from 'react-redux';
import { Picture } from '../Picture/Picture';
import './Pictures.css';
import fetchPictures from '../../actions/fetchPictures';
import { InfiniteScroll } from '../InfiniteScroll/InfiniteScroll';

const stateToProps = state => ({
    pictures: state.pictures.pictures,
    select: state.pictures.select,
    next: state.pictures.next,
    preview_mode: state.pictures.preview_mode,
    preview: state.preview,
});

const BORDER = 5;


export default class Pictures extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            resize: false,
        };
        this.onClick = this.onClick.bind(this);
        this.onResize = this.onResize.bind(this);
        this.placePictures = this.placePictures.bind(this);
        this.fetchNext = this.props && this.props.dispatch && this.props.dispatch.bind(this, fetchPictures());
        this.resize = false;
    }

    componentDidMount() {
        document.addEventListener('click', this.onClick);
        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onClick);
        window.removeEventListener('resize', this.onResize);
    }

    onResize() {
        if (!this.resize) {
            this.resize = true;
            this.forceUpdate();
        }
    }

    componentDidUpdate() {
        this.resize = false;
    }

    onClick(picture) {
        if (!picture.target.id)
            return;
        this.props.dispatch({
            type: 'PREVIEW_SHOW',
            picture_id: parseInt(picture.target.id, 10),
        })
    }

    getWindowWidth() {
        return Math.floor(window.visualViewport.width);
    }

    getQuantityElementInRow() {
        const width = this.getWindowWidth();
        if (width > 1000)
            return 6;
        else if (width > 768)
            return 5;
        else if (width > 500)
            return 4;
        else if (width >= 200)
            return 3;
        else
            return 1;
    }

    /**
     * Функция рассчитывает ширину каждой картинки в зависимости солько их стоит в ряду
     * */
    placePictures(pictures) {
        const quantity = this.getQuantityElementInRow(),
            borderSummaryWidth = BORDER * (quantity + 1),
            windowWidth = this.getWindowWidth(),
            picturesView = [];
        let count = 0;
        for (let i = 0; i < pictures.length; i += quantity) {
            const row = pictures.slice(i, i + quantity);
            let ratioSum = 0;
            row.forEach((picture) => {
                let image = picture && picture.images && picture.images['preview_gif'];
                image.ratio = image.width / image.height;
                ratioSum += image.ratio;
            });
            const height = Math.floor((windowWidth - borderSummaryWidth) / ratioSum);
            row.forEach(picture => {
                const image = picture && picture.images && picture.images['preview_gif'],
                    width = Math.round(height * image.ratio),
                    view = <Picture width={width} height={height} src={image.url} type='collection' key={count} id={count++}/>;
                picturesView.push(view);
            });
        }
        return picturesView;
    }

    render() {
        const PicturesViews = this.placePictures(this.props.pictures);
        if (this.state.loading)
            return <div><h1>Loading</h1></div>;

        return (
            <InfiniteScroll fetchNext={this.fetchNext} next={this.props.next} scrollDirection='down'>
                <div className='Pictures'>{PicturesViews.map((picture) => {
                    return picture;
                })}
                </div>
            </InfiniteScroll>
        );
    }
}


export const ConnectedPictures = connect(stateToProps)(Pictures);
