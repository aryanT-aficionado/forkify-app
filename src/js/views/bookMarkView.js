import View from "./view.js";
import previewView from "./previewView.js";
import icons from "url:../../img/icons.svg";

class BookmarksView extends View {
  _parentElement = document.querySelector(`.bookmarks__list`);
  _errorMsg = `No Book Marks found! BookMark it ;)`;
  _succesMsg = ``;

  addHandlerRender(handler) {
    window.addEventListener(`load`, handler);
  }

  _generateMarkup() {
    return this._data
      .map((bookmarks) => previewView.render(bookmarks, false))
      .join(``);
  }
}

export default new BookmarksView();
