import React from 'react';
import './Button.css';

/*
 * возможные значения type:
 *
 * user - иконка пользователя
 * add-user - иконка добавления пользователя
 * add - иконка добавления
 * cancel - иконка отмены
 * delete  - иконка удаления
 * start-chat - иконка начать чат
 * chat - иконка чата
 * settings - иконка настроек
 * search  - иконка поиска
 * stickers - стикеры
 *
 * modifier - аттрибук меняющий размер иконки
 * s - 30x30
 * m - 64x64
 * l - 100x100
 *
 *circle
 * true - кнопка в виде круга
 * false - квадратная кнопка
 * */
export function Button(props) {
    let { type, active, modifier } = props,
        btnClass = props.circle ? 'Button_circle' : '',
        iconSrc = getIcon(type, active);
    if (!props.modifier) { modifier = 's'; }

    let onClick;

    if (typeof props.onClick === 'function') {
        onClick = e => props.onClick(props.type, e);
    }

    return (<button onClick={onClick} className={`Button ${btnClass}`}>
      <img className={`Button__image Button__image_${modifier}`} src={iconSrc} alt={type} />
            </button>);
}

function getIcon(type, active) {
    const btnStatus = active ? 'active' : 'inactive',
        iconSrc = require(`../../assets/icons/${type}-${btnStatus}.png`);
    return iconSrc || null;
}
