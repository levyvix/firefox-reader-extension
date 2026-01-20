/*global chrome*/
/*global document*/

import React, { Component } from "react";
import ReactHtmlParser from "react-html-parser";
import Readability from "./libs/Readability";
import "./App.css";
import Popup from "./component/Popup";
import { fadeStopWords } from "./helpers/fadeStopWords";

class App extends Component {
  state = {
    title: "",
    content: "",
    contentWithoutStop: null,
    wrapperWidth: 800,
    readerView: true,
    theme: 0,
    sizeFont: 18,
    lineHeight: 1.6,
    fontWeight: 400,
    popupMenu: false,
    speedReading: false,
    error: null
  };

  componentWillMount() {
    try {
      console.log('[Reader] Starting componentWillMount');

      var documentClone = document.cloneNode(true);
      console.log('[Reader] Document cloned');

      var reader = new Readability(documentClone);
      // Disable aggressive content cleaning to preserve photo captions,
      // figure elements, and trailing paragraphs that may be incorrectly removed
      reader._removeFlag(reader.FLAG_CLEAN_CONDITIONALLY);
      var article = reader.parse();
      console.log('[Reader] Readability parse completed:', article);

      if (!article) {
        throw new Error('Readability parser returned null - could not extract article');
      }

      this.setState({
        title: article.title || 'Untitled',
        content: article.content || 'No content found'
      });

      console.log('[Reader] Initial state set');

      // load saved values from chrome storage
      if (chrome && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.get(
          ["theme", "sizeFont", "lineHeight", "fontWeight"],
          data => {
            console.log('[Reader] Storage data retrieved:', data);
            if (data) {
              this.setState(state => {
                return {
                  theme: isNaN(data.theme) ? state.theme : data.theme,
                  sizeFont: isNaN(data.sizeFont) ? state.sizeFont : data.sizeFont,
                  lineHeight: isNaN(data.lineHeight)
                    ? state.lineHeight
                    : data.lineHeight,
                  fontWeight: isNaN(data.fontWeight)
                    ? state.fontWeight
                    : data.fontWeight
                };
              });
            } else {
              console.log('[Reader] No saved settings, using defaults');
            }
          }
        );
      } else {
        console.warn('[Reader] chrome.storage.sync not available');
      }
    } catch (error) {
      console.error('[Reader] Error in componentWillMount:', error);
      this.setState({
        error: error.message,
        readerView: false
      });
    }
  }

  componentDidMount() {
    try {
      console.log('[Reader] componentDidMount called');
      // Apply body styles only after React successfully renders
      const bodyElement = document.getElementsByTagName("body")[0];
      if (bodyElement) {
        bodyElement.style.height = '100vh';
        bodyElement.style.overflow = 'hidden';
        console.log('[Reader] Body styles applied');
      }
    } catch (e) {
      console.error('[Reader] Error in componentDidMount:', e);
    }
  }

  componentWillUnmount() {
    try {
      console.log('[Reader] componentWillUnmount called');
      // Restore body styles when component unmounts
      const bodyElement = document.getElementsByTagName("body")[0];
      if (bodyElement) {
        bodyElement.removeAttribute("style");
        console.log('[Reader] Body styles removed');
      }
    } catch (e) {
      console.error('[Reader] Error in componentWillUnmount:', e);
    }
  }

  closeReader() {
    this.setState({
      readerView: false
    });

    // remove scroll stop style from body
    const bodyElement = document.getElementsByTagName("body");
    bodyElement[0].removeAttribute("style");
  }

  increaseFontSize() {
    this.setState(state => {
      return { sizeFont: state.sizeFont + 1 };
    });

    this.saveFont(this.state.sizeFont);
  }

  decreaseFontSize() {
    this.setState(state => {
      return { sizeFont: state.sizeFont - 1 };
    });

    this.saveFont(this.state.sizeFont);
  }

  /**
   * Change the state of theme to update the view
   * @param {number} themeIndex
   */
  toggleTheme(themeIndex) {
    this.setState({
      theme: themeIndex
    });
    this.saveTheme(themeIndex);
  }

  // open and close popup options
  togglePopup() {
    this.setState(state => {
      return { popupMenu: !state.popupMenu };
    });
  }

  /**
   * Increase or decrease line height
   * True: increase line height by 0.1
   * False: decrease line height by 0.1
   * @param {boolean} action
   */
  editLineHeight(action) {
    if (action) {
      this.setState(state => {
        return { lineHeight: state.lineHeight + 0.1 };
      });
    } else {
      this.setState(state => {
        return { lineHeight: state.lineHeight - 0.1 };
      });
    }

    this.saveLineHeight(this.state.lineHeight);
  }

  toggleSpeedReading() {
    this.setState(state => {
      return {
        speedReading: !state.speedReading
      };
    });
  }

  /**
   * Fade the stop words from the main content
   */
  toggleStopWordFade() {
    this.setState(prevState => {
      return {
        contentWithoutStop: prevState.contentWithoutStop === null ? fadeStopWords(prevState.content) : null
      }
    })
  }

  /**
   * Should it be bold or not
   * it just toggles values
   */
  toggleFontWeight() {
    this.setState(prevState => {
      const status = prevState.fontWeight === 600;
      const fontWeightValue = status ? 400 : 600;
      this.saveFontWeight(fontWeightValue); // save to chrom storage
      return {
        fontWeight: fontWeightValue
      };
    });
  }

  /**
   * Save the theme number to Chrome storage
   * @param {number} theme
   */
  saveTheme(theme) {
    try {
      if (chrome && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ theme });
      }
    } catch (e) {
      console.warn('[Reader] Error saving theme:', e);
    }
  }

  /**
   * Save base font size to Chrome storage
   * @param {number} sizeFont
   */
  saveFont(sizeFont) {
    try {
      if (chrome && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ sizeFont });
      }
    } catch (e) {
      console.warn('[Reader] Error saving font size:', e);
    }
  }

  /**
   * Save line height to Chrome storage
   * @param {number} lineHeight
   */
  saveLineHeight(lineHeight) {
    try {
      if (chrome && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ lineHeight });
      }
    } catch (e) {
      console.warn('[Reader] Error saving line height:', e);
    }
  }

  /**
   * Save font weight to Chrome storage
   * @param {number} fontWeight
   */
  saveFontWeight(fontWeight) {
    try {
      if (chrome && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ fontWeight });
      }
    } catch (e) {
      console.warn('[Reader] Error saving font weight:', e);
    }
  }

  render() {
    // Show error if one occurred
    if (this.state.error) {
      return (
        <div className="rr-app theme-white" style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Error Loading Reader</h2>
          <p>{this.state.error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', marginTop: '10px', cursor: 'pointer' }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    if (this.state.readerView) {
      let activeTheme = "theme-white";
      // if the theme is not white
      if (this.state.theme > 0) {
        activeTheme = this.state.theme === 1 ? "theme-yellow" : "theme-dark";
      }

      let speedIcon = "";
      let moreSpeedIcon = "";
      try {
        speedIcon =
          this.state.theme === 2
            ? chrome.runtime.getURL("images/icon-speed-light.png")
            : chrome.runtime.getURL("images/icon-speed.png");

        moreSpeedIcon =
          this.state.theme === 2
            ? chrome.runtime.getURL("images/icon-more-speed-light.png")
            : chrome.runtime.getURL("images/icon-more-speed.png");
      } catch (e) {
        console.warn('[Reader] Error getting runtime URLs:', e);
      }

      return (
        <div
          className={`rr-app ${activeTheme} ${
            this.state.speedReading ? "rr-speed" : ""
          }`}
        >
          <section
            className="rr-app-wrapper"
            style={{ maxWidth: `${this.state.wrapperWidth}px` }}
          >
            <header className={`rr-app-header ${activeTheme}`}>
              <div className="rr-app-header__content">
                <span
                  className="rr-button--close"
                  onClick={() => this.closeReader()}
                >
                  Close
                </span>
                <div className="rr-theme--toggle">
                  <span
                    onClick={() => this.toggleSpeedReading()}
                    className={
                      this.state.speedReading
                        ? "dr-button--action dr-active dr-speed--toggle"
                        : "dr-button--action dr-speed--toggle"
                    }
                  >
                    <img
                      src={speedIcon}
                      className="dr-icons"
                      title="Speed Reading"
                      alt=""
                    />
                  </span>

                  <span
                    onClick={() => this.toggleStopWordFade()}
                    className={
                      this.state.contentWithoutStop !== null
                        ? "dr-button--action dr-active dr-speed--toggle"
                        : "dr-button--action dr-speed--toggle"
                    }
                  >
                    <img
                      src={moreSpeedIcon}
                      className="dr-icons"
                      title="Speed Reading"
                      alt=""
                    />
                  </span>

                  <span
                    className="rr-font--update rr-dec"
                    onClick={() => this.decreaseFontSize()}
                  >
                    A
                  </span>
                  <span
                    className="rr-font--update rr-inc"
                    onClick={() => this.increaseFontSize()}
                  >
                    A
                  </span>

                  <span
                    className="rr-theme--change theme-white"
                    onClick={() => this.toggleTheme(0)}
                  ></span>
                  <span
                    className="rr-theme--change theme-yellow"
                    onClick={() => this.toggleTheme(1)}
                  ></span>
                  <span
                    className="rr-theme--change theme-dark"
                    onClick={() => this.toggleTheme(2)}
                  ></span>
                  <div className="rr-popup-toggle__wrapper">
                    <div
                      className="rr-popup-toggle--button"
                      onClick={() => this.togglePopup()}
                    >
                      <figure></figure>
                      <figure></figure>
                      <figure></figure>
                    </div>
                    {this.state.popupMenu && (
                      <Popup
                        theme={this.state.theme}
                        editLineHeight={action => this.editLineHeight(action)}
                        toggleFontWeight={() => this.toggleFontWeight()}
                        fontWeight={this.state.fontWeight === 600}
                      />
                    )}
                  </div>
                </div>
              </div>
            </header>
            <article
              className="rr-content__wrapper"
              style={{
                fontSize: `${this.state.sizeFont}px`,
                lineHeight: `${this.state.lineHeight}em`,
                fontWeight: this.state.fontWeight
              }}
            >
              <h1>{this.state.title}</h1>
              {ReactHtmlParser(this.state.contentWithoutStop !== null ? this.state.contentWithoutStop : this.state.content)}
            </article>
          </section>
        </div>
      );
    }

    return null;
  }
}

export default App;
