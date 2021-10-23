import { error } from "console";

import * as model from "./modal.js";
import { MODEL_CLOSE_SECS } from "./config.js";
import recipeView from "./views/recipeView.js";
import seachView from "./views/seachView.js";
import resultView from "./views/resultView.js";
import pageMarkView from "./views/pageMarkView.js";
import bookMarkView from "./views/bookMarkView.js";
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";
import recipeView from "./views/recipeView.js";
import { async } from "regenerator-runtime";
import View from "./views/view.js";

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0. Update results views to mark selected search result
    resultView.update(model.getSearchedPage());

    // 1. Updating bookmarks view
    bookMarkView.update(model.state.bookmarks);

    // 2. Loading recipe
    await model.loadRecipe(id);

    // 3. Rendering Recipoe

    // const recipeView=new RecipeView(model.state.recipe)
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchItems = async function () {
  try {
    resultView.renderSpinner();

    // Getting search query
    const query = seachView.getQuery();
    if (!query) return;

    // Loading the recipe
    await model.loadSearchResults(query);

    // Render results
    // resultView.render(model.state.search.results);

    resultView.render(model.getSearchedPage());

    // Render Initial page No.s
    pageMarkView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPage = function (gotoPage) {
  // Render NEW page results(as render clears everything that stayed before and overwrite a new one)
  resultView.render(model.getSearchedPage(gotoPage));

  // Render NEW page No.s
  pageMarkView.render(model.state.search);
};

const controlServing = function (newServings) {
  // Recipe serving update
  model.updateServing(newServings);

  // Recipe view update
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddRemoveBookMark = function () {
  // Adding and removing bookmark
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.removeBookMark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookMarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookMarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newReci) {
  try {
    // Show Spinner
    addRecipeView.renderSpinner();

    // Upload thee new recipe data
    await model.uploadRecipe(newReci);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success Msg
    addRecipeView.renderMsg();

    // Render bookMark view
    bookMarkView.render(model.state.bookmarks);

    // setting ID in URL
    window.history.pushState(null, ``, `#${model.state.recipe.id}`);

    // close form Window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SECS * 1000);
  } catch (err) {
    console.error(`😢😢`, err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookMarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServing);
  recipeView.addHandlerBookMark(controlAddRemoveBookMark);

  seachView.addHandlerSearch(controlSearchItems);
  pageMarkView.addHandlerPage(controlPage);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
// window.addEventListener(`hashchange`, controlRecipes);
// window.addEventListener(`load`, controlRecipes);
