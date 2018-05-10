import React from 'react';
import { configure, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Picture } from './Picture';
configure({ adapter: new Adapter });

describe('<Picture />', () => {
    it('render without type property', () => {
        const wrapper = render(<Picture />);
        expect(wrapper.find('p')._root[0].children[0].data).toMatch(/No picture type/);
    });

    it('render with type ="collection" ', () => {
        const src = 'https://www.decomarket24.cz/out/pictures/1/1870-1-embankment_.jpg',
            width = 400,
            height = 282,
            wrapper = render(<Picture type='collection' src={src} height={height} width={width} id={1}/>);
        expect(wrapper.find('img')[0].name).toMatch('img');
        expect(wrapper.find('div')._root[0].attribs.style).toMatch(`height:${height}px;width:${width}px`);
    });

    it('render with type ="preview" ', () => {
        const url = 'https://www.decomarket24.cz/out/pictures/1/1870-1-embankment_.jpg',
            width = 400,
            height = 282,
            pictureObject = {
                images: {
                    '480w_still': {
                        url,
                        width,
                        height
                    }
                }
            },
            wrapper = render(<Picture type='preview' picture={pictureObject} id={1}/>);
        expect(wrapper.find('img')._root[0].name).toMatch('img');
        expect(wrapper.find('div')._root[0].attribs.style).toMatch(/auto/);
        expect(wrapper.find('div')._root[0].attribs.style).toMatch(/100%/);
    });
});
