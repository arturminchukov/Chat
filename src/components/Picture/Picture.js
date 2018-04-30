import React from 'react';
import './Picture.css';

export class Picture extends React.Component {

    render() {
        if (this.props.type === 'collection')
            return (<div className={'Picture__item '} style={{
                height: this.props.height,
                width: this.props.width
            }}>
                <img className='Picture__image_collection' id={this.props.id} src={this.props.src}
                    alt='Изображение'/>
            </div>
            );

        if (this.props.type === 'preview') {
            const { width, height, url } = this.props.picture.images['original'],
                screenWidth = (window && window.visualViewport && window.visualViewport.width) ||
                    (window && window.screen && window.screen.width),
                screenHeight = (window && window.visualViewport && window.visualViewport.height) ||
                    (window && window.screen && window.screen.height);

            let imageRatio = width / height,
                screenRatio = screenWidth / screenHeight,
                widthProperty = 'auto',
                heightProperty = 'auto';

            if (imageRatio >= screenRatio)
                widthProperty = '100%';
            else
                heightProperty = '100%';

            return <img src={url} alt='Изображение' style={{
                width: widthProperty,
                height: heightProperty
            }}/>;
        }

        return <p>No picture type</p>;
    }
}
