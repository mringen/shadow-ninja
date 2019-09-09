import React, {useEffect} from 'react';

// Redux ..
import {connect} from "react-redux";
import {fetchProducts} from '../../actions/productActions'

// All Games
import PromoGame from './components/promoGame/promoGame';
import SortGames from './components/sortGames/sortGames';
import AllGames from './components/allGames/allGames';
//Navbar, in Progress
import StoreNavbar from './components/storenavbar/storenavbar';

// General Wrapper for GAMES
const Store = (props) => {
    const {dispatch, products} = props;


    useEffect(() => {
        dispatch(fetchProducts())
    }, [dispatch])


    return (<main className="games">
        <PromoGame match={props.match} products={products}/>
        <StoreNavbar/>
        <SortGames/>
        <AllGames products={products} match={props.match}/>
    </main>)
}

const mapStateToProps = state => ({products: state.products.items, loading: state.products.loading, error: state.products.error});

export default connect(mapStateToProps)(Store);
