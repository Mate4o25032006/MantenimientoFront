// AppUi.js
import React, { useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MantenContext } from '../Context';
import Loader from '../components/Loader';
import { Menu } from '../components/home/menu';
import { Layout } from '../layout';
import { AppRoutes } from './AppRouter';

export const AppUi = () => {
    const { loader, tokenSession } = useContext(MantenContext);

    return (
        <BrowserRouter>
            {loader && <Loader />}
            <Layout>
                {tokenSession && <Menu />}
                <AppRoutes />
            </Layout>
        </BrowserRouter>
    );
};
