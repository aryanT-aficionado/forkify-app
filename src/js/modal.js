import { async } from "regenerator-runtime";
import { API_URl, RESULT_PER_PAGE, KEY } from "./config.js";
// import { getJSON, sendJSON } from "./helpers.js";
import { AJAX } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultPerPage: RESULT_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObj = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    serving: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URl}/${id}?key=${KEY}`);

    // console.log(data,res);

    state.recipe = createRecipeObj(data);

    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (error) {
    // temp error
    console.error(`${error} 🔴🔴`);
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URl}?search=${query}&key=${KEY}`);
    console.log(data);

    state.search.results = data.data.recipes.map((reci) => {
      return {
        id: reci.id,
        title: reci.title,
        publisher: reci.publisher,
        image: reci.image_url,
        ...(reci.key && { key: reci.key }),
      };
    });

    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 🔴🔴`);
    throw err;
  }
};

export const getSearchedPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultPerPage; //10 is amount of results that we want on the page
  const end = page * state.search.resultPerPage; //9;

  return state.search.results.slice(start, end);
};

export const updateServing = function (new_serves) {
  state.recipe.ingredients.forEach((ingre) => {
    ingre.quantity = (ingre.quantity * new_serves) / state.recipe.serving;
    // newQuan = oldQuant*newServe / old \\eg- 2 * 8/4=4
  });

  state.recipe.serving = new_serves;
};

const storeBookMark = function () {
  localStorage.setItem(`bookmarks`, JSON.stringify(state.bookmarks));
};

export const addBookMark = function (recipe) {
  // Adding bookmark
  state.bookmarks.push(recipe);

  // Mark Current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  storeBookMark();
};

export const removeBookMark = function (id) {
  // delete bookmark
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark Current recipe as unbookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  storeBookMark();
};

const init = function () {
  const storage = localStorage.getItem(`bookmarks`);
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookMarks = function () {
  localStorage.clear(`bookmarks`);
};
// clearBookMarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith(`ingredient`) && entry[1] !== ``)
      .map((ing) => {
        // const ingArr = ing[1].replaceAll(` `, ``).split(`,`);
        const ingArr = ing[1].split(`,`).map((el) => el.trim());

        if (ingArr.length !== 3)
          throw new Error(
            `Wrong ingredient format!, please use correct format`
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URl}?key=${KEY}`, recipe);
    state.recipe = createRecipeObj(data);

    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};
