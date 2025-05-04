import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class MastercardClickToPayCheckout implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mastercard Click to Pay - Checkout API',
		name: 'mastercardClickToPayCheckout',
		group: ['transform'],
		version: 1,
		description: 'Use the Mastercard Click to Pay Checkout API',
		defaults: {
			name: 'Mastercard Click to Pay - Checkout API',
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
						name: 'Get Card on File',
						value: 'getCardOnFile',
						description: 'Get card on file details',
						action: 'Get card on file',
					},
					{
						name: 'Confirm Payment',
						value: 'confirmPayment',
						description: 'Confirm a payment',
						action: 'Confirm a payment',
					},
				],
				default: 'getCardOnFile',
			},
			// Fields for getCardOnFile operation
			{
				displayName: 'Transaction ID',
				name: 'transactionId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getCardOnFile'],
					},
				},
				default: '',
				description: 'The transaction ID from Click to Pay',
				required: true,
			},
			// Fields for confirmPayment operation
			{
				displayName: 'Transaction ID',
				name: 'transactionId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['confirmPayment'],
					},
				},
				default: '',
				description: 'The transaction ID from Click to Pay',
				required: true,
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['confirmPayment'],
					},
				},
				default: 0,
				description: 'The final amount for the transaction',
				required: true,
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['confirmPayment'],
					},
				},
				default: 'USD',
				description: 'The currency for the transaction',
				required: true,
			},
			{
				displayName: 'Additional Payment Details',
				name: 'additionalPaymentDetails',
				type: 'json',
				displayOptions: {
					show: {
						operation: ['confirmPayment'],
					},
				},
				default: '{}',
				description: 'Additional payment details in JSON format',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;
		
		// Get credentials
		const credentials = await this.getCredentials('mastercardClickToPayApi');
		
		// Determine base URL based on environment
		const baseUrl = credentials.environment === 'sandbox'
			? 'https://sandbox.api.mastercard.com/unified-checkout'
			: 'https://api.mastercard.com/unified-checkout';
		
		for (let i = 0; i < items.length; i++) {
			try {
				if (operation === 'getCardOnFile') {
					// Get transaction ID
					const transactionId = this.getNodeParameter('transactionId', i) as string;
					
					// In a real implementation, you would make an API call to Mastercard
					// For demonstration purposes, we'll simulate the response
					// This would be the endpoint: GET /checkout/card-on-file/{transactionId}
					
					// Simulated response
					const cardOnFileResponse = {
						transactionId: transactionId,
						card: {
							maskedPan: '************1234',
							expiryMonth: '12',
							expiryYear: '2025',
							cardholderName: 'JOHN DOE',
							brand: 'MASTERCARD',
						},
						paymentToken: 'sample_payment_token_' + Date.now(),
						responseCode: '00',
						responseDescription: 'Success',
					};
					
					// Example code for actual implementation (commented out)
					/*
					const accessToken = items[i].json.access_token; // From previous authenticate node
					
					const options = {
						method: 'GET',
						url: `${baseUrl}/checkout/card-on-file/${transactionId}`,
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'Content-Type': 'application/json',
						},
					};
					
					const response = await this.helpers.request(options);
					const cardOnFileResponse = JSON.parse(response);
					*/
					
					// Return the card on file information
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(cardOnFileResponse),
						{ itemData: { item: i } },
					);

					returnData.push(...executionData);
				} else if (operation === 'confirmPayment') {
					// Get parameters
					const transactionId = this.getNodeParameter('transactionId', i) as string;
					const amount = this.getNodeParameter('amount', i) as number;
					const currency = this.getNodeParameter('currency', i) as string;
					const additionalPaymentDetailsJson = this.getNodeParameter('additionalPaymentDetails', i) as string;
					const additionalPaymentDetails = JSON.parse(additionalPaymentDetailsJson);
					
					// In a real implementation, you would make an API call to Mastercard
					// For demonstration purposes, we'll simulate the response
					// This would be the endpoint: POST /checkout/payment/confirm
					
					// Prepare request body
					const requestBody = {
						transactionId: transactionId,
						amount: amount,
						currency: currency,
						...additionalPaymentDetails,
					};
					
					// Simulated response
					const confirmPaymentResponse = {
						transactionId: transactionId,
						confirmationId: 'conf_' + Date.now(),
						status: 'CONFIRMED',
						responseCode: '00',
						responseDescription: 'Payment confirmed successfully',
					};
					
					// Example code for actual implementation (commented out)
					/*
					const accessToken = items[i].json.access_token; // From previous authenticate node
					
					const options = {
						method: 'POST',
						url: `${baseUrl}/checkout/payment/confirm`,
						headers: {
							'Authorization': `Bearer ${accessToken}`,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(requestBody),
					};
					
					const response = await this.helpers.request(options);
					const confirmPaymentResponse = JSON.parse(response);
					*/
					
					// Return the confirmation response
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({
							...confirmPaymentResponse,
							requestDetails: requestBody,
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
