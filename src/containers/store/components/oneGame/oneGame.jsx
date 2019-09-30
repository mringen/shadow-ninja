import React from 'react';
import {Link} from "react-router-dom";
import RegularButton from '../../../../components/buttons/regular-button';

// Redux
import {connect} from 'react-redux';

// Renders ONE game, this send in to ALLGAMES component.
const OneGame = ({products, match, addProduct}) => {
	return products.map((gameinfo) => {
		return <section className="game__container" key={gameinfo._id}>
			<Link to={`${match.url}/${gameinfo._id}`}>
				<figure>
					<img src={gameinfo.imgURL} alt={gameinfo.name}/>
				</figure>

				<h3>{gameinfo.title}</h3>
				<div className="game__container-description">
					<p>Category: <span>{gameinfo.category}</span></p>
					<p>Price: <span>€{gameinfo.price}</span></p>
					<p>Rating: <span>{gameinfo.rating}</span></p>
				</div>
			</Link>
			<RegularButton title="buy" click={() => addProduct(gameinfo)}/>
		</section>

	})
}

const mapStateToProps = state => ({ products: state.products.items, loading: state.products.loading, error: state.products.error});

export default connect(mapStateToProps)(OneGame);
