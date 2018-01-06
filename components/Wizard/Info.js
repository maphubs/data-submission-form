// @flow
import React from 'react'
import { Row, Form, Input, Icon, DatePicker, Select, Button, Rate } from 'antd'

const FormItem = Form.Item
const { Option } = Select
const { MonthPicker } = DatePicker

type Props = {
  form: any,
  onSubmit: Function,
  onPrev: Function
}

const options = [
  { value: 'supermarket', label: 'Supermarket' },
  { value: 'drug', label: 'Drug' },
  { value: 'homeimprovement', label: 'Home Improvement' },
  { value: 'apparel', label: 'Fashion / Apparel' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'books', label: 'Books' },
  { value: 'toys', label: 'Toys' },
  { value: 'sportinggoods', label: 'Sporting Goods' },
  { value: 'department', label: 'Department Store' },
  { value: 'warehouse', label: 'Warehouse / Club / Wholesale' },
  { value: 'convenience', label: 'Convenience Store' },
  { value: 'speciality', label: 'Speciality Store' },
  { value: 'other', label: 'Other' }
]

class InfoForm extends React.Component<Props, void> {
  handleSubmit = (e) => {
    e.preventDefault()
    const { onSubmit, form } = this.props
    form.validateFields((err, values) => {
      if (err) {
        console.error(err)
      } else {
        onSubmit(values)
      }
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }
    return (
      <div style={{ height: '100%', padding: '2%' }}>
        <Row style={{ height: '50px' }}>
          <h3>Please provide some information about the business</h3>
        </Row>
        <Row style={{ height: 'calc(100% - 50px)' }}>
          <Form style={{ height: '100%' }} onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="Business Name"
              hasFeedback
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please enter a name' }]
              })(<Input
                prefix={<Icon type="shop" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Name of Store / Business"
              />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Business Type"
              hasFeedback
            >
              {getFieldDecorator('type', {
                rules: [{ required: true, message: 'Please select a type' }]
              })(<Select
                prefix={<Icon type="shop" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Select a type"
              >
                {options.map(option => (
                  <Option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </Option>
                ))}
              </Select>)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Closed Month"
              hasFeedback
            >
              {getFieldDecorator('closed', {
                rules: [{ required: true, message: 'Please select a month' }]
              })(<MonthPicker
                style={{ float: 'left', width: '100%' }}
              />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Rating"
            >
              {getFieldDecorator('rating', {
                initialValue: 3.5
              })(<Rate style={{ float: 'left' }} />)}
            </FormItem>
            <Button type="default" size="large" onClick={this.props.onPrev} style={{ position: 'absolute', bottom: '25px', left: '5px' }}>
              <Icon type="left" />Back
            </Button>
            <Button type="primary" size="large" htmlType="submit" style={{ position: 'absolute', bottom: '25px', right: '5px' }}>
              Next<Icon type="right" />
            </Button>
          </Form>
        </Row>
      </div>
    )
  }
}

const WrappedForm = Form.create()(InfoForm)

export default WrappedForm
