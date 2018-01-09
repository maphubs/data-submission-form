//  @flow
import React from 'react'
import { Row, Col, Steps, Button, message, Icon, Spin } from 'antd'
import { translate } from 'react-i18next'
import request from 'superagent'

import i18nHelper from '../i18n'
import EmbedLayout from './EmbedLayout'
import Location from './Wizard/Location'
import Info from './Wizard/Info'

import config from '../utils/env'

const { Step } = Steps

type Props = {
  t: any,
  i18n: any,
  showActivateButton?: boolean,
  onComplete: Function
}

type State = {
  current: number,
  geometry?: Object,
  properties?: Object,
  active: boolean,
  sending: boolean
}

class DataSubmitWizard extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      current: 0,
      active: false,
      sending: false
    }
  }

  onPropertiesChange = async (properties) => {
    this.setState({ properties })
    try {
      await this.onSubmit(properties)
      this.next()
    } catch (err) {
      message.error(`Error: ${err.message}`)
    }
  }

  onLocationSelected = (coordinates: Array<number>) => {
    this.setState({
      geometry: {
        type: 'Point',
        coordinates
      }
    })
    this.next()
  }

  onSubmit = async (properties: Object) => {
    this.setState({ sending: true })
    const { geometry } = this.state
    const feature = {
      type: 'Feature',
      geometry,
      properties
    }

    const maphubsURL: string = config.MAPHUBS_URL
    const url = `${maphubsURL}/api/layer/public/submit`
    const res = await request
      .post(url)
      .send({
        layer_id: config.MAPHUBS_LAYER_ID,
        feature
      })
    this.setState({ sending: false })
    if (!res.body || !res.body.success) {
      const err = res.body.error || 'error sending data to the server'
      throw new Error(err)
    }
    return true
  }

  onComplete = () => {
    if (this.props.onComplete) {
      this.props.onComplete()
    }
  }

  onSubmitAnother = () => {
    location.reload()
  }

  activate = () => {
    this.setState({ active: true })
  }

  next () {
    const current = this.state.current + 1
    this.setState({ current })
  }
  prev () {
    const current = this.state.current - 1
    this.setState({ current })
  }

  location: any

  render () {
    const { t, i18n, showActivateButton } = this.props
    const { current, active } = this.state

    const stepContent = [{
      title: 'Location',
      description: 'Select the location',
      icon: 'shop'
    }, {
      title: 'Info',
      description: 'Additional infomation',
      icon: 'solution'
    }, {
      title: 'Submit',
      description: 'Send it to us',
      icon: 'smile-o'
    }]

    if (!active && showActivateButton) {
      return (
        <EmbedLayout title={t('Data Submission Form')} t={t} language={i18n.language}>
          <div style={{ height: '100%', width: '100%', textAlign: 'center' }}>
            <Button
              type="primary"
              size="large"
              style={{ top: '50px' }}
              onClick={this.activate}
            >
              Submit a Location
            </Button>
          </div>
        </EmbedLayout>
      )
    }

    return (
      <EmbedLayout title={t('Data Submission Form')} t={t} language={i18n.language}>
        <style jsx>{`
          .data-submit-wizard {
            height: 100%;
            width: 100%;
          }
          .steps-content {
            border: 1px solid #e9e9e9;
            border-radius: 6px;
            background-color: #fafafa;
            min-height: 200px;
            height: 100%;
            text-align: center;
          }
          
          .steps-action {
            margin-top: 24px;
          }

          .wizard-steps-col {
            height: 75px;
            padding: 10px;
          }

          .wizard-content {
            height: calc(100% - 75px);
          }

          @media (max-width: 576px) {

            .wizard-content {
              height: 100%;
            }

            .wizard-steps-col {
              height: 0px;
              display: none;
            }
          }
        `}
        </style>
        <div className="data-submit-wizard">
          <Row>
            <div className="wizard-steps-col">
              <Col span={24}>
                <Steps current={current}>
                  {stepContent.map(item => (
                    <Step
                      style={{ color: 'red' }}
                      key={item.title}
                      title={item.title}
                      description={item.description}
                      icon={<Icon type={item.icon} />}
                    />
                  ))}
                </Steps>
              </Col>
            </div>
          </Row>
          <div className="wizard-content">          
            <Row style={{ height: '100%' }}>
              <div className="steps-content" style={{ display: current === 0 ? 'block' : 'none' }}>
                <Location onSelected={this.onLocationSelected} />
              </div>
              <div className="steps-content" style={{ display: current === 1 ? 'block' : 'none' }}>
                <Spin size="large" spinning={this.state.sending} style={{ left: 0, height: '100%' }}>
                  <Info onSubmit={this.onPropertiesChange} onPrev={() => this.prev()} name="test" />
                </Spin>
              </div>
              {current === 2 &&
                <div className="steps-content">
                  <Row style={{ top: '25%' }}>
                    <h3>Thank You!</h3>
                    <p>Thank you for contributing</p>
                  </Row>
                  <Row style={{ top: '50%' }}>
                    <Col span={12}>
                      <Button type="primary" size="large" onClick={this.onSubmitAnother}>Submit Another Location</Button>
                    </Col>
                    <Col span={12}>
                      <Button type="primary" size="large" onClick={this.onComplete}>Done</Button>
                    </Col>
                  </Row>
                </div>
              }
            </Row>
          </div>
        </div>
      </EmbedLayout>
    )
  }
}

const Extended = translate(['wizard', 'common'], { i18n: i18nHelper, wait: process.browser })(DataSubmitWizard)

// Passing down initial translations
// use req.i18n instance on serverside to avoid overlapping requests set the language wrong
Extended.getInitialProps = async ({ req }) => {
  if (req && !process.browser) return i18nHelper.getInitialProps(req, ['home', 'common'])
  return {}
}

export default Extended
