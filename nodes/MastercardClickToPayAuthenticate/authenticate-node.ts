import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class MastercardClickToPayAuthenticate implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mastercard Click to Pay - Authenticate',
		name: 'mastercardClickToPayAuthenticate',
		group: ['transform'],
		version: 1,
		description: 'Authenticate with Mastercard Click to Pay API',
		defaults: {
			name: 'Mastercard Click to Pay - Authenticate',
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
						name: 'Get Access Token',
						value: 'getAccessToken',
						description: 'Get an access token for Mastercard Click to Pay API',
						action: 'Get an access token',
					},
				],
				default: 'getAccessToken',
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
				if (operation === 'getAccessToken') {
					// In a real implementation, we would use the Mastercard OAuth Library
					// to authenticate with the certificate and client credentials
					// For demonstration purposes, we'll simulate the response
					
					const tokenResponse = {
						access_token: 'sample_access_token_' + Date.now(),
						token_type: 'Bearer',
						expires_in: 3600,
						scope: 'clicktopay',
					};
					
					// Note: In the real implementation, you would use the actual Mastercard SDK
					// to generate a real token using the certificate and credentials
					
					// Example code for actual implementation (commented out)
					/*
					const mastercardAuth = require('mastercard-oauth1-signer');
					const request = require('request-promise');
					
					const authOptions = {
						uri: `${baseUrl}/unified-checkout/authentication/oauth2/token`,
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						form: {
							grant_type: 'client_credentials',
							client_id: credentials.clientId,
							client_secret: credentials.clientSecret,
						},
						json: true,
					};
					
					// Sign the request with the certificate
					mastercardAuth.sign(authOptions, credentials.certificateKey);
					
					const tokenResponse = await request(authOptions);
					*/
					
					// Return the token information
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({
							...tokenResponse,
							environment: credentials.environment,
							merchantId: credentials.merchantId,
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
