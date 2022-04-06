import {BrowserRouter,Route,Routes,NavLink} from 'react-router-dom'
import Game from './board'
import React, { useState,useEffect,Component,memo,useContext }  from 'react';
import Navbar from "./components/navbar/Navbar";
import Login from "./components/login/login";
const CatalogContext = React.createContext();

const products = [
    {id: 123, title: 'JavaScript', price: 567.00},
    {id: 456, title: 'React.js', price: 678.00},
    {id: 789, title: 'Node.js', price: 789.00},
];

export function CatalogContextProvider(props) {
    return (
        <CatalogContext.Provider value={products}>
            {props.children}
        </CatalogContext.Provider>
    )
}
const BasketContext = React.createContext();

 function BasketContextProvider(props) {
    const [products, setProducts] = useState([]);

    const add = (item) => {
        if (!products.includes(item)) {
            setProducts([item, ...products]);
        }
    };

    const remove = (item) => {
        setProducts(products.filter(product => product !== item));
    };

    const cost = () => {
        return products.reduce((cost, product) => cost + product.price, 0);
    };

    const clear = () => {
        setProducts([]);
    }

    const context = {
        products: products,
        add: add,
        remove: remove,
        cost: cost,
        clear: clear,
    };

    return (
        <BasketContext.Provider value={context}>
            {props.children}
        </BasketContext.Provider>
    )
}
function Basket() {
    const basket = useContext(BasketContext);
    return (
        <div>
            <h3>Корзина</h3>
            <table border="1" cellSpacing="0" cellPadding="5">
                <tr>
                    <th>Код</th>
                    <th>Наименование</th>
                    <th>Цена</th>
                    <th>Удалить</th>
                </tr>
                {basket.products.map(product => (
                    <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.title}</td>
                        <td>{product.price}</td>
                        <td>
                            <button onClick={() => basket.remove(product)}>Удалить</button>
                        </td>
                    </tr>
                ))}
                <tr>
                    <td colSpan="2">Сумма</td>
                    <td>{basket.cost()}</td>
                    <td>
                        <button onClick={() => basket.clear()}>Очистить</button>
                    </td>
                </tr>
            </table>
        </div>
    );
}

function Catalog() {
    const products = useContext(CatalogContext); // товары каталога
    const basket = useContext(BasketContext); // корзина покупателя
    return (
        <div>
            <h1>Каталог</h1>
            <table border="1" cellSpacing="0" cellPadding="5">
                <tr>
                    <th>Код</th>
                    <th>Наименование</th>
                    <th>Цена</th>
                    <th>В корзину</th>
                </tr>
                {products.map(product => (
                    <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.title}</td>
                        <td>{product.price}</td>
                        <td>
                            <button onClick={() => basket.add(product)}>В корзину</button>
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <div className='app'>
                <Navbar/>
                <div className="wrap">
                    <Routes>
                        <Route path="/" element={<Login/>}/>
                        <Route path="/main" element={<Game/>}/>
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}
export default App;