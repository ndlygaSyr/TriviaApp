var NavBar = React.createClass({
    render: function() {
        return (
           <div className="container">
            <div className="nav-wrapper">
                <div className="row">
                    <div className="col s12 align-center brand-logo">
            <img className="responsive-img" src="http://static1.squarespace.com/static/5669d9f6a128e62b6fffc8f4/5669f01569a91a0c71834a2f/56896bc0a2bab852737ddee9/1451953651912/?format=1000w" />
                    </div>
                </div>
            </div>
            </div>
        );
    }
});

var FooterBar = React.createClass({
    render: function() {
        return (
            <div className="container">
            <div className="row">
                    <div className="col s6 center-align">
                        <div className="chip">Total Questions: { this.props.data.total }</div>
                    </div>
                    <div className="col s6 center-align">
                        <div className="chip">Anwered Right: { this.props.data.right }</div>
                    </div>
                    <div className="col s12 center-align">
                        <a className="waves-effect waves-light btn blue darken-2" onClick={this.props.startNewGame}>New Game</a>
                    </div>
            </div>
            </div>
        );
    }
});

var StartScreen = React.createClass({
    render: function() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col s6 offset-s3">
                        <h3 className="flow-text center-align">Welcome to</h3>
                        <div className="card-panel white">
                        <img className="responsive-img" src="http://static1.squarespace.com/static/5669d9f6a128e62b6fffc8f4/5669f01569a91a0c71834a2f/56896bc0a2bab852737ddee9/1451953651912/?format=1000w" />
                        </div>
                        <div className="center-align">
                            <button onClick={this.props.startNewGame} className="btn btn-large blue darken-2">
                                Start Game
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var TimerComp = React.createClass({
    getInitialState: function() {
        return {
            interval: 1000,
            display: 4
        };
    },
    timer: null, //Holder for timer
    setTime: function() {
        var time = this.state.display;
        time--
        this.setState({display: time});
        if (time === 0) {
            clearInterval(this.timer);
            console.log(this.timer)
            this.props.timerDone();
        }
    },
    componentDidMount: function() {
        this.timer = setInterval(function() {this.setTime()}.bind(this), this.state.interval);
    },
    render: function() {
        return (
            <div className="card-panel blue valign-wrapper center-align">
                <h1 className="white-text">{ this.state.display }</h1>
            </div>
        );
    }
});

var ResultComp = React.createClass({
    setClass: function() {
        return "card-panel valign-wrapper center-align "+this.props.color;
    },
    render: function() {
        return (
            <div className={this.setClass()} >
                <h1 className="white-text">{ this.props.text}</h1>
            </div>
        );
    }
})

var QuestionComp = React.createClass({
    render: function() {
        return (
            <div className="card-panel">
                <p>{this.props.question}</p>
                <form onSubmit={this.props.checkAnswer}>
                       <div className="row">
                        <div className="input-field col s12">
                          <input id="answer" type="text" required="required" />
                          <label for="answer">Your Answer</label>
                        </div>
                      </div>
                       <div className="row">
                        <div className="col s12">
                          <button type="submit" className="btn btn-large red darken-2">Submit</button>
                        </div>
                      </div>
                </form>
            </div>
        );
    }
});

var GameScreen = React.createClass({
    getInitialState: function() {
        this.getQuestion();
        return {
            ready: false,
            active: "timer"
        };
    },
    componentDidMount: function() {
    },
    getQuestion: function() {
        $.get("http://jservice.io/api/random", function(data) {
            data[0]["ready"] = true;
            this.setState(data[0]);
        }.bind(this));
    },
    checkAnswer: function(e) {
        e.preventDefault();
        var ans = this.state.answer;
        ans = ans.replace(/<\/?[^>]+(>|$)/g, "");
        var check = $("input#answer").val();
        if (ans === "") {
            alert("Please enter a value!");
            return false;
        }
        if(ans.toLowerCase() === check.toLowerCase()) {
            this.props.questionAnswered(true);
            this.setState({active:"right"})
        }else {
            this.props.questionAnswered(false);
            this.setState({active:"wrong"})
        }
        this.getQuestion();
        return false;
    },
    timerDone: function() {
        this.setState({active: "question"})
    },
    showComp: function() {
        if (this.state.active === "timer") {
            return (
                <TimerComp timerDone={this.timerDone} />
            );
        }
        if (this.state.ready && this.state.active === "question") {
            return (
                <QuestionComp question={this.state.question} checkAnswer={this.checkAnswer} />
            );  
        }
        if (this.state.active === "wrong") {
            return this.showResult(false);
        }
        if (this.state.active === "right") {
            return this.showResult(true);
        }
    },
    showResult: function(res) {
        var color = "red";
        var text = "WRONG";
        if (res) {
            color = "green";
            text = "RIGHT";
        }
        setTimeout(function() {
            this.setState({active:"timer"})
        }.bind(this), 2000)
        return (
            <ResultComp color={color} text={text} />
        );
    },
    render: function() {
        return (
            <div>
            <NavBar />
            <div className="container">
                <div className="row">
                    <div className="col s6 offset-s3">
                        {this.showComp()}
                    </div>
                </div>
            </div>
            <FooterBar data={this.props.data} startNewGame={this.props.startNewGame}  />
            </div>
        );
    }
})

var TriviaApp = React.createClass({
    startNewGame: function(e) {
        e.preventDefault();
        this.setState(
            {
                right: 0, 
                total: 0,
                newGame: true,
            });  
    },
    startGame: function(e) {
        e.preventDefault();
        this.setState(
            {
                right: 0, 
                total: 0,
                newGame: false,
            });  
    },
    getInitialState: function() {
        return {
            newGame: true,
            right: 0,
            total: 0
        };
    },
    questionAnswered: function(res) {
        var t = this.state.total;
        var r = this.state.right;
        if (res) {
            r++;
        }
        t++;
        this.setState({total: t, right: r})
    },
    incrementRight: function () {
        
    },
    getScreen: function() {
        if (this.state.newGame) {
            return (
                <StartScreen startNewGame={this.startGame} />
            );
        }
        return (
            <GameScreen startNewGame={this.startNewGame} data={this.state} questionAnswered={this.questionAnswered} />
        );
    },
    render: function() {
        return (
            this.getScreen()
        );
    }
});

ReactDOM.render(
  <TriviaApp />,
  document.getElementById('triviaApp')
);