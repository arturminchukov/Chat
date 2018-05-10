import React, { Component } from 'react';
import './InstanceSummaryElement.css';
import createAvatar from '../../helpers/createAvatar';


/**
 * typeModifier:
 * - true, малиновая тень
 * - false, обычная тень
*/
export class InstanceSummaryElement extends Component {

    handleClick = () => {
        this.props.onclick(this.props.summary.id);
    };

    render() {
        if (!this.props) {
            return null;
        }

        const {
            title, description, author, descModifiers,timestamp,typeModifier,contact
        } = this.props && this.props.summary;
        let titleClasses = 'InstanceSummaryElement__title';
        let descClasses = 'InstanceSummaryElement__desc';
        const unreadMessageClass = typeModifier?'InstanceSummaryElement__UnreadMessage':'';

        if (descModifiers && descModifiers === 'light') {
            titleClasses += ' InstanceSummaryElement__title_light';
            descClasses += ' InstanceSummaryElement__desc_light';
        } else {
            descClasses += ' InstanceSummaryElement__desc_dark';
        }

        let avatar = createAvatar(contact.avatar,contact,'s');
       // let avatar = '';

        let descView = '';
        if (author) {
            descView = (<p className={descClasses}>
                <span className="InstanceSummaryElement__author">{`${author}: `}</span>
                {description}
            </p>);
        } else {
            descView = (<p className={descClasses}>
                {description}
            </p>);
        }

        let timestampView='';
        if(timestamp){
            timestampView = <p className="InstanceSummaryElement__info_timestamp">{timestamp}</p>;
        }


        return (
            <div className={`InstanceSummaryElement ${unreadMessageClass}`} onClick={this.handleClick}>
                <div className="InstanceSummaryElement__avatar">
                    {avatar}
                </div>
                <div className="InstanceSummaryElement__info">
                    <div className="InstanceSummaryElement__info_header">
                        <h3 className={titleClasses}>{title}</h3>
                        {timestampView}
                    </div>
                    {descView}
                </div>
            </div>
        );
    }
}

