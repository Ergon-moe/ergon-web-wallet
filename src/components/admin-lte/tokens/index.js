import React from 'react'
import PropTypes from 'prop-types'
import { Content, Row, Col, Box } from 'adminlte-2-react'
import TokenCard from './token-card'
import TokenModal from './token-modal'
import Spinner from '../../../images/loader.gif'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SendTokens from './send-tokens'

let _this
class Tokens extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      tokens: [],
      selectedTokenToView: '',
      showModal: false,
      inFetch: true,
      onEmptyTokensMsg: 'No tokens found on this wallet..',
      selectedTokenToSend: ''

    }
  }

  render () {
    const { JWT } = _this.props.walletInfo

    return (
      <>
        {_this.state.inFetch ? (
          <div className='spinner'>
            <img alt='Loading...' src={Spinner} width={100} />
          </div>
        ) : (
          <Content>
            {!JWT && (
              <Box padding='true' className='container-nofound'>
                <Row>
                  <Col xs={12}>
                    <FontAwesomeIcon
                      className='icon btn-animation'
                      size='lg'
                      icon='exclamation-triangle'
                    />
                  </Col>

                  <Col xs={12}>
                    <em>
                      You don't have a registered JWT, you could encounter
                      errors viewing some of your tokens.
                    </em>
                  </Col>
                </Row>
              </Box>
            )}
            <br />
            {!_this.state.tokens.length && (
              <Box padding='true' className='container-nofound'>
                <Row>
                  <Col xs={12}>
                    <em>{_this.state.onEmptyTokensMsg}</em>
                  </Col>
                </Row>
              </Box>
            )}

            <SendTokens
              bchWallet={_this.props.bchWallet}
              walletInfo={_this.props.walletInfo}
              selectedToken={_this.state.selectedTokenToSend ? _this.state.selectedTokenToSend : {}}
            />
            {_this.state.tokens.length && (
              <Row>
                {_this.state.tokens.map((val, i) => {
                  return (
                    <Col sm={4} key={`token-${i}`}>
                      <TokenCard
                        key={`token-${i}`}
                        id={`token-${i}`}
                        token={val}
                        showToken={_this.showToken}
                        selectToken={_this.selectToken}
                      />
                    </Col>
                  )
                })}
              </Row>
            )}
          </Content>
        )}
        <TokenModal
          token={_this.state.selectedTokenToView ? _this.state.selectedTokenToView : {}}
          handleOnHide={_this.onHandleToggleModal}
          show={_this.state.showModal}
        />
      </>
    )
  }

  async componentDidMount () {
    const { mnemonic } = _this.props.walletInfo
    const bchWallet = _this.props.bchWallet
    let tokens = []
    let { onEmptyTokensMsg } = _this.state

    if (mnemonic && bchWallet) {
      try {
        await bchWallet.walletInfoPromise
        tokens = await bchWallet.listTokens()
      } catch (error) {
        console.error(error)
        if (error.error.match('rate limits')) onEmptyTokensMsg = error.error
      }
    } else {
      onEmptyTokensMsg =
        'You need to create or import a wallet first, to view tokens'
    }

    _this.setState({
      tokens,
      inFetch: false,
      onEmptyTokensMsg
    })
  }

  showToken (selectedTokenToView) {
    _this.setState({
      selectedTokenToView
    })
    _this.onHandleToggleModal()
  }

  selectToken (selectedTokenToSend) {
    _this.setState({
      selectedTokenToSend
    })
    const ele = document.getElementById('___gatsby')
    ele.scrollIntoView(true)

    setTimeout(() => {
      console.log(_this.state.selectedTokenToSend)
    }, 500)
  }

  onHandleToggleModal () {
    _this.setState({
      showModal: !_this.state.showModal
    })
  }
}
Tokens.propTypes = {
  walletInfo: PropTypes.object.isRequired, // wallet info
  bchWallet: PropTypes.object // get minimal-slp-wallet instance
}
export default Tokens
