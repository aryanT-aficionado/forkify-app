import View from "./view.js";
import icons from "url:../../img/icons.svg";

class PageMarkView extends View {
  _parentElement = document.querySelector(`.pagination`);

  addHandlerPage(handler) {
    this._parentElement.addEventListener(`click`, function (e) {
      const btn = e.target.closest(`.btn--inline`);

      if (!btn) return;
      const gotoPage = +btn.dataset.goto;

      handler(gotoPage);
    });
  }

  _nextPage(page) {
    return `
        <button data-goto="${
          page + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${page + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
  }

  _prevPage(page) {
    return `
        <button data-goto="${
          page - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${page - 1}</span>
        </button>
      `;
  }

  _anyPage(page) {
    return `
      <button data-goto="${page - 1}" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${page - 1}</span>
      </button>
      <button data-goto="${page + 1}" class="btn--inline pagination__btn--next">
          <span>Page ${page + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
      </button>
      `;
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );

    // at page 1, of web page
    if (currPage === 1 && numPages > 1) {
      return this._nextPage(currPage);
    }

    //On last page
    if (currPage === numPages && numPages > 1) {
      return this._prevPage(currPage);
    }

    // Some Page
    if (currPage < numPages) {
      return this._anyPage(currPage);
    }

    // Only single page
    return ``;
  }
}

export default new PageMarkView();
