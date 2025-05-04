import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MastercardClickToPayApi implements ICredentialType {
	name = 'mastercardClickToPayApi';
	displayName = 'Mastercard Click to Pay API';
	documentationUrl = 'https://developer.mastercard.com/unified-checkout-solutions/documentation/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Environment',
			name: 'environment',
			type: 'options',
			default: 'sandbox',
			options: [
				{
					name: 'Sandbox',
					value: 'sandbox',
				},
				{
					name: 'Production',
					value: 'production',
				},
			],
			description: 'The environment to connect to',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			description: 'Client ID provided by Mastercard',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Client Secret provided by Mastercard',
		},
		{
			displayName: 'Certificate Key',
			name: 'certificateKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'The private key used for API authentication',
		},
		{
			displayName: 'Certificate',
			name: 'certificate',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'The certificate used for API authentication',
		},
		{
			displayName: 'Merchant ID',
			name: 'merchantId',
			type: 'string',
			default: '',
			description: 'Your merchant ID provided by Mastercard',
		},
	];

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.environment === "sandbox" ? "https://sandbox.api.mastercard.com" : "https://api.mastercard.com"}}',
			url: '/unified-checkout/authentication/oauth2/token',
			method: 'POST',
		},
	};
}
