import React from 'react';
import formatMessage from '../../helpers/formatMessage';
import formatSmiles from '../../helpers/formatSmiles';
import formatLinks from '../../helpers/formatLinks';
import createDateStampChat from '../../helpers/createDateStampChat';
import './ChatQuote.css';

export class ChatQuote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authorName: null
        };
    }

    render() {
        const { message: text, userId: authorId, created_at } = this.props.message,
            userId = this.props.userId;
        let chatDirection = 'ChatQuote_right',
            user = '',
            date = new Date();

        date.setTime(created_at);
        const timestampView = createDateStampChat(date);

        if (userId !== authorId) {
            chatDirection = 'ChatQuote_left';
            user = <p className="ChatQuote__user">{this.props.name}</p>
        }


        const rules = [formatSmiles, formatLinks];
        const editedMessageParts = formatMessage(text, rules);
        const partsQuan = editedMessageParts.length;
        const imagesUrls = [];
        if (partsQuan > 1) {
            for (let i = 0; i < partsQuan; i++){
                if (editedMessageParts[i].type === "image") {
                    imagesUrls.push(editedMessageParts[i].src);
                }
            }
        }

        let count = 0;

        const messageImages = imagesUrls.map((url)=>{
            return <img key={`${url}+${count++}`} className="ChatQuote__extra__img" src={url} alt="" />;
        });
        
        return (
            <div className={`ChatQuote ${chatDirection}`} key={this.props.message._id}>
                {user}
                <p className="ChatQuote__text">
                    {editedMessageParts.map((token)=> {
                            switch (token.type){
                                case 'smile':
                                    return <img key={`${token.src}+${count++}`} className="ChatQuote__text__smile" src={require(`../../assets/icons/${token.src}`)} alt="" />;
                                case 'link':
                                    return <a key={`${token.src}+${count++}`} className="ChatQuote__text__link" href={token.src} target="_blank">{token.src + " "}</a>;
                                case 'image':
                                    if (partsQuan === 1) {
                                        return <img key={`${token.src}+${count++}`} className="ChatQuote__text__img" src={token.src} alt="" />;
                                    } else {
                                        return <a key={`${token.src}+${count++}`} className="ChatQuote__text__link" href={token.src} target="_blank">{token.src + " "}</a>;
                                    }

                                default:
                                    return <span key={`${token.src}+${count++}`}>{token.text + " "}</span>;
                            }
                        })}
                </p>
                <div className="ChatQuote__extra">{messageImages}</div>
                <p className="ChatQuote__timestamp">{timestampView}</p>
            </div>
        );
    }
}
