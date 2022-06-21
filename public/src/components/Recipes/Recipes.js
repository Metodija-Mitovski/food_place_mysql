import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import config from "../../config/config"

//components
import RecipeCard from "./RecipeCard";
import SectionTitle from "../SectionTitle/SectionTitle";
import Loader from "../Loader/Loader";

//styles
import "../../styles/recipes/recipes.css";

const Recipes = ({ section_title, url }) => {
    const [fetching, setFetching] = useState(true);
    const [recipesData, setRecipesData] = useState([]);
    const [infoMessage, setInfoMessage] = useState("No recipes in this category");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalId, setModalId] = useState(null);
    const [like, setLike] = useState(false);

   

    const openModal = (id) => {
        setIsModalOpen(true);
        setModalId(id);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setModalId(null);
    }



    const fetchRecipes = async () => {
        try {
            const res = await axios.get(url);
            setRecipesData(res.data);
            setFetching(false);
        } catch (error) {
            setFetching(false);
            setInfoMessage("Something went wrong, Please try again...");
        }
    };

    const updateLike = async (e, recipe_id) => {
        e.stopPropagation();
        try {
            await axios.patch(`${config.api.recipes}/rating/${recipe_id}`);
            setLike(!like);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        fetchRecipes();
    }, [url, like]);

    return (
        <section id="recipes">
            <SectionTitle section_title={section_title} />
            <main className="recipes-main">
                {fetching ? (
                    <Loader />
                ) : recipesData.recipes ? (
                    recipesData.recipes.map((recipe) => {
                        const categories = recipesData.categories.filter(r => r.recipe_id === recipe.id);
                        const images = recipesData.images.filter(i => i.recipe_id === recipe.id);
                        
                        return <RecipeCard key={recipe.id} recipe={recipe} categories={categories} images={images} isModalOpen={isModalOpen} modalId={modalId}
                            openModal={openModal} closeModal={closeModal}
                            updateLike={updateLike}
                        />;
                    })
                ) : (
                    <h1 className="info-msg">{infoMessage}</h1>
                )}
            </main>
        </section>
    );
};

Recipes.propTypes = {
    section_title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
};

export default Recipes;
