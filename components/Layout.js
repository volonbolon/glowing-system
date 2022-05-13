import React from 'react';
import Header from './Header';
import { Container } from 'semantic-ui-react';

const Layout = (props) => {
    return (
        <Container>
            <Header />
            {props.children}
            <h1>This is a footer</h1>
        </Container>
    );
};

export default Layout;