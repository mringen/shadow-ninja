import React from 'react';

import {Link} from "react-router-dom";

const PromoGame = ({products, match}) => {

    const randomPromo = products.map((game, index) => {
        return (<div className="promo__wrapper">
            <Link to={`${match.url}/${game._id}`}>More info...</Link>
            <h1>{game.title}</h1>
            <h3>now only €{game.price}</h3>
            <figure>
                <img src={game.imgURL} alt={game.title}/>
            </figure>
        </div>)

    })[18];
    //Uses Regular Index for developmentt.

    //   [Math.floor(Math.random() * products.length)]

    return <section className="promo">
        {randomPromo}
    </section>
}

export default PromoGame;
