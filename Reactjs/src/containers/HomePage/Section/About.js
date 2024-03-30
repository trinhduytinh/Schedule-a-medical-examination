import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
class About extends Component {
  render() {
    return (
      <div className="section-share section-about">
        <div className="section-about-header">
          <FormattedMessage id="homepage.media-coverage"/>
        </div>
        <div className="section-about-content">
          <div className="content-left embed-responsive embed-responsive-16by9">
            <iframe
              width="100%"
              height="400px"
              src="https://www.youtube.com/embed/9vaLkYElidg?list=RD9vaLkYElidg"
              title="Ánh Sao Và Bầu Trời - T.R.I x Cá | [Official Audio]"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen></iframe>
          </div>
          <div className="content-right">
            
                <p>SONG NAME: A star and the sky</p>
                <p>English lyrics:</p>
                <p>I have never seen you smiling that much</p>
                <p>I have never seen your eyes twinkling like this moment</p>
                <p>You passionately tell me about him</p>
                <p>About your yesterday dating</p>
                <p>About he who always surprises you with gifts</p>
                <p>I thought I would be happy when you fall in love with a guy</p>
                <p>But my heart now adrifts and breaks into hundred pieces</p>
                <p>Only a second that we were apart could desperate us forever</p>
                <p>You've got your own star but I lost my sky</p>
                <p>Wanna say "I still love you"</p>
                <p>Wanna hold your hands tightly</p>
                <p>Wanna tell you "Don't leave me alone, don't leave me for where he's waiting"</p>
                <p>Wanna hold your hand once again</p>
                <p>To come back to our old streets</p>
                <p>Do you still remember our first kiss in the rain?</p>
            
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
