import React from 'react';
import classNames from 'classnames';
import * as FontAwesome from 'react-icons/lib/fa';
import CommonPagePlaces, { reduxConnect } from 'common/component/page/places';
import InputText from '../input/text';
import InputNumber from '../input/number';
import loaderSpin from '../../images/loader.svg';

class InnerHeader extends CommonPagePlaces {
  constructor(props) {
    super(props);

    this.toogleSearch = this.toogleSearch.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);
    this.onChangeSort = this.onChangeSort.bind(this);
    this.changeValueInt = this.changeValueInt.bind(this);
    this.changeValueString = this.changeValueString.bind(this);
    this.toogleOrderBy = this.toogleOrderBy.bind(this);
  }

  toogleOrderBy() {
    let sort;
    if (this.state.sort === 'dateDesc') {
      sort = 'time';
    } else {
      sort = this.state.sort;
    }
    this.filterAndSortSearch(sort);
    this.setState({ orderBy: !this.state.orderBy });
  }

  onChangeSort(e) {
    this.filterAndSortSearch(e.target.value);
    this.setState({ sort: e.target.value });
  }

  changeValueInt(valueInt) {
    this.setState({ valueInt });
  }

  changeValueString(valueString) {
    this.setState({ valueString });
  }

  onChangeFilter(e) {
    this.setState({ filter: e.target.value });
    if (e.target.value.trim().length) {
      this.props.searchDynamics(
        this.state.keyword,
        e.target.value.trim(),
        this.state.sort,
        this.state.valueString,
        this.state.valueInt,
      );
    }
  }

  componentDidMount() {
    document.addEventListener('keypress', (e) => {
      const key = e.which || e.keyCode;
      if (key === 27) {
        this.setState({ isSearchOpen: false });
      }
    });
  }

  toogleSearch() {
    this.setState({ isSearchOpen: !this.state.isSearchOpen });
    this.props.searchIsOpen();
  }

  resultSearch() {
    const search = [];
    if (this.props.search) {
      Object.keys(this.props.search.records).forEach((element) => {
        const item = this.props.search.records[element];
        search.push(
          <tr
            role="none"
            key={element}
            onClick={() => this.openDiscution(item.folder.id, item.discussion.id)}
            className="resultRow"
          >
            <td>{item.place.name}</td>
            <td>{item.folder.name}</td>
            <td>{item.discussion.title}</td>
          </tr>,
        );
      });
    }
    return (
      <div>
        <table id="resultTable">
          <tbody>
            <tr id="table-head">
              <th>PLace</th>
              <th>Folder</th>
              <th>Discussion</th>
            </tr>
            {search}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div id="innerTopbar">
          <i
            className={classNames(
              'icon search',
              {
                open: this.state.isSearchOpen,
              },
            )}
            onClick={this.toogleSearch}
            role="none"
          >
            <FontAwesome.FaSearch className="launch-search" />
            <FontAwesome.FaClose className="close-search" />
          </i>
        </div>

        {this.state.isSearchOpen ? <div id="search-option">
          <InputText
            value={this.state.keyword}
            onChange={this.changeKeyword}
            placeholder={'Search ...'}
            className="search-input"
          />
          <button
            onClick={this.toogleOrderBy}
            className="btn btn-primary flat"
          >
            {this.state.orderBy ?
              <FontAwesome.FaSortAmountDesc />
              :
              <FontAwesome.FaSortAmountAsc />
            }
          </button>
          <div className="select-field">
          Filter by:
            <select
              className="filter-by"
              value={this.state.filter}
              onChange={this.onChangeFilter}
            >
              <option value="sizeMin">Size min</option>
              <option value="sizeMax">Size max</option>
              <option value="approved">Approved</option>
              <option value="notApproved">Desapproved</option>
              <option value="author">Author</option>
              <option value="locked">Locked</option>
            </select>
          </div>

          <div className="select-field">
          Order by:
            <select className="filter-by" value={this.state.sort} onChange={this.onChangeSort}>
              <option value={'time'}>Date</option>
              <option value={'size'}>Size</option>
              <option value={'name'}>Name</option>
            </select>
          </div>
          {this.state.filter === 'author'
            ? <InputText
              value={this.state.valueString}
              onChange={this.changeValueString}
              placeholder={'author name ...'}
            /> : null }
          {this.state.filter === 'sizeMin' || this.state.filter === 'sizeMax'
            ? <InputNumber
              value={this.state.valueInt}
              onChange={this.changeValueInt}
              placeholder={'number ...'}
            /> : null }
        </div>
          : null }
        {this.props.isFechSearch ? <div className="searchResult">
          <span className="loading"><img
            className="loading-spinner"
            src={loaderSpin}
            alt="Loader"
          />   Please wait...</span>
        </div> : null}
        {this.state.isSearchOpen && this.props.search ? <div className="searchResult">
          {this.resultSearch()} </div> : null}
      </div>
    );
  }
}

export default reduxConnect(InnerHeader);
