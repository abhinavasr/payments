import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class MastercardClickToPayLaunch implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mastercard Click to Pay - Launch Checkout',
		name: 'mastercardClickToPayLaunch',
		group: ['transform'],
		version: 1,
		description: 'Launch a Mastercard Click to Pay checkout page',
		defaults: {
			name: 'Mastercard Click to Pay - Launch Checkout',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'mastercardClickToPayApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Generate Checkout Script',
						value: 'generateCheckoutScript',
						description: 'Generate a script to launch the Click to Pay checkout',
						action: 'Generate a script to launch the click to pay checkout',
					},
				],
				default: 'generateCheckoutScript',
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['generateCheckoutScript'],
					},
				},
				default: 0,
				description: 'The amount for the transaction',
				required: true,
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['generateCheckoutScript'],
					},
				},
				default: 'USD',
				description: 'The currency for the transaction',
				required: true,
			},
			{
				displayName: 'Return URL',
				name: 'returnUrl',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['generateCheckoutScript'],
					},
				},
				default: '',
				description: 'The URL to redirect to after checkout completion',
				required: true,
			},
			{
				displayName: 'Order ID',
				name: 'orderId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['generateCheckoutScript'],
					},
				},
				default: '',
				description: 'A unique ID for this order',
				required: true,
			},
			{
				displayName: 'Customer Email',
				name: 'customerEmail',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['generateCheckoutScript'],
					},
				},
				default: '',
				description: 'The email of the customer',
				required: true,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;
		
		// Get credentials
		const credentials = await this.getCredentials('mastercardClickToPayApi');
		
		for (let i = 0; i < items.length; i++) {
			try {
				if (operation === 'generateCheckoutScript') {
					// Get parameters
					const amount = this.getNodeParameter('amount', i) as number;
					const currency = this.getNodeParameter('currency', i) as string;
					const returnUrl = this.getNodeParameter('returnUrl', i) as string;
					const orderId = this.getNodeParameter('orderId', i) as string;
					const customerEmail = this.getNodeParameter('customerEmail', i) as string;
					
					// Generate a configuration object for the Mastercard Click to Pay SDK
					const config = {
						environment: credentials.environment,
						merchantId: credentials.merchantId,
						checkoutDetails: {
							amount: amount,
							currency: currency,
							orderId: orderId,
							returnUrl: returnUrl,
						},
						customer: {
							email: customerEmail,
						},
						// In a real implementation, you would include the access token 
						// obtained from the authentication node
					};
					
					// Generate HTML and JavaScript to launch the checkout
					// This is a simplified example - in reality, you'd need to generate
					// proper code that uses the Mastercard Click to Pay SDK
					const checkoutScript = `
<!DOCTYPE html>
<html>
<head>
    <title>Mastercard Click to Pay Checkout</title>
    <!-- Include the Mastercard Click to Pay SDK -->
    <script src="${credentials.environment === 'sandbox' 
		? 'https://sandbox.src.mastercard.com/sdk/clicktopay.js' 
		: 'https://src.mastercard.com/sdk/clicktopay.js'}"></script>
</head>
<body>
    <div id="clicktopay-button-container"></div>
    
    <script>
        // Configuration for Click to Pay
        const config = ${JSON.stringify(config, null, 2)};
        
        // Initialize Click to Pay
        document.addEventListener('DOMContentLoaded', function() {
            ClickToPaySDK.init({
                merchantId: config.merchantId,
                environment: config.environment,
                locale: 'en_US',
                onReady: function() {
                    // Create checkout button
                    ClickToPaySDK.renderButton({
                        containerId: 'clicktopay-button-container',
                        buttonStyle: {
                            width: '100%',
                            height: '40px'
                        },
                        onClick: function() {
                            // Launch checkout
                            ClickToPaySDK.checkout({
                                amount: config.checkoutDetails.amount,
                                currencyCode: config.checkoutDetails.currency,
                                orderId: config.checkoutDetails.orderId,
                                callbackUrl: config.checkoutDetails.returnUrl,
                                consumerEmailAddress: config.customer.email,
                                onCheckoutComplete: function(response) {
                                    // Handle checkout completion
                                    window.location.href = config.checkoutDetails.returnUrl + 
                                        '?transactionId=' + response.transactionId;
                                },
                                onCheckoutError: function(error) {
                                    console.error('Checkout error:', error);
                                    alert('There was an error with the checkout process.');
                                }
                            });
                        }
                    });
                },
                onError: function(error) {
                    console.error('SDK initialization error:', error);
                }
            });
        });
    </script>
</body>
</html>`;
					
					// Return the script
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({
							checkoutScript,
							config,
						}),
						{ itemData: { item: i } },
					);

					returnData.push(...executionData);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}
