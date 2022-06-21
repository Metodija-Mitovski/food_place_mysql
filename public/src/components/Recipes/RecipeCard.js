import PropTypes from "prop-types";

import img from "../../assets/pizza.jpg";

//components
import CardIcons from "./CardIcons";
import RecipeModal from "./RecipeModal";

//styles
import "../../styles/recipes/recipe_card.css";

const RecipeCard = ({ recipe, categories, images, isModalOpen, modalId, openModal, closeModal, updateLike }) => {
   
    return (
        <>
            {isModalOpen && modalId === recipe.id && <RecipeModal closeModal={closeModal} recipe={recipe} images={images} categories={categories} updateLike={updateLike} />}
            <div id="recipe-card" onClick={() => openModal(recipe.id)}>
                <div className="card-img-wrapper">
                    <img src={images[0].image_url} alt="" />
                    <div className="categories-wrapper">
                        {categories.map(c => <>
                            <span >{c.category}</span>
                        </>)}
                    </div>
                </div>
                <div className="card-details-wrapper">
                    <h2>{recipe.title}</h2>
                    <p>{recipe.short_description}</p>
                    <div className="card-icons-wrapper">
                        <CardIcons recipeData={recipe} card={true} updateLike={updateLike} />
                    </div>
                </div>
            </div>
        </>

    );
};


RecipeCard.propTypes = {
    recipe: PropTypes.object.isRequired,
    isModalOpen: PropTypes.bool.isRequired,
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired
};

export default RecipeCard;
