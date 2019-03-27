import React from 'react'
import autobind from 'autobind-decorator'
import PropTypes from 'prop-types'
import moment from 'moment'

export default class HourTextField extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    useHint: PropTypes.bool,
    label: PropTypes.any,
    errorMessage: PropTypes.string,
    disabled: PropTypes.bool,
    passProps: PropTypes.object,
    format: PropTypes.string
  }

  static defaultProps = {
    format: 'HH:mm'
  }

  state = { text: '' }

  @autobind
  setNow () {
    const now = moment()
    this.props.onChange(`${now.hour()}:${now.minute()}`)
  }

  getValue () {
    return this.props.value || this.state.text
  }

  replaceTexts (text, previous) {
    if (previous.length > text.length) return
    if (text.length === 2) {
      this.onChange(text + ':')
      return true
    }
  }

  onChange (text) {
    if (text === 'n') {
      return this.props.onChange(this.setNow())
    }
    if (this.replaceTexts(text, this.state.text)) return
    this.setState({ text })
    if (text.length !== 5) return this.props.onChange(text.slice(4))
  }

  render () {
    return (
      <div>
        <div className='label'>{this.props.label}</div>
        <div className='os-input-container'>
          <input
            className='os-input-text'
            value={this.getValue()}
            onChange={event => this.onChange(event.target.value)}
            {...this.props.passProps}
          />
        </div>
        <div className='description'>{this.props.description}</div>
        <div className='os-input-error'>{this.props.errorMessage}</div>
      </div>
    )
  }
}
