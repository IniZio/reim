import {Component} from 'react'
import PropTypes from 'prop-types'
import reim from 'reim'

class State extends Component {
  state = {
    isInitialized: false,
    getterCache: {},
    setterCache: {}
  }

  componentDidMount() {
    this.store = this.props.store || reim(this.props.initial || {})

    this.setGetter()
    this.setSetter()
  }

  componentDidUpdate(prevProps, prevState) {
    // User changed getter / setter functions
    if (prevProps.getter !== this.props.getter && prevState.getterCache === this.state.getterCache) {
      this.setGetter()
    }
    if (prevProps.setter !== this.props.setter && prevState.setterCache === this.state.setterCache) {
      this.setSetter()
    }
  }

  componentWillUnmount() {
    this.store.unsubscribe(this._handler)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      (nextProps.getter !== this.props.getter || nextState.getterCache !== this.state.getterCache) ||
      (nextProps.setter !== this.props.setter || nextState.setterCache !== this.state.setterCache) ||
      (nextProps.onChange !== this.props.onChange) ||
      (nextProps.children !== this.props.children)
    )
  }

  setGetter() {
    if (this._handler) {
      this.store.unsubscribe(this._handler)
    }
    this._handler = this.store.subscribe(getterCache => {
      this.setState({getterCache})
      if (typeof this.props.onChange === 'function' && this.state.isInitialized) {
        this.props.onChange(getterCache)
      }
      this.setState({isInitialized: true})
    }, {
      immediate: true,
      getter: this.props.getter
    })
  }

  setSetter() {
    this.setState({
      setterCache: this.props.setter(this.store)
    })
  }

  render() {
    const {children} = this.props
    const {getterCache, setterCache, isInitialized} = this.state

    return (typeof children === 'function' ? (isInitialized ? children({...setterCache, ...getterCache}, this.store) : null) : children)
  }
}

State.defaultProps = {
  store: null,
  getter(s) {
    return s
  },
  setter() {
    return {}
  },
  initial: null,
  onChange: null
}

State.propTypes = {
  children: PropTypes.func.isRequired,
  store: PropTypes.any,
  getter: PropTypes.func,
  setter: PropTypes.func,
  initial: PropTypes.object,
  onChange: PropTypes.func
}

export default State