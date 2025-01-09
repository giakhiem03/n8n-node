/* eslint-disable n8n-nodes-base/cred-filename-against-convention */
import {
    ICredentialType,
    INodeProperties,
    IAuthenticateGeneric,
} from 'n8n-workflow';

export class ZaloApi implements ICredentialType {
    name = 'zaloApi';
    displayName = 'Zalo API';
    documentationUrl = 'https://developers.zalo.me/docs';  // Update with your own docs link
    properties: INodeProperties[] = [
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
			typeOptions: { password: true },  // Use the string literal directly
            required: true,
            description: 'Access token for Zalo API',
            default: '',
        },
    ];
    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            qs: {
                'access_token': '={{$credentials.accessToken}}'  // Adjust based on API requirements
            }
        },
    };
}
