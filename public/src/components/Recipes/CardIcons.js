import PropTypes from "prop-types"

// icons
import time from "../../assets/icons/icon_time.svg"
import plate from "../../assets/icons/icon_plate.svg"
import star from "../../assets/icons/icon_star.svg"
import arrows_white from "../../assets/icons/icon_arrows_white.svg"


const CardIcons = ({ recipeData, card, updateLike }) => {
    return (
        <>
            <div className="card-icons-left">
                <img src={time} alt="" className="icon-left" />
                <span>{recipeData.preparation_time}</span>
                <img src={plate} alt="" className="icon-left" />
                <span>{recipeData.number_Of_people}</span>
                <img src={star} alt="" className="icon-left like-img" onClick={(e) => { updateLike(e,recipeData.id) }} />
                <span>{recipeData.likes_count}</span>
            </div>
            <div className="card-icons-right">
                {card && <button>
                    <img src={arrows_white} alt="" className="icon-right" />
                </button>}
            </div>
        </>
    );
};

CardIcons.propTypes = {
    recipeData: PropTypes.object.isRequired,
    card: PropTypes.bool,
    updateLike: PropTypes.func.isRequired
}
export default CardIcons;
