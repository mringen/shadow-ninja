import React, {useState, useEffect, useRef} from 'react';

// Redux ..
import {connect} from "react-redux";
import {fetchProducts} from '../../services/products/productActions';
// import {} from '../../services/infiniteScroll/scrollActions'
import {changeFetchState} from '../../services/infiniteScroll/scrollActions'
// Spinner, uses for loading Animation.
import Loader from '../../components/loader/loader';

// All Games
import PromoGame from './components/promoGame/promoGame';
import SortGames from './components/sortGames/sortGames';
import AllGames from './components/allGames/allGames';

// General Wrapper for GAMES
const Store = ({dispatch, isFetching, filter, sort, products, loading, error, match}) => {
	const [skip, setSkip] = useState(0)


	const isInitialMount = useRef(true);
	const hej = useRef();

	useEffect(() => {
		// fetch on launch
		if(isInitialMount.current) {
			dispatch(fetchProducts(skip, filter, sort))
			isInitialMount.current = false;
			setSkip(skip + 3)
		}
	}, [dispatch, skip, filter, sort]);

	// fetch when scroll is in bottom on page
	useEffect(() => {

		// listen addEventListener scroll
		const fun = () => {

			const body = document.body;
			const wrapper = document.getElementById('games')
			// TODOo: anända REF i stället för vanilla DOM
			let isAtBottom = wrapper && (window.innerHeight + window.scrollY) >= body.offsetHeight;


			if (isAtBottom) {
				dispatch(changeFetchState())

				if(isFetching) {
						setSkip(skip + 3)

					dispatch(fetchProducts(skip, filter, sort))

				} else if(!isFetching) {
					return null
				}

			}


		}
		window.addEventListener('scroll', fun);
		return () => window.removeEventListener('scroll', fun);
	}, [dispatch, isFetching, skip, filter, sort]);




//If Theres an error loading the page.
    if (error) {
		// dispatch(fetchProducts(filter, sort))
        return (<div>Error, no connection</div>)
    }


// If Connection is slow, or when loading. This will show.
    if (loading) {
        return <Loader/>
    }





    return (
    <main id="games" ref={hej}>
        <PromoGame match={match} products={products}/>
        <SortGames />
        <AllGames products={products} match={match}/>
    </main>)
}

// state, can be retrieved through props or destructuring.
const mapStateToProps = state => ({
	isFetching: state.scrollBottom.isFetching,
	filter: state.products.filter,
	sort: state.products.sort,
	products: state.products.items,
	loading: state.products.loading,
	error: state.products.error
});


export default connect(mapStateToProps)(Store);
