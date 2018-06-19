import React from 'react';
import Modal from 'react-responsive-modal';
import SplitterLayout from 'react-splitter-layout';
import createHistory from 'history/createBrowserHistory';
import CommonMainContainer, { reduxConnect } from 'common/component/mainContainer';
import PageLogin from './page/login';
import PagePlaces from './page/places';
import PageDiscussions from './page/discussions';
import PageChat from './page/chat';
import PopupAll from './popup';
import Header from './page/Header';
import InnerHeader from './page/InnerHeader';

const history = createHistory();
const token = localStorage.getItem('access_token');
const id = localStorage.getItem('@userId');
const currentLocation = history.location.pathname;
const splitedUrl = currentLocation ? currentLocation.split('/') : '';
let folder = null;
let discussion = null;

class MainContainer extends CommonMainContainer {
  constructor(props) {
    super(props);

    this.showMenu = this.showMenu.bind(this);
  }

  showMenu() {
    if (this.props.userInfoIsOpen) {
      this.props.userIsOpen();
    }
  }

  componentWillMount() {
    super.componentWillMount();
    if (splitedUrl[3] && splitedUrl[4]) {
      folder = splitedUrl[4];
    }
    if (splitedUrl[5] && splitedUrl[6]) {
      discussion = splitedUrl[6];
    }
    if (token) {
      this.props.setConnected(token, folder, discussion, id);
    }
  }

  componentDidUpdate() {
    const { accessToken, user } = this.props;
    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
    }
    if (user && user.id) {
      localStorage.setItem('@userId', user.id);
    }
  }

  render() {
    return (
      <div id="main-container">
        <PopupAll />
        <Header />
        <div className="client-container" onClick={this.showMenu} role="presentation">
          <SplitterLayout
            primaryIndex={1}
            secondaryInitialSize={20}
            percentage
            customClassName="main-wrapper"
          >
            <div id="left-sidenav">
              <PagePlaces />
            </div>

            <div className="main">
              <InnerHeader />
              <SplitterLayout
                secondaryInitialSize={50}
                percentage
                customClassName="wrap-layout"
              >
                <div id="discussions">
                  <PageDiscussions />
                </div>

                <div id="chat">
                  <PageChat />
                </div>
              </SplitterLayout>
            </div>
          </SplitterLayout>
        </div>
        <Modal
          open={!this.props.connected}
          onClose={() => false}
          showCloseIcon={false}
          little
          classNames={{ modal: 'custom-modal' }}
        >
          <PageLogin />
        </Modal>
      </div>
    );
  }
}
export default reduxConnect(MainContainer);
