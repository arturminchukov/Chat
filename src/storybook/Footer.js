import React from 'react';
import { storiesOf } from '@storybook/react';
import { Footer } from '../components/Footer/Footer';

storiesOf('Footer', module)
    .add('Send', () => <Footer submitIcon="Send" />);
