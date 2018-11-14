import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import {withApollo} from 'react-apollo'
import gql from 'graphql-tag'
import SearchIcon from 'react-icons/lib/md/search'
import debounce from 'lodash/debounce'
import Loading from 'orionsoft-parts/lib/components/Loading'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

@withApollo
export default class DynamicSelect extends React.Component {
  static propTypes = {
    client: PropTypes.object,
    value: PropTypes.string,
    onChange: PropTypes.func,
    valueKey: PropTypes.string,
    labelKey: PropTypes.string,
    searchQuery: PropTypes.string,
    passProps: PropTypes.object,
    fieldName: PropTypes.string,
    multi: PropTypes.bool,
    placeholder: PropTypes.node
  }

  static defaultProps = {
    valueKey: '_id',
    labelKey: 'name'
  }

  state = {}

  constructor(props) {
    super(props)
    this.loadOptions = debounce(this._loadOptions, 300)
  }

  async getItems(filter) {
    const queryString = `query dynamicSelectSearch_${this.props.searchQuery} ($filter: String) {
        result: ${this.props.searchQuery} (filter: $filter, page: 1, limit: 6) {
          items {
            ${this.props.valueKey}
            ${this.props.labelKey}
          }
        }
    }`
    const query = gql([queryString])
    const {data: {result: {items}}} = await this.props.client.query({
      query,
      variables: {filter}
    })
    this.setState({loaded: filter})
    return items
  }

  isLoading() {
    if (!this.state.focus) return false
    if (!this.state.text) return false
    return this.state.text !== this.state.loaded
  }

  @autobind
  async _loadOptions(text) {
    const items = await this.getItems(text)
    const options = items.map(item => {
      return {
        label: item[this.props.labelKey],
        value: item[this.props.valueKey]
      }
    })
    this.setState({options})
  }

  @autobind
  onChangeText(event) {
    const text = event.target.value
    this.setState({text})
    this.loadOptions(text)
    if (!text.trim()) {
      this.props.onChange(null)
    }
  }

  @autobind
  focus() {
    this.refs.input.focus()
  }

  getBestSuggestion() {
    const {options, text} = this.state
    if (!text) return
    if (!options) return
    for (const option of options) {
      if (option.label.toLowerCase().startsWith(text.toLowerCase())) {
        return option
      }
    }
  }

  @autobind
  onFocus() {
    this.setState({focus: true})
  }

  @autobind
  onBlur() {
    setTimeout(() => {
      if (!this.props.value) {
        this.setState({text: ''})
      }
      this.setState({focus: false})
    }, 200)
  }

  autocomplete() {
    const option = this.getBestSuggestion()
    if (!option) return
    this.selectOption(option)
  }

  selectOption(option) {
    const text = option.label
    this.setState({text, loaded: text})
    this.props.onChange(option.value)
  }

  @autobind
  onKeyPress(event) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      this.autocomplete()
    }
    if (event.key === 'Backspace') {
      this.props.onChange(null)
    }
  }

  renderSuggestion() {
    if (!this.state.text) return this.props.placeholder
    if (!this.state.focus) return
    const suggestion = this.getBestSuggestion()
    if (!suggestion) return
    return this.state.text + suggestion.label.slice(this.state.text.length)
  }

  renderIcon() {
    return (
      <div className={styles.icon}>
        <ReactCSSTransitionGroup
          transitionName="dynamicSelectFade"
          transitionEnterTimeout={100}
          transitionLeaveTimeout={100}>
          {this.isLoading() ? (
            <Loading key="loading" size={15} />
          ) : (
            <SearchIcon key="icon" size={20} />
          )}
        </ReactCSSTransitionGroup>
      </div>
    )
  }

  renderOptions() {
    if (!this.state.focus) return
    if (this.props.value) return
    const {options, text} = this.state
    if (!text) return
    if (!options) return
    return options.map(option => {
      return (
        <span
          className={styles.option}
          key={option.value}
          onClick={() => this.selectOption(option)}>
          {option.label}
        </span>
      )
    })
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.border} onClick={this.focus}>
          {this.renderIcon()}
          <div className={styles.inputContainer}>
            <div className={styles.suggestion}>{this.renderSuggestion()}</div>
            <input
              ref="input"
              type="text"
              value={this.state.text || ''}
              onChange={this.onChangeText}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              onKeyDown={this.onKeyPress}
              className={styles.input}
            />
          </div>
        </div>
        <div className={styles.otherOptions}>{this.renderOptions()}</div>
      </div>
    )
  }
}
