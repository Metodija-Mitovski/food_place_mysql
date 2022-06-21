import PropTypes from "prop-types"
import img from "../../assets/pizza.jpg";

// components
import CardIcons from "./CardIcons";

//styles
import "../../styles/recipes/recipe_modal.css";

//icons
import close from "../../assets/icons/icon_close.svg"

const RecipeModal = ({ closeModal, recipe, categories, images, updateLike }) => {

    return (
        <main id="recipe-modal">
            <div className="modal-top">
                <h1>{recipe.title}</h1>
                <button onClick={closeModal}>
                    <img src={close} alt="" className="modal-close-icon" />
                </button>
            </div>
            <div className="modal-content-wrapper">
                <div className="modal-content-left">
                    <img src={images[0].image_url} alt="recipe image" className="recipe-img" />
                    <div className="best-served-for">
                        <h3>best served for</h3>
                        <div className="modal-categories-wrapper">
                            {categories.map(c => <>
                                <span key={c.id}>{c.category}</span>
                            </>)}
                        </div>
                    </div>
                    <p>
                        {recipe.short_description}
                    </p>
                    <CardIcons recipeData={recipe} card={false} updateLike={updateLike} />
                </div>
                <div className="modal-content-right">
                    <h3>recipe details</h3>
                    <p>
                        {recipe.long_description}
                    </p>
                </div>
            </div>
        </main>
    );
};

RecipeModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    recipe: PropTypes.object.isRequired,
    updateLike: PropTypes.func.isRequired
}
export default RecipeModal;
