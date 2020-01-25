const React = require("react");
const Layout = require("./layout");

class Tweed extends React.Component {
  render() {
    const editPath = "/tweeds/" + this.props.tweed.id + "/edit";

    return (
      <Layout
        username={this.props.username}
        userID={this.props.userID}
        loggedIn={this.props.loggedIn}
      >
        <div className="container">
          <h2>{this.props.user.username} tweeded:</h2>
          <span className="mr-2">{this.props.tweed.tweets}</span>
          <a href={editPath}>
            <button className="btn btn-warning">Edit</button>
          </a>
        </div>
      </Layout>
    );
  }
}
module.exports = Tweed;
