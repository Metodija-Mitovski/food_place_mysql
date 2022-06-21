import PropTypes from "prop-types";

//components
import Loader from "../../Loader/Loader";
import DeleteModal from "./DeleteModal";

//styles
import "../../../styles/recipes/my-recipes/my-recepies-table.css";

//icons
import trashcan from "../../../assets/icons/icon_trashcan.svg";

const MyRecipesTable = ({ recipesData, fetching, infoMessage, goToUpdate, openModal }) => {
          

console.log(recipesData)
    return (
        <>
            {fetching ? <Loader /> : recipesData.recipes ? <>

                <table id="my-recepies-table" cellSpacing="0">

                    <thead>
                        <tr>
                            <th>recipe name</th>
                            <th>category</th>
                            <th>created on</th>
                            <th>delete</th>
                        </tr>
                    </thead>

                    <tbody>
                        {recipesData.recipes.length > 0  &&
                            recipesData.recipes.map((recipe) => {
                                const recipe_categories = recipesData.categories.filter(c => c.recipe_id === recipe.id);
                                const recipe_images = recipesData.images.filter(i => i.recipe_id === recipe.id)
                                const updateRecipeData = {...recipe,category:recipe_categories[0].category,image:recipe_images[0].image_url}
                               
                                return (
                                    <tr key={recipe.id} onClick={() => { goToUpdate(updateRecipeData) }}>
                                        <td className="table-recipe-name">{recipe.title}</td>
                                        <td className="table-recipe-category">
                                            <span>{recipe_categories[0].category}</span>
                                        </td>
                                        <td className="table-recipe-date">{recipe.created_at}</td>
                                        <td className="table-recipe-delete">
                                            <button onClick={(e) => { openModal(e, recipe.id) }}>
                                                <img src={trashcan} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table></> : <h1 className="info-msg">{infoMessage}</h1>}
        </>
    )
};

MyRecipesTable.propTypes = {
    handleDelete: PropTypes.func.isRequired,
    fetching: PropTypes.bool.isRequired,
    infoMessage: PropTypes.string,
    goToUpdate: PropTypes.func.isRequired
};

export default MyRecipesTable;
