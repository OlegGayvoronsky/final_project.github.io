"use strict";

const {
  Formik,
  Field,
  Form
} = window.Formik;
const {
  createSlice,
  configureStore
} = window.RTK;
const {
  combineReducers
} = window.Redux;
const {
  Provider,
  connect
} = window.ReactRedux;
const {
  HashRouter,
  Route,
  Switch,
  withRouter
} = window.ReactRouterDOM;

function saveLocalStorage(values) {
  localStorage.setItem("name", values.yourName === null ? "" : values.yourName);
  localStorage.setItem("phone", values.phone === null ? "" : values.phone);
  localStorage.setItem("email", values.email === null ? "" : values.email);
  localStorage.setItem("message", values.message === null ? "" : values.message);
  localStorage.setItem("policy", values.policy);
}

const formOpenerSlice = createSlice({
  name: 'formOpener',
  initialState: "",
  reducers: {
    requestOpen: (state, action) => {
      if (state === "") return action.payload;
      return state;
    },
    requestFulfilled: state => ""
  }
});
const formAnimationSlice = createSlice({
  name: 'formAnimation',
  initialState: "",
  reducers: {
    formClosed: state => "",
    submitStart: state => "wait",
    submitSuccess: state => "success",
    submitError: state => "error"
  }
});
const mainReducer = combineReducers({
  formOpener: formOpenerSlice.reducer,
  formAnimation: formAnimationSlice.reducer
});
const store = configureStore({
  reducer: mainReducer
});
let validateFormCallback = undefined;

function captchaCallback() {
  if (validateFormCallback) validateFormCallback();
}

class MainForm extends React.Component {
  constructor(props) {
    super(props);
    this.renderButtonText = this.renderButtonText.bind(this);
    this.step = this.step.bind(this);
  }

  componentDidMount() {
    let captcha = document.getElementById("recaptcha");
    document.getElementById("recaptcha-place").appendChild(captcha);
    this.validateForm();
  }

  componentWillUnmount() {
    let captcha = document.getElementById("recaptcha");
    document.getElementById("recaptcha-store").appendChild(captcha);
    this.props.formClosed();
  }

  step(timestamp) {
    if (this.start === undefined) this.start = timestamp;
    let elapsed = timestamp - this.start;
    const time = 1000;
    let element = document.querySelector('.animation-wait');
    if (element) element.style.setProperty('--rotateTransform', 'rotate(' + elapsed / time * 360 + 'deg)');

    if (this.props.animation === "wait") {
      window.requestAnimationFrame(this.step);
    } else {
      this.start = undefined;
    }
  }

  renderButtonText() {
    if (this.props.animation === 'success') return /*#__PURE__*/React.createElement("span", {
      className: "btn-animation animation-success"
    }, "\xA0");
    if (this.props.animation === 'error') return /*#__PURE__*/React.createElement("span", {
      className: "btn-animation animation-error"
    }, "\xA0");

    if (this.props.animation === 'wait') {
      window.requestAnimationFrame(this.step);
      return /*#__PURE__*/React.createElement("span", {
        className: "btn-animation animation-wait"
      }, "\xA0");
    }

    return /*#__PURE__*/React.createElement("span", {
      className: "btn-animation animation-none"
    }, "\u041E\u0422\u041F\u0420\u0410\u0412\u0418\u0422\u042C");
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Formik, {
      initialValues: {
        yourName: localStorage.getItem("name"),
        email: localStorage.getItem("email"),
        phone: localStorage.getItem("phone"),
        message: localStorage.getItem("message"),
        policy: localStorage.getItem("policy") === "true"
      },
      validate: values => {
        const errors = {};

        if (!values.yourName) {
          errors.yourName = 'Required';
        }

        if (!values.email) {
          errors.email = 'Required';
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(values.email)) {
          errors.email = 'Invalid';
        }

        if (!values.phone) {
          errors.phone = 'Required';
        }

        if (!values.policy) {
          errors.policy = 'Required';
        }

        if (grecaptcha.getResponse() === "") {
          errors.captcha = 'Required';
        }

        return errors;
      },
      onSubmit: (values, {
        setSubmitting
      }) => {
        // https://formcarry.com/s/W-vREVGtdg
        this.props.submitStart();
        const prom = fetch('https://formcarry.com/s/W-vREVGtdg', {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify(values)
        });
        prom.then(response => {
          if (response.ok) this.props.submitSuccess();else this.props.submitError();
          setSubmitting(false);
        });
      }
    }, ({
      isSubmitting,
      handleChange,
      handleBlur,
      values,
      errors,
      validateForm
    }) => {
      this.validateForm = validateForm;
      validateFormCallback = validateForm;
      console.log(values);
      saveLocalStorage(values);
      return /*#__PURE__*/React.createElement(Form, null, /*#__PURE__*/React.createElement(Field, {
        type: "text",
        name: "yourName",
        placeholder: "\u0412\u0430\u0448\u0435 \u0438\u043C\u044F",
        valid: errors.yourName ? 'false' : 'true'
      }), /*#__PURE__*/React.createElement(Field, {
        type: "text",
        name: "phone",
        placeholder: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D",
        valid: errors.phone ? 'false' : 'true'
      }), /*#__PURE__*/React.createElement(Field, {
        type: "email",
        name: "email",
        placeholder: "E-mail",
        valid: errors.email ? 'false' : 'true'
      }), /*#__PURE__*/React.createElement("textarea", {
        name: "message",
        onChange: handleChange,
        onBlur: handleBlur,
        value: values.message,
        placeholder: "\u0412\u0430\u0448 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439"
      }), /*#__PURE__*/React.createElement("label", {
        htmlFor: "policy",
        className: "c_box"
      }, /*#__PURE__*/React.createElement(Field, {
        type: "checkbox",
        className: "cb",
        id: "policy",
        name: "policy",
        checked: values.policy
      }), /*#__PURE__*/React.createElement("span", {
        className: "cb_place"
      }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
        className: "checkbox-text"
      }, "\u041E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u044F \u0437\u0430\u044F\u0432\u043A\u0443, \u044F \u0434\u0430\u044E \u0441\u043E\u0433\u043B\u0430\u0441\u0438\u0435 \u043D\u0430 ", /*#__PURE__*/React.createElement("a", {
        href: ""
      }, "\u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0443 \u0441\u0432\u043E\u0438\u0445 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445"), "."))), /*#__PURE__*/React.createElement("div", {
        id: "recaptcha-place"
      }), /*#__PURE__*/React.createElement("button", {
        type: "submit",
        disabled: isSubmitting || Object.keys(errors).length > 0
      }, this.renderButtonText()));
    }));
  }

}

function mapStateForm(state) {
  const {
    formAnimation
  } = state;
  return {
    animation: formAnimation
  };
}

const formAnimationActions = formAnimationSlice.actions;
const mapDispatchForm = {
  formClosed: formAnimationActions.formClosed,
  submitStart: formAnimationActions.submitStart,
  submitSuccess: formAnimationActions.submitSuccess,
  submitError: formAnimationActions.submitError
};
const WrappedMainForm = connect(mapStateForm, mapDispatchForm)(MainForm);

class ModalWindow extends React.Component {
  constructor(props) {
    super(props);
    let isOpen = props.location.pathname === "/form";

    if (isOpen) {
      props.history.replace("/");
      props.history.push("/form");
    }

    this.state = {
      animationInProgress: false
    };
    this.stepOpen = this.stepOpen.bind(this);
    this.playOpen = this.playOpen.bind(this);
    this.stepClose = this.stepClose.bind(this);
    this.playClose = this.playClose.bind(this);
    this.handleOffClick = this.handleOffClick.bind(this);
  }

  stepOpen(timestamp) {
    if (this.startOpen === undefined) this.startOpen = timestamp;
    let elapsed = timestamp - this.startOpen;
    const time = 2000;
    document.getElementById('moving-overlay').style.transform = 'scale(' + Math.min(elapsed / time, 1) + ')';

    if (this.id) {
      let element = document.getElementById(this.id);
      let rect = element.getBoundingClientRect();
      let centerX = (rect.left + rect.right) / 2;
      let centerY = (rect.top + rect.bottom) / 2;
      let centerString = centerX + "px " + centerY + "px";
      document.getElementById('moving-overlay').style.transformOrigin = centerString;
    }

    document.getElementById('my-fixed-overlay').style.backgroundColor = 'rgba(20, 20, 20, ' + Math.min(elapsed / time * 0.8, 0.8) + ')';

    if (elapsed < time) {
      window.requestAnimationFrame(this.stepOpen);
    } else {
      this.setState({
        animationInProgress: false
      });
    }
  }

  playOpen(id) {
    grecaptcha.reset();
    if (this.state.animationInProgress) return;
    this.setState({
      animationInProgress: true
    });
    this.props.history.push("/form");
    this.startOpen = undefined;
    this.id = id;
    window.requestAnimationFrame(this.stepOpen);
  }

  stepClose(timestamp) {
    if (this.startClose === undefined) this.startClose = timestamp;
    let elapsed = timestamp - this.startClose;
    const time = 2000;
    document.getElementById('moving-overlay').style.transform = 'scale(' + (1 - Math.min(elapsed / time, 1)) + ')';

    if (this.id) {
      let element = document.getElementById(this.id);
      let rect = element.getBoundingClientRect();
      let centerX = (rect.left + rect.right) / 2;
      let centerY = (rect.top + rect.bottom) / 2;
      let centerString = centerX + "px " + centerY + "px";
      document.getElementById('moving-overlay').style.transformOrigin = centerString;
    }

    document.getElementById('my-fixed-overlay').style.backgroundColor = 'rgba(20, 20, 20, ' + (0.8 - Math.min(elapsed / time * 0.8, 0.8)) + ')';

    if (elapsed < time) {
      window.requestAnimationFrame(this.stepClose);
    } else {
      this.setState({
        animationInProgress: false
      });
      this.props.history.goBack();
    }
  }

  playClose() {
    if (this.state.animationInProgress) return;
    this.setState({
      animationInProgress: true
    });
    this.startClose = undefined;

    if (this.id) {
      let element = document.getElementById(this.id);
      let rect = element.getBoundingClientRect();
      let centerX = (rect.left + rect.right) / 2;
      let centerY = (rect.top + rect.bottom) / 2;
      this.centerString = centerX + "px " + centerY + "px";
    }

    window.requestAnimationFrame(this.stepClose);
  }

  componentDidMount() {
    /*this.playOpen();*/
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) this.setState({
      animationInProgress: false
    });

    if (this.props.openRequest !== "") {
      this.playOpen(this.props.openRequest);
      this.props.requestFulfilled();
    }
  }

  handleOffClick(e) {
    if (document.getElementById('my-modal').contains(e.target)) return;
    this.playClose();
  }

  render() {
    return /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
      path: "/form"
    }, /*#__PURE__*/React.createElement("div", {
      id: "my-fixed-overlay"
    }, /*#__PURE__*/React.createElement("div", {
      id: "moving-overlay",
      onClick: this.handleOffClick
    }, /*#__PURE__*/React.createElement("div", {
      id: "my-modal"
    }, this.props.children)))));
  }

}

function mapStateOpener(state) {
  const {
    formOpener
  } = state;
  return {
    openRequest: formOpener
  };
}

const mapDispatchOpener = {
  requestFulfilled: formOpenerSlice.actions.requestFulfilled
};
const WrappedModalWindow = connect(mapStateOpener, mapDispatchOpener)(withRouter(ModalWindow));

function App() {
  return /*#__PURE__*/React.createElement(HashRouter, null, /*#__PURE__*/React.createElement(Provider, {
    store: store
  }, /*#__PURE__*/React.createElement(WrappedModalWindow, null, /*#__PURE__*/React.createElement(WrappedMainForm, null))));
}

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('react-main'));

function clickHandler(e) {
  e.preventDefault();
  store.dispatch(formOpenerSlice.actions.requestOpen(e.target.id));
}

document.querySelectorAll(".form-opener").forEach(elem => elem.addEventListener("click", clickHandler));