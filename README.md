# n8n-nodes-mastercard-clicktopay

This is an n8n community node. It lets you use Mastercard's Click to Pay in your n8n workflows.

Mastercard Click to Pay provides a secure and simplified checkout experience. This node package allows you to integrate Click to Pay functionality into your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This package includes three nodes:

### 1. Mastercard Click to Pay - Authenticate
- **Get Access Token**: Authenticates with Mastercard API using your credentials and certificate to obtain an access token.

### 2. Mastercard Click to Pay - Launch Checkout
- **Generate Checkout Script**: Creates HTML/JavaScript code to launch a Click to Pay checkout experience.

### 3. Mastercard Click to Pay - Checkout API
- **Get Card on File**: Retrieves card-on-file details from a transaction.
- **Confirm Payment**: Confirms a payment after checkout.

## Credentials

You need to obtain the following from Mastercard to use these nodes:

1. **Client ID** and **Client Secret**: Your API client credentials.
2. **Certificate and Private Key**: For secure API authentication.
3. **Merchant ID**: Your merchant identifier.

To set up credentials in n8n:

1. Navigate to **Settings** > **Credentials** > **New**.
2. Search for "Mastercard Click to Pay API" and select it.
3. Fill in your credentials and save.

## Usage

### Basic Workflow Example

1. **Trigger Node** (e.g., HTTP Request or Webhook) - Start the workflow.
2. **Mastercard Click to Pay - Authenticate** - Authenticate and get an access token.
3. **Mastercard Click to Pay - Launch Checkout** - Generate the checkout script.
4. **HTTP Response** - Return the checkout page to the user.

After the user completes the checkout:

1. **Webhook** - Receive the transaction callback.
2. **Mastercard Click to Pay - Checkout API** - Confirm the payment.

### Integration with E-commerce Systems

This node package can be integrated with various e-commerce platforms:

1. Create a webhook in your e-commerce system that triggers when a user initiates checkout.
2. Use n8n to generate the Click to Pay checkout page.
3. After the user completes payment, confirm the transaction and update your e-commerce system.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Mastercard Unified Checkout Solutions documentation](https://developer.mastercard.com/unified-checkout-solutions/documentation/)
* [Click to Pay SDK Reference](https://developer.mastercard.com/unified-checkout-solutions/documentation/sdk-reference/)
* [Checkout API Reference](https://developer.mastercard.com/unified-checkout-solutions/documentation/api-reference/apis/#checkout-card-on-file-and-confirmations-api)
