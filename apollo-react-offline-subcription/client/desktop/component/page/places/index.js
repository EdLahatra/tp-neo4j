import createHistory from 'history/createBrowserHistory';
import React from 'react';
import classNames from 'classnames';
import CommonPagePlaces, { reduxConnect } from 'common/component/page/places';
import * as FontAwesome from 'react-icons/lib/fa';
import Folder from './folder';
import AddPlace from './addPlace';
import logo from '../../../images/monologo.svg';

const history = createHistory();

class PagePlaces extends CommonPagePlaces {
  componentDidMount() {
    const currentLocation = history.location.pathname;
    const splitedUrl = currentLocation ? currentLocation.split('/') : '';
    if (splitedUrl[1] && splitedUrl[2]) {
      this.props.openPlace(splitedUrl[2], true);
    }
  }

  /**
   * Add browser url change capability
   * @param{object} event
   * @param{string} place - Selected place id
   * @param{boolean} openFirstFolder - If the first folder should be open
  */
  openPlace(place, openFirstFolder) {
    this.props.openPlace(place, openFirstFolder);
    history.push({
      pathname: `/place/${place.id}`,
    });
  }

  render() {
    const placesList = [];
    let tabId = 0;
    this.props.places.forEach((place, keyPlace) => {
      let subfolders = null;
      if (this.props.currentPlace === place.id) {
        const folders = [];
        Object.keys(this.props.folders).forEach((key) => {
          if (
            this.props.folders[key].place.id === place.id
            && this.props.folders[key].parent === null
          ) {
            folders.push((
              <Folder
                key={`${key} ${keyPlace + 1}`}
                folder={this.props.folders[key]}
                folders={this.props.folders}
                currentFolder={this.props.currentFolder}
              />
            ));
          }
        });
        subfolders =
          (
            <div className="subfolders">
              {folders}
            </div>
          );
      }

      placesList.push((
        <div key={`${place.id} ${keyPlace + 1}`} className="item-place">
          <span
            className={
              classNames(
                'place-name',
                { placeSelected: this.props.currentPlace === place.id },
              )
            }
            onClick={() => { this.toggleOpenPLace(place); }}
            role="menuitem"
            tabIndex={tabId}
          >
            <FontAwesome.FaHome className="place-icon" />
            {place.name}
            <FontAwesome.FaPlus className="toggle-arrow closed" />
            <FontAwesome.FaMinus className="toggle-arrow open" />
          </span>
          {subfolders}
        </div>
      ));
      tabId += 1;
    });
    return (
      <div className="flex-item">
        <div id="logoZone">
          <img src={logo} alt="Share.Place logo" className="logo" /> V0.2.2
        </div>
        <div className="top-place-list">
          <div className="content-head">
            <span
              className="all-topics"
              onClick={this.allTopics}
              role="none"
            >
              Show all topics <FontAwesome.FaList className="icon" />
            </span>
            <AddPlace />
          </div>
        </div>
        <div className="place-list">
          {placesList}
        </div>
      </div>
    );
  }
}

export default reduxConnect(PagePlaces);
